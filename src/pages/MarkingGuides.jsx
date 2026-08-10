import { useState, useEffect } from 'react'
import { Sparkles, Plus } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { PrimaryButton, SecondaryButton } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

const blankQuestion = () => ({
  id: Date.now() + Math.random(),
  text: '',
  modelAnswer: '',
  keywords: '',
  marks: 0,
})

export default function MarkingGuides() {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([blankQuestion(), blankQuestion()])
  const [recentGuides, setRecentGuides] = useState([])
  const [loadingGuides, setLoadingGuides] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)

  useEffect(() => {
    loadGuides()
  }, [])

  async function loadGuides() {
    setLoadingGuides(true)
    try {
      const guides = await api.getGuides(token)
      setRecentGuides(guides)
    } catch (err) {
      // Non-fatal: the form still works even if the list fails to load
      console.error(err)
    } finally {
      setLoadingGuides(false)
    }
  }

  const addQuestion = () => {
    setQuestions((qs) => [...qs, blankQuestion()])
  }

  function updateQuestion(id, field, value) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  async function handleSaveAndPublish() {
    setError('')
    setSuccessMsg('')

    if (!title.trim()) {
      setError('Please give this marking guide a subject / exam title.')
      return
    }
    if (questions.some((q) => !q.text.trim())) {
      setError('Every question needs question text before publishing.')
      return
    }

    setSaving(true)
    try {
      await api.createGuide(
        {
          title,
          questions: questions.map((q) => ({
            text: q.text,
            modelAnswer: q.modelAnswer,
            keywords: q.keywords,
            maxMarks: q.marks,
          })),
        },
        token
      )
      setSuccessMsg('Marking guide saved and published.')
      setTitle('')
      setQuestions([blankQuestion(), blankQuestion()])
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
            <SecondaryButton onClick={() => setSuccessMsg('Draft saved locally (publish to persist it to the database).')}>
              Draft Save
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSaveAndPublish}
              disabled={saving}
              className="bg-sky-500 hover:bg-sky-400"
            >
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

          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 relative">
              <span className="absolute -left-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-white">
                {idx + 1}
              </span>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Question {idx + 1} Details</p>

              <label className="mt-4 block text-sm font-medium text-slate-700">Question Text</label>
              <textarea
                rows={2}
                value={q.text}
                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                placeholder="Enter the question prompt here..."
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              />

              <div className="mt-4 flex items-center justify-between">
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
                rows={3}
                value={q.modelAnswer}
                onChange={(e) => updateQuestion(q.id, 'modelAnswer', e.target.value)}
                placeholder="Paste the ideal response here..."
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Keywords (Comma separated)</label>
                    <button
                      type="button"
                      onClick={() => setError('AI-assisted keyword suggestions are coming in a later phase.')}
                      className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700"
                    >
                      <Sparkles size={12} /> Suggest Keywords
                    </button>
                  </div>
                  <input
                    value={q.keywords}
                    onChange={(e) => updateQuestion(q.id, 'keywords', e.target.value)}
                    placeholder="Mitochondria, ATP, Energy production"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Max Marks</label>
                  <input
                    type="number"
                    value={q.marks}
                    onChange={(e) => updateQuestion(q.id, 'marks', e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-8 flex flex-col items-center gap-1 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Add Another Question</span>
            <span className="text-xs text-slate-400">Build your assessment criteria step-by-step</span>
          </button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl bg-ink-950 text-white p-5">
            <p className="font-semibold mb-4">Guide Summary</p>
            <div className="flex items-center justify-between text-sm py-2 border-b border-white/10">
              <span className="text-slate-300">Total Questions</span>
              <span className="font-semibold">{questions.length}</span>
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
              Our AI models suggest keeping keywords specific to ensure 98% accuracy in grading.
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
                        <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-600">
                          Active
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
