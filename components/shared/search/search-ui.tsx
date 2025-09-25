import { Search, X, User, Users, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchUIProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  hasSearched: boolean;
  filteredResults: any[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleResultSelect: (result: any) => void;
  clearSearch: () => void;
  getIconForType: (type: string) => React.ReactNode;
  getTypeLabel: (type: string) => string;
  typeSpecificText: {
    placeholder: string;
    description: string;
  };
  showTabs?: boolean;
  compact?: boolean;
}

export function SearchUI({
  searchQuery,
  setSearchQuery,
  isLoading,
  hasSearched,
  filteredResults,
  activeTab = 'all',
  setActiveTab,
  searchInputRef,
  handleSearch,
  handleKeyPress,
  handleResultSelect,
  clearSearch,
  getIconForType,
  getTypeLabel,
  typeSpecificText,
  showTabs = false,
  compact = false
}: SearchUIProps) {
  return (
    <>
      <div className="relative">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={typeSpecificText.placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full pr-12 ${compact ? 'text-base' : 'text-lg'} bg-gradient-to-r from-background via-background to-secondary/10 border-2 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl`}
        />

        <Button
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>

        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">清除</span>
          </Button>
        )}
      </div>

      {/* 标签页（仅在showTabs为true时显示） */}
      {showTabs && setActiveTab && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mt-4 gap-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3">
              全部
            </TabsTrigger>
            <TabsTrigger value="student" className="text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3">
              <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 mr-0 sm:mr-1" />
              <span className="hidden sm:inline">学生</span>
            </TabsTrigger>
            <TabsTrigger value="teacher" className="text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 mr-0 sm:mr-1" />
              <span className="hidden sm:inline">教师</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 mr-0 sm:mr-1" />
              <span className="hidden sm:inline">教室</span>
            </TabsTrigger>
            <TabsTrigger value="profession" className="text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 mr-0 sm:mr-1" />
              <span className="hidden sm:inline">专业</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {hasSearched && renderSearchResults()}
          </TabsContent>
        </Tabs>
      )}

      {/* 搜索结果区域（不在标签页中显示时） */}
      {hasSearched && !showTabs && renderSearchResults()}
    </>
  );

  // 渲染搜索结果的辅助函数
  function renderSearchResults() {
    return (
      <div className="mt-4 border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">
            <Loader2 className="inline h-5 w-5 animate-spin mr-2" />
            正在搜索，请稍候...
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {filteredResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultSelect(result)}
                className={`px-6 py-4 hover:bg-secondary/30 cursor-pointer flex items-center justify-between transition-colors ${compact ? '' : 'border-b border-border last:border-0'}`}
              >
                <div className="text-left flex items-center">
                  {getIconForType(result.type)}
                  <div>
                    <div className="font-medium text-foreground">{result.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.label || ''} • {getTypeLabel(result.type)}
                    </div>
                  </div>
                </div>
                {!compact && (
                  <Button variant="ghost" size="sm">
                    查看课表
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">未找到相关结果</p>
            <p className="mt-2 text-sm">请尝试其他关键词或检查拼写</p>
          </div>
        )}
      </div>
    );
  }
}