import { useState, useEffect } from 'react'
import { Sparkles, Plus, Trash2 } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { PrimaryButton, SecondaryButton } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

// Converts an index to a letter label: 0->a, 1->b, ... 25->z, 26->aa, 27->ab, ...
// This means a question can have as many sub-parts as needed, not just a–d.
function letterLabel(index) {
  let n = index
  let label = ''
  do {
    label = String.fromCharCode(97 + (n % 26)) + label
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return label
}

const blankPart = () => ({
  id: Date.now() + Math.random(),
  text: '',
  modelAnswer: '',
  keywords: '',
  marks: 0,
})

const blankGroup = (number) => ({
  id: Date.now() + Math.random(),
  number: String(number),
  parts: [blankPart()],
})

export default function MarkingGuides() {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [groups, setGroups] = useState([blankGroup(1), blankGroup(2)])
  const [recentGuides, setRecentGuides] = useState([])
  const [loadingGuides, setLoadingGuides] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const totalMarks = groups.reduce(
    (sum, g) => sum + g.parts.reduce((pSum, p) => pSum + Number(p.marks || 0), 0),
    0
  )
  const totalQuestionCount = groups.reduce((sum, g) => sum + g.parts.length, 0)

  useEffect(() => {
    loadGuides()
  }, [])

  async function loadGuides() {
    setLoadingGuides(true)
    try {
      const guides = await api.getGuides(token)
      setRecentGuides(guides)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingGuides(false)
    }
  }

  function addGroup() {
    setGroups((gs) => [...gs, blankGroup(gs.length + 1)])
  }

  function removeGroup(groupId) {
    setGroups((gs) => gs.filter((g) => g.id !== groupId))
  }

  function updateGroupNumber(groupId, value) {
    setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, number: value } : g)))
  }

  function addPart(groupId) {
    setGroups((gs) =>
      gs.map((g) => (g.id === groupId ? { ...g, parts: [...g.parts, blankPart()] } : g))
    )
  }

  function removePart(groupId, partId) {
    setGroups((gs) =>
      gs.map((g) => (g.id === groupId ? { ...g, parts: g.parts.filter((p) => p.id !== partId) } : g))
    )
  }

  function updatePart(groupId, partId, field, value) {
    setGroups((gs) =>
      gs.map((g) =>
        g.id === groupId
          ? { ...g, parts: g.parts.map((p) => (p.id === partId ? { ...p, [field]: value } : p)) }
          : g
      )
    )
  }

  async function handleSave(isDraft) {
    setError('')
    setSuccessMsg('')

    if (!title.trim()) {
      setError('Please give this marking guide a subject / exam title, even for a draft.')
      return
    }

    if (!isDraft) {
      if (groups.some((g) => !g.number.trim())) {
        setError('Every question needs a number (e.g. "1", "2").')
        return
      }
      if (groups.some((g) => g.parts.some((p) => !p.text.trim()))) {
        setError('Every question (and sub-part) needs question text before publishing.')
        return
      }
    }

    // Flatten groups into the flat question list the backend expects.
    // A group with only one part has no sub-label (plain "Question 1").
    // A group with multiple parts gets subLabel a, b, c, ... automatically.
    const flatQuestions = groups.flatMap((g) =>
      g.parts
        .filter((p) => isDraft || p.text.trim()) // drop fully-empty parts when publishing
        .map((p, i) => ({
          number: g.number,
          subLabel: g.parts.length > 1 ? letterLabel(i) : null,
          text: p.text,
          modelAnswer: p.modelAnswer,
          keywords: p.keywords,
          maxMarks: p.marks,
        }))
    )

    setSaving(true)
    try {
      await api.createGuide({ title, questions: flatQuestions, isDraft }, token)
      setSuccessMsg(isDraft ? 'Saved as a draft — you can finish it later.' : 'Marking guide saved and published.')
      setTitle('')
      setGroups([blankGroup(1), blankGroup(2)])
      loadGuides()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Topbar
        title="Create Marking Guide"
        right={
          <div className="flex items-center gap-2">
            <SecondaryButton onClick={() => handleSave(true)} disabled={saving}>
              {saving ? 'Saving...' : 'Draft Save'}
            </SecondaryButton>
            <PrimaryButton onClick={() => handleSave(false)} disabled={saving} className="bg-sky-500 hover:bg-sky-400">
              {saving ? 'Saving...' : 'Save & Publish'}
            </PrimaryButton>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {(error || successMsg) && (
            <div
              className={`rounded-lg border px-4 py-2.5 text-sm ${
                error ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-emerald-200 bg-emerald-50 text-emerald-600'
              }`}
            >
              {error || successMsg}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject / Exam Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Biology Midterm - Fall 2024"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {groups.map((group) => {
            const groupTotal = group.parts.reduce((sum, p) => sum + Number(p.marks || 0), 0)
            const hasSubParts = group.parts.length > 1

            return (
              <div key={group.id} className="rounded-xl border border-slate-200 bg-white p-5 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Question</span>
                    <input
                      value={group.number}
                      onChange={(e) => updateGroupNumber(group.id, e.target.value)}
                      className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-center font-semibold outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      Question total: <span className="font-semibold text-slate-700">{groupTotal} marks</span>
                    </span>
                    {groups.length > 1 && (
                      <button
                        onClick={() => removeGroup(group.id)}
                        className="text-slate-400 hover:text-rose-500"
                        title="Remove this question"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {group.parts.map((part, i) => (
                    <div
                      key={part.id}
                      className={hasSubParts ? 'rounded-lg border border-slate-100 bg-slate-50/50 p-4' : ''}
                    >
                      {hasSubParts && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-sky-600">
                            Part {group.number}{letterLabel(i)}
                          </span>
                          {group.parts.length > 1 && (
                            <button
                              onClick={() => removePart(group.id, part.id)}
                              className="text-slate-400 hover:text-rose-500"
                              title="Remove this sub-part"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      <label className="block text-sm font-medium text-slate-700">Question Text</label>
                      <textarea
                        rows={2}
                        value={part.text}
                        onChange={(e) => updatePart(group.id, part.id, 'text', e.target.value)}
                        placeholder="Enter the question prompt here..."
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                      />

                      <div className="mt-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">Model Answer</label>
                        <button
                          type="button"
                          onClick={() => setError('AI-assisted generation is coming in a later phase (LLM integration).')}
                          className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700"
                        >
                          <Sparkles size={12} /> Generate with AI
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={part.modelAnswer}
                        onChange={(e) => updatePart(group.id, part.id, 'modelAnswer', e.target.value)}
                        placeholder="Paste the ideal response here... (formulas are fine as plain text, e.g. F = ma)"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                      />

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                        <div>
                          <label className="text-sm font-medium text-slate-700">Keywords (comma separated)</label>
                          <input
                            value={part.keywords}
                            onChange={(e) => updatePart(group.id, part.id, 'keywords', e.target.value)}
                            placeholder="e.g. Newton's second law, force, acceleration"
                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">Marks</label>
                          <input
                            type="number"
                            value={part.marks}
                            onChange={(e) => updatePart(group.id, part.id, 'marks', e.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addPart(group.id)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  <Plus size={14} /> Add sub-part (e.g. {letterLabel(group.parts.length)})
                </button>
              </div>
            )
          })}

          <button
            onClick={addGroup}
            className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-8 flex flex-col items-center gap-1 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Add Another Question</span>
            <span className="text-xs text-slate-400">Each question can optionally be split into as many sub-parts as needed</span>
          </button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl bg-ink-950 text-white p-5">
            <p className="font-semibold mb-4">Guide Summary</p>
            <div className="flex items-center justify-between text-sm py-2 border-b border-white/10">
              <span className="text-slate-300">Questions (incl. sub-parts)</span>
              <span className="font-semibold">{totalQuestionCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-white/10">
              <span className="text-slate-300">Total Possible Marks</span>
              <span className="font-semibold">{totalMarks}</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-slate-300">AI Confidence Score</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> High
              </span>
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-white/5 p-3 text-xs text-slate-300">
              <Sparkles size={14} className="shrink-0 mt-0.5" />
              Formulas can be typed as plain text (e.g. "v = u + at"). Handwritten formulas in scanned scripts may not
              OCR perfectly — this is a known limitation of general-purpose OCR.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-slate-900">Recent Guides</p>
              <button className="text-xs font-medium text-sky-600">View All</button>
            </div>
            {loadingGuides ? (
              <p className="text-sm text-slate-400">Loading guides...</p>
            ) : recentGuides.length === 0 ? (
              <p className="text-sm text-slate-400">No marking guides yet — create your first one on the left.</p>
            ) : (
              <ul className="space-y-3">
                {recentGuides.slice(0, 5).map((g) => {
                  const totalGuideMarks = g.questions.reduce((sum, q) => sum + q.maxMarks, 0)
                  return (
                    <li key={g.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-800">{g.title}</p>
                        <span
                          className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                            g.isDraft ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {g.isDraft ? 'Draft' : 'Active'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {g.questions.length} Questions &bull; {totalGuideMarks} Marks
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Updated {new Date(g.updatedAt).toLocaleDateString()}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}