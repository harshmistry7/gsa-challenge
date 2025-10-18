'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'

export default function MobileGuard({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true)
  const [qr, setQr] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    setCurrentUrl(url)
    QRCode.toDataURL(url, { margin: 1 })
      .then(setQr)
      .catch(() => {})
  }, [])

  if (isMobile) return <>{children}</>

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-[90%] max-w-md sm:max-w-lg md:max-w-xl h-[90%] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 flex flex-col justify-between border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="Gemini Challenge Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Gemini 5-Step Festive Challenge
          </h1>
        </div>

        {/* Warning */}
        <div className="text-center">
          <div className="text-6xl mb-3 animate-pulse">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Mobile-Only Experience
          </h2>
          <p className="text-gray-600 text-base px-4 sm:px-6 leading-relaxed">
            This experience is designed exclusively for mobile devices.  
            Please scan the QR code or open this link on your phone.
          </p>
        </div>

        {/* QR Code */}
        {qr && (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr}
                alt="QR Code to open on mobile"
                className="w-40 sm:w-44 md:w-48 h-40 sm:h-44 md:h-48 mx-auto"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Scan with your phone camera 📸
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          {currentUrl && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mx-4 sm:mx-6">
              <p className="text-xs text-gray-400 mb-0.5">Current URL:</p>
              <p className="text-xs text-gray-600 break-all">{currentUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
