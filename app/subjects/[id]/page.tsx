import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Building, CreditCard, ChevronRight, Calendar, Users, Clock, MapPin, Filter } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatTimeRange } from '@/lib/timeMapping'
import { parseSlot } from '@/lib/client/parseCourseItem'

// Server component for SEO
async function SubjectDetailContent({ id }: { id: string }) {
  // 获取课程详情
  const subject = await prisma.subject.findUnique({
    where: {
      id
    },
    include: {
      courses: {
        include: {
          lessons: {
            include: {
              location: true,
              tuition: {
                include: {
                  teacher: true
                }
              }
            }
          }
        },
        orderBy: {
          term: 'desc'
        }
      }
    }
  })
  
  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-700">课程不存在</h1>
          <p className="text-slate-500">找不到ID为 {id} 的课程</p>
          <Link href="/subjects" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
            返回课程列表
          </Link>
        </div>
      </div>
    )
  }
  
  // 按学期分组开课
  const coursesByTerm: Record<string, typeof subject.courses> = {}
  subject.courses.forEach(course => {
    const term = course.term
    if (!coursesByTerm[term]) {
      coursesByTerm[term] = []
    }
    coursesByTerm[term].push(course)
  })
  
  const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* 现代磨砂质感渐变背景 */}
      <div className="absolute inset-0 bg-[var(--glass-effect)] dark:bg-[var(--glass-dark-effect)]"></div>
      <div className="absolute inset-0 [mask-image:linear-gradient(0deg,white,white/60)] opacity-20 dark:opacity-10"></div>

      <div className="relative w-full max-w-6xl mx-auto p-4 lg:p-6 space-y-8">
        {/* 面包屑导航 */}
        <div className="flex items-center text-sm text-muted-foreground space-x-2">
          <Link href="/" className="hover:text-primary transition-colors">首页</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/subjects" className="hover:text-primary transition-colors">课程列表</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{subject.name}</span>
        </div>

        {/* 课程基本信息卡片 */}
        <Card className="overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{subject.name}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge key="subject-id" variant="secondary" className="text-xs">{subject.id}</Badge>
                    <Badge key="subject-category" variant="secondary" className="text-xs">{subject.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-destructive" />
                  <span className="text-lg font-semibold text-destructive">{subject.credit} 学分</span>
                </div>
              </div>

              {/* 课程详情 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-chart-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">开课学院</p>
                      <p className="text-sm text-muted-foreground">{subject.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-chart-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">课程代码</p>
                      <p className="text-sm text-muted-foreground">{subject.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-chart-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">总开课次数</p>
                      <p className="text-sm text-muted-foreground">{subject.courses.length} 次</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Filter className="w-5 h-5 text-chart-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">课程性质</p>
                      <p className="text-sm text-muted-foreground">{subject.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 开课列表 */}
        {Object.entries(coursesByTerm).length > 0 && (
          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">开课列表</h2>
              
              {Object.entries(coursesByTerm).map(([term, courses]) => (
                <div key={term} className="mb-8 last:mb-0">
                  <h3 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {term} ({courses.length} 个开课)
                  </h3>
                  
                  <div className="space-y-4">
                    {courses.map(course => (
                      <Link
                        key={course.id}
                        href={`/course/${course.id}`}
                        className="block group"
                      >
                        <Card className="overflow-hidden transition-all hover:border-primary/30">
                          <div className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{course.id}</Badge>
                                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                  {course.className}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-chart-4" />
                                <span className="text-sm text-muted-foreground">选课人数: {course.electCount}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {course.lessons.map((lesson, index) => (
                                <div key={lesson.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-chart-5" />
                                    <span className="text-sm">{days[parseSlot(lesson.timeSlot).day]} {formatTimeRange(parseSlot(lesson.timeSlot).rowIds)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-chart-3" />
                                    <span className="text-sm text-muted-foreground">{lesson.location.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    <span className="text-sm text-muted-foreground">周次: {lesson.weeks}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {lesson.tuition.map(tuition => (
                                      <Badge key={tuition.teacherId+tuition.lessonId} variant="outline" className="text-xs">
                                        {tuition.teacher.name}
                                      </Badge>
                                    ))}
                                    {lesson.weekFreq === 1 && <Badge key="odd-week" variant="outline" className="text-xs">单周</Badge>}
                                    {lesson.weekFreq === 2 && <Badge key="even-week" variant="outline" className="text-xs">双周</Badge>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id
      }
    });
    
    if (subject) {
      return {
        title: `${subject.name} - 课程详情`,
        description: `中南大学${subject.name}课程详情，包含课程基本信息和相关开课列表`,
        keywords: [
          '中南大学',
          '课程详情',
          subject.name,
          subject.department,
          subject.category
        ],
        openGraph: {
          title: `${subject.name} - 课程详情`,
          description: `中南大学${subject.name}课程详情，包含课程基本信息和相关开课列表`,
          type: 'website',
          locale: 'zh_CN',
        },
        twitter: {
          card: 'summary',
          title: `${subject.name} - 课程详情`,
          description: `中南大学${subject.name}课程详情，包含课程基本信息和相关开课列表`,
        }
      };
    }
  } catch (error) {
    console.error('Error generating metadata for subject:', error);
  }

  return {
    title: '课程详情 - 绮课',
    description: '中南大学课程详情页面'
  };
}

export default async function SubjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600">加载课程详情中...</p>
        </div>
      </div>
    }>
      <SubjectDetailContent id={id} />
    </Suspense>
  );
}