'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type LevelCardProps = {
  idx: number
  title: string
  emoji: string
  promptLink: string
  status: 'locked' | 'completed' | 'unlocked'
  onOpen?: (idx: number) => void
}

export default function LevelCard({ idx, title, emoji, promptLink, status, onOpen }: LevelCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const openPrompt = () => {
    if (status !== 'unlocked') return

    setIsLoading(true)
    const geminiWindow = window.open(promptLink, '_blank')

    if (geminiWindow) {
      try {
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.7 } })
      } catch {}

      setTimeout(() => {
        setIsLoading(false)
        onOpen?.(idx)
      }, 2000)
    } else {
      setIsLoading(false)
      alert('Please allow popups to open Gemini and start your quest!')
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'unlocked':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completed ✅'
      case 'unlocked':
        return 'Ready to Start'
      default:
        return 'Locked 🔒'
    }
  }

  return (
    <Card className={`p-4 transition-all duration-300 border-none bg-white/80 rounded-2xl backdrop-blur-sm ${
      status === 'locked' || status === 'completed' ? 'opacity-60' : 'hover:shadow-lg hover:scale-[1.02]'
    }`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{emoji}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
              Level {idx + 1}: {title}
            </h3>
            {status === 'completed' && <div className="text-green-500 text-2xl">🏆</div>}
          </div>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </div>
      {status === 'unlocked' && (
        <div className="mt-3">
          <Button
            onClick={openPrompt}
            disabled={isLoading}
            className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isLoading ? 'Loading...' : '🚀 Start Quest'}
          </Button>
        </div>
      )}
    </Card>
  )
}
