import { Metadata } from 'next';
import SubjectsQuery from './SubjectsQuery';
import { PageHeader } from '@/components/layout/page-header';

// 页面特定的SEO元数据配置
export const metadata: Metadata = {
  title: '中南大学课程查询 - 所有课程列表与筛选',
  description: '中南大学课程查询系统，提供所有本科课程的详细信息，包括课程名称、学分、学时、院系等信息，支持按院系、学分、课程类别等多维度筛选。',
  keywords: ['中南大学', '课程查询', '课程列表', '学分', '学时', '院系', '公共选修课', '专业课', '绮课'],
  alternates: {
    canonical: '/subjects',
  },
  openGraph: {
    title: '中南大学课程查询 - 所有课程列表与筛选',
    description: '中南大学课程查询系统，提供所有本科课程的详细信息，支持多维度筛选',
    url: 'https://qike.site/subjects',
    images: [
      {
        url: 'https://qike.site/screenshots/qike.png',
        alt: '中南大学课程查询页面',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '中南大学课程查询 - 所有课程列表与筛选',
    description: '中南大学课程查询系统，提供所有本科课程的详细信息，支持多维度筛选',
  },
  robots: {
    index: true,
    follow: true,
  },
  // 结构化数据 - JSON-LD格式
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: '中南大学课程列表',
      description: '中南大学所有本科课程的查询与筛选页面',
      url: 'https://qike.site/subjects',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [],
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首页',
            item: 'https://qike.site',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '课程查询',
            item: 'https://qike.site/subjects',
          },
        ],
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://qike.site/subjects?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }),
  },
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-background relative pt-16">
      <div className="absolute inset-0 bg-[var(--glass-effect)] dark:bg-[var(--glass-dark-effect)]"></div>
      <div className="relative z-10">
        {/* 页面标题 */}
        <PageHeader
          title="课程查询"
          description="探索中南大学的所有课程，按照不同维度筛选，找到您感兴趣的学习内容"
        />
        <SubjectsQuery />
      </div>
    </div>
  )
}