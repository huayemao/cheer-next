import { Metadata } from 'next';
import { getBlogPosts } from "@/lib/server/blog-service";
import { BlogCard } from "@/components/blog/blog-card";
import { FeaturedPosts } from "@/components/blog/featured-posts";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 动态生成博客页面的SEO元数据
export async function generateMetadata(props: BlogPageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const tag = searchParams.tag as string | undefined;
  const limit = 9;

  // 获取博客文章数据用于SEO
  const { posts, total } = await getBlogPosts({
    published: true,
    limit: 1,
    offset: 0,
    tag,
  });
  const totalPages = Math.ceil(total / limit);

  // 基础URL
  const baseUrl = 'https://qike.site/blog';
  const currentUrl = tag 
    ? `${baseUrl}?tag=${encodeURIComponent(tag)}${page > 1 ? `&page=${page}` : ''}`
    : `${baseUrl}${page > 1 ? `?page=${page}` : ''}`;

  // 生成标题
  let title = '绮课博客 - 分享关于绮课的功能更新和开发经验';
  if (tag) {
    title = `${tag}相关文章 - 绮课博客`;
  }
  if (page > 1) {
    title = `第${page}页 - ${title}`;
  }

  // 生成描述
  let description = '绮课博客分享关于绮课的功能更新、开发经验和使用技巧，帮助你更好地使用绮课平台。';
  if (tag) {
    description = `浏览所有关于${tag}的博客文章，了解绮课的最新动态和相关技术分享。`;
  }

  // 生成关键词
  const baseKeywords = ['绮课', '博客', '中南大学', '课程表', '功能更新', '开发经验'];
  const keywords = tag ? [...baseKeywords, tag] : baseKeywords;

  // 生成OG和Twitter图像 - 使用screenshots目录下的qike.png作为备选
  const ogImage = posts.length > 0 && posts[0].coverImage 
    ? posts[0].coverImage 
    : 'https://qike.site/screenshots/qike.png';

  // 生成JSON-LD结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': '绮课博客',
    'description': '分享关于绮课的功能更新和开发经验',
    'url': baseUrl,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': baseUrl
    },
    'publisher': {
      '@type': 'Organization',
      'name': '绮课',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://qike.site/favicon.ico',
        'width': 64,
        'height': 64
      }
    },
    'image': {
      '@type': 'ImageObject',
      'url': ogImage,
      'width': 1200,
      'height': 630
    }
  };

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
      images: [
        {
          url: ogImage,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    // JSON-LD结构化数据
    other: {
      'application/ld+json': JSON.stringify(jsonLd)
    },
    // 分页信息
    ...(totalPages > 1 && {
      pagination: {
        current: page,
        total: totalPages,
        prev: page > 1 ? 
          (tag ? `/blog?tag=${encodeURIComponent(tag)}&page=${page - 1}` : `/blog?page=${page - 1}`) : 
          undefined,
        next: page < totalPages ? 
          (tag ? `/blog?tag=${encodeURIComponent(tag)}&page=${page + 1}` : `/blog?page=${page + 1}`) : 
          undefined,
      },
    }),
  };
}

export default async function BlogPage(props: BlogPageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const tag = searchParams.tag as string | undefined;
  const limit = 9;

  const [postsData] = await Promise.all([
    getBlogPosts({
      published: true,
      limit,
      offset: (page - 1) * limit,
      tag,
    }),
    // getFeaturedPosts(3)
  ]);

  const { posts, total } = postsData;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* 页面标题 - 使用可复用组件 */}
        <PageHeader
          title="博客"
          description="分享关于绮课的功能更新和开发经验"
          className='mb-8'
        />

        {/* {featuredPosts.length > 0 && page === 1 && !tag && (
          <FeaturedPosts posts={featuredPosts} />
        )} */}

        {tag && (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              标签:{" "}
              <span className="text-transparent gradient-purple bg-clip-text">
                {tag}
              </span>
            </h2>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无文章</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <BlogPagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl={tag ? `/blog?tag=${encodeURIComponent(tag)}` : "/blog"}
            />
          </>
        )}
      </div>
    </div>
  );
}
