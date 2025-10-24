import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, discovery, consultation } = body

    // Validation
    if (!name || !email || !consultation) {
      return NextResponse.json(
        { error: '必須項目を入力してください' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          discovery: discovery || null,
          consultation,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'データの保存に失敗しました' },
        { status: 500 }
      )
    }

    // メール送信
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
      const fromEmail = process.env.FROM_EMAIL || adminEmail

      // 管理者向けメール
      await sgMail.send({
        to: adminEmail,
        from: {
          email: fromEmail,
          name: '富士山タイプ'
        },
        subject: '【富士山タイプ】新しいお問い合わせ',
        html: `
          <!DOCTYPE html>
          <html lang="ja">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- ヘッダー -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">新しいお問い合わせ</h1>
                      </td>
                    </tr>

                    <!-- コンテンツ -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                          新しいお問い合わせが届きました。
                        </p>

                        <!-- お名前 -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #d4af37; border-radius: 4px;">
                          <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">お名前</p>
                          <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 500;">${name}</p>
                        </div>

                        <!-- メールアドレス -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #d4af37; border-radius: 4px;">
                          <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">メールアドレス</p>
                          <p style="margin: 0; color: #333333; font-size: 16px;">
                            <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a>
                          </p>
                        </div>

                        <!-- 本の中で見つけた仕掛け -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #d4af37; border-radius: 4px;">
                          <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">本の中で見つけた仕掛け</p>
                          <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${discovery || '（未記入）'}</p>
                        </div>

                        <!-- 困りごと・相談したいこと -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #fffef2; border-left: 4px solid #d4af37; border-radius: 4px;">
                          <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">困りごと・相談したいこと</p>
                          <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${consultation}</p>
                        </div>

                        <!-- 送信日時 -->
                        <p style="margin: 30px 0 0 0; color: #999999; font-size: 12px; text-align: right;">
                          送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      })

      // お客様向け自動返信
      await sgMail.send({
        to: email,
        from: {
          email: fromEmail,
          name: '富士山タイプ'
        },
        replyTo: adminEmail,
        subject: 'お問い合わせありがとうございます - 富士山タイプ',
        html: `
          <!DOCTYPE html>
          <html lang="ja">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- ヘッダー -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">富士山タイプ</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">お問い合わせありがとうございます</p>
                      </td>
                    </tr>

                    <!-- コンテンツ -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-weight: 700;">${name} 様</h2>

                        <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px; line-height: 1.8;">
                          この度は富士山タイプへお問い合わせいただき、誠にありがとうございます。<br>
                          以下の内容でお問い合わせを承りました。
                        </p>

                        <!-- お問い合わせ内容 -->
                        <div style="margin-bottom: 30px; padding: 30px; background-color: #fffef2; border-radius: 8px; border: 1px solid #f4d03f;">
                          ${discovery ? `
                            <div style="margin-bottom: 20px;">
                              <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">本の中で見つけた仕掛け</p>
                              <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${discovery}</p>
                            </div>
                          ` : ''}

                          <div>
                            <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">困りごと・相談したいこと</p>
                            <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${consultation}</p>
                          </div>
                        </div>

                        <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px; line-height: 1.8;">
                          内容を確認させていただき、必ずしもお受けできるとは限りませんが、なんとかできそうなら連絡いたします。<br>
                          今しばらくお待ちください。
                        </p>

                        <!-- 注意事項 -->
                        <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px;">
                          <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
                            <strong style="color: #d4af37;">※ このメールは送信専用です</strong><br>
                            このメールアドレスへの返信はできません。<br>
                            お問い合わせは下記のメールアドレスまでお願いいたします。
                          </p>
                          <p style="margin: 15px 0 0 0; text-align: center;">
                            <a href="mailto:${adminEmail}" style="display: inline-block; padding: 12px 30px; background-color: #d4af37; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px;">${adminEmail}</a>
                          </p>
                        </div>
                      </td>
                    </tr>

                    <!-- フッター -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="text-align: center;">
                              <p style="margin: 0 0 10px 0; color: #d4af37; font-size: 18px; font-weight: 700;">富士山タイプ</p>
                              <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                Email: <a href="mailto:${adminEmail}" style="color: #d4af37; text-decoration: none;">${adminEmail}</a>
                              </p>
                              <p style="margin: 0; color: #666666; font-size: 13px;">
                                Web: <a href="https://fujisantype.com" style="color: #d4af37; text-decoration: none;">https://fujisantype.com</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- コピーライト -->
                  <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                      <td style="text-align: center; padding: 20px;">
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                          &copy; ${new Date().getFullYear()} 富士山タイプ. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // メール送信失敗してもデータは保存されているのでエラーにしない
    }

    return NextResponse.json(
      { message: '送信に成功しました', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
