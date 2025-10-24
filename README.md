# 富士山タイプ - fujisantype.com

本の中に隠された暗号を解いて辿り着いた読者への特別なページ。

## プロジェクト概要

- **ドメイン**: fujisantype.com
- **技術スタック**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **データベース**: Supabase
- **デプロイ**: Vercel

## 機能

### 1. ヒーローセクション
- 富士山の頂に立つキャラクターの画像レイヤー
- 回転する後光エフェクト（15秒で1回転）
- 麻の葉模様の背景パターン
- スムーススクロール促進アイコン

### 2. お祝いメッセージセクション
- スクロール時のフェードインアニメーション
- 「富士山タイプ」の説明
- 達成感を祝うメッセージ

### 3. 相談フォームセクション
- お名前（必須）
- メールアドレス（必須）
- 本の中で見つけた仕掛け（任意）
- 困りごと・相談したいこと（必須）
- Supabaseへのデータ保存

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fujisantype
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. Supabaseのセットアップ

#### 3.1 Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com/)にアクセス
2. 新しいプロジェクトを作成
3. Project Settings > API から以下を取得:
   - Project URL
   - anon/public key

#### 3.2 データベーステーブルの作成
1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase-setup.sql`の内容をコピー&ペースト
3. 実行してテーブルを作成

### 4. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、Supabaseの情報を設定:

```bash
cp .env.local.example .env.local
```

`.env.local`を編集:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## Vercelへのデプロイ

### 1. Vercelプロジェクトの作成

```bash
# Vercel CLIのインストール（初回のみ）
npm install -g vercel

# デプロイ
vercel
```

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. カスタムドメインの設定

1. Vercelダッシュボード > Settings > Domains
2. `fujisantype.com`を追加
3. お名前.comでDNS設定を更新:
   - Aレコード: Vercelが指定するIP
   - CNAMEレコード: `cname.vercel-dns.com`

## プロジェクト構成

```
fujisantype/
├── app/
│   ├── page.tsx              # メインページ
│   ├── layout.tsx            # ルートレイアウト
│   ├── globals.css           # グローバルスタイル
│   └── api/
│       └── contact/
│           └── route.ts      # フォーム送信API
├── components/
│   ├── HeroSection.tsx       # ヒーローセクション
│   ├── CongratulationsSection.tsx  # お祝いメッセージ
│   └── ContactForm.tsx       # 相談フォーム
├── lib/
│   └── supabase.ts           # Supabaseクライアント
├── public/
│   └── images/
│       ├── bg_img.png        # 背景パターン（麻の葉模様）
│       ├── bg.png            # ヘッダー背景
│       ├── light.png         # 回転する後光エフェクト
│       └── hero_img.png      # 富士山の頂のキャラクター
├── .env.local.example        # 環境変数テンプレート
├── supabase-setup.sql        # Supabaseテーブル作成SQL
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## データベーススキーマ

### consultations テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー（自動生成） |
| created_at | TIMESTAMP | 作成日時（UTC） |
| name | TEXT | お名前（必須） |
| email | TEXT | メールアドレス（必須） |
| discovery | TEXT | 本で見つけた仕掛け（任意） |
| consultation | TEXT | 相談内容（必須） |

## アニメーション仕様

### light.png の回転
- 回転速度: 15秒で360度回転
- アニメーション: linear（等速）
- 無限ループ

### スクロール時のフェードイン
- Intersection Observer API使用
- opacity: 0 → 1
- translateY: 20px → 0
- duration: 1秒

### スクロール促進矢印
- bounce アニメーション
- duration: 2秒
- 上下10pxの移動

## SEO設定

- title: "富士山タイプ | おめでとうございます"
- description: "あなたは富士山の頂に辿り着きました"
- robots: noindex, nofollow（検索エンジンには非公開）

## パフォーマンス最適化

- Next.js Image componentによる画像最適化
- lazy loading
- GPU加速アニメーション（transform, opacity）
- スムーススクロール

## トラブルシューティング

### Supabase接続エラー
- `.env.local`の環境変数が正しく設定されているか確認
- Supabaseプロジェクトが有効か確認
- RLSポリシーが正しく設定されているか確認

### フォーム送信エラー
- ブラウザのコンソールでエラーを確認
- Supabaseダッシュボードでテーブルが作成されているか確認
- ネットワークタブでAPIリクエストを確認

### 画像が表示されない
- `public/images/`に画像ファイルがあるか確認
- ファイル名が正しいか確認
- Next.jsサーバーを再起動

## ライセンス

Private - All rights reserved

## お問い合わせ

fujisantype.comの相談フォームからお問い合わせください。
