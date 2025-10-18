'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function WelcomeCard() {
  const router = useRouter()
  const [name, setName] = useLocalStorage('g5_name', '')
  const [localName, setLocalName] = useState(name || '')
  const [isLoading, setIsLoading] = useState(false)

  function start() {
    if (!localName.trim()) return alert('Please enter your name')
    setIsLoading(true)
    setName(localName.trim())

    // initialize progress if not present
    try {
      const progress =
        typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('g5_progress') || '[]')
          : []
      if (!progress || progress.length === 0) {
        localStorage.setItem('g5_progress', JSON.stringify([false, false, false, false, false]))
      }
    } catch (e) {
      localStorage.setItem('g5_progress', JSON.stringify([false, false, false, false, false]))
    }

    setTimeout(() => {
      router.push('/map')
    }, 500)
  }

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-8 border-none bg-white/80 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full p-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <img src="/logo.png" alt="logo" className="w-20 h-20 rounded-full bg-white p-1" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gemini Festive Challenge
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mt-2">
            Complete 5 fun AI-powered tasks and unlock your achievement!
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full"
            />
          </div>

          <Button
            onClick={start}
            disabled={!localName.trim() || isLoading}
            className={`mt-4 w-full py-3 rounded-lg font-medium shadow-sm text-white transition ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isLoading ? 'Starting...' : '🚀 Start My Quest'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
