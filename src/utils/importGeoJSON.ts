import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'

// Your Firebase config - load from environment or paste directly
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface GeoJSONFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    Retailer: string
    Address: string
  }
}

interface GeoJSONData {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export async function importGeoJSON() {
  try {
    console.log('Fetching GeoJSON data from poketools.live...')
    const response = await fetch(
      'https://poketools.live/assets/all_states.geojson'
    )
    const data: GeoJSONData = await response.json()

    console.log(`Found ${data.features.length} vending machines`)

    let imported = 0
    let failed = 0

    // Import in batches to avoid overwhelming Firestore
    const batchSize = 100

    for (let i = 0; i < data.features.length; i += batchSize) {
      const batch = data.features.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async feature => {
          try {
            const [lng, lat] = feature.geometry.coordinates
            const { Retailer, Address } = feature.properties

            await addDoc(collection(db, 'pins'), {
              name: `${Retailer} - Pokemon Vending Machine`,
              location: {
                lat: lat,
                lng: lng
              },
              address: Address,
              // description: '',
              createdBy: 'system-import',
              createdAt: serverTimestamp(),
              lastUpdated: serverTimestamp(),
              verified: true,
              retailer: Retailer
            })

            imported++
          } catch (error) {
            console.error(
              'Failed to import:',
              feature.properties.Address,
              error
            )
            failed++
          }
        })
      )

      console.log(
        `Progress: ${Math.min(i + batchSize, data.features.length)}/${
          data.features.length
        }`
      )
    }

    console.log(`✅ Import complete!`)
    console.log(`   Imported: ${imported}`)
    console.log(`   Failed: ${failed}`)

    return { imported, failed }
  } catch (error) {
    console.error('❌ Import failed:', error)
    throw error
  }
}
