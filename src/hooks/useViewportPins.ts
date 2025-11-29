import { useState, useEffect } from 'react'
import { VendingMachinePin } from '../types/poi'

interface Bounds {
  north: number
  south: number
  east: number
  west: number
}

/**
 * Filters pins to only show those within the current map viewport
 * This dramatically improves performance by only rendering visible markers
 */
export function useViewportPins(
  allPins: VendingMachinePin[],
  bounds: Bounds | null,
  zoom: number
) {
  const [visiblePins, setVisiblePins] = useState<VendingMachinePin[]>([])

  useEffect(() => {
    if (!bounds || allPins.length === 0) {
      // At low zoom levels, show a subset
      if (zoom < 6) {
        // Show every 10th pin when zoomed out
        setVisiblePins(allPins.filter((_, index) => index % 10 === 0))
      } else if (zoom < 8) {
        // Show every 3rd pin at medium zoom
        setVisiblePins(allPins.filter((_, index) => index % 3 === 0))
      } else {
        setVisiblePins(allPins)
      }
      return
    }

    // Filter pins within viewport bounds
    const filtered = allPins.filter(pin => {
      const { lat, lng } = pin.location
      return (
        lat >= bounds.south &&
        lat <= bounds.north &&
        lng >= bounds.west &&
        lng <= bounds.east
      )
    })

    // Limit total markers even within viewport for performance
    const maxMarkers = zoom < 10 ? 100 : zoom < 12 ? 200 : 500
    setVisiblePins(filtered.slice(0, maxMarkers))
  }, [allPins, bounds, zoom])

  return visiblePins
}

