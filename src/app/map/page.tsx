'use client'
import MobileGuard from '../../components/MobileGuard'
import QuestMap from '../../components/QuestMap'

export default function MapPage(){
  return (
    <MobileGuard>
      <QuestMap />
    </MobileGuard>
  )
}