import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'アミダス人（ひと）: それはプラモデルからはじまった',
  description: '読み終わった後に、もう一つの扉が開く🔓 面白いから読んでみて？',
  openGraph: {
    title: 'アミダス人（ひと）: それはプラモデルからはじまった',
    description: '読み終わった後に、もう一つの扉が開く🔓',
    images: [
      {
        url: '/images/amidasu_book.png',
        width: 375,
        height: 600,
        alt: 'アミダス人（ひと）表紙',
      },
    ],
    type: 'book',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'アミダス人（ひと）: それはプラモデルからはじまった',
    description: '読み終わった後に、もう一つの扉が開く🔓',
    images: ['/images/amidasu_book.png'],
  },
}

export default function BookPage() {
  // Amazonにリダイレクト
  redirect('https://amzn.asia/d/gdOwxkj')
}
