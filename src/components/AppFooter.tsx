// components/AppFooter.tsx
import React from "react"

export default function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full py-4 text-center text-gray-500 text-sm border-t border-gray-200 bg-white/60 backdrop-blur-md">
      © {year} GSA ADIT — Harsh Mistry
    </footer>
  )
}
