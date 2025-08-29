import { useRef, useState, useEffect } from "react"
import useEarthquakeData from "./hooks/useEarthquakeData"
import MapView from "./components/MapView/MapView"
import Sidebar from "./components/SideBar/Sidebar"
import { Menu, X } from "lucide-react"

export default function App() {
  const { earthquakes, loading } = useEarthquakeData()
  const mapRef = useRef()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Changed default to false
  const [isMobile, setIsMobile] = useState(false)

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

  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024 // lg breakpoint
      setIsMobile(mobile)
      // Always start with sidebar closed for overlay behavior
      if (!isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-100/20 to-transparent rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-100/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      {/* Overlay for sidebar (all screen sizes when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always positioned as overlay */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
        `}>
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          mapRef={mapRef}
          earthquakes={earthquakes}
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={loading}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />
      </aside>

      {/* Fullscreen Map Container */}
      <div className='absolute inset-0 z-10'>
        {loading ? (
          <div className='flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
            <div className='flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 max-w-sm w-full'>
              <div className='relative'>
                <div className='w-12 h-12 sm:w-16 sm:h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin'></div>
                <div className='absolute inset-1.5 sm:inset-2 w-9 h-9 sm:w-12 sm:h-12 border-4 border-slate-100 border-b-indigo-600 rounded-full animate-spin animate-reverse'></div>
              </div>
              <div className='text-center'>
                <p className='text-slate-700 font-bold text-base sm:text-lg'>
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
      </div>

      {/* Floating Navigation Header - Overlaid on top */}
      <nav className='absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 p-4 sm:p-6 pointer-events-none'>
        {/* Left Section - Hamburger Menu */}
        <div className='flex items-center pointer-events-auto'>
          <button
            onClick={toggleSidebar}
            className='bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 group relative'
            aria-label='Toggle sidebar'>
            <div className='w-5 h-5 sm:w-6 sm:h-6'>
              {isSidebarOpen ? (
                <X className='w-5 h-5 sm:w-6 sm:h-6 text-slate-700 transition-transform duration-200 group-hover:rotate-90' />
              ) : (
                <Menu className='w-5 h-5 sm:w-6 sm:h-6 text-slate-700 transition-transform duration-200 group-hover:scale-110' />
              )}
            </div>
            {/* Notification dot for active filters */}
            {!isSidebarOpen && (
              <div className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg' />
            )}
          </button>
        </div>

        {/* Center Section - Header */}
        <div className='flex-1 flex justify-center px-4 pointer-events-auto'>
          <div className='bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-6 sm:py-4 transition-all duration-300 hover:shadow-3xl hover:scale-105 max-w-2xl w-full'>
            <div className='flex items-center justify-between gap-2 sm:gap-4'>
              <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
                <div className='relative flex-shrink-0'>
                  <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg'></div>
                  <div className='absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping opacity-30'></div>
                </div>
                <div className='flex flex-col min-w-0 flex-1'>
                  <span className='font-bold text-slate-800 text-sm sm:text-lg truncate'>
                    Seismic Monitor 🌍
                  </span>
                  <span className='text-xs text-slate-500 font-medium hidden sm:block'>
                    Real-time Global Activity
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
                <div className='text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-semibold shadow-sm border border-emerald-200/50'>
                  LIVE
                </div>
                <div className='text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-semibold shadow-sm border border-blue-200/50'>
                  {earthquakes.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Spacer for balance */}
        <div className='w-12 sm:w-16'></div>
      </nav>
    </div>
  )
}
