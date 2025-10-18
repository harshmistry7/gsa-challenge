'use client'

import MobileGuard from '../components/MobileGuard'
import WelcomeCard, { WelcomeCardProps } from '../components/WelcomeCard'

export default function Home() {
  const welcomeCardProps: WelcomeCardProps = {
    logo: '/logo.png',
  }

  return (
    <MobileGuard>
      <WelcomeCard {...welcomeCardProps} />
    </MobileGuard>
  )
}
