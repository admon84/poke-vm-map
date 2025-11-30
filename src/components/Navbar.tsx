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
import { useState, lazy, Suspense } from 'react'
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

// Lazy load AuthDialog (only shown when user clicks sign in)
const AuthDialog = lazy(() =>
  import('./AuthDialog').then(m => ({ default: m.AuthDialog }))
)

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
  onOpenNearestPanel?: () => void
  maxNearestLocations?: number
  maxNearestDistance?: number
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
  // onPinSelect, // Available for future use
  onOpenNearestPanel,
  maxNearestLocations = 25,
  maxNearestDistance = 50
}: // locationName
NavbarProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showMobileStats, setShowMobileStats] = useState(false)
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

  // Get closest locations to user within max distance
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

    // Filter by max distance, sort by distance, and take up to max count
    return pinsWithDistance
      .filter(item => item.distanceMiles <= maxNearestDistance)
      .sort((a, b) => a.distanceMiles - b.distanceMiles)
      .slice(0, maxNearestLocations)
      .map(({ pin, distance, unit }) => ({ pin, distance, unit }))
  }

  const closestLocations = getClosestLocations()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully', { id: 'sign-out' })
    } catch (error) {
      toast.error('Failed to sign out', { id: 'sign-out-error' })
    }
  }

  const handleCopyCoordinates = () => {
    if (mapCenter) {
      const coordsText = `${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(
        6
      )}`
      navigator.clipboard.writeText(coordsText)
      toast.success('Coordinates copied!', {
        id: 'coords-copied',
        description: coordsText
      })
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={300} disableHoverableContent={false}>
        <nav className='bg-slate-900 text-white shadow-md z-[1000] relative'>
          <div className='flex justify-between items-center max-w-full px-3 sm:px-6 py-3'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <h1 className='m-0 text-xl sm:text-2xl font-semibold text-white'>
                PokeMap
              </h1>

              {/* Separator - Desktop only */}
              {totalPins > 0 && (
                <div className='hidden lg:block h-8 w-px bg-slate-600' />
              )}

              {/* Stats display - Desktop only */}
              {totalPins > 0 && (
                <div className='hidden lg:flex items-center gap-4 text-sm'>
                  {/* Nearest Locations - Only shows if user location available */}
                  {closestLocations.length > 0 && (
                    <button
                      onClick={onOpenNearestPanel}
                      className='flex items-center gap-2 text-slate-300 hover:text-white transition-colors min-h-[44px] px-2 -mx-2 rounded'
                    >
                      <Navigation
                        className='h-4 w-4 flex-shrink-0'
                        strokeWidth={2}
                      />
                      <span>
                        <span className='font-semibold text-white'>
                          Nearest
                        </span>
                        <span className='text-xs text-slate-400 ml-1'>
                          ({closestLocations.length})
                        </span>
                      </span>
                    </button>
                  )}

                  <div className='h-4 w-px bg-slate-600' />

                  {/* Visible Pin Count */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center gap-2 text-slate-300 min-h-[44px] px-2 -mx-2 rounded'>
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
                    <TooltipContent side='bottom'>
                      <p className='font-medium mb-1'>Visible Locations</p>
                      <p className='text-xs text-slate-300'>
                        {`${visiblePins.toLocaleString()} in current view`}
                      </p>
                      {visiblePins < totalPins && (
                        <p className='text-xs text-slate-400 mt-1.5'>
                          Zoom out or pan to see more
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>

                  <div className='h-4 w-px bg-slate-600' />

                  {/* Zoom Level */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center gap-2 text-slate-300 min-h-[44px] px-2 -mx-2 rounded'>
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
                    <TooltipContent side='bottom'>
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
                        Scale: 1-20 • Current: {currentZoom}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <div className='h-4 w-px bg-slate-600' />

                  {/* Map Center Coordinates */}
                  {mapCenter && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className='flex items-center gap-2 text-slate-300 hover:text-white transition-colors min-h-[44px] px-2 -mx-2 rounded'
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
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side='bottom'>
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

              {/* Nearest Locations Button - Mobile/Tablet only */}
              {closestLocations.length > 0 && (
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={onOpenNearestPanel}
                  className='lg:hidden flex items-center gap-2'
                >
                  <Navigation className='h-4 w-4' strokeWidth={2} />
                  <span className='hidden sm:inline'>Nearest</span>
                </Button>
              )}

              {/* Mobile Stats Button - Shows on tablet and mobile */}
              {totalPins > 0 && (
                <DropdownMenu
                  open={showMobileStats}
                  onOpenChange={setShowMobileStats}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant='secondary' size='sm' className='lg:hidden'>
                      <MapPinned className='h-4 w-4' strokeWidth={2} />
                      <span className='hidden sm:inline'>Stats</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-72'>
                    <DropdownMenuLabel>Map Statistics</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Map Center */}
                    {mapCenter && (
                      <DropdownMenuItem
                        onClick={handleCopyCoordinates}
                        className='flex-col items-start py-3'
                      >
                        <div className='flex items-center gap-2 mb-1'>
                          <Focus
                            className='h-4 w-4 text-slate-400'
                            strokeWidth={2}
                          />
                          <span className='font-medium'>Map Center</span>
                        </div>
                        <span className='font-mono text-xs text-slate-400 ml-6'>
                          {mapCenter.lat.toFixed(6)}°,{' '}
                          {mapCenter.lng.toFixed(6)}°
                        </span>
                        <span className='text-xs text-slate-500 ml-6 mt-1'>
                          Tap to copy
                        </span>
                      </DropdownMenuItem>
                    )}

                    {/* Zoom Level */}
                    <DropdownMenuItem className='flex-col items-start py-3'>
                      <div className='flex items-center gap-2 mb-1'>
                        <ZoomIn
                          className='h-4 w-4 text-slate-400'
                          strokeWidth={2}
                        />
                        <span className='font-medium'>Zoom Level</span>
                      </div>
                      <span className='text-sm text-slate-400 ml-6'>
                        {Math.round(currentZoom)}x •{' '}
                        {currentZoom < 5
                          ? 'Continent view'
                          : currentZoom < 10
                          ? 'State/Region view'
                          : currentZoom < 15
                          ? 'City view'
                          : 'Street view'}
                      </span>
                    </DropdownMenuItem>

                    {/* Visible Pins */}
                    <DropdownMenuItem className='flex-col items-start py-3'>
                      <div className='flex items-center gap-2 mb-1'>
                        <MapPinned
                          className='h-4 w-4 text-slate-400'
                          strokeWidth={2}
                        />
                        <span className='font-medium'>Visible Locations</span>
                      </div>
                      <span className='text-sm text-slate-400 ml-6'>
                        {visiblePins.toLocaleString()}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className='flex gap-2 sm:gap-3 items-center pl-2 sm:pl-0'>
              <Button
                variant='default'
                size='sm'
                onClick={onLocateUser}
                className='flex items-center gap-2'
              >
                <Crosshair className='h-4 w-4' strokeWidth={2} />
                <span className='hidden sm:inline'>Find My Location</span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='secondary' size='sm'>
                      <UserIcon className='h-4 w-4' strokeWidth={2} />
                      <span className='hidden sm:inline text-sm'>
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
                  size='sm'
                  onClick={() => setShowAuthDialog(true)}
                >
                  <UserIcon className='h-4 w-4 sm:hidden' strokeWidth={2} />
                  <span className='hidden sm:inline'>Sign In</span>
                </Button>
              )}

              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary' size='sm'>
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

      <Suspense fallback={null}>
        <AuthDialog
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
        />
      </Suspense>
    </>
  )
}
