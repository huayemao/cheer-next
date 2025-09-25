import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User, MapPin, Clock, BookOpen, Users, Calendar, CreditCard, Building, BookMarked, BarChart3, ChevronRight } from 'lucide-react'
import getCourseById from '@/lib/server/service/getCourseById'
import { formatTimeRange } from '@/lib/timeMapping'
import { parseSlot } from '@/lib/client/parseCourseItem'
import prisma from '@/lib/prisma'

// Server component for SEO
async function CourseDetailContent({ id }: { id: string }) {
  const course = await getCourseById(id)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-700">开课不存在</h1>
          <p className="text-slate-500">找不到ID为 {id} 的开课</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  // 按班级分组学生
  const studentsByClass: Record<string, typeof course.enrollments> = {}
  course.enrollments.forEach(enrollment => {
    const className = enrollment.student.className || '未知班级'
    if (!studentsByClass[className]) {
      studentsByClass[className] = []
    }
    studentsByClass[className].push(enrollment)
  })

  const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/5 to-secondary/5 relative overflow-hidden pt-16">
      {/* 现代磨砂质感渐变背景 */}
      <div className="absolute inset-0 bg-[var(--glass-effect)] dark:bg-[var(--glass-dark-effect)]"></div>
      <div className="absolute inset-0 [mask-image:linear-gradient(0deg,white,white/60)] opacity-20 dark:opacity-10"></div>

      <div className="relative w-full max-w-6xl mx-auto p-4 lg:p-6 space-y-8">
        {/* 面包屑导航 */}
        <div className="flex items-center text-sm text-muted-foreground space-x-2">
          <Link href="/" className="hover:text-primary transition-colors">首页</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{course.subject.name}</span>
        </div>

        {/* 课程基本信息卡片 */}
        <Card className="overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    <Link href={`/subjects/${course.subject.id}`}>{course.subject.name}</Link>
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge key="course-id" variant="secondary" className="text-xs">{course.id}</Badge>
                    <Badge key="course-term" variant="secondary" className="text-xs">{course.term}</Badge>
                    <Badge key="course-category" variant="secondary" className="text-xs">{course.subject.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-destructive" />
                  <span className="text-lg font-semibold text-destructive">{course.subject.credit} 学分</span>
                </div>
              </div>

              {/* 课程详情 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* 左侧信息 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-chart-1 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">授课教师</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {course.lessons.flatMap(lesson => lesson.tuition.map(tuition => tuition.teacher)).map((teacher, index, self) => {
                          // 去重
                          if (self.findIndex(t => t.id === teacher.id) === index) {
                            return (
                              <Link
                                key={teacher.id}
                                href={`/table/teacher/${teacher.id}`}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors underline underline-offset-2 text-sm"
                              >
                                {teacher.name}
                              </Link>
                            )
                          }
                          return null
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-chart-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">班级</p>
                      <Link href={`/table/class/${course.className}`} className="text-sm text-muted-foreground underline underline-offset-2">{course.className}</Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-chart-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">开课学院</p>
                      <p className="text-sm text-muted-foreground">{course.subject.department}</p>
                    </div>
                  </div>
                </div>

                {/* 右侧信息 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-chart-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">选课人数</p>
                      <Link href={`#students`} className="text-sm text-muted-foreground underline underline-offset-2">{course.electCount} 人</Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookMarked className="w-5 h-5 text-chart-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">课程性质</p>
                      <p className="text-sm text-muted-foreground">{course.subject.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-chart-2 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">课程代码</p>
                      <p className="text-sm text-muted-foreground">{course.subject.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 上课安排 */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">开课安排</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-chart-5" />
                      <span className="text-sm font-medium text-foreground">{days[parseSlot(lesson.timeSlot).day]} {formatTimeRange(parseSlot(lesson.timeSlot).rowIds)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-chart-3" />
                      <span className="text-sm text-muted-foreground">{lesson.location.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">周次: {lesson.weeks}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {lesson.tuition.map(tuition => (
                      <Badge key={tuition.teacherId + tuition.lessonId} variant="outline" className="text-xs">
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

        {/* 学生列表 */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <h2 id='students' className="text-xl font-bold text-foreground mb-4">选课学生 ({course.enrollments.length} 人)</h2>

            {Object.entries(studentsByClass).map(([className, enrollments]) => (
              <div key={className} className="mb-6 last:mb-0">
                <h3 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {className} ({enrollments.length} 人)
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">序号</TableHead>
                        <TableHead>姓名</TableHead>
                        <TableHead>班级</TableHead>
                        <TableHead>学院</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment, index) => (
                        <TableRow key={enrollment.student.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Link
                              href={`/table/student/${enrollment.student.id}`}
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${enrollment.student.sex === '男' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-pink-100 dark:bg-pink-900/30'}`}>
                                <User className={`w-4 h-4 ${enrollment.student.sex === '男' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`} />
                              </div>
                              <span>{enrollment.student.name}</span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link href={`/table/class/${enrollment.student.className}`} className="hover:text-primary transition-colors ">
                              {enrollment.student.className}
                            </Link>
                          </TableCell>
                          <TableCell>{enrollment.student.facultyName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  try {
    const course = await getCourseById(id);

    if (course) {
      return {
        title: `${course.subject.name} - 开课详情`,
        description: `中南大学${course.subject.name}开课详情，包含课程基本信息、开课安排和选课学生列表`,
        keywords: [
          '中南大学',
          '开课详情',
          course.subject.name,
          course.className,
          course.term
        ],
        openGraph: {
          title: `${course.subject.name} - 开课详情`,
          description: `中南大学${course.subject.name}开课详情，包含课程基本信息、开课安排和选课学生列表`,
          type: 'website',
          locale: 'zh_CN',
        },
        twitter: {
          card: 'summary',
          title: `${course.subject.name} - 开课详情`,
          description: `中南大学${course.subject.name}开课详情，包含课程基本信息、开课安排和选课学生列表`,
        }
      };
    }
  } catch (error) {
    console.error('Error generating metadata for course:', error);
  }

  return {
    title: '开课详情 - 绮课',
    description: '中南大学开课详情页面'
  };
}

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600">加载开课详情中...</p>
        </div>
      </div>
    }>
      <CourseDetailContent id={id} />
    </Suspense>
  );
}