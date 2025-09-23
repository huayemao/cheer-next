import {
  getBlogPostBySlug,
  getBlogPosts,
} from "@/lib/server/blog-service";
import { notFound } from "next/navigation";
import { MDXRenderer } from "@/components/blog/mdx-renderer";
import { ShareButtons } from "@/components/blog/share-buttons";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { posts } = await getBlogPosts({ published: true, limit: 5 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Admin"],
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }


  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto md:px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回博客
            </Link>
          </Button>

          <article className="bg-card rounded-2xl shadow-lg overflow-hidden">
            {post.coverImage && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishedAt?.toISOString()}>
                    {format(
                      post.publishedAt || post.createdAt,
                      "yyyy年MM月dd日",
                      { locale: zhCN }
                    )}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} 阅读</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/90 text-primary-foreground"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRenderer content={post.content} />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    分享文章:
                  </span>
                  <ShareButtons
                    title={post.title}
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${
                      post.slug
                    }`}
                    summary={post.excerpt}
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
