import { Map } from './components/Map'
import { Navbar } from './components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useState } from 'react'

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 })
  const [mapZoom, setMapZoom] = useState(5)

  if (!apiKey) {
    return <div>Error: Google Maps API key not found</div>
  }

  const handleLocateUser = async () => {
    if ('geolocation' in navigator) {
      toast.loading('Finding your location...')

      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setMapCenter(userLocation)
          setMapZoom(13) // Zoom in when finding user location
          toast.success('Location found!', {
            description: 'Map centered on your location'
          })
        },
        async error => {
          console.error('Error getting location:', error)

          // Try IP-based geolocation as fallback
          if (error.code === 2) {
            // POSITION_UNAVAILABLE
            try {
              console.log('Trying IP-based geolocation fallback...')
              const response = await fetch('https://ipapi.co/json/')
              const data = await response.json()

              if (data.latitude && data.longitude) {
                const userLocation = {
                  lat: data.latitude,
                  lng: data.longitude
                }
                setMapCenter(userLocation)
                setMapZoom(12)
                toast.success(`Located in ${data.city}, ${data.region}`, {
                  description: 'Using IP-based location (approximate)'
                })
                return
              }
            } catch (fallbackError) {
              console.error('IP geolocation fallback failed:', fallbackError)
            }
          }

          // Show error message if both methods failed
          let errorMessage = ''

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage =
                'Please allow location access in your browser settings.'
              break
            case 2: // POSITION_UNAVAILABLE
              errorMessage =
                'Location unavailable. Check Location Services in System Settings.'
              break
            case 3: // TIMEOUT
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

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navbar onLocateUser={handleLocateUser} />
      <Map apiKey={apiKey} center={mapCenter} zoom={mapZoom} />
      <Toaster />
    </div>
  )
}

export default App
