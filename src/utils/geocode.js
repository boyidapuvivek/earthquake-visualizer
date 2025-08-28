export async function geocodeCountry(country) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?country=${country}&format=json&limit=1`
    )
    const data = await res.json()
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
    return null
  } catch (err) {
    console.error("Geocoding error:", err)
    return null
  }
}
