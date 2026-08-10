import { Bell, User } from 'lucide-react'

export default function Topbar({ title, tabs, activeTab, onTabChange, right, search }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-semibold text-slate-900 whitespace-nowrap">{title}</h2>
        {tabs && (
          <nav className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange && onTabChange(tab)}
                className={`text-sm pb-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600 font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {search && (
          <input
            type="text"
            placeholder={search}
            className="hidden sm:block w-56 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        )}
        {right}
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <User size={16} />
        </div>
      </div>
    </header>
  )
}
