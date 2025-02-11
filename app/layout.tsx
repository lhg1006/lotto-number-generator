import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: '로또 번호 추첨기 | 무료 로또 번호 생성',
  description: '무료 로또 번호 생성기로 1부터 45까지의 숫자 중에서 랜덤하게 6개의 번호를 뽑아보세요. 한 번에 여러 줄 생성도 가능하며, 번호별 색상 구분과 히스토리 기능을 제공합니다.',
  keywords: '로또, 로또번호생성, 로또번호추첨, 로또번호추첨기, 로또번호생성기, 무료로또, 로또번호조합, 로또번호패턴, 로또당첨번호',
  authors: [{ name: 'lhg1006' }],
  creator: 'lhg1006',
  publisher: 'lhg1006',
  robots: 'index, follow',
  icons: {
    icon: '/favicon/icon.png',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-icon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/favicon/apple-icon.png',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://lotto-number-generator-pi.vercel.app/',
    title: '로또 번호 추첨기 | 무료 로또 번호 생성',
    description: '무료 로또 번호 생성기로 1부터 45까지의 숫자 중에서 랜덤하게 6개의 번호를 뽑아보세요. 한 번에 여러 줄 생성도 가능하며, 번호별 색상 구분과 히스토리 기능을 제공합니다.',
    siteName: '로또 번호 추첨기',
    images: [{
      url: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/2d28ecc0cfe5317675dcc42ac4f4fa020d17af21/images/project/ltg-0.png',
      width: 1200,
      height: 630,
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '로또 번호 추첨기 | 무료 로또 번호 생성',
    description: '무료 로또 번호 생성기로 1부터 45까지의 숫자 중에서 랜덤하게 6개의 번호를 뽑아보세요.',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  verification: {}
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
