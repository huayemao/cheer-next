import { NextRequest, NextResponse } from 'next/server'
import { generateCaptcha, verifyCaptcha } from '@/lib/server/captcha-service'

/**
 * GET /api/captcha
 * 生成验证码
 */
export async function GET(request: NextRequest) {
  try {
    // 生成验证码
    const { token, pngBase64 } = await generateCaptcha()
    
    // 返回验证码图片和token，并设置缓存控制头防止缓存
    return NextResponse.json({
      token,
      pngBase64
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('生成验证码失败:', error)
    return NextResponse.json(
      { error: '生成验证码失败' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  }
}

