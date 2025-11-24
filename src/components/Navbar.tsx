import { Button } from '@/components/ui/button'

interface NavbarProps {
  onLocateUser: () => void
}

export function Navbar({ onLocateUser }: NavbarProps) {
  return (
    <nav className='bg-slate-900 text-white shadow-md z-[1000]'>
      <div className='flex justify-between items-center max-w-full px-6 py-3'>
        <h1 className='m-0 text-2xl font-semibold text-white'>Poke VM Map</h1>
        <div className='flex gap-3 items-center'>
          <Button onClick={onLocateUser} className='flex items-center gap-2'>
            <span className='text-lg'>📍</span>
            My Location
          </Button>
        </div>
      </div>
    </nav>
  )
}

