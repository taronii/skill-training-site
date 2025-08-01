import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 合言葉削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 合言葉削除
    await prisma.passPhrase.delete({
      where: { id },
    })

    // 関連するセッションも削除
    const now = new Date()
    await prisma.session.deleteMany({
      where: {
        validUntil: {
          lt: now,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete passphrase:', error)
    return NextResponse.json(
      { error: '合言葉の削除に失敗しました' },
      { status: 500 }
    )
  }
}