import { useState, useEffect, useCallback } from 'react'

interface Location {
  lat: number
  lng: number
}

export function useReverseGeocode(
  location: Location | null,
  apiKey: string,
  debounceMs: number = 1000
) {
  const [locationName, setLocationName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchLocationName = useCallback(
    async (loc: Location) => {
      if (!loc || !apiKey) return

      setLoading(true)
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${apiKey}&result_type=locality|administrative_area_level_3|administrative_area_level_2`
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          // Try to extract city/town name from address components
          const result = data.results[0]
          const addressComponents = result.address_components

          // Look for locality (city/town) first
          const locality = addressComponents.find((component: any) =>
            component.types.includes('locality')
          )

          if (locality) {
            // Also get the state for context
            const adminArea = addressComponents.find((component: any) =>
              component.types.includes('administrative_area_level_1')
            )

            if (adminArea) {
              setLocationName(`${locality.short_name}, ${adminArea.short_name}`)
            } else {
              setLocationName(locality.short_name)
            }
          } else {
            // Fallback to administrative area
            const adminArea2 = addressComponents.find((component: any) =>
              component.types.includes('administrative_area_level_2')
            )
            const adminArea1 = addressComponents.find((component: any) =>
              component.types.includes('administrative_area_level_1')
            )

            if (adminArea2 && adminArea1) {
              setLocationName(
                `${adminArea2.short_name}, ${adminArea1.short_name}`
              )
            } else if (adminArea1) {
              setLocationName(adminArea1.short_name)
            } else {
              setLocationName(null)
            }
          }
        } else {
          setLocationName(null)
        }
      } catch (error) {
        console.error('Error fetching location name:', error)
        setLocationName(null)
      } finally {
        setLoading(false)
      }
    },
    [apiKey]
  )

  useEffect(() => {
    if (!location) {
      setLocationName(null)
      return
    }

    // Debounce the geocoding request
    const timeoutId = setTimeout(() => {
      fetchLocationName(location)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [location, fetchLocationName, debounceMs])

  return { locationName, loading }
}
