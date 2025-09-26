'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Metadata } from 'next'
import { BlogCard } from '@/components/blog/blog-card'
import { SearchBox } from '@/components/blog/search-box'
import { BlogPagination } from '@/components/blog/blog-pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search } from 'lucide-react'

// 动态生成博客搜索页面的SEO元数据
export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const query = searchParams.q as string || ''
  const page = Number(searchParams.page) || 1
  
  // 基础URL
  const baseUrl = 'https://qike.site/search/blog'
  const currentUrl = query 
    ? `${baseUrl}?q=${encodeURIComponent(query)}${page > 1 ? `&page=${page}` : ''}`
    : `${baseUrl}${page > 1 ? `?page=${page}` : ''}`
  
  // 生成标题
  let title = '搜索博客 - 绮课'
  if (query) {
    title = `搜索结果: ${query} - 绮课博客`
  }
  if (page > 1) {
    title = `第${page}页 - ${title}`
  }
  
  // 生成描述
  let description = '在绮课博客中搜索相关文章，了解绮课的最新动态和技术分享。'
  if (query) {
    description = `关于"${query}"的博客搜索结果，来自绮课博客平台。`
  }
  
  // 生成关键词
  const baseKeywords = ['绮课', '博客', '搜索', '中南大学', '课程表']
  const keywords = query ? [...baseKeywords, query] : baseKeywords
  
  return {
    title,
    description,
    keywords,
    metadataBase: new URL('https://qike.site'),
    alternates: {
      canonical: currentUrl,
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: '绮课',
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  published: boolean
  featured: boolean
  views: number
  tags: string[]
  meta: Record<string, any>
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export default function BlogSearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const limit = 9
  const totalPages = Math.ceil(total / limit)

  useEffect(() => {
    if (query) {
      searchPosts()
    } else {
      setLoading(false)
    }
  }, [query, page])

  const searchPosts = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/blog/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('搜索失败')
      }

      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (err) {
      setError('搜索文章时出错，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">搜索博客</h1>
        
        <SearchBox />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !query ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">开始搜索</h2>
            <p className="text-muted-foreground">输入关键词搜索博客文章</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">未找到结果</h2>
            <p className="text-muted-foreground">
              没有找到与 "{query}" 相关的文章
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              找到 {total} 个与 "{query}" 相关的结果
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <BlogPagination 
              currentPage={page}
              totalPages={totalPages}
              baseUrl={`/search/blog?q=${encodeURIComponent(query)}`}
            />
          </>
        )}
      </div>
    </div>
  )
}