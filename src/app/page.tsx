'use client'
import MobileGuard from '../components/MobileGuard'
import WelcomeCard from '../components/WelcomeCard'

const AnyWelcomeCard = WelcomeCard as any

export default function Home(){
  return (
    <MobileGuard>
      <AnyWelcomeCard logo={'/logo.png'} />
    </MobileGuard>
  )
}