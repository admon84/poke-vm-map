// Custom map styles to reduce visual noise and make POI markers stand out
// Documentation: https://developers.google.com/maps/documentation/javascript/style-reference

export const minimalMapStyle = [
  // Hide all default POI (points of interest)
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  // Hide POI business icons
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }]
  },
  // Hide attractions
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'off' }]
  },
  // Hide government buildings
  {
    featureType: 'poi.government',
    stylers: [{ visibility: 'off' }]
  },
  // Hide medical facilities
  {
    featureType: 'poi.medical',
    stylers: [{ visibility: 'off' }]
  },
  // Hide parks (optional - you might want to keep these)
  {
    featureType: 'poi.park',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  // Hide places of worship
  {
    featureType: 'poi.place_of_worship',
    stylers: [{ visibility: 'off' }]
  },
  // Hide schools
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }]
  },
  // Hide sports complexes
  {
    featureType: 'poi.sports_complex',
    stylers: [{ visibility: 'off' }]
  },
  // Simplify road labels
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  },
  // Reduce transit visibility
  {
    featureType: 'transit',
    stylers: [{ visibility: 'simplified' }]
  },
  // Hide transit stations
  {
    featureType: 'transit.station',
    stylers: [{ visibility: 'off' }]
  }
]

// Alternative: Ultra-minimal style (even cleaner)
export const ultraMinimalMapStyle = [
  // Hide ALL POIs
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }]
  },
  // Hide transit completely
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }]
  },
  // Simplify road labels - only show major roads
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  // Reduce landscape detail
  {
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 20 }]
  },
  // Subtle water color
  {
    featureType: 'water',
    stylers: [{ color: '#c9e6f7' }]
  }
]

// Pokemon-themed style (branded colors)
export const pokemonMapStyle = [
  // Hide all POIs
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }]
  },
  // Hide transit
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }]
  },
  // Pokemon Red & White theme
  {
    featureType: 'landscape',
    stylers: [{ color: '#f5f5f5' }]
  },
  {
    featureType: 'water',
    stylers: [{ color: '#4a90e2' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }]
  }
]
