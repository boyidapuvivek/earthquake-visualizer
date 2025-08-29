import { Map, SlidersHorizontal, BarChart2, Settings } from "lucide-react"
import TabButton from "./TabButton"

export default function SidebarHeader({ activeTab, setActiveTab }) {
  return (
    <div className='p-6 border-b border-white/30 bg-gradient-to-r from-white/60 to-slate-50/60 backdrop-blur-sm relative z-10'>
      <div className='flex items-center gap-4 mb-4'>
        <div className='w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
          <Map className='text-white w-6 h-6' />
        </div>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent'>
            Seismic Control
          </h1>
          <p className='text-slate-600 text-sm font-medium'>
            Global earthquake monitoring
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 bg-gray-200 p-1.5 rounded-xl'>
        <TabButton
          id='filters'
          label='Filters'
          icon={<SlidersHorizontal size={16} />}
          isActive={activeTab === "filters"}
          onClick={setActiveTab}
        />
        <TabButton
          id='stats'
          label='Stats'
          icon={<BarChart2 size={16} />}
          isActive={activeTab === "stats"}
          onClick={setActiveTab}
        />
        <TabButton
          id='settings'
          label='View'
          icon={<Settings size={16} />}
          isActive={activeTab === "settings"}
          onClick={setActiveTab}
        />
      </div>
    </div>
  )
}
