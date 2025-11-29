import { useEffect, useState } from 'react'
import { VendingMachinePin } from '../types/poi'
import { Timestamp } from 'firebase/firestore'

interface GeoJSONFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    Retailer: string
    Address: string
  }
}

interface GeoJSONData {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export function useGeoJSONPins() {
  const [pins, setPins] = useState<VendingMachinePin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        // Fetch from local public folder for best performance
        const response = await fetch('/data/pokemon-vms.geojson')

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }

        const data: GeoJSONData = await response.json()

        const convertedPins: VendingMachinePin[] = data.features.map(
          (feature, index) => {
            const [lng, lat] = feature.geometry.coordinates
            const { Retailer, Address } = feature.properties

            return {
              id: `vm-${index}`,
              name: `Pokemon Vending Machine`,
              location: {
                lat: lat,
                lng: lng
              },
              address: Address,
              // description: '',
              createdBy: 'system',
              createdAt: Timestamp.now(),
              lastUpdated: Timestamp.now(),
              verified: true,
              retailer: Retailer
            }
          }
        )

        setPins(convertedPins)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch GeoJSON:', err)
        setError(err as Error)
        setLoading(false)
      }
    }

    fetchGeoJSON()
  }, [])

  return { pins, loading, error }
}
