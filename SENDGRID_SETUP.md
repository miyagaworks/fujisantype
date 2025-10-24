# SendGrid メール送信設定ガイド

## 1. SendGridアカウントの作成

1. [SendGrid](https://sendgrid.com)にアクセス
2. **Start for Free** をクリック
3. アカウント情報を入力して登録
4. メール認証を完了

## 2. Sender Authentication（送信者認証）

### Single Sender Verification（簡易設定）

1. SendGridダッシュボードで **Settings** → **Sender Authentication** をクリック
2. **Verify a Single Sender** をクリック
3. 以下の情報を入力：
   - **From Name**: 富士山タイプ
   - **From Email Address**: あなたのメールアドレス（例: your-email@gmail.com）
   - **Reply To**: 同じメールアドレス
   - **Company Address**: 会社住所（任意）
4. **Create** をクリック
5. 確認メールが送られてくるので、リンクをクリックして認証

**注意**: この方法では、認証したメールアドレスからのみ送信可能です。

### Domain Authentication（本番環境推奨）

独自ドメイン（`fujisantype.com`）から送信する場合：

1. **Settings** → **Sender Authentication** → **Authenticate Your Domain**
2. ドメイン `fujisantype.com` を入力
3. DNS Provider で **Cloudflare** または **Other** を選択
4. 表示されるDNSレコードをCloudflareに追加：
   - 3つのCNAMEレコード（DKIM、SPF用）
5. 認証完了後、`FROM_EMAIL=noreply@fujisantype.com` が使用可能に

## 3. API Keyの作成

1. **Settings** → **API Keys** をクリック
2. **Create API Key** をクリック
3. API Key名を入力（例: `fujisantype-production`）
4. **API Key Permissions** で **Full Access** または **Restricted Access** を選択
   - **Restricted Access** の場合、**Mail Send** の権限のみ有効にする
5. **Create & View** をクリック
6. 表示されたAPI Keyをコピー（1回しか表示されません！）

## 4. 環境変数に設定

`.env.local` ファイルに以下を追加：

```bash
# SendGrid API Key
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 管理者メールアドレス（お問い合わせ通知の送信先）
ADMIN_EMAIL=your-email@example.com

# 送信元メールアドレス（認証済みのアドレス）
FROM_EMAIL=your-email@example.com
```

**重要**: 
- `FROM_EMAIL` は **Sender Authentication** で認証したアドレスを使用してください
- ドメイン認証していない場合、Single Sender で認証したアドレスを使用

## 5. 開発サーバーを再起動

```bash
npm run dev
```

## 6. テスト送信

フォームから送信して、以下を確認：
- ✅ 管理者メールに通知が届く
- ✅ お客様に自動返信メールが届く

## 料金プラン

### Free プラン
- 月 **100通** まで無料
- クレジットカード登録不要
- Single Sender Verification のみ

### 有料プラン
- $19.95/月〜（月40,000通）
- Domain Authentication 可能
- より高い送信レート

本番環境で大量送信が必要な場合は有料プランへアップグレードしてください。

## トラブルシューティング

### メールが届かない場合

1. **Sender Authentication を確認**
   - Settings → Sender Authentication で認証済みか確認
   
2. **FROM_EMAIL が認証済みアドレスか確認**
   - 認証していないアドレスからは送信できません

3. **SendGridダッシュボードで送信履歴を確認**
   - Activity → Email Activity で送信状況を確認

4. **迷惑メールフォルダを確認**

5. **開発サーバーのログでエラーを確認**
   ```bash
   # ターミナルでエラーメッセージを確認
   ```

### よくあるエラー

**Error: The from email does not contain a valid address**
→ `FROM_EMAIL` が認証されていません。Sender Authentication を完了してください。

**Error: API key does not have permission**
→ API Keyの権限が不足しています。Full Access または Mail Send 権限を付与してください。
