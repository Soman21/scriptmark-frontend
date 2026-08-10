import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { LayoutGrid, Trophy, Flag, FileText, Download, ListFilter, ChevronRight } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { StatCard, PrimaryButton, SecondaryButton, Badge } from '../components/ui.jsx'

const distribution = [
  { range: '0-20', value: 5 },
  { range: '21-40', value: 22 },
  { range: '41-60', value: 32 },
  { range: '61-80', value: 45 },
  { range: '81-100', value: 26 },
]

const sections = [
  { name: 'Section A: Fundamentals', score: 76 },
  { name: 'Section B: Logic', score: 41 },
  { name: 'Section C: Coding', score: 88 },
]

const flagged = [
  { id: 'SM-4492', reason: 'Handwriting illegibility', confidence: 'MED (64%)', assignee: 'Dr. Aris Thorne', status: 'PENDING' },
]

export default function Analytics() {
  return (
    <div className="flex h-full flex-col">
      <Topbar
        title="Analytics Report"
        right={
          <div className="flex items-center gap-2">
            <SecondaryButton>
              <ListFilter size={14} /> Filter Data
            </SecondaryButton>
            <PrimaryButton>
              <Download size={14} /> Export PDF
            </PrimaryButton>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <p className="text-xs text-slate-400">Exams &gt; Winter Finals 2024</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Performance Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Detailed analysis for CS101: Introduction to Programming (Batch A)</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<LayoutGrid size={16} className="text-sky-500" />}
            label="Class Average"
            value="72%"
            sub="\u2197 +3.2%"
            subColor="text-emerald-500"
          />
          <StatCard icon={<Trophy size={16} className="text-amber-500" />} label="Highest Score" value="98%" sub="Candidate ID: SM-8821" />
          <StatCard
            icon={<Flag size={16} className="text-rose-500" />}
            label="Flagged Scripts"
            value="12"
            sub="Requires manual review"
            subColor="text-rose-500"
          />
          <StatCard icon={<FileText size={16} className="text-slate-500" />} label="Total Scripts" value="148" sub="Processing complete" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">Score Distribution</p>
            <p className="text-sm text-slate-500 mb-4">Frequency of scores across all script submissions</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={distribution}>
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Question Analysis</p>
                <p className="text-sm text-slate-500">Performance heat-map per section</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {sections.map((s) => (
                <div key={s.name} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-slate-600 shrink-0">{s.name}</span>
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 flex-1 rounded"
                        style={{ backgroundColor: `rgba(14,165,233,${0.3 + (s.score / 100) * 0.6 * ((i + 1) / 5)})` }}
                      />
                    ))}
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-slate-700">{s.score}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Low (0%)</span>
              <div className="flex-1 mx-3 h-1.5 rounded-full bg-gradient-to-r from-sky-100 to-sky-500" />
              <span>High (100%)</span>
              <a className="ml-3 text-sky-600 font-medium">Detailed Breakdown</a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="font-semibold text-slate-900">Anomalies &amp; Flagged Scripts</p>
            <Badge tone="red">12 ACTION REQUIRED</Badge>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3">Candidate ID</th>
                <th className="px-5 py-3">Flag Reason</th>
                <th className="px-5 py-3">Confidence</th>
                <th className="px-5 py-3">Assigned To</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {flagged.map((f) => (
                <tr key={f.id} className="border-b border-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{f.id}</td>
                  <td className="px-5 py-3 text-slate-600">{f.reason}</td>
                  <td className="px-5 py-3">
                    <Badge tone="amber">{f.confidence}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{f.assignee}</td>
                  <td className="px-5 py-3">
                    <Badge tone="slate">{f.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <ChevronRight size={16} className="text-slate-400 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
