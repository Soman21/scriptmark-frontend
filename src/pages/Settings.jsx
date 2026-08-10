import Topbar from '../components/Topbar.jsx'

export default function Settings() {
  return (
    <div className="flex h-full flex-col">
      <Topbar title="Settings" />
      <div className="flex-1 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Account, institution, and security settings will live here.
        </div>
      </div>
    </div>
  )
}
