import MarkerClusterGroup from "react-leaflet-markercluster"
import EarthquakeMarker from "../EarthquakeMarker"

export default function ClusterLayer({ earthquakes }) {
  return (
    <MarkerClusterGroup chunkedLoading>
      {earthquakes.map((eq) => (
        <EarthquakeMarker
          key={eq.id}
          earthquake={eq}
          clustered
        />
      ))}
    </MarkerClusterGroup>
  )
}
