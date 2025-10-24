'use client'

import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.getElementById('congratulations')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* 金色のトップバー */}
      <div className="w-full h-4 bg-[#d4af37]"></div>

      <section className="relative w-full overflow-hidden bg-cream">

      {/* Hero image - PC用とモバイル用で切り替え */}
      <div className="relative w-full z-10">
        {/* モバイル・タブレット用 */}
        <div className="lg:hidden">
          <Image
            src="/images/hero_img.png"
            alt="富士山の頂に立つキャラクター"
            width={1200}
            height={1600}
            className="w-full h-auto"
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, 0px"
          />
        </div>
        {/* PC用 */}
        <div className="hidden lg:block">
          <Image
            src="/images/hero_img_pc.png"
            alt="富士山の頂に立つキャラクター"
            width={2400}
            height={1200}
            className="w-full h-auto"
            priority
            quality={90}
            sizes="(min-width: 1024px) 100vw, 0px"
          />
        </div>
      </div>

      {/* CSS製の回転する後光エフェクト - 最前面、キャラクターの頭の上 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[200vw] h-[200vw] max-w-[2200px] max-h-[2200px] z-50">
        <div className="relative w-full h-full animate-rotate-light">
          {/* 放射状のグラデーション - 透明度を下げてキャラクターが見えるように */}
          {[...Array(32)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-[50%] origin-top"
              style={{
                transform: `translate(-50%, 0) rotate(${i * (360 / 32)}deg)`,
                background: `linear-gradient(to bottom, ${
                  i % 2 === 0 ? 'rgba(212, 175, 55, 0.25)' : 'rgba(212, 175, 55, 0.15)'
                }, transparent)`,
              }}
            />
          ))}
        </div>
      </div>

    </section>

    {/* Scroll indicator - PCとタブレットのみ表示 */}
    <div className="hidden md:flex w-full justify-center py-8 bg-cream">
      <button
        onClick={scrollToNext}
        className="text-gold animate-bounce-slow hover:text-gold-dark transition-colors cursor-pointer"
        aria-label="下にスクロール"
      >
        <ChevronDown className="w-12 h-12" />
      </button>
    </div>
    </>
  )
}
