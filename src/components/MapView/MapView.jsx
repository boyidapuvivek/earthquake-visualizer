import { MapContainer, TileLayer } from "react-leaflet"
import { useState } from "react"
import EarthquakeLayer from "./EarthquakeLayer"
import ClusterLayer from "./ClusterLayer"
import HeatmapLayer from "./HeatmapLayer"
import MapControls from "./MapControls"
import { Layers, Check, Map } from "lucide-react" // using icons

export default function MapView({ earthquakes, filters, mapRef, viewMode }) {
  const [mapStyle, setMapStyle] = useState("terrain")
  const [showControls, setShowControls] = useState(true)
  const [styleMenuOpen, setStyleMenuOpen] = useState(false)

  const filterByIntensity = (eq) => {
    const mag = eq.properties.mag
    if (mag >= 5 && filters.intensity.includes("high")) return true
    if (mag >= 3 && mag < 5 && filters.intensity.includes("medium")) return true
    if (mag < 3 && filters.intensity.includes("low")) return true
    return false
  }

  const filteredEarthquakes = earthquakes.filter(filterByIntensity)

  const mapStyles = {
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap, SRTM | © OpenTopoMap",
    },
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
  }

  const handleStyleChange = (style) => {
    setMapStyle(style)
    setStyleMenuOpen(false) // close after selecting
  }

  return (
    <div className='relative h-full w-full overflow-hidden shadow-2xl'>
      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        className='h-full w-screen z-0'
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

      {/* Floating Map Controls */}
      <div
        className={`absolute top-6 right-6 z-20 transition-all duration-300 ${
          showControls ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}>
        <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2'>
          {/* Map Style Dropdown */}
          <div className='relative'>
            {/* Toggle Button */}
            <button
              onClick={() => setStyleMenuOpen(!styleMenuOpen)}
              className='flex items-center px-2 py-2 rounded-lg text-white text-sm font-medium'>
              <Map className='w-4 h-4 text-slate-400 hover:text-blue-800' />
            </button>

            {/* Dropdown */}
            {styleMenuOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50'>
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
        </div>
      </div>

      {/* Zoom & Reset */}
      <MapControls mapRef={mapRef} />
    </div>
  )
}
