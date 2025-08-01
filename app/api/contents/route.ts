import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tab = searchParams.get('tab') || 'latest'
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''

    // 基本的なwhere条件
    let where: any = {}
    
    // カテゴリーフィルター
    if (category !== 'all') {
      where.categoryId = category
    }
    
    // 検索フィルター
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive' as const,
      }
    }
    
    // タブに応じたソートとフィルター
    let orderBy: any = {}
    
    switch (tab) {
      case 'latest':
        orderBy = { publishedAt: 'desc' }
        break
      case 'popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'pinned':
        where.isPinned = true
        orderBy = { publishedAt: 'desc' }
        break
    }

    // コンテンツを取得
    const contents = await prisma.content.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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