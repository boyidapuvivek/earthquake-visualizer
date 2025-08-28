import { useRef, useState } from "react"
import useEarthquakeData from "./hooks/useEarthquakeData"
import MapView from "./components/MapView"
import Sidebar from "./components/SideBar"

export default function App() {
  const { earthquakes, loading } = useEarthquakeData()
  const mapRef = useRef()

  const [filters, setFilters] = useState({
    intensity: ["low", "medium", "high"],
    dateRange: {
      start: null,
      end: null,
    },
    depth: {
      min: 0,
      max: 700,
    },
  })

  const [viewMode, setViewMode] = useState("standard") // standard, heatmap, cluster

  return (
    <div className='min-h-screen w-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-100/20 to-transparent rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-100/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      <Sidebar
        filters={filters}
        setFilters={setFilters}
        mapRef={mapRef}
        earthquakes={earthquakes}
        viewMode={viewMode}
        setViewMode={setViewMode}
        loading={loading}
      />

      <main className='flex-1 relative z-10'>
        {/* Enhanced floating header */}
        <header className='absolute top-6 left-1/2 -translate-x-1/2 z-30'>
          <div className='bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl px-6 py-4 transition-all duration-300 hover:shadow-3xl hover:scale-105'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg'></div>
                <div className='absolute inset-0 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping opacity-30'></div>
              </div>
              <div className='flex flex-col'>
                <span className='font-bold text-slate-800 text-lg'>
                  🌍 Seismic Monitor
                </span>
                <span className='text-xs text-slate-500 font-medium'>
                  Real-time Global Activity
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-emerald-200/50'>
                  LIVE
                </div>
                <div className='text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-blue-200/50'>
                  {earthquakes.length} Events
                </div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className='flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
            <div className='flex flex-col items-center gap-6 p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50'>
              <div className='relative'>
                <div className='w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin'></div>
                <div className='absolute inset-2 w-12 h-12 border-4 border-slate-100 border-b-indigo-600 rounded-full animate-spin animate-reverse'></div>
              </div>
              <div className='text-center'>
                <p className='text-slate-700 font-bold text-lg'>
                  Loading Seismic Data
                </p>
                <p className='text-slate-500 text-sm mt-1'>
                  Fetching global earthquake information...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MapView
            earthquakes={earthquakes}
            filters={filters}
            mapRef={mapRef}
            viewMode={viewMode}
          />
        )}

        {!loading && (
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-20'>
            <div className='bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl px-6 py-3'>
              <div className='flex items-center gap-6 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                  <span className='text-slate-600 font-medium'>
                    High:{" "}
                    {earthquakes.filter((eq) => eq.properties.mag >= 5).length}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-orange-400 rounded-full'></div>
                  <span className='text-slate-600 font-medium'>
                    Medium:{" "}
                    {
                      earthquakes.filter(
                        (eq) => eq.properties.mag >= 3 && eq.properties.mag < 5
                      ).length
                    }
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-emerald-400 rounded-full'></div>
                  <span className='text-slate-600 font-medium'>
                    Low:{" "}
                    {earthquakes.filter((eq) => eq.properties.mag < 3).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
