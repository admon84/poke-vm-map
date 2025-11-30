import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LeftPanelContent } from '@/types/panel'
import { useNavbarHeight } from '@/hooks/useNavbarHeight'

interface LeftPanelProps {
  isOpen: boolean
  activeContent: LeftPanelContent
  onClose: () => void
  children: React.ReactNode
}

export function LeftPanel({
  isOpen,
  activeContent,
  onClose,
  children
}: LeftPanelProps) {
  const navbarHeight = useNavbarHeight()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/20 z-[1040] transition-opacity duration-300'
          onClick={onClose}
          aria-hidden='true'
        />
      )}

      {/* Panel */}
      <aside
        className={`
          fixed left-0 bottom-0 w-96 
          bg-slate-900/95 backdrop-blur-md
          shadow-2xl border-r border-slate-700
          z-[1050]
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          top: `${navbarHeight}px`
        }}
        aria-label='Left panel'
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-slate-700'>
          <h2 className='text-lg font-semibold text-white'>
            {activeContent === 'nearest' && 'Nearest Locations'}
            {activeContent === 'search' && 'Search'}
            {activeContent === 'categories' && 'Categories'}
            {activeContent === 'saved' && 'Saved Locations'}
          </h2>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            aria-label='Close panel'
            className='text-white hover:text-slate-900 hover:bg-white'
          >
            <X className='h-4 w-4' strokeWidth={2} />
          </Button>
        </div>

        {/* Content */}
        <div
          className='overflow-y-auto custom-scrollbar'
          style={{
            height: `calc(100vh - ${navbarHeight}px - 53px)`
          }}
        >
          {children}
        </div>
      </aside>
    </>
  )
}
