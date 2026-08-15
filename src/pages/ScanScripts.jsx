import { useState, useEffect, useRef } from 'react'
import { Search, UploadCloud, Camera, CheckCircle2, RotateCw, X, Loader2, AlertCircle } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { PrimaryButton, SecondaryButton, Badge } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function ScanScripts() {
  const { token } = useAuth()
  const fileInputRef = useRef(null)
  const [sessionId, setSessionId] = useState(null)
  const [scripts, setScripts] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [guides, setGuides] = useState([])
  const [selectedGuideId, setSelectedGuideId] = useState('')
  const [scoring, setScoring] = useState(false)
  const [scoreResult, setScoreResult] = useState(null)

  useEffect(() => {
    initSession()
    loadGuides()
  }, [])

  async function loadGuides() {
    try {
      const data = await api.getGuides(token)
      setGuides(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function initSession() {
    let id = localStorage.getItem('scriptmark_active_session')
    if (!id) {
      try {
        const session = await api.createSession({ title: `Scan Session — ${new Date().toLocaleDateString()}` }, token)
        id = session.id
        localStorage.setItem('scriptmark_active_session', id)
      } catch (err) {
        setError('Could not start a scanning session: ' + err.message)
        return
      }
    }
    setSessionId(id)
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file || !sessionId) return

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/sessions/${sessionId}/scripts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setScripts((prev) => [data.script || data, ...prev])
      setScoreResult(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const latestScript = scripts[0]

  async function handleDiscard() {
    if (!latestScript) return
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/sessions/${sessionId}/scripts/${latestScript.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok && res.status !== 204) throw new Error('Could not discard the script.')
      setScripts((prev) => prev.filter((s) => s.id !== latestScript.id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCommit() {
    if (!latestScript) return
    if (!selectedGuideId) {
      setError('Select a marking guide before committing this script for scoring.')
      return
    }

    setScoring(true)
    setError('')
    try {
      const result = await api.scoreScript(latestScript.id, selectedGuideId, token)
      setScoreResult(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setScoring(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Topbar
        title="Scan Student Scripts"
        right={
          <span className="hidden md:flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1">
            SESSION: {sessionId ? sessionId.slice(0, 10).toUpperCase() : 'STARTING...'}
          </span>
        }
        search="Search sessions..."
      />

      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Left column: upload + queue */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Marking Guide (required to score scripts)
            </label>
            <select
              value={selectedGuideId}
              onChange={(e) => setSelectedGuideId(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">Select a marking guide...</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.questions.length} questions)
                </option>
              ))}
            </select>
            {guides.length === 0 && (
              <p className="mt-1.5 text-xs text-amber-600">
                No marking guides yet — create one on the Marking Guides page first.
              </p>
            )}
          </div>

          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
              <UploadCloud size={22} />
            </div>
            <p className="font-semibold text-slate-900">Drop Batch Here</p>
            <p className="text-sm text-slate-500 mt-1">Upload a script image — runs real OCR via Google Cloud Vision</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="script-upload-input"
            />
            <PrimaryButton
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !sessionId}
              className="mt-4 mx-auto bg-sky-500 hover:bg-sky-400"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <UploadCloud size={16} /> Select File
                </>
              )}
            </PrimaryButton>
          </div>

          <div className="relative rounded-xl bg-ink-950 overflow-hidden aspect-video flex items-center justify-center">
            <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE SCAN
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
              <Camera size={22} />
            </div>
            <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-300">
              Live camera capture isn&apos;t wired up yet — use &quot;Select File&quot; above for now
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Scanned Scripts ({scripts.length})</p>
            </div>
            {scripts.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">No scripts uploaded yet in this session.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {scripts.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        s.status === 'DIGITIZED'
                          ? 'bg-emerald-50 text-emerald-500'
                          : s.status === 'FLAGGED'
                          ? 'bg-rose-50 text-rose-500'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {s.status === 'DIGITIZED' ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 truncate">{s.studentIdentifier || `Script ${s.id.slice(0, 8)}`}</p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        s.status === 'DIGITIZED' ? 'text-emerald-500' : s.status === 'FLAGGED' ? 'text-rose-500' : 'text-slate-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right column: live review */}
        <div className="rounded-xl border border-slate-200 bg-white flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-800">
              {latestScript ? `Live Review: ${latestScript.studentIdentifier || latestScript.id.slice(0, 8)}` : 'Live Review'}
            </p>
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-slate-600">
                <Search size={16} />
              </button>
              <button className="text-slate-400 hover:text-slate-600">
                <RotateCw size={16} />
              </button>
            </div>
          </div>

          {!latestScript ? (
            <div className="flex-1 flex items-center justify-center p-10 text-sm text-slate-400 text-center">
              Upload a script image on the left, the extracted text from Google Cloud Vision will appear here.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
                <div className="rounded-lg bg-slate-50 border border-slate-200 aspect-[4/3] overflow-hidden">
                  {latestScript.imageUrl ? (
                    <img src={latestScript.imageUrl} alt="Uploaded script" className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">No preview</div>
                  )}
                </div>

                <div className="text-sm text-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Extracted Text</span>
                    {latestScript.ocrConfidence != null && (
                      <Badge tone={latestScript.ocrConfidence > 0.7 ? 'green' : 'amber'}>
                        <CheckCircle2 size={12} /> Confidence: {Math.round(latestScript.ocrConfidence * 100)}%
                      </Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">
                    {latestScript.ocrText || (
                      <span className="text-slate-400 italic">No text extracted yet, OCR may still be processing.</span>
                    )}
                  </p>
                </div>
              </div>

              {scoreResult && (
                <div className="border-t border-slate-100 p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Suggested Scores (from Llama 3.3 via Groq, a lecturer must confirm these)
                  </p>
                  {scoreResult.answers.map((ans) => {
                    const question = scoreResult.questions.find((q) => q.id === ans.questionId)
                    const label = question
                      ? `Question ${question.number}${question.subLabel || ''}`
                      : 'Question'
                    return (
                      <div key={ans.id} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-sky-600">{label}</span>
                            <p className="text-sm font-medium text-slate-800">{question?.text}</p>
                          </div>
                          <span className="text-sm font-semibold text-sky-600 whitespace-nowrap ml-3">
                            {ans.suggestedScore} / {question?.maxMarks}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{ans.reasoning}</p>
                      </div>
                    )
                  })}
                  <p className="text-sm font-semibold text-slate-800 text-right">
                    Total suggested: {scoreResult.script.totalScore} marks
                  </p>
                </div>
              )}

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3">
                <p className="text-xs text-slate-500">Status: {latestScript.status}</p>
                <div className="flex items-center gap-2">
                  <SecondaryButton onClick={handleDiscard} className="px-3 py-1.5 text-xs">
                    Discard Scan
                  </SecondaryButton>
                  <PrimaryButton onClick={handleCommit} disabled={scoring} className="px-3 py-1.5 text-xs">
                    {scoring ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Scoring...
                      </>
                    ) : (
                      'Commit to Grading Queue'
                    )}
                  </PrimaryButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}