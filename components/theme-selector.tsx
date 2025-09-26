'use client';

import React from 'react';
import { Palette, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { themeList } from '@/lib/theme-config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { theme, setTheme, } = useTheme();

  return (
    <DropdownMenu>
      <Button asChild variant="outline" size="icon" className="relative">
        <DropdownMenuTrigger>
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">选择主题</span>
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>主题设置</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>颜色主题</DropdownMenuLabel>

        {themeList.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.name}
            onClick={() => setTheme(themeOption.name)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: themeOption.colors.primary }}
              />
              <span>{themeOption.label}</span>
            </div>
            {theme === themeOption.name && (
              <div className="h-2 w-2 rounded-full bg-current" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeSelectorMinimal() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {themeList.map((themeOption) => (
        <button
          key={themeOption.name}
          onClick={() => setTheme(themeOption.name)}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-md transition-all",
            theme === themeOption.name
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          )}
          title={themeOption.label}
        >
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: themeOption.colors.primary }}
          />
        </button>
      ))}
    </div>
  );
}