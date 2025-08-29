import { Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import { useMap } from "react-leaflet"
import { formatDate } from "../utils/formatData"
import {
  MapPin, // for location
  Clock, // for time
  Calendar, // for full date
  ExternalLink, // for USGS details
  Mountain, // for depth
  Zap, // for intensity
} from "lucide-react"

const getMarkerIcon = (
  magnitude,
  clustered = false,
  popupDirection = "top"
) => {
  const getSize = (mag) => {
    if (mag >= 6) return clustered ? 48 : 40
    if (mag >= 5) return clustered ? 40 : 32
    if (mag >= 3) return clustered ? 32 : 24
    return clustered ? 24 : 20
  }

  const getColor = (mag) => {
    if (mag >= 6)
      return {
        bg: "bg-red-600",
        border: "border-red-700",
        shadow: "shadow-red-500/50",
      }
    if (mag >= 5)
      return {
        bg: "bg-red-500",
        border: "border-red-600",
        shadow: "shadow-red-400/50",
      }
    if (mag >= 4)
      return {
        bg: "bg-orange-500",
        border: "border-orange-600",
        shadow: "shadow-orange-400/50",
      }
    if (mag >= 3)
      return {
        bg: "bg-orange-400",
        border: "border-orange-500",
        shadow: "shadow-orange-300/50",
      }
    return {
      bg: "bg-emerald-400",
      border: "border-emerald-500",
      shadow: "shadow-emerald-300/50",
    }
  }

  const size = getSize(magnitude)
  const colors = getColor(magnitude)
  const pulseSize = size + 8

  // Adjust popup anchor based on desired direction
  const getPopupAnchor = () => {
    switch (popupDirection) {
      case "bottom":
        return [0, size / 2 + 10] // Show popup below marker
      case "top":
      default:
        return [0, -size / 2] // Show popup above marker (default)
    }
  }

  return L.divIcon({
    className: "custom-earthquake-marker",
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Outer pulse ring -->
        <div class="absolute w-${pulseSize / 4} h-${pulseSize / 4} ${
      colors.bg
    } rounded-full opacity-20 animate-ping"></div>
        
        <!-- Middle glow ring -->
        <div class="absolute w-${(size + 4) / 4} h-${(size + 4) / 4} ${
      colors.bg
    } rounded-full opacity-40 animate-pulse"></div>
        
        <!-- Main marker -->
        <div class="relative w-${size / 4} h-${size / 4} ${colors.bg} ${
      colors.border
    } border-2 rounded-full 
                    flex items-center justify-center text-white font-bold shadow-lg ${
                      colors.shadow
                    }
                    hover:scale-110 transition-all duration-300 cursor-pointer z-10
                    ${clustered ? "ring-2 ring-white ring-opacity-50" : ""}">
          <span class="text-${
            size >= 32 ? "sm" : "xs"
          } drop-shadow-sm">${magnitude.toFixed(1)}</span>
        </div>
        
        <!-- Ripple effect on hover -->
        <div class="absolute w-${size / 4} h-${size / 4} ${
      colors.bg
    } rounded-full opacity-0 hover:opacity-30 
                    hover:scale-150 transition-all duration-500 pointer-events-none"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: getPopupAnchor(),
  })
}

const getIntensityInfo = (magnitude) => {
  if (magnitude >= 6)
    return {
      level: "Major",
      description: "Significant damage",
      color: "text-red-600",
      bgColor: "bg-red-600",
    }
  if (magnitude >= 5)
    return {
      level: "Moderate",
      description: "Minor damage",
      color: "text-red-500",
      bgColor: "bg-red-500",
    }
  if (magnitude >= 4)
    return {
      level: "Light",
      description: "Rarely damages",
      color: "text-orange-500",
      bgColor: "bg-orange-500",
    }
  if (magnitude >= 3)
    return {
      level: "Minor",
      description: "Weak shaking",
      color: "text-orange-400",
      bgColor: "bg-orange-400",
    }
  return {
    level: "Micro",
    description: "Not felt",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
  }
}

export default function EarthquakeMarker({ earthquake, clustered = false }) {
  const { mag, place, time, url, title } = earthquake.properties
  const [lng, lat, depth] = earthquake.geometry.coordinates
  const intensityInfo = getIntensityInfo(mag)
  const map = useMap()

  const formatDepth = (depth) =>
    depth == null ? "Unknown" : `${Math.abs(depth).toFixed(1)} km`

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const eventTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - eventTime) / (1000 * 60))
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const formatLocationShort = (location) => {
    if (!location) return "Unknown location"
    // Trim long location names and keep essential info
    return location.length > 35 ? location.substring(0, 32) + "..." : location
  }

  // Determine popup direction based on marker position on screen
  const getPopupDirection = () => {
    if (!map) return "top"

    const bounds = map.getBounds()
    const center = map.getCenter()

    // If marker is in the top third of visible area, show popup below
    if (lat > center.lat + (bounds.getNorth() - center.lat) * 0.3) {
      return "bottom"
    }

    // Default: show popup above
    return "top"
  }

  const popupDirection = getPopupDirection()

  return (
    <>
      {/* Optional circle for high magnitude earthquakes */}
      {mag >= 5 && (
        <Circle
          center={[lat, lng]}
          radius={mag * 50000}
          pathOptions={{
            fillColor: mag >= 6 ? "#ef4444" : mag >= 5 ? "#f97316" : "#10b981",
            fillOpacity: 0.1,
            color: mag >= 6 ? "#dc2626" : mag >= 5 ? "#ea580c" : "#059669",
            weight: 2,
            opacity: 0.6,
          }}
        />
      )}

      <Marker
        position={[lat, lng]}
        icon={getMarkerIcon(mag, clustered, popupDirection)}>
        <Popup
          className='custom-earthquake-popup'
          maxWidth={240}
          closeButton={true}
          autoPan={true}
          keepInView={true}
          autoPanPadding={[20, 20]}
          offset={[0, 0]}>
          <div className='bg-white rounded-lg shadow-lg border-0 overflow-hidden z-1000'>
            {/* Compact Header */}
            <div className={`${intensityInfo.bgColor} text-white p-2`}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Zap className='w-4 h-4' />
                  <div>
                    <span className='text-lg font-bold'>
                      M {mag.toFixed(1)}
                    </span>
                    <div className='text-xs opacity-90'>
                      {intensityInfo.level}
                    </div>
                  </div>
                </div>
                <div className='text-right text-xs'>
                  <div className='font-medium'>{getTimeAgo(time)}</div>
                  <div className='opacity-80'>
                    {formatDate(time).split(",")[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Content */}
            <div className='p-2 space-y-2'>
              {/* Location - icon + text */}
              <div className='flex items-start gap-2'>
                <MapPin className='w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0' />
                <div className='text-xs'>
                  <div className='font-medium text-slate-800 leading-tight'>
                    {formatLocationShort(place || title)}
                  </div>
                  <div className='text-slate-500'>
                    {lat.toFixed(2)}°, {lng.toFixed(2)}°
                  </div>
                </div>
              </div>

              {/* Quick stats - horizontal layout */}
              <div className='flex gap-3 text-xs'>
                <div className='flex items-center gap-1'>
                  <Mountain className='w-3 h-3 text-slate-500' />
                  <span className='text-slate-600'>{formatDepth(depth)}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='w-3 h-3 text-slate-500' />
                  <span className='text-slate-600'>
                    {formatDate(time).split(",")[1]}
                  </span>
                </div>
              </div>

              {/* Compact timestamp */}
              <div className='bg-slate-50 rounded p-2'>
                <div className='flex items-center gap-1 mb-1'>
                  <Calendar className='w-3 h-3 text-slate-500' />
                  <span className='text-xs text-slate-500 font-medium'>
                    Full Date
                  </span>
                </div>
                <div className='text-xs text-slate-700'>{formatDate(time)}</div>
              </div>

              {/* Compact action button */}
              {url && (
                <a
                  href={url}
                  target='_blank'
                  rel='noreferrer'
                  className='w-full flex items-center justify-center gap-2 px-3 py-2 
                           bg-blue-600 rounded 
                           hover:bg-blue-700 transition-colors text-xs'>
                  <ExternalLink className='w-3 h-3 text-white' />
                  <text className='text-white font-medium '>USGS Details</text>
                </a>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  )
}
