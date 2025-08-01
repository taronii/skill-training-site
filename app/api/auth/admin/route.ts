import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      )
    }

    // 管理者を検索
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // パスワードを検証
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // JWTトークンを生成（管理者用）
    const token = jwt.sign(
      { 
        adminId: admin.id,
        email: admin.email,
        isAdmin: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    // Cookieにトークンを保存
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24時間
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'ログインに成功しました',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin authentication error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 管理者ログアウト
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')

    return NextResponse.json(
      { success: true, message: 'ログアウトしました' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'ログアウトに失敗しました' },
      { status: 500 }
    )
  }
}