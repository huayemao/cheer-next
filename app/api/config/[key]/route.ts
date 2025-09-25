import { NextRequest, NextResponse } from 'next/server'
import { getConfig, setConfig, deleteConfig, getConfigValue } from '@/lib/server/config-service'
import { authAdmin } from '@/lib/server/auth'

/**
 * 获取单个配置项
 * GET /api/config/:key
 */
export async function GET(request: NextRequest, props: { params: Promise<{ key: string }> }) {
  const params = await props.params;
  try {
    const key = params.key
    
    // 检查是否需要管理员权限
    const needAuth = checkIfConfigNeedsAuth(key)
    if (needAuth) {
      const admin = await authAdmin(request)
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    
    const config = await getConfig(key)
    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * 更新配置项
 * POST /api/config/:key
 */
export async function POST(request: NextRequest, props: { params: Promise<{ key: string }> }) {
  const params = await props.params;
  try {
    // 验证管理员权限
    const admin = await authAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const key = params.key
    const data = await request.json()
    
    // 验证请求数据
    if (data.value === undefined || data.value === null || !data.type || !data.group) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const config = await setConfig(key, {
      value: data.value,
      description: data.description,
      type: data.type,
      group: data.group
    })
    
    return NextResponse.json(config, { status: 200 })
  } catch (error: any) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 })
  }
}

/**
 * 删除配置项
 * DELETE /api/config/:key
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ key: string }> }) {
  const params = await props.params;
  try {
    // 验证管理员权限
    const admin = await authAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const key = params.key
    const result = await deleteConfig(key)
    
    if (!result) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * 检查配置项是否需要管理员权限
 * 这里可以根据实际需求定义哪些配置项需要权限
 */
function checkIfConfigNeedsAuth(key: string): boolean {
  // 示例：除了公开配置外，其他都需要权限
  const publicConfigs = ['home.showAds'] // 可根据实际情况扩展
  return !publicConfigs.includes(key)
}