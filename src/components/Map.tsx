import {
  APIProvider,
  Map as GoogleMap,
  useMap
} from '@vis.gl/react-google-maps'
import { useEffect } from 'react'

interface MapProps {
  apiKey: string
  center: { lat: number; lng: number }
  zoom: number
}

function MapController({
  center,
  zoom
}: {
  center: { lat: number; lng: number }
  zoom: number
}) {
  const map = useMap()

  useEffect(() => {
    if (map) {
      map.panTo(center)
      map.setZoom(zoom)
    }
  }, [map, center, zoom])

  return null
}

export function Map({ apiKey, center, zoom }: MapProps) {
  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '100%', width: '100%', flex: 1 }}>
        <GoogleMap
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling='greedy'
        >
          <MapController center={center} zoom={zoom} />
        </GoogleMap>
      </div>
    </APIProvider>
  )
}
