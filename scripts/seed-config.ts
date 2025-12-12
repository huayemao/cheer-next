import { PrismaClient } from '@prisma/client'
import { defaultConfigs } from '../lib/config/default-configs'

const prisma = new PrismaClient()

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
