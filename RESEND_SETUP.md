# Resend メール送信設定ガイド

## 1. Resendアカウントの作成

1. [Resend](https://resend.com)にアクセス
2. **Sign Up** でアカウントを作成（GitHubアカウントでログイン可能）
3. 無料プランで月100通まで送信可能

## 2. API Keyの取得

1. Resendダッシュボードにログイン
2. 左サイドバーの **API Keys** をクリック
3. **Create API Key** をクリック
4. 名前を入力（例: `fujisantype-production`）
5. **Add** をクリック
6. 表示されたAPI Keyをコピー（1回しか表示されないので注意！）

## 3. 環境変数に設定

`.env.local` ファイルに以下を追加：

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=あなたのメールアドレス
```

`ADMIN_EMAIL` には、お問い合わせ通知を受け取りたいメールアドレスを設定してください。

## 4. ドメイン認証（本番環境用）

### テスト環境（開発中）
- `onboarding@resend.dev` から送信されます
- 自分のメールアドレスにのみ送信可能

### 本番環境
独自ドメイン（`fujisantype.com`）からメールを送信するには：

1. Resendダッシュボードで **Domains** をクリック
2. **Add Domain** をクリック
3. `fujisantype.com` を入力
4. 表示されるDNSレコードをドメインのDNS設定に追加：
   - TXTレコード
   - MXレコード
   - CNAMEレコード（DKIM用）
5. 認証完了後、`from` アドレスを変更：
   ```typescript
   from: 'fujisantype <noreply@fujisantype.com>'
   ```

## 5. テスト送信

開発サーバーを再起動：
```bash
npm run dev
```

フォームから送信して、以下を確認：
- ✅ 管理者メールに通知が届く
- ✅ お客様に自動返信メールが届く

## トラブルシューティング

### メールが届かない場合

1. **迷惑メールフォルダを確認**
2. **Resendダッシュボードで送信履歴を確認**
   - Logs → Emails で送信状況を確認
3. **環境変数が正しく設定されているか確認**
   ```bash
   echo $RESEND_API_KEY
   echo $ADMIN_EMAIL
   ```
4. **開発サーバーのログでエラーを確認**

### 送信制限

無料プランの制限：
- 月100通まで
- 1日3,000通まで
- 送信先は自分のメールアドレスのみ（ドメイン認証なしの場合）

本番環境で大量送信が必要な場合は有料プランへアップグレードしてください。
