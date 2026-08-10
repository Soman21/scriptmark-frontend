import { useState } from 'react'
import { Sparkles, CheckCircle2, ChevronRight, Send, Plus, Mic, FileText } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { PrimaryButton } from '../components/ui.jsx'

const messages = [
  {
    role: 'user',
    text: "I've just uploaded the new marking guide for the Digital Electronics (ECE 831). Can you verify the grading criteria for Question 4 - Computer Architecture?",
    file: 'digital_electronics_v2.pdf',
  },
  {
    role: 'assistant',
    intro: 'Got it. I\u2019ve processed the Digital Electronics guide. Ready to scan scripts.',
    body: 'For Question 4, I\u2019ve identified four key marking points:',
    points: [
      '2 points for the correct Schr\u00f6dinger equation derivation.',
      '1 point for identifying the boundary conditions.',
    ],
  },
]

export default function Dashboard() {
  const [draft, setDraft] = useState('')

  return (
    <div className="flex h-full flex-col">
      <Topbar
        title="Active Marking: Physics Mid-term"
        tabs={['Sessions', 'Guides', 'Archive']}
        activeTab="Sessions"
        right={<PrimaryButton className="bg-ink-950">Upgrade</PrimaryButton>}
      />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-xl rounded-2xl bg-slate-100 px-5 py-4">
                <p className="text-sm text-slate-800">{m.text}</p>
                {m.file && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-600">
                    <FileText size={16} />
                    {m.file}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-white">
                <Sparkles size={16} />
              </div>
              <div className="max-w-xl rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4">
                <p className="text-sm text-slate-800">
                  {m.intro.split('Digital Electronics').map((chunk, idx) =>
                    idx === 0 ? (
                      <span key={idx}>{chunk}</span>
                    ) : (
                      <span key={idx}>
                        <span className="font-semibold text-sky-700">Digital Electronics</span>
                        {chunk}
                      </span>
                    )
                  )}
                </p>
                <p className="text-sm text-slate-800 mt-3">{m.body}</p>
                <ul className="mt-2 space-y-1.5">
                  {m.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sky-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 text-xs">
              script
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Queue Status</p>
              <p className="text-sm text-slate-500">32 scripts pending for ECE 831. Estimated grading time: 4 minutes.</p>
            </div>
            <ChevronRight className="text-slate-400" size={18} />
          </div>
          <div className="rounded-xl bg-sky-50 p-4 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-sky-600">98%</p>
            <p className="text-xs font-medium text-sky-700 tracking-wide mt-1">ACCURACY RATING</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5">
          <button className="text-slate-400 hover:text-slate-600">
            <Plus size={18} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message ScriptMark..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button className="text-slate-400 hover:text-slate-600">
            <Mic size={18} />
          </button>
          <button className="rounded-full bg-ink-950 p-2 text-white hover:bg-ink-900">
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">AI can make mistakes. Check important info.</p>
      </div>
    </div>
  )
}
