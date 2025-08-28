import { useEffect, useState } from "react"

const API_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

export default function useEarthquakeData() {
  const [earthquakes, setEarthquakes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        setEarthquakes(data.features || [])
      } catch (error) {
        console.error("Error fetching earthquake data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarthquakes()
  }, [])

  return { earthquakes, loading }
}
