import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 管理者削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 最後の管理者かチェック
    const adminCount = await prisma.admin.count()
    
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: '最後の管理者は削除できません' },
        { status: 400 }
      )
    }

    // 管理者削除
    await prisma.admin.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete admin:', error)
    return NextResponse.json(
      { error: '管理者の削除に失敗しました' },
      { status: 500 }
    )
  }
}