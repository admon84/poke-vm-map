import { Timestamp } from 'firebase/firestore'

export interface VendingMachinePin {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  address?: string
  description?: string
  createdBy: string // user ID
  createdAt: Timestamp
  lastUpdated: Timestamp
  photoUrl?: string
  verified: boolean
  retailer?: string // Store name (e.g., "Safeway", "Fred Meyer")
}

export interface PinSubmission {
  id: string
  pinId: string // reference to vending machine
  userId: string
  userName?: string
  type: 'restock' | 'success' | 'issue' | 'other'
  timestamp: Timestamp
  data: {
    restockItems?: string[]
    successNote?: string
    issueDescription?: string
    notes?: string
  }
}

export interface MarkerStyle {
  background: string
  borderColor: string
  glyphColor: string
  scale?: number
}

// Legacy type alias for compatibility
export type PointOfInterest = VendingMachinePin
