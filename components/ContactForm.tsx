'use client'

import { useEffect, useRef, useState, FormEvent } from 'react'
import { SendHorizontal } from 'lucide-react'

export default function ContactForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const sectionRef = useRef<HTMLElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discovery: '',
    consultation: '',
  })

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('送信に失敗しました')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        discovery: '',
        consultation: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // メールアドレス入力時に全角文字を半角に変換
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // 全角英数字・記号を半角に変換
    value = value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    })
    // 全角@を半角@に変換
    value = value.replace(/＠/g, '@')
    // 全角ドットを半角ドットに変換
    value = value.replace(/．/g, '.')
    // 全角ハイフンを半角ハイフンに変換
    value = value.replace(/－/g, '-')
    // 全角アンダースコアを半角アンダースコアに変換
    value = value.replace(/＿/g, '_')
    // 全角スペースを削除
    value = value.replace(/　/g, '')
    // ひらがな・カタカナ・漢字などを削除
    value = value.replace(/[ぁ-んァ-ヶー一-龠々〆〤]/g, '')

    setFormData((prev) => ({ ...prev, email: value }))
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`max-w-2xl w-full mx-auto transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0' : 'translate-y-5'
        }`}
      >
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gold mb-12">
          相談したいことがあれば...
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* お名前 */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleEmailChange}
              pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
              title="半角英数字のメールアドレスを入力してください"
              autoComplete="email"
              inputMode="email"
              lang="en"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* 本の中で見つけた仕掛け */}
          <div>
            <label
              htmlFor="discovery"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              本の中で見つけた仕掛けで印象的だったもの
            </label>
            <textarea
              id="discovery"
              name="discovery"
              rows={3}
              value={formData.discovery}
              onChange={handleChange}
              placeholder="例:釣りの絵の小さなカニ、わさび→お茶漬けの発想など"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold focus:outline-none transition-colors resize-none text-justify"
            />
          </div>

          {/* 困りごと・相談したいこと */}
          <div>
            <label
              htmlFor="consultation"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              困りごと・相談したいこと <span className="text-red-500">*</span>
            </label>
            <textarea
              id="consultation"
              name="consultation"
              rows={8}
              required
              value={formData.consultation}
              onChange={handleChange}
              placeholder="形にしたいアイデア、解決したい課題など、何でもお書きください"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold focus:outline-none transition-colors resize-none text-justify"
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gold text-white text-xl font-bold rounded-lg hover:bg-gold-dark disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? '送信中...' : (
              <>
                <span>なんとかしましょう</span>
                <SendHorizontal className="w-6 h-6" style={{ transform: 'rotate(-30deg) translateY(-3px)' }} />
              </>
            )}
          </button>

          {/* ステータスメッセージ */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg text-green-800 text-justify">
              ありがとうございます！<br/>必ずしもお受けできるとは限りませんが、なんとかできそうなら連絡します。
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg text-red-800 text-center">
              申し訳ございません。もう一度お試しください。
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
