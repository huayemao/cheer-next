"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// 配置项类型定义
interface ConfigItem {
  key: string;
  value: any;
  description?: string;
  type: string;
  group: string;
}

// 配置分组定义
const configGroups = {
  general: "基本配置",
  home: "首页配置",
  ads: "广告配置",
  footer: "页脚配置",
  advanced: "高级配置",
};

export function ConfigManagement() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentGroup, setCurrentGroup] = useState("home");
  const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null);
  const [draftConfigs, setDraftConfigs] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // 初始化配置项
  const defaultConfigs: ConfigItem[] = [
    {
      key: "home.showAds",
      value: true,
      description: "是否在首页显示广告轮播",
      type: "boolean",
      group: "home"
    },
    {
      key: "home.maxAdCount",
      value: 5,
      description: "首页最大显示广告数量",
      type: "number",
      group: "home"
    },
    {
      key: "ads.autoRotate",
      value: true,
      description: "是否自动轮播广告",
      type: "boolean",
      group: "ads"
    },
    {
      key: "ads.rotateInterval",
      value: 5000,
      description: "广告轮播间隔时间(毫秒)",
      type: "number",
      group: "ads"
    },
    {
      key: "footer.authors",
      value: [
        { name: "绮课团队", link: "https://github.com/qike-class" }
      ],
      description: "页脚显示的作者信息",
      type: "array",
      group: "footer"
    }
  ];

  useEffect(() => {
    fetchConfigs();
    setDraftConfigs({});
    setHasChanges(false);
  }, [currentGroup]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/config?group=${currentGroup}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const data = await response.json();
      
      // 如果没有配置项，使用默认配置
      if (!Array.isArray(data) || data.length === 0) {
        const groupDefaults = defaultConfigs.filter(config => config.group === currentGroup);
        setConfigs(groupDefaults);
      } else {
        setConfigs(data);
      }
    } catch (error) {
      console.error('获取配置项失败:', error);
      toast.error('获取配置项失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存配置变更到草稿状态
  const saveToDraft = (key: string, value: any) => {
    setDraftConfigs(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // 提交所有更改
  const submitChanges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // 批量提交所有更改的配置项
      for (const [key, value] of Object.entries(draftConfigs)) {
        const config = configs.find(c => c.key === key);
        if (!config) continue;
        
        const response = await fetch(`/api/config/${key}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...config,
            value
          })
        });

        if (response.ok) {
          const updatedConfig = await response.json();
          setConfigs(configs.map(c => c.key === key ? updatedConfig : c));
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || `更新配置项 ${key} 失败`);
          return;
        }
      }
      
      // 清除草稿状态
      setDraftConfigs({});
      setHasChanges(false);
      toast.success('所有配置已更新');
    } catch (error) {
      console.error('提交配置变更失败:', error);
      toast.error('提交配置变更失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消更改
  const cancelChanges = () => {
    setDraftConfigs({});
    setHasChanges(false);
    toast.info('已取消更改');
  };

  const handleConfigChange = (key: string, value: any) => {
    saveToDraft(key, value);
  };

  // 处理数组类型的配置编辑
  const handleArrayItemChange = (configKey: string, index: number, field: string, value: string) => {
    // 获取当前配置值或草稿值
    const currentValue = draftConfigs[configKey] || configs.find(c => c.key === configKey)?.value || [];
    const updatedArray = Array.isArray(currentValue) ? [...currentValue] : [];
    updatedArray[index] = {
      ...updatedArray[index],
      [field]: value
    };
    saveToDraft(configKey, updatedArray);
  };

  // 添加数组项
  const addArrayItem = (configKey: string) => {
    // 获取当前配置值或草稿值
    const config = configs.find(c => c.key === configKey);
    if (!config) return;
    
    const currentValue = draftConfigs[configKey] || config.value || [];
    if (!Array.isArray(currentValue)) return;
    
    let newItem = {};
    // 根据数组中已有的项目结构创建新项目
    if (currentValue.length > 0) {
      // 获取第一个项目的所有键，并初始化为空字符串
      Object.keys(currentValue[0]).forEach(key => {
        newItem = { ...newItem, [key]: '' };
      });
    } else {
      // 如果是空数组，根据配置键推断项目结构
      if (configKey === 'footer.authors') {
        newItem = { name: '', link: '' };
      }
    }
    
    const updatedArray = [...currentValue, newItem];
    saveToDraft(configKey, updatedArray);
  };

  // 删除数组项
  const removeArrayItem = (configKey: string, index: number) => {
    // 获取当前配置值或草稿值
    const config = configs.find(c => c.key === configKey);
    if (!config) return;
    
    const currentValue = draftConfigs[configKey] || config.value || [];
    if (!Array.isArray(currentValue) || currentValue.length <= 1) return;
    
    const updatedArray = currentValue.filter((_, i) => i !== index);
    saveToDraft(configKey, updatedArray);
  };

  const renderConfigInput = (config: ConfigItem) => {
    // 获取当前显示的值（优先使用草稿值）
    const displayValue = draftConfigs[config.key] !== undefined ? draftConfigs[config.key] : config.value;
    
    switch (config.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={config.key}
              checked={Boolean(displayValue)}
              onCheckedChange={(checked) => handleConfigChange(config.key, checked)}
            />
            <Label htmlFor={config.key} className="sr-only">
              {config.description}
            </Label>
          </div>
        );
      case 'number':
        return (
          <Input
            id={config.key}
            type="number"
            value={Number(displayValue)}
            onChange={(e) => handleConfigChange(config.key, Number(e.target.value))}
            className="w-32"
          />
        );
      case 'string':
        return (
          <Input
            id={config.key}
            value={String(displayValue)}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={config.key}
            value={String(displayValue)}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            className="min-h-[100px]"
          />
        );
      case 'array':
        // 确保值是数组
        const arrayValue = Array.isArray(displayValue) ? displayValue : [];
        
        return (
          <div className="w-full">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2 p-2 border rounded-lg">
                {config.key === 'footer.authors' && (
                  <>
                    <div className="flex-1 mr-2">
                      <Label htmlFor={`${config.key}-${index}-name`} className="text-xs">名称</Label>
                      <Input
                        id={`${config.key}-${index}-name`}
                        value={item.name || ''}
                        onChange={(e) => handleArrayItemChange(config.key, index, 'name', e.target.value)}
                        placeholder="作者名称"
                      />
                    </div>
                    <div className="flex-1 mr-2">
                      <Label htmlFor={`${config.key}-${index}-link`} className="text-xs">链接</Label>
                      <Input
                        id={`${config.key}-${index}-link`}
                        value={item.link || ''}
                        onChange={(e) => handleArrayItemChange(config.key, index, 'link', e.target.value)}
                        placeholder="作者链接"
                      />
                    </div>
                  </>
                )}
                {arrayValue.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem(config.key, index)}
                  >
                    删除
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => addArrayItem(config.key)}
              className="mt-2"
            >
              添加
            </Button>
          </div>
        );
      default:
        return (
          <Input
            id={config.key}
            value={String(config.value)}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
          />
        );
    }
  };

  const getConfigDisplayName = (key: string): string => {
    // 从键名生成显示名称，移除前缀部分
    const parts = key.split('.');
    return parts[parts.length - 1]
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>系统配置</CardTitle>
        <CardDescription>管理系统全局配置选项</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentGroup} onValueChange={setCurrentGroup} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            {Object.entries(configGroups).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(configGroups).map((group) => (
            <TabsContent key={group} value={group}>
              {loading ? (
                <div className="py-8 text-center">加载配置中...</div>
              ) : (
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div key={config.key} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-lg border bg-card">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{getConfigDisplayName(config.key)}</h4>
                        {config.description && (
                          <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderConfigInput(config)}
                      </div>
                    </div>
                  ))}
                  
                  {/* 操作按钮 */}
                  {hasChanges && (
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={cancelChanges}
                      >
                        取消
                      </Button>
                      <Button
                        type="button"
                        onClick={submitChanges}
                      >
                        提交更改
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}