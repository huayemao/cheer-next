// 配置项类型定义
export interface ConfigItem {
  key: string;
  value: any;
  description?: string;
  type: string;
  group: string;
}

// 默认配置项
export const defaultConfigs: ConfigItem[] = [
  // 基本配置
  {
    key: "general.siteUrl",
    value: "https://qike.site",
    description: "网站的完整地址，例如 https://qike.site",
    type: "string",
    group: "general"
  },
  {
    key: "general.siteName",
    value: "绮课",
    description: "网站名称",
    type: "string",
    group: "general"
  },
  {
    key: "general.maintenanceMode",
    value: false,
    description: "是否开启维护模式",
    type: "boolean",
    group: "general"
  },

  // 首页配置
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

  // 广告配置
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

  // 页脚配置
  {
    key: "footer.authors",
    value: [
      { name: "花野猫", link: "https://huayemao.run" },
      { name: "SteamFinder", link: "https://github.com/SteamFinder" },
      { name: "grtsinry43", link: "https://github.com/grtsinry43" }
    ],
    description: "页脚显示的作者信息列表",
    type: "array",
    group: "footer"
  },

  // 安全配置
  {
    key: "security.enableCaptcha",
    value: true,
    description: "是否启用验证码",
    type: "boolean",
    group: "security"
  },
  {
    key: "security.captchaExpiry",
    value: 300,
    description: "验证码有效期(秒)",
    type: "number",
    group: "security"
  },
  {
    key: "security.captchaLength",
    value: 4,
    description: "验证码长度",
    type: "number",
    group: "security"
  },
  {
    key: "security.rateLimitEnabled",
    value: true,
    description: "是否启用速率限制",
    type: "boolean",
    group: "security"
  },
  {
    key: "security.rateLimitRequests",
    value: 10,
    description: "速率限制请求数",
    type: "number",
    group: "security"
  },
  {
    key: "security.rateLimitDuration",
    value: 60,
    description: "速率限制时间窗口(秒)",
    type: "number",
    group: "security"
  }
];
