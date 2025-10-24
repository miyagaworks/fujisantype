# 富士山タイプ - セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクト名: `fujisantype`
4. データベースパスワードを設定（安全な場所に保存）
5. リージョン: `Northeast Asia (Tokyo)` を選択

## 2. データベーステーブルの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase-setup.sql`の内容をコピー＆ペースト
3. 「Run」ボタンをクリックして実行

これで以下が作成されます：
- `contact_submissions`テーブル
- 必要なインデックス
- Row Level Security (RLS) ポリシー

## 3. 環境変数の設定

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の情報を確認：
   - `Project URL`
   - `anon/public key`

3. プロジェクトルートに`.env.local`ファイルを作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=あなたのプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon key
NEXT_PUBLIC_SITE_URL=https://fujisantype.com
```

## 4. 依存パッケージのインストール

```bash
npm install
```

## 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 6. 本番ビルド

```bash
npm run build
npm start
```

## 7. デプロイ（Vercel推奨）

1. [Vercel](https://vercel.com)にアカウント作成
2. GitHubリポジトリを接続
3. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. デプロイ

## パフォーマンス最適化

✅ 画像最適化（AVIF/WebP形式）
✅ 動的コンポーネントの遅延読み込み
✅ フォント最適化（display: swap）
✅ First Load JS: 97KB

## トラブルシューティング

### フォームが送信できない場合

1. `.env.local`ファイルが正しく設定されているか確認
2. Supabaseのテーブルが正しく作成されているか確認
3. ブラウザのコンソールでエラーメッセージを確認

### 画像が表示されない場合

1. `public/images/`に以下のファイルがあるか確認：
   - `hero_img.png`
   - `hero_img_pc.png`
2. `public/favicon.ico`があるか確認
