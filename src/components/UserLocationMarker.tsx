import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { memo, useEffect, useState } from 'react'

interface UserLocationMarkerProps {
  position: { lat: number; lng: number }
  pulseTrigger?: number
}

export const UserLocationMarker = memo(function UserLocationMarker({
  position,
  pulseTrigger = 0
}: UserLocationMarkerProps) {
  const [isHighlighted, setIsHighlighted] = useState(false)

  // Trigger highlight animation whenever pulseTrigger changes (increments)
  useEffect(() => {
    if (pulseTrigger > 0) {
      setIsHighlighted(true)
      // Remove highlight after animation completes
      const timer = setTimeout(() => setIsHighlighted(false), 800)
      return () => clearTimeout(timer)
    }
  }, [pulseTrigger])

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

        {/* Highlight pulse (triggered on location found) */}
        {isHighlighted && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'rgba(66, 133, 244, 0.6)',
              animation: 'highlightPulse 0.8s ease-out'
            }}
          />
        )}

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
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease-out',
            ...(isHighlighted && {
              transform: 'translate(-50%, -50%) scale(1.3)'
            })
          }}
        />
      </div>
    </AdvancedMarker>
  )
})
