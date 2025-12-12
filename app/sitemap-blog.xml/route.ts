import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/server/blog-service'
import { getSiteUrl } from '@/lib/server/config-service'

export async function GET() {
  try {
    const posts = await getBlogPosts({ published: true })
    
    const baseUrl = await getSiteUrl()
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('生成博客站点地图失败:', error)
    return new NextResponse('生成站点地图失败', { status: 500 })
  }
}