import { useEffect, useState } from 'react'
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { VendingMachinePin } from '@/types/poi'

export function usePins() {
  const [pins, setPins] = useState<VendingMachinePin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'pins'),
        orderBy('createdAt', 'desc')
      )

      // Real-time listener
      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const pinsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as VendingMachinePin[]

          setPins(pinsData)
          setLoading(false)
        },
        err => {
          console.error('Error fetching pins:', err)
          setError(err as Error)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Error setting up pins listener:', err)
      setError(err as Error)
      setLoading(false)
    }
  }, [])

  const addPin = async (
    pin: Omit<VendingMachinePin, 'id' | 'createdAt' | 'lastUpdated'>
  ) => {
    try {
      const docRef = await addDoc(collection(db, 'pins'), {
        ...pin,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding pin:', err)
      throw err
    }
  }

  const updatePin = async (
    pinId: string,
    updates: Partial<Omit<VendingMachinePin, 'id' | 'createdAt'>>
  ) => {
    try {
      const pinRef = doc(db, 'pins', pinId)
      await updateDoc(pinRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      })
    } catch (err) {
      console.error('Error updating pin:', err)
      throw err
    }
  }

  return {
    pins,
    loading,
    error,
    addPin,
    updatePin
  }
}

