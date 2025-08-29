import { Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import { formatDate } from "../utils/formatData"
import {
  MapPin, // for location
  Clock, // for time
  Calendar, // for full date
  ExternalLink, // for USGS details
} from "lucide-react"

const getMarkerIcon = (magnitude, clustered = false) => {
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
    popupAnchor: [0, -size / 2],
  })
}

const getIntensityInfo = (magnitude) => {
  if (magnitude >= 6)
    return {
      level: "Major",
      description: "Significant damage possible",
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
    }
  if (magnitude >= 5)
    return {
      level: "Moderate",
      description: "Noticeable shaking, minor damage",
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200",
    }
  if (magnitude >= 4)
    return {
      level: "Light",
      description: "Often felt, rarely causes damage",
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-200",
    }
  if (magnitude >= 3)
    return {
      level: "Minor",
      description: "Weak shaking, felt by few people",
      color: "text-orange-400",
      bgColor: "bg-orange-50 border-orange-200",
    }
  return {
    level: "Micro",
    description: "Generally not felt",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 border-emerald-200",
  }
}

export default function EarthquakeMarker({ earthquake, clustered = false }) {
  const { mag, place, time, url, title } = earthquake.properties
  const [lng, lat, depth] = earthquake.geometry.coordinates
  const intensityInfo = getIntensityInfo(mag)

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
        icon={getMarkerIcon(mag, clustered)}>
        <Popup
          className='custom-earthquake-popup'
          maxWidth={350}
          closeButton={true}
          autoPan={true}>
          <div className='bg-white rounded-2xl shadow-2xl border-0 overflow-hidden min-w-80'>
            {/* Header */}
            <div
              className={`${intensityInfo.bgColor} border-2 p-4 relative overflow-hidden`}>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-4 h-4 rounded-full ${
                        mag >= 6
                          ? "bg-red-600"
                          : mag >= 5
                          ? "bg-red-500"
                          : mag >= 4
                          ? "bg-orange-500"
                          : mag >= 3
                          ? "bg-orange-400"
                          : "bg-emerald-400"
                      } shadow-lg animate-pulse`}></div>
                    <div>
                      <span
                        className={`text-2xl font-bold ${intensityInfo.color}`}>
                        M {mag.toFixed(1)}
                      </span>
                      <div
                        className={`text-sm font-semibold ${intensityInfo.color} opacity-80`}>
                        {intensityInfo.level}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xs text-slate-600 font-medium'>
                      {getTimeAgo(time)}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {formatDate(time).split(",")[0]}
                    </div>
                  </div>
                </div>
                <p
                  className={`text-sm ${intensityInfo.color} opacity-80 font-medium`}>
                  {intensityInfo.description}
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className='p-4 space-y-4'>
              {/* Location */}
              <div className='space-y-2'>
                <div className='flex items-start gap-3'>
                  <div className='w-5 h-5 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <MapPin className='w-3 h-3 text-slate-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-slate-800 font-semibold text-sm leading-relaxed'>
                      {place || title || "Location not specified"}
                    </p>
                    <p className='text-slate-500 text-xs'>
                      {lat.toFixed(4)}°, {lng.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-slate-50 rounded-xl p-3 text-center border border-slate-100'>
                  <div className='text-slate-500 text-xs font-medium uppercase tracking-wide mb-1'>
                    Depth
                  </div>
                  <div className='text-slate-800 font-bold text-sm'>
                    {formatDepth(depth)}
                  </div>
                </div>
                <div className='bg-slate-50 rounded-xl p-3 text-center border border-slate-100'>
                  <div className='text-slate-500 text-xs font-medium uppercase tracking-wide mb-1'>
                    Time
                  </div>
                  <div className='text-slate-800 font-bold text-sm'>
                    {formatDate(time).split(",")[1]}
                  </div>
                </div>
              </div>

              {/* Full timestamp */}
              <div className='bg-slate-50 rounded-xl p-3 border border-slate-100'>
                <div className='flex items-center gap-2 mb-1'>
                  <Clock className='w-3 h-3 text-slate-500' />
                  <span className='text-slate-500 text-xs font-medium uppercase tracking-wide'>
                    Full Date
                  </span>
                </div>
                <p className='text-slate-700 text-sm font-medium'>
                  {formatDate(time)}
                </p>
              </div>

              {/* Action button */}
              {url && (
                <a
                  href={url}
                  target='_blank'
                  rel='noreferrer'
                  className='w-full inline-flex items-center justify-center gap-3 px-4 py-3 
                           bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl 
                           hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 
                           shadow-lg hover:shadow-xl hover:scale-105 text-sm'>
                  <ExternalLink className='w-4 h-4' />
                  View USGS Details
                </a>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  )
}
