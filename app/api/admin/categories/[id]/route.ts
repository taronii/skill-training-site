import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// カテゴリー更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, slug, order } = await request.json()

    // スラッグの重複チェック（自分以外）
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'このスラッグは既に使用されています' },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        order,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Failed to update category:', error)
    return NextResponse.json(
      { error: 'カテゴリーの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// カテゴリー部分更新（順序変更用）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Failed to patch category:', error)
    return NextResponse.json(
      { error: 'カテゴリーの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// カテゴリー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // コンテンツが存在するかチェック
    const contentCount = await prisma.content.count({
      where: { categoryId: id },
    })

    if (contentCount > 0) {
      return NextResponse.json(
        { error: 'コンテンツが存在するカテゴリーは削除できません' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json(
      { error: 'カテゴリーの削除に失敗しました' },
      { status: 500 }
    )
  }
}