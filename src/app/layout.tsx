import './globals.css'
import MobileGuard from '@/components/MobileGuard'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

export const metadata = {
  title: 'Gemini Festive Challenge',
  description: '🎯 Complete 5 fun AI-powered tasks and unlock your achievement!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-inter text-gray-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
        {/* Header */}
        <AppHeader />

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center pt-[var(--header-height,4rem)]">
          {/* Add top padding equal to header height */}
          <MobileGuard>{children}</MobileGuard>
        </main>

        {/* Footer */}
        <AppFooter />
      </body>
    </html>
  )
}
