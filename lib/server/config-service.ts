import prisma from '@/lib/prisma'
import type { Configuration } from '@prisma/client'

/**
 * 配置服务 - 处理系统配置的CRUD操作
 */
export interface ConfigItem {
  key: string
  value: any
  description?: string
  type: string
  group: string
}

export interface ConfigUpdate {
  value?: any
  description?: string
  type?: string
  group?: string
}

/**
 * 获取单个配置项
 * @param key 配置项键名
 * @returns 配置项对象或null
 */
export async function getConfig(key: string): Promise<ConfigItem | null> {
  const config = await prisma.configuration.findUnique({
    where: { key }
  })

  if (!config) return null

  return {
    key: config.key,
    value: config.value,
    description: config.description || undefined,
    type: config.type,
    group: config.group
  }
}

/**
 * 获取配置项的值
 * @param key 配置项键名
 * @param defaultValue 默认值
 * @returns 配置项的值或默认值
 */
export async function getConfigValue<T = any>(key: string, defaultValue?: T): Promise<T> {
  const config = await getConfig(key)

  if (!config) {
    return defaultValue as T
  }

  // 根据配置项类型进行类型转换
  try {
    return convertConfigValue<T>(config.value, config.type)
  } catch (error) {
    console.error(`配置项 ${key} 类型转换失败:`, error)
    return defaultValue as T
  }
}

/**
 * 获取多个配置项
 * @param keys 配置项键名数组
 * @returns 配置项对象映射
 */
export async function getConfigs(keys: string[]): Promise<Record<string, ConfigItem>> {
  const configs = await prisma.configuration.findMany({
    where: {
      key: {
        in: keys
      }
    }
  })

  const result: Record<string, ConfigItem> = {}
  configs.forEach(config => {
    result[config.key] = {
      key: config.key,
      value: config.value,
      description: config.description || undefined,
      type: config.type,
      group: config.group
    }
  })

  return result
}

/**
 * 获取分组下的所有配置项
 * @param group 配置项分组
 * @returns 配置项数组
 */
export async function getConfigsByGroup(group: string): Promise<ConfigItem[]> {
  const configs = await prisma.configuration.findMany({
    where: { group },
    orderBy: { key: 'asc' }
  })

  return configs.map(config => ({
    key: config.key,
    value: config.value,
    description: config.description || undefined,
    type: config.type,
    group: config.group
  }))
}

/**
 * 创建或更新配置项
 * @param key 配置项键名
 * @param data 配置项数据
 * @returns 更新后的配置项
 */
export async function setConfig(key: string, data: Omit<ConfigItem, 'key'>): Promise<ConfigItem> {
  // 验证数据类型
  if (!validateConfigType(data.value, data.type)) {
    throw new Error(`配置项 ${key} 的值类型与指定类型不匹配`)
  }

  const config = await prisma.configuration.upsert({
    where: { key },
    update: {
      value: data.value,
      description: data.description,
      type: data.type,
      group: data.group
    },
    create: {
      key,
      value: data.value,
      description: data.description,
      type: data.type,
      group: data.group
    }
  })

  return {
    key: config.key,
    value: config.value,
    description: config.description || undefined,
    type: config.type,
    group: config.group
  }
}

/**
 * 批量创建或更新配置项
 * @param configs 配置项数组
 * @returns 操作结果
 */
export async function batchSetConfigs(configs: ConfigItem[]): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {}

  for (const config of configs) {
    try {
      await setConfig(config.key, {
        value: config.value,
        description: config.description,
        type: config.type,
        group: config.group
      })
      result[config.key] = true
    } catch (error) {
      console.error(`配置项 ${config.key} 处理失败:`, error)
      result[config.key] = false
    }
  }

  return result
}

/**
 * 删除配置项
 * @param key 配置项键名
 * @returns 删除结果
 */
export async function deleteConfig(key: string): Promise<boolean> {
  try {
    await prisma.configuration.delete({
      where: { key }
    })
    return true
  } catch (error) {
    console.error(`删除配置项 ${key} 失败:`, error)
    return false
  }
}

/**
 * 配置项类型转换
 * @param value 原始值
 * @param type 目标类型
 * @returns 转换后的值
 */
function convertConfigValue<T>(value: any, type: string): T {
  // 尝试进行类型转换
  switch (type) {
    case 'boolean':
      return (typeof value === 'string'
        ? (value.toLowerCase() === 'true' || value === '1')
        : Boolean(value)) as unknown as T
    case 'number':
      return Number(value) as unknown as T
    case 'string':
      return String(value) as unknown as T
    case 'array':
      return (Array.isArray(value) ? value : JSON.parse(value)) as unknown as T
    case 'object':
      return (typeof value === 'object' && value !== null ? value : JSON.parse(value)) as unknown as T
    default:
      return value as T
  }
}

/**
 * 验证配置项类型是否匹配
 * @param value 配置值
 * @param type 配置类型
 * @returns 是否匹配
 */
function validateConfigType(value: any, type: string): boolean {
  try {
    const convertedValue = convertConfigValue(value, type)

    switch (type) {
      case 'boolean':
        return typeof convertedValue === 'boolean'
      case 'number':
        return typeof convertedValue === 'number' && !isNaN(convertedValue)
      case 'string':
        return typeof convertedValue === 'string'
      case 'array':
        return Array.isArray(convertedValue)
      case 'object':
        return typeof convertedValue === 'object' && convertedValue !== null && !Array.isArray(convertedValue)
      default:
        return true
    }
  } catch (error) {
    return false
  }
}

export async function getSiteUrl(): Promise<string> {
  return await getConfigValue("general.siteUrl") || process.env.NEXT_PUBLIC_SITE_URL || 'https://qike.site'
}