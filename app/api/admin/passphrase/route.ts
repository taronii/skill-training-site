import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 合言葉一覧取得
export async function GET() {
  try {
    const passphrases = await prisma.passPhrase.findMany({
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
    })

    return NextResponse.json({ passphrases })
  } catch (error) {
    console.error('Failed to fetch passphrases:', error)
    return NextResponse.json(
      { error: '合言葉の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 合言葉追加
export async function POST(request: NextRequest) {
  try {
    const { phrase, month, year } = await request.json()

    // バリデーション
    if (!phrase || !month || !year) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      )
    }

    // 月の範囲チェック
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: '月は1〜12の範囲で入力してください' },
        { status: 400 }
      )
    }

    // 既存の合言葉チェック（同じ年月）
    const existingPassphrase = await prisma.passPhrase.findUnique({
      where: {
        month_year: { month, year },
      },
    })

    if (existingPassphrase) {
      return NextResponse.json(
        { error: 'この年月の合言葉は既に登録されています' },
        { status: 400 }
      )
    }

    // 合言葉作成
    const passphrase = await prisma.passPhrase.create({
      data: {
        phrase,
        month,
        year,
      },
    })

    return NextResponse.json({ passphrase })
  } catch (error) {
    console.error('Failed to create passphrase:', error)
    return NextResponse.json(
      { error: '合言葉の作成に失敗しました' },
      { status: 500 }
    )
  }
}