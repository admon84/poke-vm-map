import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { VendingMachinePin } from '../types/poi'
import { memo } from 'react'
import { formatAddressLines } from '../utils/addressParser.tsx'
import { Store, MapPin, Navigation, ChevronRight } from 'lucide-react'

interface POIMarkerProps {
  pin: VendingMachinePin
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
  onOpenDetails?: (pinId: string) => void
}

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        fontSize: '12px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '500',
        marginBottom: '4px'
      }}
    >
      {children}
    </div>
  )
}

export const POIMarker = memo(function POIMarker({
  pin,
  isSelected,
  onSelect,
  onClose,
  onOpenDetails
}: POIMarkerProps) {
  // Custom Pokeball marker (no default style needed)

  const [width, height] = [40, 64]
  const [small, medium, large] = [0.8, 0.9, 1]

  const markerContent = (
    <img
      src={`${import.meta.env.BASE_URL}pokeball-pin.png`}
      alt='Pokemon Vending Machine'
      style={{
        width: `${width}px`,
        height: `${height}px`,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        transform: isSelected ? `scale(${large})` : `scale(${small})`
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = `scale(${medium})`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = isSelected
          ? `scale(${large})`
          : `scale(${small})`
      }}
    />
  )

  return (
    <AdvancedMarker position={pin.location} onClick={onSelect}>
      {markerContent}
      {isSelected && (
        <InfoWindow
          position={pin.location}
          onCloseClick={onClose}
          pixelOffset={[0, -height + 2]}
          headerContent={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}pokeball-pin.png`}
                alt='Pokeball'
                style={{
                  width: '16px',
                  filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
                  margin: '0 2px'
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}
              >
                Pokemon Vending Machine
              </h3>
            </div>
          }
        >
          <div style={{ maxWidth: '280px' }}>
            {/* Retailer with icon */}
            {pin.retailer && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <Store className='h-5 w-5 text-gray-600 flex-shrink-0' />
                <div>
                  <Label>Store</Label>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontWeight: '600'
                    }}
                  >
                    {pin.retailer}
                  </div>
                </div>
              </div>
            )}

            {/* Address with icon */}
            {pin.address && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '8px',
                  padding: '8px 0'
                }}
              >
                <MapPin className='h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5' />
                <div>
                  <Label>Location</Label>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontWeight: '400'
                    }}
                  >
                    {formatAddressLines(pin.address)}
                  </div>
                </div>
              </div>
            )}

            {/* Verified badge - more prominent */}
            {/* {pin.verified && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#f0f9ff',
                  borderLeft: '3px solid #4CAF50',
                  borderRadius: '4px'
                }}
              >
                <span style={{ fontSize: '16px', color: '#4CAF50' }}>✓</span>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#2e7d32',
                    fontWeight: '600'
                  }}
                >
                  Verified Location
                </span>
              </div>
            )} */}

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid #f0f0f0'
              }}
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${pin.location.lat},${pin.location.lng}`}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#3367d6'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#4285f4'
                }}
              >
                <Navigation className='h-4 w-4' />
                <span>Get Directions</span>
              </a>

              {/* TODO: More details right panel functionality */}
              {/* {onOpenDetails && (
                <button
                  onClick={() => onOpenDetails(pin.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#059669'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#10b981'
                  }}
                >
                  <span>More Details</span>
                  <ChevronRight className='h-4 w-4' />
                </button>
              )} */}
            </div>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
})
