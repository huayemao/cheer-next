import prisma from "@/lib/prisma";
import { getTimetable } from "@/lib/server/service/getTimetable";
import { OwnerType } from "@/lib/types/Owner";
import { Metadata } from "next";
import { Suspense } from "react";

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

// Server component for SEO
async function TimeTableContent({
  type,
  id,
  term,
  grade,
}: {
  type: string;
  id: string;
  term: string;
  grade: string;
}) {
  const {
    courses,
    owner,
    terms,
    grades = [],
  } = await getTimetable(type as OwnerType, id, term, grade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/5 to-secondary/5 relative overflow-hidden pt-16">

      <div className="absolute inset-0 bg-gradient-to-br from-[var(--chart-1)]/25 via-[var(--chart-2)]/20 to-[var(--chart-3)]/25 dark:from-[var(--chart-1)]/35 dark:via-[var(--chart-2)]/30 dark:to-[var(--chart-3)]/35"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[var(--chart-4)]/40 via-transparent to-transparent dark:from-[var(--chart-4)]/50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[var(--chart-5)]/40 via-transparent to-transparent dark:from-[var(--chart-5)]/50"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,var(--tw-gradient-stops))] from-transparent via-[var(--primary)]/15 to-transparent dark:via-[var(--primary)]/25"></div>
      

      <div className="relative w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <ClientTimetable
          terms={terms}
          title={(owner.label || "") + owner.name}
          courses={courses}
          type={type}
          id={id}
          grades={grades}
        />
      </div>
    </div>
  );
}

// Client component wrapper
import dynamic from "next/dynamic";

const ClientTimetable = dynamic(() => import("@/components/timetable-client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-slate-600">加载课表中...</p>
      </div>
    </div>
  ),
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const { slug } = params;
  const [type, id, term, grade] = slug;

  if (decodeURIComponent(type) === "[[...slug]]") {
    return {
      title: "绮课 - 中南大学课程表查询",
      description: "中南大学学生、教师、教室课表查询平台",
    };
  }

  try {
    const { courses, owner, terms } = await getTimetable(
      type as OwnerType,
      id,
      term,
      grade
    );

    const typeMap = {
      student: "学生",
      teacher: "教师",
      location: "教室",
      profession: "专业",
    };
    return {
      title: `${(owner.label || "") + owner.name} - ${
        typeMap[type as keyof typeof typeMap] || ""
      }课表`,
      description: `中南大学${owner.label}${owner.name}${
        term ? `${term}学期` : ""
      }课程表查询，包含${courses.length}门课程信息`,
      keywords: [
        "中南大学",
        "课程表",
        owner.name,
        owner.label,
        term ? `${term}学期` : "",
        typeMap[type as keyof typeof typeMap] || type,
      ],
      openGraph: {
        title: `${owner.name} - ${
          typeMap[type as keyof typeof typeMap] || ""
        }课表`,
        description: `中南大学${owner.label}${owner.name}${
          term ? `${term}学期` : ""
        }课程表`,
        type: "website",
        locale: "zh_CN",
      },
      twitter: {
        card: "summary",
        title: `${owner.name} - ${
          typeMap[type as keyof typeof typeMap] || ""
        }课表`,
        description: `中南大学${owner.label}${owner.name}${
          term ? `${term}学期` : ""
        }课程表`,
      },
    };
  } catch (error) {
    return {
      title: "绮课 - 课程表查询",
      description: "中南大学课程表查询平台",
    };
  }
}

export default async function TimeTablePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { slug } = params;
  const [type, id, term, grade] = slug;

  if (decodeURIComponent(type) === "[[...slug]]") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 mb-2">参数错误</h1>
          <p className="text-slate-500">请检查URL参数是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-600">加载课表中...</p>
          </div>
        </div>
      }
    >
      <TimeTableContent type={type} id={id} term={term} grade={grade} />
    </Suspense>
  );
}
