import { useState } from "react"
import { X } from "lucide-react"
import SidebarHeader from "../SideBar/SidebarHeader"
import SearchSection from "../SideBar/SettingsSection"
import IntensityFilters from "../SideBar/IntensityFilters"
import StatsSection from "../SideBar/StatsSection"
import SettingsSection from "../SideBar/SettingsSection"

export default function Sidebar({
  filters,
  setFilters,
  mapRef,
  earthquakes,
  viewMode,
  setViewMode,
  loading,
  onClose,
  isMobile,
}) {
  const [activeTab, setActiveTab] = useState("filters")

  return (
    <aside
      className='w-96 bg-gradient-to-br from-white/90 via-slate-50/90 to-blue-50/90 
                     backdrop-blur-xl shadow-2xl h-screen flex flex-col border-r border-white/50 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/30 to-blue-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2'></div>

      {/* Mobile Close Button */}
      {isMobile && (
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg rounded-lg p-2 transition-all duration-200 hover:shadow-xl hover:scale-105'
          aria-label='Close sidebar'>
          <X className='w-5 h-5 text-slate-700' />
        </button>
      )}

      {/* Header */}
      <SidebarHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Body */}
      <div className='flex-1 overflow-y-auto relative z-10'>
        {activeTab === "filters" && (
          <>
            <SearchSection mapRef={mapRef} />
            <IntensityFilters
              filters={filters}
              setFilters={setFilters}
              earthquakes={earthquakes}
            />
          </>
        )}

        {activeTab === "stats" && <StatsSection earthquakes={earthquakes} />}

        {activeTab === "settings" && (
          <SettingsSection
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        )}
      </div>

      {/* Mobile indicator */}
      {isMobile && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20'>
          <div className='bg-white/80 backdrop-blur-sm rounded-full px-3 py-1'>
            <div className='text-xs text-slate-500 font-medium'>
              Swipe or tap outside to close
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
