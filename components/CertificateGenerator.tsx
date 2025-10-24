'use client'

import { useState, useRef, useEffect } from 'react'
import { Download } from 'lucide-react'
import NextImage from 'next/image'

export default function CertificateGenerator() {
  const [name, setName] = useState('')
  const [certNumber, setCertNumber] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // 認定番号を取得
    const lastNumber = localStorage.getItem('fujisantype_cert_number') || '41'
    const nextNumber = (parseInt(lastNumber) + 1).toString().padStart(5, '0')
    setCertNumber(nextNumber)
  }, [])

  const generateCertificate = async () => {
    if (!name.trim()) {
      alert('お名前を入力してください')
      return
    }

    setIsGenerating(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 1200
    canvas.height = 630

    const bgImage = new Image()
    bgImage.src = '/images/certificate.png'
    bgImage.crossOrigin = 'anonymous'

    bgImage.onload = () => {
      // 背景画像を描画
      ctx.drawImage(bgImage, 0, 0, 1200, 630)

      // テキストのアンチエイリアシング
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 認定番号を描画（左下）
      ctx.fillStyle = '#000000'
      ctx.font = '32px "Noto Sans JP", "Yu Gothic", "游ゴシック体", sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`認定番号：No.${certNumber}`, 50, 580)

      // 名前の長さに応じてフォントサイズを調整
      let nameFontSize = 48
      ctx.font = `bold ${nameFontSize}px "Noto Sans JP", "Yu Gothic", "游ゴシック体", sans-serif`

      // 「様」を含めた全体の幅を計算
      const samaWidth = ctx.measureText('様').width
      let nameWidth = ctx.measureText(name).width
      let totalWidth = nameWidth + samaWidth + 10 // 10pxは名前と様の間隔

      // 名前が長い場合はフォントサイズを縮小
      while (totalWidth > 350 && nameFontSize > 24) {
        nameFontSize -= 2
        ctx.font = `bold ${nameFontSize}px "Noto Sans JP", "Yu Gothic", "游ゴシック体", sans-serif`
        nameWidth = ctx.measureText(name).width
        totalWidth = nameWidth + samaWidth + 10
      }

      // 中央に配置するための開始位置を計算
      const centerX = 600 // 画像の中央
      const startX = centerX - (totalWidth / 2)

      // 名前を描画（中央）
      ctx.textAlign = 'left'
      ctx.fillText(name, startX, 580)

      // 「様」を描画
      ctx.font = '32px "Noto Sans JP", "Yu Gothic", "游ゴシック体", sans-serif'
      ctx.fillText('様', startX + nameWidth + 10, 580)

      // 画像として保存
      const imageUrl = canvas.toDataURL('image/png')
      setGeneratedImage(imageUrl)
      setIsGenerating(false)

      // 認定番号を更新
      localStorage.setItem('fujisantype_cert_number', parseInt(certNumber).toString())
    }

    bgImage.onerror = () => {
      alert('認定証画像の読み込みに失敗しました')
      setIsGenerating(false)
    }
  }

  const downloadCertificate = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.download = `富士山タイプ認定証_${name}_No${certNumber}.png`
    link.href = generatedImage
    link.click()
  }

  const shareToLine = () => {
    const text = `「アミダス人（ひと）: それはプラモデルからはじまった」\n\n唯一無二を目指す人、高い頂を諦めない人、自分の足で登る人へ。`
    const url = 'https://amzn.asia/d/gdOwxkj'
    const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + url)}`
    window.open(shareUrl, '_blank')
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          認定証を作成する
        </h2>
        <p className="text-center text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
          あなたの名前を入力して、オリジナルの認定証を作成しましょう
        </p>

        {/* 入力フォーム */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-colors text-lg"
            />
          </div>

          <button
            onClick={generateCertificate}
            disabled={isGenerating || !name.trim()}
            className="w-full bg-gradient-to-r from-gold to-gold-light text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isGenerating ? '生成中...' : '認定証を生成'}
          </button>
        </div>

        {/* プレビュー */}
        {generatedImage && (
          <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              あなたの認定証
            </h2>
            <div className="mb-6 border-4 border-gold rounded-lg overflow-hidden">
              <img
                src={generatedImage}
                alt="富士山タイプ認定証"
                className="w-full h-auto"
              />
            </div>

            {/* ダウンロードボタン */}
            <button
              onClick={downloadCertificate}
              className="w-full bg-gold text-white font-bold py-3 px-6 rounded-lg hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              認定証をダウンロード
            </button>
          </div>
        )}

        {/* 本のシェアセクション - 認定証の下 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
            この本をシェアする
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* 表紙画像 */}
            <div className="flex-shrink-0">
              <NextImage
                src="/images/amidasu_book.png"
                alt="アミダス人（ひと）: それはプラモデルからはじまった"
                width={150}
                height={240}
                className="rounded shadow-lg"
              />
            </div>

            {/* 本の情報とボタン */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                アミダス<ruby>人<rt style={{ fontSize: '0.5em' }}>ひと</rt></ruby>
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                それはプラモデルからはじまった<br />
                唯一無二を目指す人、高い頂を諦めない人、自分の足で登る人へ。
              </p>

              <button
                onClick={shareToLine}
                className="w-full bg-[#06C755] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#05B04D] transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                LINEでシェア
              </button>
            </div>
          </div>
        </div>

        {/* Canvas（非表示） */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
