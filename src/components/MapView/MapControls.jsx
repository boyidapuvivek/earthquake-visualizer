import { Plus, Minus, Crosshair } from "lucide-react"

export default function MapControls({ mapRef }) {
  return (
    <>
      {/* Zoom Controls */}
      <div className='absolute bottom-6 right-6 z-20 space-y-3'>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 
                     hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
                     flex items-center justify-center'>
          <Plus className='w-5 h-5 text-blue-600' />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 
                     hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
                     flex items-center justify-center'>
          <Minus className='w-5 h-5 text-blue-600' />
        </button>
      </div>

      {/* Reset Center */}
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
