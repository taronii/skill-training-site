import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json()

    if (!passphrase) {
      return NextResponse.json(
        { error: '合言葉を入力してください' },
        { status: 400 }
      )
    }

    // 現在の年月を取得
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // 合言葉を検証
    const validPassPhrase = await prisma.passPhrase.findFirst({
      where: {
        phrase: passphrase,
        month: currentMonth,
        year: currentYear,
      },
    })

    if (!validPassPhrase) {
      return NextResponse.json(
        { error: '合言葉が違います！メールに送られた合言葉を確認してね！' },
        { status: 401 }
      )
    }

    // 月末までの有効期限を計算
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59)
    
    // JWTトークンを生成
    const token = jwt.sign(
      { 
        authenticated: true,
        validUntil: endOfMonth.toISOString(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    // セッションをデータベースに保存
    await prisma.session.create({
      data: {
        token,
        validUntil: endOfMonth,
      },
    })

    // Cookieにトークンを保存
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: endOfMonth,
    })

    return NextResponse.json(
      { success: true, message: 'ログインに成功しました' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}