'use client'
import MobileGuard from '../../components/MobileGuard'
import CertificateCard from '../../components/CertificateCard'

export default function CertificatePage(){
  return (
    <MobileGuard>
      <CertificateCard template={'/cert-template.jpg'} />
    </MobileGuard>
  )
}