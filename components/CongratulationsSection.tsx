'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const CertificateGenerator = dynamic(() => import('./CertificateGenerator'), {
  ssr: false,
  loading: () => <div className="min-h-[600px] flex items-center justify-center"><p>読み込み中...</p></div>
})

export default function CongratulationsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      id="congratulations"
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center px-6 mb-20 py-4 md:py-20 bg-gradient-to-b from-cream to-white transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto text-center space-y-8 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0" : "translate-y-5"
        }`}
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gold mb-16">
          おめでとうございます！
        </h1>

        <p className="text-xl md:text-3xl font-semibold text-gray-800 leading-relaxed">
          あなたは富士山の頂に立ちました。
        </p>

        <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
          <p>
            15個の座標を見つけ、暗号を解き、
            <br />
            ここに辿り着いた。
            <br />
            それができるあなたは、
            <br />
            まさに
            <span className="text-gold font-bold">「富士山タイプ」</span>
            です。
          </p>

          <div className="my-12 p-8 bg-white rounded-lg shadow-lg border-2 border-gold/20">
            <h2 className="text-2xl md:text-3xl font-bold text-gold mb-6">
              富士山タイプとは？
            </h2>
            <ul className="space-y-3 text-left max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="text-gold mr-3 text-xl">•</span>
                <span>唯一無二を目指す人</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3 text-xl">•</span>
                <span>高い頂を諦めない人</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3 text-xl">•</span>
                <span>自分の足で登る人</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3 text-xl">•</span>
                <span>+アルファの遊び心を理解できる人</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-3 text-xl">•</span>
                <span>形にすることを楽しむ人</span>
              </li>
            </ul>
          </div>

          <p className="text-xl md:text-2xl font-semibold mt-12">
            日本一の山、富士山。
            <br />
            誰もが知っているけれど、実際に登った人は多くない。
          </p>

          <p className="text-lg md:text-xl">
            この本の仕掛けも同じです。
            <br />
            気づいた人はいるでしょう。
            <br />
            でも、ここまで辿り着いた人は...
          </p>

          <p className="text-3xl md:text-4xl font-bold text-gold mt-8">
            あなただけです。
          </p>
        </div>

        {/* 認定証生成 */}
        <div className="mt-16 w-full">
          <CertificateGenerator />
        </div>
      </div>
    </section>
  );
}
