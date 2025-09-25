import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/server/blog-service'
import { verifyToken } from '@/lib/server/auth'

// GET /api/blog/posts/[id] - 获取单篇文章
export async function GET(request: NextRequest, props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  try {
    const post = await getBlogPostById(params.postId)
    
    if (!post || !post.published) {
      return NextResponse.json(
        { error: '文章未找到' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/posts/[id] - 更新文章
export async function PUT(request: NextRequest, props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证信息' },
        { status: 401 }
      )
    }

    const isValid = await verifyToken(token)
    if (!isValid) {
      return NextResponse.json(
        { error: '无效的认证信息' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const updatedPost = await updateBlogPost(params.postId, data)
    
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/posts/[id] - 删除文章
export async function DELETE(request: NextRequest, props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证信息' },
        { status: 401 }
      )
    }

    const isValid = await verifyToken(token)
    if (!isValid) {
      return NextResponse.json(
        { error: '无效的认证信息' },
        { status: 401 }
      )
    }

    await deleteBlogPost(params.postId)
    
    return NextResponse.json({ message: '文章已删除' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    )
  }
}