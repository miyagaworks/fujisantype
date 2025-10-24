import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'

// ファーストビュー以外のコンポーネントを遅延読み込み
const CongratulationsSection = dynamic(() => import('@/components/CongratulationsSection'), {
  loading: () => <div className="min-h-screen" />,
})
const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="min-h-screen" />,
})
const Footer = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CongratulationsSection />
      <ContactForm />
      <Footer />
    </main>
  )
}
