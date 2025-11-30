import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { User } from 'firebase/auth'
import { AuthDialog } from './AuthDialog'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Crosshair,
  User as UserIcon,
  LogOut,
  MapPinned,
  ZoomIn,
  Focus,
  Navigation
} from 'lucide-react'

interface NavbarProps {
  onLocateUser: () => void
  user: User | null
  mapColorScheme: 'LIGHT' | 'DARK' | 'FOLLOW_SYSTEM'
  onMapColorSchemeChange: (scheme: 'LIGHT' | 'DARK' | 'FOLLOW_SYSTEM') => void
  totalPins?: number
  visiblePins?: number
  currentZoom?: number
  mapCenter?: { lat: number; lng: number }
  userLocation?: { lat: number; lng: number } | null
  pins?: Array<{
    id: string
    location: { lat: number; lng: number }
    address?: string
    retailer?: string
  }>
  onPinSelect?: (pinId: string) => void
  // locationName?: string | null
}

export function Navbar({
  onLocateUser,
  user,
  mapColorScheme,
  onMapColorSchemeChange,
  totalPins = 0,
  visiblePins = 0,
  currentZoom = 5,
  mapCenter,
  userLocation,
  pins = [],
  onPinSelect
}: // locationName
NavbarProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { signOut } = useAuth()

  // Haversine formula to calculate distance between two points in km
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371 // Radius of the Earth in km
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

  // Get top 10 closest locations to user
  const getClosestLocations = (): Array<{
    pin: (typeof pins)[0]
    distance: number
    unit: 'mi' | 'km'
  }> => {
    if (!userLocation || pins.length === 0) return []

    const pinsWithDistance = pins.map(pin => {
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

    // Sort by distance and take top 10
    return pinsWithDistance
      .sort((a, b) => a.distanceMiles - b.distanceMiles)
      .slice(0, 10)
      .map(({ pin, distance, unit }) => ({ pin, distance, unit }))
  }

  const closestLocations = getClosestLocations()

  const handlePinClick = (pinId: string) => {
    if (onPinSelect) {
      onPinSelect(pinId)
      toast.success('Location selected', {
        description: 'Map centered on selected location'
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const handleCopyCoordinates = () => {
    if (mapCenter) {
      const coordsText = `${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(
        6
      )}`
      navigator.clipboard.writeText(coordsText)
      toast.success('Coordinates copied!', {
        description: coordsText
      })
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <nav className='bg-slate-900 text-white shadow-md z-[1000]'>
          <div className='flex justify-between items-center max-w-full px-6 py-3'>
            <div className='flex items-center gap-6'>
              <h1 className='m-0 text-2xl font-semibold text-white'>PokeMap</h1>

              {/* Separator */}
              {totalPins > 0 && <div className='h-8 w-px bg-slate-600' />}

              {/* Stats display */}
              {totalPins > 0 && (
                <div className='flex items-center gap-4 text-sm'>
                  {/* Map Center Coordinates */}
                  {mapCenter && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className='flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors'
                          onClick={handleCopyCoordinates}
                        >
                          <Focus
                            className='h-4 w-4 flex-shrink-0'
                            strokeWidth={2}
                          />
                          <span className='font-mono text-xs'>
                            <span className='font-semibold text-white'>
                              {mapCenter.lat.toFixed(4)}°,{' '}
                              {mapCenter.lng.toFixed(4)}°
                            </span>
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='font-medium mb-1'>Map Center</p>
                        <p className='text-xs text-slate-300'>
                          Lat: {mapCenter.lat.toFixed(6)}°{' '}
                          {mapCenter.lat >= 0 ? 'N' : 'S'}
                        </p>
                        <p className='text-xs text-slate-300'>
                          Lng: {mapCenter.lng.toFixed(6)}°{' '}
                          {mapCenter.lng >= 0 ? 'E' : 'W'}
                        </p>
                        <p className='text-xs text-slate-400 mt-1.5'>
                          Click to copy coordinates
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <div className='h-4 w-px bg-slate-600' />

                  {/* Zoom Level */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center gap-2 text-slate-300 cursor-default hover:text-white transition-colors'>
                        <ZoomIn
                          className='h-4 w-4 flex-shrink-0'
                          strokeWidth={2}
                        />
                        <span>
                          <span className='font-semibold text-white'>
                            {Math.round(currentZoom)}x
                          </span>
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='font-medium mb-1'>Map Zoom Level</p>
                      <p className='text-xs text-slate-300'>
                        {currentZoom < 5
                          ? 'Continent view'
                          : currentZoom < 10
                          ? 'State/Region view'
                          : currentZoom < 15
                          ? 'City view'
                          : 'Street view'}
                      </p>
                      <p className='text-xs text-slate-400 mt-1.5'>
                        Scale: 1-20 • Current: {currentZoom.toFixed(1)}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <div className='h-4 w-px bg-slate-600' />

                  {/* Visible Pin Count */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center gap-2 text-slate-300 cursor-default hover:text-white transition-colors'>
                        <MapPinned
                          className='h-4 w-4 flex-shrink-0'
                          strokeWidth={2}
                        />
                        <span>
                          <span className='font-semibold text-white'>
                            {visiblePins.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='font-medium mb-1'>Visible Locations</p>
                      <p className='text-xs text-slate-300'>
                        {visiblePins === totalPins
                          ? 'All locations visible on map'
                          : `${visiblePins.toLocaleString()} of ${totalPins.toLocaleString()} in current view`}
                      </p>
                      {visiblePins < totalPins && (
                        <p className='text-xs text-slate-400 mt-1.5'>
                          Zoom out or pan to see more
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>

                  {/* Nearest Locations - Only shows if user location available */}
                  {closestLocations.length > 0 && (
                    <>
                      <div className='h-4 w-px bg-slate-600' />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='flex items-center gap-2 text-slate-300 cursor-default hover:text-white transition-colors'>
                            <Navigation
                              className='h-4 w-4 flex-shrink-0'
                              strokeWidth={2}
                            />
                            <span>
                              <span className='font-semibold text-white'>
                                Nearest
                              </span>
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className='min-w-[300px] max-w-[320px]'>
                          <p className='font-medium mb-2'>
                            Closest Locations to You
                          </p>

                          <div className='space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar'>
                            {closestLocations.map((poi, index) => (
                              <button
                                key={poi.pin.id}
                                onClick={() => handlePinClick(poi.pin.id)}
                                className='w-full text-left px-2 py-2 rounded hover:bg-slate-700 transition-colors group'
                              >
                                <div className='flex items-start justify-between gap-3'>
                                  <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 mb-0.5'>
                                      <span className='text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded'>
                                        #{index + 1}
                                      </span>
                                      <p className='text-xs font-medium text-slate-200 group-hover:text-white truncate flex-1'>
                                        {poi.pin.retailer || 'Location'}
                                      </p>
                                    </div>
                                    {poi.pin.address && (
                                      <p className='text-[10px] text-slate-400 truncate mt-1 pl-0.5'>
                                        {poi.pin.address}
                                      </p>
                                    )}
                                  </div>
                                  <div className='flex flex-col items-end gap-1'>
                                    <span className='text-xs font-bold text-emerald-400 whitespace-nowrap'>
                                      {poi.distance.toFixed(1)} {poi.unit}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>

                          <div className='mt-3 pt-2 border-t border-slate-700'>
                            <p className='text-xs text-slate-400'>
                              Click any location to view on map
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}

                  {/* Location name if available */}
                  {/* {locationName && (
                  <>
                    <div className='h-4 w-px bg-slate-600' />
                    <div className='flex items-center gap-2 text-slate-300 max-w-[200px]'>
                      <span className='truncate font-medium text-white'>
                        {locationName}
                      </span>
                    </div>
                  </>
                )} */}
                </div>
              )}
            </div>

            <div className='flex gap-3 items-center'>
              <Button
                variant='default'
                onClick={onLocateUser}
                className='flex items-center gap-2'
              >
                <Crosshair className='h-4 w-4' strokeWidth={2} />
                Find My Location
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='secondary'>
                      <UserIcon className='h-4 w-4' strokeWidth={2} />
                      <span className='text-sm'>
                        {user.displayName || 'Guest'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                      {user.email || 'Anonymous'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className='h-4 w-4' strokeWidth={2} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant='secondary'
                  onClick={() => setShowAuthDialog(true)}
                >
                  Sign In
                </Button>
              )}

              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary' size='icon'>
                    <Settings className='h-4 w-4' strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Map Theme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={mapColorScheme}
                    onValueChange={value =>
                      onMapColorSchemeChange(
                        value as 'LIGHT' | 'DARK' | 'FOLLOW_SYSTEM'
                      )
                    }
                  >
                    <DropdownMenuRadioItem value='LIGHT'>
                      <Sun className='h-4 w-4 mr-2' strokeWidth={2} />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='DARK'>
                      <Moon className='h-4 w-4 mr-2' strokeWidth={2} />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='FOLLOW_SYSTEM'>
                      <Monitor className='h-4 w-4 mr-2' strokeWidth={2} />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </TooltipProvider>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  )
}
