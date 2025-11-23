import { useState, useEffect } from 'react'
import { PointOfInterest } from '../types/poi'

/**
 * Custom hook for managing POI data
 * Can be extended to fetch from an API
 */
export function usePOIs(initialPOIs: PointOfInterest[]) {
  const [pois, setPois] = useState<PointOfInterest[]>(initialPOIs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Example: Fetch POIs from an API
  // Uncomment and modify when you have an API endpoint
  /*
  useEffect(() => {
    setLoading(true)
    fetch('/api/pois')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch POIs')
        return res.json()
      })
      .then(data => {
        setPois(data)
        setError(null)
      })
      .catch(err => {
        setError(err)
        console.error('Error fetching POIs:', err)
      })
      .finally(() => setLoading(false))
  }, [])
  */

  return { pois, loading, error, setPois }
}

/**
 * Custom hook for managing map state
 */
export function useMapState() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 })
  const [zoom, setZoom] = useState(12)

  const selectMarker = (id: string) => setSelectedMarkerId(id)
  const deselectMarker = () => setSelectedMarkerId(null)

  return {
    selectedMarkerId,
    center,
    zoom,
    selectMarker,
    deselectMarker,
    setCenter,
    setZoom
  }
}

/**
 * Custom hook for filtering POIs
 */
export function useFilteredPOIs(
  pois: PointOfInterest[],
  searchTerm?: string,
  categoryFilter?: PointOfInterest['category']
) {
  const [filteredPOIs, setFilteredPOIs] = useState(pois)

  useEffect(() => {
    let result = pois

    // Filter by category
    if (categoryFilter) {
      result = result.filter((poi) => poi.category === categoryFilter)
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (poi) =>
          poi.name.toLowerCase().includes(term) ||
          poi.description?.toLowerCase().includes(term)
      )
    }

    setFilteredPOIs(result)
  }, [pois, searchTerm, categoryFilter])

  return filteredPOIs
}

