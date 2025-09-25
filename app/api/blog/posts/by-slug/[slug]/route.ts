import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostBySlug } from '@/lib/server/blog-service'

// GET /api/blog/posts/[slug]/by-slug - 通过slug获取文章
export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const post = await getBlogPostBySlug(params.slug)
    
    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('获取博客文章错误:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}