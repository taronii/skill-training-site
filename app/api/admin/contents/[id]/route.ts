import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// コンテンツ取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'コンテンツが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to fetch content:', error)
    return NextResponse.json(
      { error: 'コンテンツの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// コンテンツ更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const content = await prisma.content.update({
      where: { id },
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
    console.error('Failed to update content:', error)
    return NextResponse.json(
      { error: 'コンテンツの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// コンテンツ部分更新（ピン留め等）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const content = await prisma.content.update({
      where: { id },
      data,
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to patch content:', error)
    return NextResponse.json(
      { error: 'コンテンツの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// コンテンツ削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.content.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete content:', error)
    return NextResponse.json(
      { error: 'コンテンツの削除に失敗しました' },
      { status: 500 }
    )
  }
}