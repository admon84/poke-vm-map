import { Navigation } from 'lucide-react'

interface Pin {
  id: string
  location: { lat: number; lng: number }
  address?: string
  retailer?: string
}

interface NearestLocationsProps {
  userLocation: { lat: number; lng: number }
  pins: Pin[]
  onPinSelect: (pinId: string) => void
  maxResults?: number
  maxDistance?: number
}

export function NearestLocations({
  userLocation,
  pins,
  onPinSelect,
  maxResults = 25,
  maxDistance = 50
}: NearestLocationsProps) {
  // Calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const pinsWithDistance = pins
    .map(pin => {
      const distanceKm = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        pin.location.lat,
        pin.location.lng
      )
      const miles = distanceKm * 0.621371

      return {
        pin,
        distance: miles < 1 ? distanceKm : miles,
        unit: (miles < 1 ? 'km' : 'mi') as 'mi' | 'km',
        distanceMiles: miles
      }
    })
    .filter(item => item.distanceMiles <= maxDistance)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, maxResults)

  if (pinsWithDistance.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-slate-400'>
        <Navigation className='h-12 w-12 mb-4' strokeWidth={1.5} />
        <p className='text-sm'>No locations found nearby</p>
        <p className='text-xs mt-1'>No locations within {maxDistance} miles</p>
      </div>
    )
  }

  return (
    <div className='p-4 space-y-2'>
      {pinsWithDistance.map((item, index) => (
        <button
          key={item.pin.id}
          onClick={() => onPinSelect(item.pin.id)}
          className='w-full text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors group'
        >
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded'>
                  #{index + 1}
                </span>
                <h3 className='text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate'>
                  {item.pin.retailer || 'Location'}
                </h3>
              </div>
              {item.pin.address && (
                <p className='text-xs text-slate-400 truncate mt-1'>
                  {item.pin.address}
                </p>
              )}
            </div>
            <div className='flex flex-col items-end gap-1'>
              <span className='text-sm font-bold text-emerald-400 whitespace-nowrap'>
                {item.distance.toFixed(1)} {item.unit}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
