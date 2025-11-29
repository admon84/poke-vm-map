import { Map } from './components/Map'
import { Navbar } from './components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useState } from 'react'
import { useGeoJSONPins } from './hooks/useGeoJSONPins'
import { useAuth } from './hooks/useAuth'

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 })
  const [mapZoom, setMapZoom] = useState(5)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // Use GeoJSON data for Pokemon vending machines
  const { pins, loading: pinsLoading, error: pinsError } = useGeoJSONPins()
  const { user, loading: authLoading } = useAuth()

  if (!apiKey) {
    return <div>Error: Google Maps API key not found</div>
  }

  const handleLocateUser = async () => {
    if ('geolocation' in navigator) {
      const loadingToast = toast.loading('Finding your location...')

      navigator.geolocation.getCurrentPosition(
        position => {
          toast.dismiss(loadingToast)
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(userLocation)
          setMapCenter(userLocation)
          setMapZoom(13)
          toast.success('Location found!', {
            description: 'Map centered on your location'
          })
        },
        async error => {
          console.error('Error getting location:', error)

          // Try IP-based geolocation as fallback
          if (error.code === 2) {
            try {
              console.log('Trying IP-based geolocation fallback...')
              toast.dismiss(loadingToast)
              const ipLoadingToast = toast.loading(
                'Trying IP-based location...'
              )

              const response = await fetch('https://ipapi.co/json/')
              const data = await response.json()

              if (data.latitude && data.longitude) {
                toast.dismiss(ipLoadingToast)
                const ipLocation = {
                  lat: data.latitude,
                  lng: data.longitude
                }
                setUserLocation(ipLocation)
                setMapCenter(ipLocation)
                setMapZoom(12)
                toast.success(`Located in ${data.city}, ${data.region}`, {
                  description: 'Using IP-based location (approximate)'
                })
                return
              }
              toast.dismiss(ipLoadingToast)
            } catch (fallbackError) {
              console.error('IP geolocation fallback failed:', fallbackError)
            }
          }

          toast.dismiss(loadingToast)
          let errorMessage = ''

          switch (error.code) {
            case 1:
              errorMessage =
                'Please allow location access in your browser settings.'
              break
            case 2:
              errorMessage =
                'Location unavailable. Check Location Services in System Settings.'
              break
            case 3:
              errorMessage = 'Location request timed out. Please try again.'
              break
            default:
              errorMessage = 'An unknown error occurred.'
          }

          toast.error('Unable to get your location', {
            description: errorMessage
          })
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      toast.error('Geolocation not supported', {
        description: 'Your browser does not support geolocation'
      })
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  // Show error if GeoJSON failed to load
  if (pinsError) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <div className='text-xl text-red-600'>
          Failed to load vending machine data
        </div>
        <div className='text-sm text-gray-600'>{pinsError.message}</div>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navbar onLocateUser={handleLocateUser} user={user} />

      {pinsLoading && (
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-[1001] bg-white px-4 py-2 rounded-lg shadow-lg'>
          <div className='flex items-center gap-2'>
            <div className='animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full' />
            <span className='text-sm font-medium'>
              Loading {pins.length > 0 ? `${pins.length}` : ''} Pokemon vending
              machines...
            </span>
          </div>
        </div>
      )}

      <Map
        apiKey={apiKey}
        center={mapCenter}
        zoom={mapZoom}
        pins={pins}
        pinsLoading={pinsLoading}
        userLocation={userLocation}
      />
      <Toaster position='bottom-center' />
    </div>
  )
}

export default App
