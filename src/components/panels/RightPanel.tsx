import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RightPanelContent } from '@/types/panel'

interface RightPanelProps {
  isOpen: boolean
  activeContent: RightPanelContent
  locationId?: string
  isLoading?: boolean
  onClose: () => void
  children: React.ReactNode
}

export function RightPanel({
  isOpen,
  activeContent,
  isLoading = false,
  onClose,
  children
}: RightPanelProps) {
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
          fixed right-0 top-[68px] bottom-0 w-[28rem]
          bg-slate-900/95 backdrop-blur-md
          shadow-2xl border-l border-slate-700
          z-[1050]
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label='Right panel'
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-slate-700'>
          <h2 className='text-lg font-semibold text-white'>
            {activeContent === 'location-details' && 'Location Details'}
            {activeContent === 'reviews' && 'Reviews'}
            {activeContent === 'photos' && 'Photos'}
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
        <div className='overflow-y-auto h-[calc(100vh-57px-53px)] custom-scrollbar'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
            </div>
          ) : (
            children
          )}
        </div>
      </aside>
    </>
  )
}
