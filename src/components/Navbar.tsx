import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User } from 'firebase/auth'
import { AuthDialog } from './AuthDialog'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

interface NavbarProps {
  onLocateUser: () => void
  user: User | null
}

export function Navbar({ onLocateUser, user }: NavbarProps) {
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
              Find My Location
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary'>
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
