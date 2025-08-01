import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      authenticated: boolean
      validUntil: string
    }

    // 有効期限をチェック
    const validUntil = new Date(decoded.validUntil)
    const now = new Date()
    
    if (now > validUntil) {
      return NextResponse.json(
        { authenticated: false, reason: 'Token expired' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true, validUntil: decoded.validUntil },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, reason: 'Invalid token' },
      { status: 401 }
    )
  }
}