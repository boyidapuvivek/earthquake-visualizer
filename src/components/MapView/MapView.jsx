import { MapContainer, TileLayer } from "react-leaflet"
import { useState } from "react"
import EarthquakeLayer from "./EarthquakeLayer"
import ClusterLayer from "./ClusterLayer"
import HeatmapLayer from "./HeatmapLayer"
import MapControls from "./MapControls"

export default function MapView({ earthquakes, filters, mapRef, viewMode }) {
  const [mapStyle, setMapStyle] = useState("satellite")
  const [showControls, setShowControls] = useState(true)

  const filterByIntensity = (eq) => {
    const mag = eq.properties.mag
    if (mag >= 5 && filters.intensity.includes("high")) return true
    if (mag >= 3 && mag < 5 && filters.intensity.includes("medium")) return true
    if (mag < 3 && filters.intensity.includes("low")) return true
    return false
  }

  const filteredEarthquakes = earthquakes.filter(filterByIntensity)

  const mapStyles = {
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri",
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
    },
    light: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap, SRTM | © OpenTopoMap",
    },
  }

  return (
    <div className='relative h-full w-full overflow-hidden rounded-l-3xl shadow-2xl'>
      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        className='h-full w-full z-0'
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        ref={mapRef}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        attributionControl={false}>
        <TileLayer
          url={mapStyles[mapStyle].url}
          attribution={mapStyles[mapStyle].attribution}
          noWrap={false}
          minZoom={2}
          maxZoom={18}
        />

        {viewMode === "standard" && (
          <EarthquakeLayer earthquakes={filteredEarthquakes} />
        )}
        {viewMode === "cluster" && (
          <ClusterLayer earthquakes={filteredEarthquakes} />
        )}
        {viewMode === "heatmap" && (
          <HeatmapLayer earthquakes={filteredEarthquakes} />
        )}
      </MapContainer>

      {/* Floating Map Controls (must be outside MapContainer) */}
      <div
        className={`absolute top-6 right-6 z-20 transition-all duration-300 ${
          showControls ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}>
        <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 space-y-3'>
          <div className='space-y-2'>
            <p className='text-xs font-semibold text-slate-600 uppercase tracking-wide'>
              Map Style
            </p>
            <div className='grid grid-cols-2 gap-2'>
              {Object.entries(mapStyles).map(([style]) => (
                <button
                  key={style}
                  onClick={() => setMapStyle(style)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                    mapStyle === style
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom & Reset */}
      <MapControls mapRef={mapRef} />
    </div>
  )
}

// import { MapContainer, TileLayer } from "react-leaflet"
// import EarthquakeMarker from "./EarthquakeMarker"
// import { useState, useEffect } from "react"
// import { Plus, Minus, Crosshair } from "lucide-react"

// export default function MapView({ earthquakes, filters, mapRef, viewMode }) {
//   const [mapStyle, setMapStyle] = useState("satellite")
//   const [showControls, setShowControls] = useState(true)

//   const filterByIntensity = (eq) => {
//     const mag = eq.properties.mag
//     if (mag >= 5 && filters.intensity.includes("high")) return true
//     if (mag >= 3 && mag < 5 && filters.intensity.includes("medium")) return true
//     if (mag < 3 && filters.intensity.includes("low")) return true
//     return false
//   }

//   const filteredEarthquakes = earthquakes.filter(filterByIntensity)

//   const mapStyles = {
//     dark: {
//       url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
//     },
//     light: {
//       url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
//     },
//     satellite: {
//       url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//       attribution: "Tiles &copy; Esri",
//     },
//     terrain: {
//       url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
//       attribution:
//         'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
//     },
//   }

//   useEffect(() => {
//     // Auto-hide controls after 3 seconds of inactivity
//     const timer = setTimeout(() => {
//       setShowControls(false)
//     }, 3000)

//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <div
//       className='relative h-full w-full overflow-hidden rounded-l-3xl shadow-2xl group'
//       onMouseEnter={() => setShowControls(true)}
//       onMouseLeave={() => setShowControls(false)}>
//       {/* Enhanced Map Container */}
//       <MapContainer
//         center={[20, 0]}
//         zoom={2}
//         scrollWheelZoom={true}
//         className='h-full w-full z-0'
//         maxBounds={[
//           [-90, -180],
//           [90, 180],
//         ]}
//         ref={mapRef}
//         maxBoundsViscosity={1.0}
//         zoomControl={false}
//         attributionControl={false}>
//         <TileLayer
//           url={mapStyles[mapStyle].url}
//           attribution={mapStyles[mapStyle].attribution}
//           noWrap={false}
//           minZoom={2}
//           maxZoom={18}
//         />

//         {/* Render earthquakes based on view mode */}
//         {viewMode === "standard" &&
//           filteredEarthquakes.map((eq) => (
//             <EarthquakeMarker
//               key={eq.id}
//               earthquake={eq}
//             />
//           ))}

//         {viewMode === "cluster" && (
//           // For cluster mode, we would typically use a clustering library
//           // For now, showing all markers with enhanced styling
//           <>
//             {filteredEarthquakes.map((eq) => (
//               <EarthquakeMarker
//                 key={eq.id}
//                 earthquake={eq}
//                 clustered={true}
//               />
//             ))}
//           </>
//         )}

//         {/* Heatmap mode would require additional libraries like leaflet-heatmap */}
//       </MapContainer>

//       {/* Floating Map Controls */}
//       <div
//         className={`absolute top-6 right-6 z-20 transition-all duration-300 ${
//           showControls ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
//         }`}>
//         <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 space-y-3'>
//           {/* Map Style Selector */}
//           <div className='space-y-2'>
//             <p className='text-xs font-semibold text-slate-600 uppercase tracking-wide'>
//               Map Style
//             </p>
//             <div className='grid grid-cols-2 gap-2'>
//               {Object.entries(mapStyles).map(([style, config]) => (
//                 <button
//                   key={style}
//                   onClick={() => setMapStyle(style)}
//                   className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
//                     mapStyle === style
//                       ? "bg-blue-600 text-white shadow-md"
//                       : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                   }`}>
//                   {style.charAt(0).toUpperCase() + style.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* View Mode Indicator */}
//           <div className='pt-3 border-t border-slate-200/50'>
//             <p className='text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2'>
//               View Mode
//             </p>
//             <div className='flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg'>
//               <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
//               <span className='text-xs font-medium text-slate-700 capitalize'>
//                 {viewMode}
//               </span>
//             </div>
//           </div>

//           {/* Data Info */}
//           <div className='pt-3 border-t border-slate-200/50'>
//             <div className='flex items-center justify-between text-xs'>
//               <span className='text-slate-600 font-medium'>Showing:</span>
//               <span className='text-slate-800 font-bold'>
//                 {filteredEarthquakes.length} events
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {viewMode === "heatmap" && (
//         <div className='absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30'>
//           <div className='bg-white rounded-2xl shadow-xl border border-white/50 p-8 text-center'>
//             <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
//             <p className='text-slate-700 font-semibold'>Loading Heatmap View</p>
//             <p className='text-slate-500 text-sm mt-1'>
//               Generating density visualization...
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Enhanced zoom controls */}
//       <div className='absolute bottom-6 right-6 z-20'>
//         <div className='space-y-3'>
//           <button
//             onClick={() => mapRef.current?.zoomIn()}
//             className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3
//                hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
//                flex items-center justify-center'>
//             <Plus className='w-5 h-5 text-blue-600' />
//           </button>
//           <button
//             onClick={() => mapRef.current?.zoomOut()}
//             className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3
//                hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
//                flex items-center justify-center'>
//             <Minus className='w-5 h-5 text-blue-600' />
//           </button>
//         </div>
//       </div>

//       {/* Center map button */}
//       <div className='absolute bottom-6 left-6 z-20'>
//         <button
//           onClick={() => mapRef.current?.setView([20, 0], 2)}
//           className='bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3
//                hover:bg-blue-50 active:scale-95 transition-all duration-200 hover:shadow-xl
//                flex items-center justify-center'
//           title='Center Map'>
//           <Crosshair className='w-5 h-5 text-blue-600' />
//         </button>
//       </div>
//     </div>
//   )
// }
