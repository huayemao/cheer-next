"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, Calendar, Search, Home, Users, Palette, Moon, Sun, MessageCircle, BookOpen } from "lucide-react";
import { SearchDialog } from "@/components/search/search-dialog";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ThemeSelector } from "@/components/theme-selector";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [versionInfo, setVersionInfo] = useState({ gitHash: 'dev', buildDate: '' });

  // 在客户端获取版本信息
  React.useEffect(() => {
    async function fetchVersionInfo() {
      try {
        const response = await fetch('/version.json');
        if (response.ok) {
          const data = await response.json();
          setVersionInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch version info:', error);
      }
    }
    fetchVersionInfo();
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl min-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 justify-around items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  绮课
                </span>
              </Link>

            </div>

            <NavigationMenu className="ml-auto">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" className={navigationMenuTriggerStyle() + ' bg-transparent'}>
                    <Home className="w-4 h-4 mr-2" />
                    首页
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group bg-transparent">
                    <Search className="w-4 h-4 mr-2" />
                    课表查询
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="animate-in fade-in zoom-in-95 duration-150 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95">
                    <div className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-2 bg-background">
                      <div className="row-span-3">
                        <SearchDialog
                          customTrigger={
                            <div className="flex h-full w-full select-none cursor-pointer flex-col justify-end rounded-md gradient-blue-lavender p-6 no-underline outline-none transition-all duration-300 hover:shadow-lg focus:shadow-lg">
                              <div className="mb-2 mt-4 text-lg font-medium text-white">
                                快速查询
                              </div>
                              <p className="text-sm leading-tight text-white/90">
                                输入学号、姓名或教室名称，快速查找课表信息
                              </p>
                            </div>
                          }
                        />
                      </div>
                      <NavigationMenuLink asChild>
                        <a
                          href="/search/student"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-accent-foreground focus:bg-secondary focus:text-secondary-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            学生课表
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            按学号或姓名查询学生个人课表
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a
                          href="/search/teacher"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-accent-foreground focus:bg-secondary focus:text-secondary-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            教师课表
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            查询教师授课安排
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a
                          href="/search/location"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-accent-foreground focus:bg-secondary focus:text-secondary-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            教室课表
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            查看教室使用安排
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a
                          href="/search/profession"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-accent-foreground focus:bg-secondary focus:text-secondary-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            专业课表
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            查询专业课程安排
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/department" className={navigationMenuTriggerStyle() + " bg-transparent"}>
                    <Users className="w-4 h-4 mr-2" />
                    院系列表
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/discovery" className={navigationMenuTriggerStyle() + " bg-transparent"}>
                    <Palette className="w-4 h-4 mr-2" />
                    数据发现
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/subjects" className={navigationMenuTriggerStyle() + " bg-transparent"}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    课程查询
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/blog" className={navigationMenuTriggerStyle() + " bg-transparent"}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    博客
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="mr-2">
              <SearchDialog />
            </div>
            <div className="flex items-center space-x-2">
              <ThemeSelector />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">切换暗黑模式</span>
              </Button>
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              版本： {versionInfo.buildDate}-{versionInfo.gitHash}
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50  backdrop-blur-md border-b border-white/20 shadow-sm bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                绮课
              </span>
            </Link>


            <div className="flex items-center space-x-2">
              <SearchDialog />
              <ThemeSelector />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">切换暗黑模式</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden backdrop-blur-md border-t border-white/20 bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/search/student"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                学生课表
              </Link>
              <Link
                href="/search/teacher"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                教师课表
              </Link>
              <Link
                href="/search/location"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                教室课表
              </Link>
              <Link
                href="/department"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                院系列表
              </Link>
              <Link
                href="/discovery"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                数据发现
              </Link>
              <Link
                href="/subjects"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                课程查询
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                博客
              </Link>
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              版本： {versionInfo.buildDate}-{versionInfo.gitHash}
            </span>
          </div>
        )}
      </nav>


    </>
  );
}

// ListItem component for navigation
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
