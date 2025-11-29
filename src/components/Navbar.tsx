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
  LogOut
} from 'lucide-react'

interface NavbarProps {
  onLocateUser: () => void
  user: User | null
  mapColorScheme: 'LIGHT' | 'DARK' | 'FOLLOW_SYSTEM'
  onMapColorSchemeChange: (scheme: 'LIGHT' | 'DARK' | 'FOLLOW_SYSTEM') => void
}

export function Navbar({
  onLocateUser,
  user,
  mapColorScheme,
  onMapColorSchemeChange
}: NavbarProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <>
      <nav className='bg-slate-900 text-white shadow-md z-[1000]'>
        <div className='flex justify-between items-center max-w-full px-6 py-3'>
          <h1 className='m-0 text-2xl font-semibold text-white'>
            Pokemon VM Map
          </h1>
          <div className='flex gap-3 items-center'>
            <Button
              variant='default'
              onClick={onLocateUser}
              className='flex items-center gap-2'
            >
              <Crosshair className='h-4 w-4' />
              Find My Location
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary'>
                    <UserIcon className='h-4 w-4' />
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
                    <LogOut className='h-4 w-4' />
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
                  <Settings className='h-5 w-5' />
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
                    <Sun className='mr-2 h-4 w-4' />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='DARK'>
                    <Moon className='mr-2 h-4 w-4' />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='FOLLOW_SYSTEM'>
                    <Monitor className='mr-2 h-4 w-4' />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  )
}
