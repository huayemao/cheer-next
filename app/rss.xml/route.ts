import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/server/blog-service'
import { getSiteUrl } from '@/lib/server/config-service'

export async function GET() {
  try {
    const posts = await getBlogPosts({ published: true, limit: 20 })
    
    const baseUrl = await getSiteUrl()
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>博客 - 精品课表</title>
    <description>精品课表官方博客，分享教育技术、学习方法和校园生活</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>`).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('生成RSS失败:', error)
    return new NextResponse('生成RSS失败', { status: 500 })
  }
}