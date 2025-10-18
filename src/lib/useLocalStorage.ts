'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null
      return item ? JSON.parse(item) : initialValue
    } catch (e) {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state))
      }
    } catch (e) {}
  }, [key, state])

  return [state, setState]
}