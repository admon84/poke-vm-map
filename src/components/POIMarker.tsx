import { AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'
import { PointOfInterest, MarkerStyle } from '../types/poi'

interface POIMarkerProps {
  poi: PointOfInterest
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
  markerStyle?: MarkerStyle
}

export function POIMarker({
  poi,
  isSelected,
  onSelect,
  onClose,
  markerStyle
}: POIMarkerProps) {
  const defaultStyle: MarkerStyle = {
    background: '#FF0000',
    borderColor: '#8B0000',
    glyphColor: '#FFF',
    scale: 1.0
  }

  const style = markerStyle || defaultStyle

  return (
    <AdvancedMarker position={poi.position} onClick={onSelect}>
      <Pin
        background={style.background}
        borderColor={style.borderColor}
        glyphColor={style.glyphColor}
        scale={style.scale}
      />
      {isSelected && (
        <InfoWindow position={poi.position} onCloseClick={onClose}>
          <div
            style={{
              padding: '12px',
              maxWidth: '250px'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
              {poi.name}
            </h3>
            {poi.category && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '8px'
                }}
              >
                {poi.category}
              </span>
            )}
            {poi.description && (
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                {poi.description}
              </p>
            )}
            {poi.website && (
              <a
                href={poi.website}
                target='_blank'
                rel='noopener noreferrer'
                style={{ fontSize: '14px', color: '#1a73e8' }}
              >
                Visit Website →
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}
