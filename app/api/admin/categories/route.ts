import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// カテゴリー一覧取得（管理画面用）
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { contents: true },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'カテゴリーの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// カテゴリー作成
export async function POST(request: NextRequest) {
  try {
    const { name, slug, order } = await request.json()

    // バリデーション
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'カテゴリー名とスラッグは必須です' },
        { status: 400 }
      )
    }

    // スラッグの重複チェック
    const existing = await prisma.category.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'このスラッグは既に使用されています' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        order: order ?? 0,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      { error: 'カテゴリーの作成に失敗しました' },
      { status: 500 }
    )
  }
}