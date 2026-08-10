import { Search, Maximize2, ImageIcon, Sparkles, CheckCircle2, PenLine, ArrowRight, Send } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { PrimaryButton, SecondaryButton } from '../components/ui.jsx'

const previousResults = [
  { label: 'Script 3: Sarah J.', score: '19/20', tone: 'text-emerald-600' },
  { label: 'Script 2: Mike R.', score: '14/20', tone: 'text-amber-500' },
  { label: 'Script 1: Alex P.', score: '18/20', tone: 'text-slate-400' },
]

export default function Results() {
  return (
    <div className="flex h-full flex-col">
      <Topbar title="ScriptMark" tabs={['Sessions', 'Guides', 'Archive']} activeTab="Sessions" search="Search scripts..." right={<PrimaryButton>Upgrade</PrimaryButton>} />

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-ink-950 text-white text-xs font-medium px-3 py-1">Script 4 of 32</span>
              <h3 className="text-sm font-medium text-slate-700">Biology Midterm &bull; Section C</h3>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Search size={16} className="cursor-pointer hover:text-slate-600" />
              <Maximize2 size={16} className="cursor-pointer hover:text-slate-600" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="h-40 w-32 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <ImageIcon size={28} />
                </div>
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <ImageIcon size={12} /> IMG_9482.jpg &bull; 2.4MB
                </p>
              </div>
              <span className="ml-auto text-xs text-slate-400">10:42 AM</span>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-white">
                <Sparkles size={16} />
              </div>
              <div className="flex-1 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Extracted Text (OCR)</p>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-sky-600">18</span>
                    <span className="text-sm text-slate-400">/20</span>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Suggest Score</p>
                  </div>
                </div>
                <p className="mt-2 text-sm italic text-slate-700">
                  &ldquo;The mitochondria is the powerhouse of the cell because it generates most of the chemical energy
                  needed to power the cell&rsquo;s biochemical reactions. Chemical energy produced by the mitochondria is
                  stored in a small molecule called adenosine triphosphate (ATP).&rdquo;
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-l-2 border-sky-400 pl-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Model Answer</p>
                    <p className="text-sm text-slate-700 mt-1">
                      Identify mitochondria as the energy source. Mention ATP production. Explain biochemical reaction
                      support.
                    </p>
                  </div>
                  <div className="border-l-2 border-sky-400 pl-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reasoning</p>
                    <p className="text-sm text-slate-700 mt-1">
                      Complete conceptual alignment. Terminology &ldquo;ATP&rdquo; used correctly. Slight deduction for
                      omission of cristae structure mention.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <PrimaryButton className="bg-emerald-600 hover:bg-emerald-500">
                    <CheckCircle2 size={16} /> Confirm Score
                  </PrimaryButton>
                  <SecondaryButton>
                    <PenLine size={16} /> Edit Text
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5">
            <input
              placeholder="Add a comment or adjustment..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <button className="rounded-full bg-sky-500 p-2 text-white hover:bg-sky-400">
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right: marking scheme */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Marking Scheme</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-sky-600">SECTION C-1</span>
                <span className="text-xs text-slate-400">Max 20 pts</span>
              </div>
              <p className="font-medium text-slate-800 mt-1">Cellular Functions</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                <li className="flex justify-between">
                  <span>Mitochondria identification</span> <span className="text-slate-400">(+5)</span>
                </li>
                <li className="flex justify-between">
                  <span>ATP definition</span> <span className="text-slate-400">(+10)</span>
                </li>
                <li className="flex justify-between">
                  <span>Biochemical context</span> <span className="text-slate-400">(+5)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Previous Results</p>
            <ul className="space-y-2">
              {previousResults.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                >
                  <span className="text-sm text-slate-700">{r.label}</span>
                  <span className={`text-sm font-semibold ${r.tone}`}>{r.score}</span>
                </li>
              ))}
            </ul>
          </div>

          <PrimaryButton className="w-full justify-center bg-sky-500 hover:bg-sky-400">
            Next Script <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
