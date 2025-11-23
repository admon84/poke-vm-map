import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps'

interface MapProps {
  apiKey: string
}

export function Map({ apiKey }: MapProps) {
  // Center on the United States
  const defaultCenter = { lat: 39.8283, lng: -98.5795 }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMap
          defaultCenter={defaultCenter}
          defaultZoom={5}
          gestureHandling='greedy'
        />
      </div>
    </APIProvider>
  )
}
