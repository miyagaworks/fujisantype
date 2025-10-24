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

      <section className="relative h-[50vh] md:h-screen w-full overflow-hidden bg-cream">

      {/* Hero image - PC用とモバイル用で切り替え */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-start justify-center">
        <div className="relative w-full h-full">
          {/* モバイル・タブレット用 */}
          <Image
            src="/images/hero_img.png"
            alt="富士山の頂に立つキャラクター"
            fill
            className="object-contain object-top lg:hidden"
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, 0px"
          />
          {/* PC用 */}
          <Image
            src="/images/hero_img_pc.png"
            alt="富士山の頂に立つキャラクター"
            fill
            className="object-contain object-top hidden lg:block"
            priority
            quality={90}
            sizes="(min-width: 1024px) 100vw, 0px"
          />
        </div>
      </div>

      {/* CSS製の回転する後光エフェクト - 最前面、キャラクターの頭の上 */}
      <div className="absolute top-[-110%] md:top-[-65%] lg:top-[-90%] left-1/2 -translate-x-1/2 w-[200vw] h-[200vw] md:w-[180vw] md:h-[180vw] lg:w-[160vw] lg:h-[160vw] max-w-[2200px] max-h-[2200px] z-50">
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

      {/* Scroll indicator - PCとタブレットのみ表示 */}
      <button
        onClick={scrollToNext}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-60 text-gold animate-bounce-slow hover:text-gold-dark transition-colors cursor-pointer items-center justify-center"
        aria-label="下にスクロール"
      >
        <ChevronDown className="w-12 h-12" />
      </button>
    </section>
    </>
  )
}
