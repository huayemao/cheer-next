import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const MAX_RETRIES = 3
const RETRY_DELAY = 100 // ms

async function updateViewsWithRetry(postId: string, retries = 0): Promise<{ views: number }> {
  try {
    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        views: true
      }
    })
    return { views: updatedPost.views }
  } catch (error: any) {
    // 如果是并发冲突错误且还有重试次数
    if (error.code === 1020 && retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries)))
      return updateViewsWithRetry(postId, retries + 1)
    }
    throw error
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params

    const result = await updateViewsWithRetry(postId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('更新浏览量失败:', error)
    
    // 对于并发冲突错误，返回特定的错误信息
    if (error.code === 1020) {
      return NextResponse.json(
        { error: '更新浏览量时发生冲突，请稍后重试' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: '更新浏览量失败' },
      { status: 500 }
    )
  }
}