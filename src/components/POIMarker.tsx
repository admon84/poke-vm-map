import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { VendingMachinePin } from '../types/poi'
import { memo } from 'react'
import { formatAddressLines } from '../utils/addressParser.tsx'

interface POIMarkerProps {
  pin: VendingMachinePin
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
}

export const POIMarker = memo(function POIMarker({
  pin,
  isSelected,
  onSelect,
  onClose
}: POIMarkerProps) {
  // Custom Pokeball marker (no default style needed)
  const markerContent = (
    <img
      src='/pokeball-pin.png'
      alt='Pokemon Vending Machine'
      style={{
        width: '40px',
        height: '64px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        transform: isSelected ? 'scale(0.7)' : 'scale(0.5)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(0.6)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = isSelected
          ? 'scale(0.7)'
          : 'scale(0.5)'
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
          pixelOffset={[0, -55]}
          headerContent={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img
                src='/pokeball-pin.png'
                alt='Pokeball'
                style={{ width: '16px' }}
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
          <div
            style={{
              maxWidth: '280px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
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
                <span style={{ fontSize: '18px' }}>🏪</span>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '500'
                    }}
                  >
                    Store
                  </div>
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
                <span style={{ fontSize: '18px' }}>📍</span>
                <div>
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
                    Location
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#444',
                      lineHeight: '1.4'
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
                    fontSize: '13px',
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
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
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
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
})
