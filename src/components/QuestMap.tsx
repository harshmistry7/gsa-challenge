'use client'

import { useState, useEffect } from 'react'
import LevelCard from './LevelCard'
import ProgressBar from './ProgressBar'
import { PROMPTS } from '@/data/prompt'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function QuestMap() {
  const [progress, setProgress] = useState<boolean[]>(Array(PROMPTS.length).fill(false))
  const [name, setName] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedProgress = localStorage.getItem('g5_progress')
    const storedName = localStorage.getItem('g5_name') || ''
    setName(storedName.replace(/^"|"$/g, ''))

    if (storedProgress) {
      try {
        const parsed = JSON.parse(storedProgress)
        if (Array.isArray(parsed)) setProgress(parsed)
      } catch {
        setProgress(Array(PROMPTS.length).fill(false))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('g5_progress', JSON.stringify(progress))

    if (progress.every(Boolean)) {
      setIsRedirecting(true)
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/certificate'
      }, 2000)
    }
  }, [progress])

  const handleLevelComplete = (idx: number) => {
    const updated = [...progress]
    updated[idx] = true
    setProgress(updated)
  }

  const getStatus = (idx: number) => {
    if (progress[idx]) return 'completed'
    if (idx === 0 || progress[idx - 1]) return 'unlocked'
    return 'locked'
  }

  const completedCount = progress.filter(Boolean).length

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-6 px-4 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="w-full text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {name || 'Explorer'}! 👋</h2>
        <p className="text-md text-gray-600">Complete all quests to earn your certificate</p>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm w-full max-w-md mx-auto">
          <ProgressBar currentStep={completedCount} totalSteps={PROMPTS.length} />
        </div>
      </header>

      <div className="w-full max-w-md flex flex-col gap-4">
        {PROMPTS.map((level, idx) => (
          <LevelCard
            key={idx}
            idx={idx}
            title={level.title}
            emoji={level.emoji}
            promptLink={level.promptLink}
            status={getStatus(idx)}
            onOpen={handleLevelComplete}
          />
        ))}
      </div>

      <Dialog open={isRedirecting}>
        <DialogContent className="sm:max-w-md border-none bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500 animate-ping opacity-20"></div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">🎉 All Quests Completed! 🎉</h2>
              <p className="text-gray-600">Redirecting to your certificate...</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
