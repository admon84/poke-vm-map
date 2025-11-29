import {
  APIProvider,
  ColorScheme,
  Map as GoogleMap,
  useMap
} from '@vis.gl/react-google-maps'
import { useEffect, useState, useCallback } from 'react'
import { POIMarker } from './POIMarker'
import { UserLocationMarker } from './UserLocationMarker'
import { VendingMachinePin } from '../types/poi'
import { useViewportPins } from '../hooks/useViewportPins'

interface MapProps {
  apiKey: string
  center: { lat: number; lng: number }
  zoom: number
  pins: VendingMachinePin[]
  pinsLoading: boolean
  userLocation: { lat: number; lng: number } | null
}

interface Bounds {
  north: number
  south: number
  east: number
  west: number
}

function MapController({
  center,
  zoom,
  onBoundsChanged,
  onZoomChanged
}: {
  center: { lat: number; lng: number }
  zoom: number
  onBoundsChanged: (bounds: Bounds | null) => void
  onZoomChanged: (zoom: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (map) {
      map.panTo(center)
      map.setZoom(zoom)
    }
  }, [map, center, zoom])

  useEffect(() => {
    if (!map) return

    const boundsListener = map.addListener('bounds_changed', () => {
      const bounds = map.getBounds()
      if (bounds) {
        onBoundsChanged({
          north: bounds.getNorthEast().lat(),
          south: bounds.getSouthWest().lat(),
          east: bounds.getNorthEast().lng(),
          west: bounds.getSouthWest().lng()
        })
      }
    })

    const zoomListener = map.addListener('zoom_changed', () => {
      const currentZoom = map.getZoom()
      if (currentZoom) {
        onZoomChanged(currentZoom)
      }
    })

    return () => {
      google.maps.event.removeListener(boundsListener)
      google.maps.event.removeListener(zoomListener)
    }
  }, [map, onBoundsChanged, onZoomChanged])

  return null
}

export function Map({
  apiKey,
  center,
  zoom,
  pins,
  pinsLoading,
  userLocation
}: MapProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)

  // Use viewport filtering for better performance
  const visiblePins = useViewportPins(pins, bounds, currentZoom)

  const handleBoundsChanged = useCallback((newBounds: Bounds | null) => {
    setBounds(newBounds)
  }, [])

  const handleZoomChanged = useCallback((newZoom: number) => {
    setCurrentZoom(newZoom)
  }, [])

  return (
    <APIProvider apiKey={apiKey}>
      <div
        style={{ height: '100%', width: '100%', flex: 1, position: 'relative' }}
      >
        <GoogleMap
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling='greedy'
          mapId='e28565e73aadc71c448f1ec2'
          colorScheme={ColorScheme.DARK}
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
        >
          <MapController
            center={center}
            zoom={zoom}
            onBoundsChanged={handleBoundsChanged}
            onZoomChanged={handleZoomChanged}
          />

          {/* User location marker */}
          {userLocation && <UserLocationMarker position={userLocation} />}

          {!pinsLoading &&
            visiblePins.map(pin => (
              <POIMarker
                key={pin.id}
                pin={pin}
                isSelected={selectedMarkerId === pin.id}
                onSelect={() => setSelectedMarkerId(pin.id)}
                onClose={() => setSelectedMarkerId(null)}
              />
            ))}
        </GoogleMap>

        {/* Pin counter */}
        {!pinsLoading && pins.length > 0 && (
          <div className='absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]'>
            <div className='text-sm font-medium text-gray-700'>
              🗺️ Showing {visiblePins.length.toLocaleString()} of{' '}
              {pins.length.toLocaleString()} locations
            </div>
            <div className='text-xs text-gray-500 mt-1'>
              Zoom: {Math.round(currentZoom)}x
            </div>
          </div>
        )}
      </div>
    </APIProvider>
  )
}
