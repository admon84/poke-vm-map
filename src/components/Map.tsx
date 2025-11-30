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
  colorScheme: ColorScheme
  onZoomChange?: (zoom: number) => void
  onVisiblePinsChange?: (visibleCount: number) => void
  onCenterChange?: (center: { lat: number; lng: number }) => void
  onOpenDetails?: (pinId: string) => void
  selectedPinId?: string | null
  onPinSelectionChange?: (pinId: string | null) => void
  locationPulseTrigger?: number
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
  onZoomChanged,
  onCenterChanged
}: {
  center: { lat: number; lng: number }
  zoom: number
  onBoundsChanged: (bounds: Bounds | null) => void
  onZoomChanged: (zoom: number) => void
  onCenterChanged: (center: { lat: number; lng: number }) => void
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

    const centerListener = map.addListener('center_changed', () => {
      const mapCenter = map.getCenter()
      if (mapCenter) {
        onCenterChanged({
          lat: mapCenter.lat(),
          lng: mapCenter.lng()
        })
      }
    })

    return () => {
      google.maps.event.removeListener(boundsListener)
      google.maps.event.removeListener(zoomListener)
      google.maps.event.removeListener(centerListener)
    }
  }, [map, onBoundsChanged, onZoomChanged, onCenterChanged])

  return null
}

export function Map({
  apiKey,
  center,
  zoom,
  pins,
  pinsLoading,
  userLocation,
  colorScheme,
  onZoomChange,
  onVisiblePinsChange,
  onCenterChange,
  onOpenDetails,
  selectedPinId,
  onPinSelectionChange,
  locationPulseTrigger = 0
}: MapProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)

  // Use viewport filtering for better performance
  const visiblePins = useViewportPins(pins, bounds, currentZoom)

  // Sync external selectedPinId with internal state
  useEffect(() => {
    if (selectedPinId !== undefined && selectedPinId !== selectedMarkerId) {
      setSelectedMarkerId(selectedPinId)
    }
  }, [selectedPinId, selectedMarkerId])

  // Handle pin selection
  const handlePinSelect = useCallback(
    (pinId: string) => {
      setSelectedMarkerId(pinId)
      onPinSelectionChange?.(pinId)
    },
    [onPinSelectionChange]
  )

  // Handle pin close
  const handlePinClose = useCallback(() => {
    setSelectedMarkerId(null)
    onPinSelectionChange?.(null)
  }, [onPinSelectionChange])

  const handleBoundsChanged = useCallback((newBounds: Bounds | null) => {
    setBounds(newBounds)
  }, [])

  const handleZoomChanged = useCallback(
    (newZoom: number) => {
      setCurrentZoom(newZoom)
      onZoomChange?.(newZoom)
    },
    [onZoomChange]
  )

  const handleCenterChanged = useCallback(
    (newCenter: { lat: number; lng: number }) => {
      onCenterChange?.(newCenter)
    },
    [onCenterChange]
  )

  // Notify parent of visible pins count changes
  useEffect(() => {
    onVisiblePinsChange?.(visiblePins.length)
  }, [visiblePins.length, onVisiblePinsChange])

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
          colorScheme={colorScheme}
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
            onCenterChanged={handleCenterChanged}
          />

          {/* User location marker */}
          {userLocation && (
            <UserLocationMarker
              position={userLocation}
              pulseTrigger={locationPulseTrigger}
            />
          )}

          {!pinsLoading &&
            visiblePins.map(pin => (
              <POIMarker
                key={pin.id}
                pin={pin}
                isSelected={selectedMarkerId === pin.id}
                onSelect={() => handlePinSelect(pin.id)}
                onClose={handlePinClose}
                onOpenDetails={onOpenDetails}
              />
            ))}
        </GoogleMap>
      </div>
    </APIProvider>
  )
}
