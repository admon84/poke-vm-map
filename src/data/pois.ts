import { VendingMachinePin } from '../types/poi'

// Sample POI data - this will be replaced by Firebase data
// Keeping for reference/fallback
export const samplePOIs: VendingMachinePin[] = []

// Helper function to get marker color (Pokemon themed)
export function getMarkerStyle() {
  return {
    background: '#EE1515', // Pokemon Red
    borderColor: '#CC0000',
    glyphColor: '#FFF'
  }
}

