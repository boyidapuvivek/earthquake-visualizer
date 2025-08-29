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

      {/* Zoom & Reset Controls with Map Style Button */}
      <MapControls
        mapRef={mapRef}
        mapStyle={mapStyle}
        mapStyles={mapStyles}
        styleMenuOpen={styleMenuOpen}
        setStyleMenuOpen={setStyleMenuOpen}
        handleStyleChange={handleStyleChange}
      />
    </div>
  )
}
