import { useState } from 'react'
import { Search, UploadCloud, Camera, CheckCircle2, ZoomIn, RotateCw, X } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { PrimaryButton, SecondaryButton, Badge } from '../components/ui.jsx'

const queue = [
  { name: 'script_042.jpg', status: 'Extracting OCR...', state: 'active' },
  { name: 'batch_01.pdf (Page 4/12)', status: 'Queued', state: 'queued' },
  { name: 'script_041.jpg', status: 'Digitized', state: 'done' },
]

export default function ScanScripts() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <Topbar
        title="Scan Student Scripts"
        right={
          <span className="hidden md:flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1">
            SESSION: MIDTERM_CS101
          </span>
        }
        search="Search sessions..."
      />

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Left column: upload + queue */}
        <div className="space-y-6">
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
              <UploadCloud size={22} />
            </div>
            <p className="font-semibold text-slate-900">Drop Batch Here</p>
            <p className="text-sm text-slate-500 mt-1">Upload PDFs or Image folders (max 500 scripts per batch)</p>
            <PrimaryButton className="mt-4 mx-auto bg-sky-500 hover:bg-sky-400">
              <UploadCloud size={16} /> Select Files
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
              Align script edges with guide lines for best results
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Scanning Queue (4)</p>
              <span className="text-xs text-slate-500">72% OVERALL</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {queue.map((q) => (
                <li key={q.name} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      q.state === 'done' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {q.state === 'done' ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">{q.name}</p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      q.state === 'done' ? 'text-emerald-500' : q.state === 'active' ? 'text-sky-500' : 'text-slate-400'
                    }`}
                  >
                    {q.status}
                  </span>
                </li>
              ))}
            </ul>
            <button className="w-full border-t border-slate-100 py-3 text-sm font-medium text-sky-600 hover:bg-slate-50">
              VIEW FULL QUEUE
            </button>
          </div>
        </div>

        {/* Right column: live review */}
        <div className="rounded-xl border border-slate-200 bg-white flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-800">Live Review: script_041.jpg</p>
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-slate-600">
                <Search size={16} />
              </button>
              <button className="text-slate-400 hover:text-slate-600">
                <RotateCw size={16} />
              </button>
              <PrimaryButton className="px-3 py-1.5 text-xs">Accept Extraction</PrimaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
            <div className="rounded-lg bg-slate-50 border border-slate-200 aspect-[4/3] flex items-center justify-center text-slate-400 text-sm">
              scanned script preview
            </div>

            <div className="text-sm text-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-slate-400">Extracted Text</span>
                <Badge tone="green">
                  <CheckCircle2 size={12} /> Confidence: 98.4%
                </Badge>
              </div>
              <p>
                <span className="underline decoration-sky-300">Student ID: 2023-CS-041</span>
              </p>
              <p className="underline decoration-sky-300">Question 1: Explain the concept of recursion.</p>
              <p>
                Recursion is a <span className="bg-sky-50 underline decoration-sky-300">method of solving problems</span> where
                the solution depends on solutions to smaller instances of the same problem. In programming, this is achieved by
                having a function call itself from within its own code.
              </p>
              <p>
                A base case is <span className="bg-sky-50 underline decoration-sky-300">essential</span> to prevent infinite
                loops. For example, calculating a factorial involves n * factorial(n-1) until the base case of n=1 is reached.
              </p>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">AI SUGGESTION</p>
                <p className="text-sm text-slate-700 mt-1">
                  Handwriting style detected as <span className="font-semibold">Cursive/Script</span>. No ambiguities found in
                  key mathematical notations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-500">Last saved 2 minutes ago to CS101_Fall_Batch</p>
            <div className="flex items-center gap-2">
              <SecondaryButton className="px-3 py-1.5 text-xs">Discard Scan</SecondaryButton>
              <PrimaryButton className="px-3 py-1.5 text-xs">Commit to Grading Queue</PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {!dismissed && (
        <div className="fixed bottom-6 right-6 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
          <p className="text-sm font-semibold text-slate-900">Batch Analysis Ready</p>
          <p className="text-sm text-slate-500 mt-1">Batch 1 has been successfully digitized.</p>
        </div>
      )}
    </div>
  )
}
