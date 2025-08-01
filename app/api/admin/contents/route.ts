import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// コンテンツ一覧取得（管理画面用）
export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ contents })
  } catch (error) {
    console.error('Failed to fetch contents:', error)
    return NextResponse.json(
      { error: 'コンテンツの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// コンテンツ作成
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const content = await prisma.content.create({
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to create content:', error)
    return NextResponse.json(
      { error: 'コンテンツの作成に失敗しました' },
      { status: 500 }
    )
  }
}