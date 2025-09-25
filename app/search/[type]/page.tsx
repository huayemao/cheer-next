import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import TimetableClient from "@/components/timetable-client";
import { type SearchResult } from "@/lib/actions/search";
import {TypeSpecificSearchBox} from "@/app/search/[type]/search-box";


interface SearchPageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
  const params = await props.params;
  const { type } = params;

  const titles = {
    student: "学生课表查询 - 绮课",
    teacher: "教师课表查询 - 绮课",
    location: "教室课表查询 - 绮课",
    profession: "专业课表查询 - 绮课",
  };

  const descriptions = {
    student: "中南大学学生课程表在线查询，支持按学号、姓名快速查找课程信息",
    teacher: "中南大学教师课程表在线查询，支持按教师姓名快速查找授课信息",
    location: "中南大学教室课程表在线查询，支持按教室名称快速查找教室使用情况",
    profession: "中南大学专业课程表在线查询，支持按专业名称快速查找专业课程",
  };

  return {
    title: titles[type as keyof typeof titles] || "课表查询 - 绮课",
    description: descriptions[type as keyof typeof descriptions] || "中南大学课程表在线查询",
    keywords: ["中南大学", "课程表", "课表查询", type, "绮课"],
    openGraph: {
      title: titles[type as keyof typeof titles] || "课表查询 - 绮课",
      description: descriptions[type as keyof typeof descriptions] || "中南大学课程表在线查询",
      type: "website",
      locale: "zh_CN",
    },
  };
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { type } = params;
  const { q: initialQuery } = searchParams;

  const validTypes = ["student", "teacher", "location", "profession"];
  if (!validTypes.includes(type)) {
    notFound();
  }

  // 获取类型特定的标题和描述
  const getTypeSpecificInfo = () => {
    switch (type) {
      case 'student':
        return {
          title: "学生课表查询",
          description: "输入学号或姓名查询学生课程表"
        };
      case 'teacher':
        return {
          title: "教师课表查询",
          description: "输入教师姓名查询教师授课表"
        };
      case 'location':
        return {
          title: "教室课表查询",
          description: "输入教室名称查询教室使用情况"
        };
      case 'profession':
        return {
          title: "专业课表查询",
          description: "输入专业名称查询专业课程表"
        };
      default:
        return {
          title: "课表查询",
          description: "输入关键词查询课程表信息"
        };
    }
  };

  const typeInfo = getTypeSpecificInfo();

  return (
    <div className="min-h-screen bg-background pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {typeInfo.title}
          </h1>
          <p className="text-muted-foreground mb-6">
            {typeInfo.description}
          </p>
          
          {/* 搜索区域卡片 */}
          <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-sm border">
            <TypeSpecificSearchBox 
              type={type} 
              initialQuery={initialQuery} 
            />
          </div>
        </div>

        {/* 仅当有初始查询参数时显示课表预览 */}
        {initialQuery && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <TimetableClient terms={[]} title={""} courses={[]} type={type} id={initialQuery} />
          </Suspense>
        )}
      </div>
    </div>
  );
}