'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LevelCard from './LevelCard'
import ProgressBar from './ProgressBar'
import { PROMPTS } from '@/data/prompt'
import confetti from 'canvas-confetti'

export default function QuestMap() {
  const [progress, setProgress] = useState<boolean[]>(Array(PROMPTS.length).fill(false))
  const [name, setName] = useState<string>('')
  const router = useRouter()

  /** Load student name and progress from localStorage */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedName = localStorage.getItem('g5_name') || ''
    setName(storedName.replace(/^"|"$/g, ''))

    const storedProgress = localStorage.getItem('g5_progress')
    if (storedProgress) {
      try {
        const parsed = JSON.parse(storedProgress)
        if (Array.isArray(parsed)) setProgress(parsed)
      } catch {
        setProgress(Array(PROMPTS.length).fill(false))
        localStorage.setItem('g5_progress', JSON.stringify(Array(PROMPTS.length).fill(false)))
      }
    }
  }, [])

  /** Persist progress and redirect when all levels are completed */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('g5_progress', JSON.stringify(progress))
    }

    if (progress.every(Boolean)) {
      // Redirect after 2 seconds
      const timer = setTimeout(() => {
        router.push('/certificate')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [progress, router])

  /** Mark a level as completed and trigger confetti */
  const handleLevelComplete = (idx: number) => {
    if (!progress[idx]) {
      const updated = [...progress]
      updated[idx] = true
      setProgress(updated)

      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899']
      })
    }
  }

  /** Determine the status of each level */
  const getStatus = (idx: number): 'locked' | 'unlocked' | 'completed' => {
    if (progress[idx]) return 'completed'
    if (idx === 0 || progress[idx - 1]) return 'unlocked'
    return 'locked'
  }

  const completedCount = progress.filter(Boolean).length

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-6 px-4 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* Header */}
      <header className="w-full text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {name || 'Explorer'}! 👋
        </h2>
        <p className="text-md text-gray-600">
          Complete all quests to earn your certificate
        </p>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm w-full max-w-md mx-auto">
          <ProgressBar currentStep={completedCount} totalSteps={PROMPTS.length} />
        </div>
      </header>

      {/* Level Cards */}
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

      {/* Completion Message */}
      {completedCount === PROMPTS.length && (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-lg font-bold text-green-600 mb-1">Congratulations!</h2>
          <p className="text-sm text-gray-600">Redirecting to your certificate...</p>
        </div>
      )}
    </div>
  )
}
