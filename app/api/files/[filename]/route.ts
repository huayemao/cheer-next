import { NextRequest, NextResponse } from 'next/server'
import { getFileByUrl } from '@/lib/server/image-service'

export async function GET(request: NextRequest, props: { params: Promise<{ filename: string }> }) {
  const params = await props.params;
  try {
    const file = await getFileByUrl(`/api/files/${params.filename}`)
    
    if (!file) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      )
    }

    // 处理非ASCII字符的文件名
    // 将Buffer转换为正确的格式
    const buffer = Buffer.from(file.blobData as Buffer);
    
    // 创建响应对象
    const response = new NextResponse(buffer);
    
    // 设置头信息
    response.headers.set('Content-Type', file.mimeType);
    response.headers.set('Cache-Control', 'public, max-age=31536000');
    
    // 处理中文文件名，使用RFC 5987标准编码
    const encodedFilename = encodeURIComponent(file.originalName);
    response.headers.set(
      'Content-Disposition', 
      `inline; filename*=UTF-8''${encodedFilename}`
    );
    
    return response
  } catch (error) {
    console.error('获取文件错误:', error)
    return NextResponse.json(
      { error: '获取文件失败' },
      { status: 500 }
    )
  }
}