import { Metadata } from 'next';
import Link from 'next/link';
import { getProfessionsByDepartmentName } from '@/lib/server/service/profession';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// 生成页面元数据
export async function generateMetadata(props: { params: Promise<{ department: string }> }): Promise<Metadata> {
  const params = await props.params;
  const department = decodeURIComponent(params.department);

  return {
    title: `${department}专业列表 - 绮课`,
    description: `${department}下的所有专业信息和课表查询入口`,
    keywords: ['中南大学', department, '专业', '课程表', '绮课'],
  };
}

// 主页面组件
export default async function ProfessionsPage(props: { params: Promise<{ department: string }> }) {
  const params = await props.params;
  const department = decodeURIComponent(params.department);

  try {
    // 获取该系下的所有专业
    const professions = await getProfessionsByDepartmentName(department);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/5 to-secondary/5 relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,var(--chart-3)/30,transparent_50%),radial-gradient(circle_at_80%_20%,var(--chart-5)/30,transparent_50%),radial-gradient(circle_at_40%_40%,var(--chart-1)/20,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,white/60)] opacity-30"></div>
        <div className="relative w-full max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
          {/* 返回按钮 */}
          <Link href="/department" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回院系列表
          </Link>

          {/* 页面标题 */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary   to-secondary bg-clip-text text-transparent">
              {department}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              选择您感兴趣的专业，查看该专业的课程表
            </p>
          </div>

          {/* 专业列表 */}
          <div className="grid grid-cols-1 gap-6">
            {professions.map((profession) => {
              // 计算该专业的总人数
              const totalStudents = profession.grades.reduce((sum, grade) => sum + (grade.studentCount || 0), 0);
              
              // 生成唯一的 accordion ID
              const accordionId = `accordion-${profession.professionName.replace(/\s+/g, '-').toLowerCase()}`;

              return (
                <div key={`${profession.professionName}-${department}`} className="bg-card backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Accordion type="multiple"  className="w-full">
                    <AccordionItem value={accordionId} className="border-b-0">
                      <AccordionTrigger className="py-0 hover:no-underline">
                        <div className="flex items-center justify-between w-full gap-3">
                          <h2 className="text-xl font-bold text-foreground truncate flex-1">{profession.professionName}</h2>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 text-sm">
                              {totalStudents}人
                            </span>
                            <span className="text-muted-foreground text-sm">({profession.grades.length}个年级)</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {/* 显示各年级人数和课表链接 */}
                        <div className="space-y-2 mt-2">
                          {profession.grades.map((grade) => (
                            <div key={grade.grade} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/30 transition-colors">
                              <Link
                                href={`/table/profession/${encodeURIComponent(profession.professionName)}-${grade.grade}`} className="underline underline-offset-2 text-muted-foreground hover:text-primary transition-colors">{grade.grade}级
                              </Link>
                              <span className="font-medium">{grade.studentCount}人</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('获取专业信息失败:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">无法获取专业信息</h1>
          <p className="text-muted-foreground mb-6">请检查院系名称是否正确，或稍后再试</p>
          <Link href="/department" className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            返回院系列表
          </Link>
        </div>
      </div>
    );
  }
}