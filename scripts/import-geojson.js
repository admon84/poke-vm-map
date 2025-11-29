import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'

// Your Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function importGeoJSON() {
  try {
    console.log('Fetching GeoJSON data...')
    const response = await fetch(
      'https://poketools.live/assets/all_states.geojson'
    )
    const data = await response.json()

    console.log(`Found ${data.features.length} vending machines`)

    let imported = 0
    let failed = 0

    for (const feature of data.features) {
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
        if (imported % 50 === 0) {
          console.log(`Imported ${imported}/${data.features.length}...`)
        }
      } catch (error) {
        console.error('Failed to import:', feature, error)
        failed++
      }
    }

    console.log(`✅ Import complete! Imported: ${imported}, Failed: ${failed}`)
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

// Run the import
importGeoJSON()
