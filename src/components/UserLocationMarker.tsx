import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { memo } from 'react'

interface UserLocationMarkerProps {
  position: { lat: number; lng: number }
}

export const UserLocationMarker = memo(function UserLocationMarker({
  position
}: UserLocationMarkerProps) {
  return (
    <AdvancedMarker position={position} zIndex={1000}>
      <div
        style={{
          position: 'relative',
          width: '20px',
          height: '20px'
        }}
      >
        {/* Outer pulse ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(66, 133, 244, 0.2)',
            animation: 'pulse 2s infinite'
          }}
        />

        {/* Inner blue dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#4285f4',
            border: '3px solid white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}
        />
      </div>
    </AdvancedMarker>
  )
})
