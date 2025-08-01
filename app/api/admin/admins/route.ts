import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// 管理者一覧取得
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Failed to fetch admins:', error)
    return NextResponse.json(
      { error: '管理者の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 管理者追加
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // バリデーション
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      )
    }

    // 既存の管理者チェック
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // 管理者作成
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Failed to create admin:', error)
    return NextResponse.json(
      { error: '管理者の作成に失敗しました' },
      { status: 500 }
    )
  }
}