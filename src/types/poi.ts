export interface PointOfInterest {
  id: string
  name: string
  category?: 'restaurant' | 'park' | 'landmark' | 'attraction' | 'custom'
  position: {
    lat: number
    lng: number
  }
  description?: string
  image?: string
  website?: string
}

export interface MarkerStyle {
  background: string
  borderColor: string
  glyphColor: string
  scale?: number
}

