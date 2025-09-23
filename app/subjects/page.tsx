'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, BookOpen, Building, CreditCard, Tag, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SubjectCard } from '@/components/subject-card';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { PageHeader } from '@/components/layout/page-header';

export default function SubjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || 'all');
  const [credit, setCredit] = useState(searchParams.get('credit') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [isPublicElective, setIsPublicElective] = useState(searchParams.get('public') === 'true');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>(['all']);
  const [credits, setCredits] = useState<number[]>([0]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(false);

  // 防抖搜索
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 检测是否为移动设备
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        // 通过API获取筛选选项数据
        const response = await fetch('/api/filter-options');
        if (!response.ok) {
          throw new Error('获取筛选选项数据失败');
        }
        const filterOptions = await response.json();

        // 设置筛选选项
        setDepartments(['all', ...filterOptions.departments]);
        setCategories(['all', ...filterOptions.categories]);
        setCredits(filterOptions.credits);
      } catch (error) {
        console.error('初始化数据失败:', error);
      }
    };

    initializeData();
  }, []);

  // 加载课程数据
  const loadSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      // 构建查询参数
      const searchParams = new URLSearchParams();
      searchParams.append('q', debouncedSearchQuery);
      searchParams.append('departmentName', department === 'all' ? '' : department);
      searchParams.append('publicElectiveOnly', isPublicElective ? 'true' : 'false');
      if (credit !== 'all') searchParams.append('credit', credit);
      searchParams.append('category', category === 'all' ? '' : category);
      searchParams.append('page', String(currentPage));
      searchParams.append('pageSize', String(itemsPerPage));

      // 调用 API 获取课程数据
      const response = await fetch(`/api/subjects?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('获取课程数据失败');
      }
      const data = await response.json();

      setSubjects(data.subjects);
      setTotalCount(data.total);
    } catch (error) {
      console.error('加载课程数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, department, credit, category, isPublicElective, currentPage, itemsPerPage]);

  // 计算活跃筛选条件
  const hasActiveFilters = useMemo(() => {
    return department !== 'all' ||
           credit !== 'all' ||
           category !== 'all' ||
           isPublicElective ||
           debouncedSearchQuery !== '';
  }, [department, credit, category, isPublicElective, debouncedSearchQuery]);

  // 同步活跃筛选状态
  useEffect(() => {
    setActiveFilters(hasActiveFilters);
  }, [hasActiveFilters]);

  // 筛选条件变化时重置分页并加载数据
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, department, credit, category, isPublicElective]);

  // 加载数据（筛选条件或分页变化时）
  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // 更新URL参数
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (department !== 'all') params.set('department', department);
    if (credit !== 'all') params.set('credit', credit);
    if (category !== 'all') params.set('category', category);
    if (isPublicElective) params.set('public', 'true');

    const searchString = params.toString();
    router.push(`/subjects${searchString ? `?${searchString}` : ''}`, {
      scroll: false,
    });
  }, [searchQuery, department, credit, category, isPublicElective, router]);

  // 重置所有筛选条件
  const resetFilters = () => {
    setSearchQuery('');
    setDepartment('all');
    setCredit('all');
    setCategory('all');
    setIsPublicElective(false);
    setCurrentPage(1);
  };

  // 计算总页数
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 渲染分页按钮
  const renderPagination = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <Button
          key="first"
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(1)}
          className="mr-1"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis-start" className="inline-flex items-center justify-center h-9 px-2 text-sm">...</span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={i === currentPage ? "mr-1" : "mr-1"}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis-end" className="inline-flex items-center justify-center h-9 px-2 text-sm">...</span>
        );
      }
      pageButtons.push(
        <Button
          key="last"
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          className="ml-1"
        >
          {totalPages}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center mt-6 space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="mr-2"
        >
          上一页
        </Button>
        {pageButtons}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="ml-2"
        >
          下一页
        </Button>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background relative pt-16">
      <div className="absolute inset-0 bg-[var(--glass-effect)] dark:bg-[var(--glass-dark-effect)]"></div>
      <div className="relative z-10">
        {/* 页面标题 */}
        <PageHeader
          title="课程查询"
          description="探索中南大学的所有课程，按照不同维度筛选，找到您感兴趣的学习内容"
        />


        {/* 主要内容区 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 搜索栏 */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="搜索课程名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg bg-card border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* 活跃筛选条件 和 筛选面板组合 */}
          <div className="mb-8">
            {/* 筛选按钮和活跃条件 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  variant="default"
                  className="flex items-center gradient-blue-lavender hover:opacity-90 text-white"
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    筛选条件
                    {activeFilters && (
                      <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">
                        已选
                      </Badge>
                    )}
                  </div>
                  {isFilterExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {isMobile && isFilterExpanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="ml-2"
                  >
                    重置
                  </Button>
                )}
              </div>
            </div>



            {/* 筛选面板 */}
            {isFilterExpanded && (
              <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    筛选条件
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* 活跃筛选条件 */}
                  {activeFilters && (
                    <div className="p-4 bg-card rounded-lg border border-border shadow-md mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center text-sm font-medium text-muted-foreground mr-2">
                          <Filter className="h-4 w-4 mr-1" /> 已选条件:
                        </div>
                        {department !== 'all' && (
                          <Badge variant="secondary" className="gap-1">
                            院系: {department}
                            <button onClick={() => setDepartment('all')} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {credit !== 'all' && (
                          <Badge variant="secondary" className="gap-1">
                            学分: {credit}
                            <button onClick={() => setCredit('all')} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {category !== 'all' && (
                          <Badge variant="secondary" className="gap-1">
                            类别: {category}
                            <button onClick={() => setCategory('all')} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {isPublicElective && (
                          <Badge variant="secondary" className="gap-1">
                            公共选修课
                            <button onClick={() => setIsPublicElective(false)} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {searchQuery && (
                          <Badge variant="secondary" className="gap-1">
                            搜索: {searchQuery}
                            <button onClick={() => setSearchQuery('')} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                        >
                          清除全部
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* 院系筛选 */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium">
                      <Building className="h-4 w-4 mr-2 text-primary" />
                      院系
                    </div>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择院系" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept === 'all' ? '全部院系' : dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* 学分筛选 */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium">
                      <CreditCard className="h-4 w-4 mr-2 text-primary" />
                      学分
                    </div>
                    <Select value={credit} onValueChange={setCredit}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择学分" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部学分</SelectItem>
                        {credits
                          .filter(c => c > 0)
                          .map(cred => (
                            <SelectItem key={cred} value={cred.toString()}>
                              {cred} 学分
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* 课程类别筛选 */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium">
                      <Tag className="h-4 w-4 mr-2 text-primary" />
                      课程类别
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择课程类别" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat === 'all' ? '全部类别' : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* 公共选修课筛选 */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="public-elective"
                      checked={isPublicElective}
                      onCheckedChange={(checked) => setIsPublicElective(checked as boolean)}
                    />
                    <label
                      htmlFor="public-elective"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      仅显示公共选修课
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 border-t border-border hidden sm:flex">
                  <Button variant="ghost" onClick={resetFilters} className="w-full">
                    重置筛选条件
                  </Button>
                </CardFooter>
              </Card>
            )}


          </div>

          {/* 筛选和结果区域 */}
          <div className="grid grid-cols-1 gap-8">
            {/* 课程列表 */}
            <div className="space-y-6">
              {isLoading ? (
                // 加载状态 - 骨架屏
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden transition-all duration-300 border-0 shadow-md bg-white dark:bg-card animate-pulse">
                      {/* 顶部渐变条 - 绝对定位 */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"></div>
                      
                      <CardHeader className="pt-6 pb-4 relative">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            {/* 两行标题 - 模拟课程名称 */}
                            <Skeleton className="h-5 w-full mb-1 bg-gray-100 dark:bg-gray-800" />
                            <Skeleton className="h-5 w-2/3 mb-1 bg-gray-100 dark:bg-gray-800" />
                            {/* 课程代码 - 固定宽度模拟编号 */}
                            <Skeleton className="h-4 w-24 mt-1 bg-gray-100 dark:bg-gray-800" />
                          </div>
                          {/* 徽章占位符 - 有些卡片有，有些没有 */}
                          {index % 3 === 0 && (
                            <Skeleton className="h-6 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30" />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pb-4">
                        {/* 院系信息 */}
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded bg-blue-100 dark:bg-blue-900/30 shrink-0" />
                          <Skeleton className="h-4 w-32 bg-gray-100 dark:bg-gray-800" />
                        </div>
                        
                        {/* 学分信息 */}
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/30 shrink-0" />
                          <Skeleton className="h-4 w-14 bg-gray-100 dark:bg-gray-800" />
                        </div>
                        
                        {/* 课程类别 - 有条件显示 */}
                        {index % 2 === 0 && (
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded bg-purple-100 dark:bg-purple-900/30 shrink-0" />
                            <Skeleton className="h-4 w-28 bg-gray-100 dark:bg-gray-800" />
                          </div>
                        )}
                        
                        {/* 学时信息 */}
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded bg-orange-100 dark:bg-orange-900/30 shrink-0" />
                          <Skeleton className="h-4 w-16 bg-gray-100 dark:bg-gray-800" />
                        </div>
                        
                        {/* 班级数量 */}
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded bg-pink-100 dark:bg-pink-900/30 shrink-0" />
                          <Skeleton className="h-4 w-18 bg-gray-100 dark:bg-gray-800" />
                        </div>
                      </CardContent>

                      <Separator className="my-1" />

                      <CardFooter className="flex justify-between items-center px-6">
                        <Skeleton className="h-3 w-24 bg-gray-100 dark:bg-gray-800" />
                        <Skeleton className="h-8 w-18 rounded bg-blue-100 dark:bg-blue-900/30" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : subjects.length > 0 ? (
                // 显示课程列表
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              ) : (
                // 无结果状态
                <Card className="text-center border-0 shadow-md overflow-hidden">
                  <CardContent className="pt-16 pb-16 px-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">未找到相关课程</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                      尝试调整筛选条件或搜索关键词，以获取更多课程结果
                    </p>
                    <Button
                      onClick={resetFilters}
                      className="mt-6 gradient-blue-lavender hover:opacity-90 text-white"
                    >
                      重置筛选条件
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* 分页控制 */}
              {!isLoading && totalCount > itemsPerPage && renderPagination()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}