import EarthquakeMarker from "../EarthquakeMarker"

export default function EarthquakeLayer({ earthquakes }) {
  return (
    <>
      {earthquakes.map((eq) => (
        <EarthquakeMarker
          key={eq.id}
          earthquake={eq}
        />
      ))}
    </>
  )
}
