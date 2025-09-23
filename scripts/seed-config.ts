import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 默认配置项
const defaultConfigs = [
  // 作者信息配置
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
  {
    key: "home.showAds",
    value: false,
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
]

/**
 * 初始化系统配置
 */
async function seedConfig() {
  try {
    console.log('开始初始化系统配置...')
    
    // 检查并创建配置项
    for (const config of defaultConfigs) {
      // 检查配置是否已存在
      const existingConfig = await prisma.configuration.findUnique({
        where: { key: config.key }
      })
      
      if (existingConfig) {
        console.log(`配置项 ${config.key} 已存在，跳过创建`)
      } else {
        // 创建新的配置项
        await prisma.configuration.create({
          data: {
            key: config.key,
            value: config.value,
            description: config.description,
            type: config.type,
            group: config.group
          }
        })
        console.log(`配置项 ${config.key} 创建成功`)
      }
    }
    
    console.log('系统配置初始化完成')
  } catch (error) {
    console.error('系统配置初始化失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行初始化脚本
seedConfig()
