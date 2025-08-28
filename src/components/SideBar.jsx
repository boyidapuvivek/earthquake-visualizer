import { useState } from "react"
import { geocodeCountry } from "../utils/geocode"
import {
  Search,
  Clock,
  SlidersHorizontal,
  BarChart2,
  Settings,
  AlertTriangle,
  Activity,
  Map,
} from "lucide-react"

export default function Sidebar({
  filters,
  setFilters,
  mapRef,
  earthquakes,
  viewMode,
  setViewMode,
  loading,
}) {
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [activeTab, setActiveTab] = useState("filters") // filters, stats, settings

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!search.trim()) return

    setIsSearching(true)
    try {
      const coords = await geocodeCountry(search)
      if (coords && mapRef.current) {
        mapRef.current.setView([coords.lat, coords.lng], 6)
        setSearchHistory((prev) => [
          { query: search, coords, timestamp: Date.now() },
          ...prev.slice(0, 4),
        ])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
      setSearch("")
    }
  }

  const intensityConfig = {
    low: {
      label: "Low Magnitude",
      range: "< 3.0",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      dotColor: "bg-emerald-400",
      count: earthquakes.filter((eq) => eq.properties.mag < 3).length,
    },
    medium: {
      label: "Medium Magnitude",
      range: "3.0 - 4.9",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      dotColor: "bg-orange-400",
      count: earthquakes.filter(
        (eq) => eq.properties.mag >= 3 && eq.properties.mag < 5
      ).length,
    },
    high: {
      label: "High Magnitude",
      range: "≥ 5.0",
      color: "bg-red-100 text-red-800 border-red-200",
      dotColor: "bg-red-500",
      count: earthquakes.filter((eq) => eq.properties.mag >= 5).length,
    },
  }

  const viewModes = [
    { id: "standard", label: "Standard", icon: <Map size={18} /> },
    { id: "heatmap", label: "Heatmap", icon: <Activity size={18} /> },
    { id: "cluster", label: "Cluster", icon: <BarChart2 size={18} /> },
  ]
  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
        isActive
          ? "bg-white shadow-lg text-blue-600 border-2 border-blue-200"
          : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
      }`}>
      {icon}
      <span className='text-sm'>{label}</span>
    </button>
  )

  const QuickSearchButton = ({ query, coords, onClick }) => (
    <button
      onClick={() => onClick(coords)}
      className='flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg transition-colors duration-200'>
      <Clock
        size={14}
        className='text-slate-500'
      />
      {query}
    </button>
  )

  return (
    <aside className='w-96 bg-gradient-to-br from-white/90 via-slate-50/90 to-blue-50/90 backdrop-blur-xl shadow-2xl h-screen flex flex-col border-r border-white/50 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/30 to-blue-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2'></div>

      {/* Enhanced Header */}
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

        {/* Tab Navigation */}
        <div className='flex gap-2 bg-slate-100/50 p-1.5 rounded-xl'>
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

      <div className='flex-1 overflow-y-auto relative z-10'>
        {activeTab === "filters" && (
          <div className='p-6 space-y-8'>
            {/* Enhanced Search Section */}
            <div className='space-y-4'>
              <h3 className='font-bold text-slate-800 flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                  <Search className='w-4 h-4 text-white' />
                </div>
                Location Search
              </h3>

              <div className='space-y-3'>
                <div className='relative group'>
                  <input
                    type='text'
                    placeholder='Search countries, cities, regions...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className='w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl text-sm 
                             focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400
                             shadow-lg transition-all duration-300 placeholder:text-slate-400
                             group-hover:shadow-xl group-hover:border-slate-300/50'
                  />
                  <div className='absolute left-4 top-1/2 -translate-y-1/2'>
                    <Search className='w-5 h-5 text-slate-400 group-hover:text-slate-500 transition-colors duration-200' />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isSearching || !search.trim()}
                  className='w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold rounded-2xl
                           hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3'>
                  {isSearching ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>Search Location</span>
                    </>
                  )}
                </button>

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-600 font-medium'>
                      Recent Searches:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {searchHistory.map((item, index) => (
                        <QuickSearchButton
                          key={index}
                          query={item.query}
                          coords={item.coords}
                          onClick={(coords) =>
                            mapRef.current?.setView([coords.lat, coords.lng], 6)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Intensity Filters */}
            <div className='space-y-4'>
              <h3 className='font-bold text-slate-800 flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                Magnitude Filters
              </h3>

              <div className='space-y-3'>
                {Object.entries(intensityConfig).map(([level, config]) => (
                  <label
                    key={level}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer
                               transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                                 filters.intensity.includes(level)
                                   ? config.color + " shadow-lg scale-105"
                                   : "bg-white/60 border-slate-200/50 hover:border-slate-300/50 hover:bg-white/80"
                               }`}>
                    <div className='flex items-center gap-4'>
                      <div className='relative'>
                        <input
                          type='checkbox'
                          checked={filters.intensity.includes(level)}
                          onChange={() => {
                            setFilters((prev) => ({
                              ...prev,
                              intensity: prev.intensity.includes(level)
                                ? prev.intensity.filter((i) => i !== level)
                                : [...prev.intensity, level],
                            }))
                          }}
                          className='w-5 h-5 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2'
                        />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-sm'>
                          {config.label}
                        </span>
                        <span className='text-xs opacity-75'>
                          {config.range}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          filters.intensity.includes(level)
                            ? "bg-white/50"
                            : "bg-slate-100"
                        }`}>
                        {config.count}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full shadow-sm ${config.dotColor}`}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className='p-6 space-y-6'>
            {/* Activity Overview */}
            <div className='bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-xl'>
              <h3 className='font-bold text-slate-800 mb-6 flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
                Activity Summary
              </h3>
              <div className='grid grid-cols-3 gap-4'>
                {Object.entries(intensityConfig).map(([level, config]) => (
                  <div
                    key={level}
                    className={`${config.color} rounded-2xl p-4 text-center border transition-all duration-300 hover:scale-105`}>
                    <div className='text-2xl font-bold mb-1'>
                      {config.count}
                    </div>
                    <div className='text-xs font-semibold opacity-80'>
                      {config.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className='bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-xl'>
              <h4 className='font-bold text-slate-800 mb-4'>
                Recent High Magnitude
              </h4>
              <div className='space-y-3 max-h-48 overflow-y-auto'>
                {earthquakes
                  .filter((eq) => eq.properties.mag >= 4)
                  .slice(0, 5)
                  .map((eq, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/30'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          eq.properties.mag >= 5
                            ? "bg-red-500"
                            : "bg-orange-400"
                        }`}></div>
                      <div className='flex-1'>
                        <div className='font-semibold text-sm text-slate-800'>
                          {eq.properties.mag.toFixed(1)}
                        </div>
                        <div className='text-xs text-slate-600'>
                          {eq.properties.place}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className='p-6 space-y-6'>
            {/* View Mode Selection */}
            <div className='space-y-4'>
              <h3 className='font-bold text-slate-800 flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                </div>
                Visualization Mode
              </h3>

              <div className='grid grid-cols-1 gap-3'>
                {viewModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                      viewMode === mode.id
                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 shadow-lg scale-105"
                        : "bg-white/60 border-slate-200/50 hover:bg-white/80 hover:border-slate-300/50 hover:scale-102"
                    }`}>
                    <div className='text-2xl'>{mode.icon}</div>
                    <div className='text-left'>
                      <div className='font-semibold text-slate-800'>
                        {mode.label}
                      </div>
                      <div className='text-xs text-slate-600'>
                        {mode.id === "standard" && "Individual markers"}
                        {mode.id === "heatmap" && "Density visualization"}
                        {mode.id === "cluster" && "Grouped markers"}
                      </div>
                    </div>
                    {viewMode === mode.id && (
                      <div className='ml-auto'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
