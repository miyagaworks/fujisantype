import CertificateGenerator from '@/components/CertificateGenerator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '富士山タイプ認定証生成 | fujisantype.com',
  description: 'あなただけの富士山タイプ認定証を作成して、SNSでシェアしましょう',
  robots: 'noindex, nofollow',
}

export default function CertificatePage() {
  return <CertificateGenerator />
}
