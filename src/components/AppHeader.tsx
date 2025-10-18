'use client'

import Image from 'next/image'

export default function AppHeader() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Gemini Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-lg drop-shadow-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gemini Festive Challenge
          </h1>
        </div>
      </div>
    </header>
  )
}
