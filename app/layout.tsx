import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fujisantype.com'),
  title: '富士山タイプ | おめでとうございます',
  description: 'あなたは富士山の頂に辿り着きました',
  robots: 'noindex, nofollow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '富士山タイプ | おめでとうございます',
    description: 'あなたは富士山の頂に辿り着きました',
    images: ['/images/hero_img.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth bg-[#d4af37]">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
