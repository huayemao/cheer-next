import prisma from '@/lib/prisma'
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from '@/lib/types/blog'

export async function getBlogPosts(options: {
  published?: boolean
  limit?: number
  offset?: number
  tag?: string
  search?: string
  excludeAds?: boolean
} = {}): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
  const { published = true, limit = 10, offset = 0, tag, search, excludeAds = true } = options

  const where: any = { published }

  // 排除广告
  if (excludeAds) {
    where.isAd = false
  }

  if (tag) {
    where.tags = { has: tag }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.blogPost.count({ where })
  ])

  return {
    posts: posts as BlogPost[],
    total,
    hasMore: offset + limit < total
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  })

  if (!post) return null

  return post as BlogPost
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { id }
  })

  if (!post) return null

  return post as BlogPost
}

export async function incrementBlogPostViews(postId: string): Promise<void> {
  await prisma.blogPost.update({
    where: { id: postId },
    data: { views: { increment: 1 } }
  })
}

export async function createBlogPost(data: BlogPostCreate): Promise<BlogPost> {
  return prisma.blogPost.create({
    data: {
      ...data,
      publishedAt: data.published ? new Date() : null,
    }
  }) as Promise<BlogPost>
}

export async function updateBlogPost(id: string, data: BlogPostUpdate): Promise<BlogPost> {
  const updateData: any = { ...data }

  if (data.published !== undefined) {
    updateData.publishedAt = data.published ? new Date() : null
  }

  return prisma.blogPost.update({
    where: { id },
    data: updateData
  }) as Promise<BlogPost>
}

export async function deleteBlogPost(id: string): Promise<BlogPost> {
  return prisma.blogPost.delete({
    where: { id }
  }) as Promise<BlogPost>
}