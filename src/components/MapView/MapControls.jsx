import { Plus, Minus, Crosshair, Map, Check } from "lucide-react"

export default function MapControls({
  mapRef,
  mapStyle,
  mapStyles,
  styleMenuOpen,
  setStyleMenuOpen,
  handleStyleChange,
}) {
  return (
    <>
      {/* Right Side Controls - Map Style and Zoom */}
      <div className='absolute bottom-6 right-6 z-20 space-y-3'>
        {/* Map Style Dropdown */}
        <div className='relative'>
          {/* Map Style Toggle Button */}
          <button
            onClick={() => setStyleMenuOpen(!styleMenuOpen)}
            className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 
                       hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
                       flex items-center justify-center'>
            <Map className='w-5 h-5 text-blue-600' />
          </button>

          {/* Dropdown Menu */}
          {styleMenuOpen && (
            <div className='absolute right-0 bottom-full mb-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50'>
              {Object.entries(mapStyles).map(([style]) => (
                <button
                  key={style}
                  onClick={() => handleStyleChange(style)}
                  className={`w-full px-4 py-2 text-sm flex items-center justify-between transition ${
                    mapStyle === style
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                  {mapStyle === style && <Check className='w-4 h-4' />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom In Button */}
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 
                     hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
                     flex items-center justify-center'>
          <Plus className='w-5 h-5 text-blue-600' />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 
                     hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
                     flex items-center justify-center'>
          <Minus className='w-5 h-5 text-blue-600' />
        </button>
      </div>

      {/* Reset Center Button - Left Side */}
      <div className='absolute bottom-6 left-6 z-20'>
        <button
          onClick={() => mapRef.current?.setView([20, 0], 2)}
          className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 
                     hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
                     flex items-center justify-center'
          title='Center Map'>
          <Crosshair className='w-5 h-5 text-blue-600' />
        </button>
      </div>
    </>
  )
}
