'use client'

import { useState, useEffect, Dispatch, SetStateAction } from 'react'

/**
 * useLocalStorage hook
 * @param key - localStorage key
 * @param initialValue - initial value if key does not exist
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (e) {
      console.error(`useLocalStorage: Error reading key "${key}":`, e)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state))
      }
    } catch (e) {
      console.error(`useLocalStorage: Error setting key "${key}":`, e)
    }
  }, [key, state])

  return [state, setState]
}
