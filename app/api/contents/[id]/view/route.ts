import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 閲覧数を増やす
    const content = await prisma.content.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      viewCount: content.viewCount 
    })
  } catch (error) {
    console.error('Failed to increment view count:', error)
    return NextResponse.json(
      { error: '閲覧数の更新に失敗しました' },
      { status: 500 }
    )
  }
}