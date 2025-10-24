-- フォーム送信データを保存するテーブル
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  discovery TEXT,
  consultation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Row Level Security (RLS) の有効化
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 誰でも挿入できるポリシー（フォーム送信用）
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 管理者のみ読み取り可能なポリシー
CREATE POLICY "Only authenticated users can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
