import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { getConfigValue } from '@/lib/server/config-service'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: '绮课 - 中南大学课程表查询平台',
    template: '%s | 绮课'
  },
  description: '绮课 - 专为中南大学学生打造的课程表查询平台，支持学生课表、教师课表、教室课表查询，提供便捷的课表管理服务。',
  keywords: ['中南大学', '课程表', '课表查询', '学生课表', '教师课表', '教室查询', '绮课'],
  authors: [{ name: '绮课团队' }],
  creator: '绮课',
  publisher: '绮课',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://qike.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '绮课 - 中南大学课程表查询平台',
    description: '专为中南大学学生打造的课程表查询平台，支持学生课表、教师课表、教室课表查询',
    url: 'https://qike.site',
    siteName: '绮课',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '绮课 - 中南大学课程表查询平台',
    description: '专为中南大学学生打造的课程表查询平台',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 在服务器端获取作者信息配置
  const authors = await getConfigValue<Array<{ name: string; link: string }>>("footer.authors", [])
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="cyan"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer authors={authors} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
