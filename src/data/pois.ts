import { PointOfInterest } from '../types/poi'

// Example POI data - you can replace this with data from an API or database
export const samplePOIs: PointOfInterest[] = [
  {
    id: '1',
    name: 'San Francisco',
    category: 'landmark',
    position: { lat: 37.7749, lng: -122.4194 },
    description: 'The City by the Bay - a cultural and commercial hub',
    website: 'https://www.sftravel.com'
  },
  {
    id: '2',
    name: 'Golden Gate Park',
    category: 'park',
    position: { lat: 37.7694, lng: -122.4862 },
    description: 'Large urban park with gardens, museums, and trails'
  },
  {
    id: '3',
    name: 'Fisherman\'s Wharf',
    category: 'attraction',
    position: { lat: 37.8080, lng: -122.4177 },
    description: 'Popular tourist destination with seafood restaurants and shops'
  },
  {
    id: '4',
    name: 'Alcatraz Island',
    category: 'landmark',
    position: { lat: 37.8267, lng: -122.4233 },
    description: 'Historic former federal prison, now a museum',
    website: 'https://www.nps.gov/alca'
  }
]

// Helper function to get marker color by category
export function getMarkerStyleByCategory(
  category?: PointOfInterest['category']
) {
  const styles = {
    restaurant: {
      background: '#FF6B35',
      borderColor: '#C44D2C',
      glyphColor: '#FFF'
    },
    park: {
      background: '#4CAF50',
      borderColor: '#357A38',
      glyphColor: '#FFF'
    },
    landmark: {
      background: '#2196F3',
      borderColor: '#1565C0',
      glyphColor: '#FFF'
    },
    attraction: {
      background: '#9C27B0',
      borderColor: '#6A1B9A',
      glyphColor: '#FFF'
    },
    custom: {
      background: '#FF0000',
      borderColor: '#8B0000',
      glyphColor: '#FFF'
    }
  }

  return category ? styles[category] : styles.custom
}

