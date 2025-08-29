import { useEffect } from "react"
import { useMap } from "react-leaflet"
import "leaflet.heat"

export default function HeatmapLayer({ earthquakes }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const heatData = earthquakes.map((eq) => [
      eq.geometry.coordinates[1], // lat
      eq.geometry.coordinates[0], // lng
      eq.properties.mag / 10, // intensity weight
    ])

    const heat = window.L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "orange",
        0.8: "red",
      },
    }).addTo(map)

    return () => {
      map.removeLayer(heat)
    }
  }, [earthquakes, map])

  return null
}
