import { Map, Activity, BarChart2 } from "lucide-react"

export default function SettingsSection({ viewMode, setViewMode }) {
  const viewModes = [
    { id: "standard", label: "Standard", icon: <Map size={18} /> },
    { id: "heatmap", label: "Heatmap", icon: <Activity size={18} /> },
    { id: "cluster", label: "Cluster", icon: <BarChart2 size={18} /> },
  ]

  return (
    <div className='p-6 space-y-6'>
      <h3 className='font-bold text-slate-800 mb-4'>Visualization Mode</h3>
      <div className='grid gap-3'>
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
              viewMode === mode.id
                ? "bg-blue-100 border-blue-300 shadow-md scale-105"
                : "bg-white/60 border-slate-200 hover:bg-white/80 hover:border-slate-300"
            }`}>
            {mode.icon}
            <div>
              <div className='font-semibold'>{mode.label}</div>
              <div className='text-xs text-slate-500'>
                {mode.id === "standard" && "Individual markers"}
                {mode.id === "heatmap" && "Density visualization"}
                {mode.id === "cluster" && "Grouped markers"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
