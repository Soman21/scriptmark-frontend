import { Users, CheckCircle2, Clock, Flag, Download, Upload, ChevronRight, ChevronLeft } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import { StatCard, SecondaryButton, Badge } from '../components/ui.jsx'

const students = [
  { id: '#STU-8821', name: 'Alice Robertson', score: '94/100', status: 'REVIEWED', date: 'Oct 24, 2023' },
  { id: '#STU-8824', name: 'Benjamin Thorne', score: '--', status: 'PENDING', date: 'Oct 25, 2023' },
  { id: '#STU-8827', name: 'Clara Higgins', score: '42/100', status: 'FLAGGED', date: 'Oct 22, 2023' },
  { id: '#STU-8831', name: 'David Chen', score: '88/100', status: 'REVIEWED', date: 'Oct 24, 2023' },
  { id: '#STU-8835', name: 'Elena Vargas', score: '76/100', status: 'REVIEWED', date: 'Oct 23, 2023' },
]

const statusTone = { REVIEWED: 'green', PENDING: 'amber', FLAGGED: 'red' }

export default function Archive() {
  return (
    <div className="flex h-full flex-col relative">
      <Topbar title="Student Results" tabs={['Sessions', 'Guides', 'Archive']} activeTab="Archive" search="Search students..." />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500">Exam Period</label>
            <select className="mt-1 block w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option>Final Examination 2023</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select className="mt-1 block w-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option>All Statuses</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs font-medium text-slate-500 flex justify-between">
              <span>Score Range</span> <span className="text-sky-600">0 - 100</span>
            </label>
            <input type="range" className="mt-2 w-full accent-sky-500" />
          </div>
          <div className="flex gap-2">
            <SecondaryButton>
              <Download size={14} /> Export CSV
            </SecondaryButton>
            <SecondaryButton>
              <Download size={14} /> Export PDF
            </SecondaryButton>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={<Users size={16} className="text-sky-500" />} label="Total Students" value="124" />
          <StatCard icon={<CheckCircle2 size={16} className="text-emerald-500" />} label="Reviewed" value="82" />
          <StatCard icon={<Clock size={16} className="text-amber-500" />} label="Pending" value="38" />
          <StatCard icon={<Flag size={16} className="text-rose-500" />} label="Flagged" value="4" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Activity</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-500">{s.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                        {s.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{s.score}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{s.date}</td>
                  <td className="px-5 py-3">
                    <ChevronRight size={16} className="text-slate-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1-10 of 124 students</p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`h-8 w-8 rounded-lg text-sm ${
                  n === 1 ? 'bg-ink-950 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button className="h-8 w-8 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">13</button>
            <button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <button className="absolute bottom-6 right-6 rounded-full bg-sky-500 hover:bg-sky-400 p-3 text-white shadow-lg">
        <Upload size={18} />
      </button>
    </div>
  )
}
