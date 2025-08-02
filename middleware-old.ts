import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { apiRateLimit } from './lib/rate-limit'

// 保護されたルートのパス
const protectedPaths = ['/dashboard', '/content']
const adminPaths = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // CORS設定（本番環境ではオリジンを制限）
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com']
    : ['http://localhost:3000']
  
  const origin = request.headers.get('origin')
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // プリフライトリクエストの処理
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers })
  }

  // APIルートのレート制限
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await apiRateLimit(request)
    if (rateLimitResult.limited) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfter),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
        },
      })
    }
  }

  // 管理者ルートかチェック
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path)) && !pathname.includes('/login')
  
  if (isAdminPath) {
    // 管理者トークンを確認
    const adminToken = request.cookies.get('admin-token')?.value
    
    if (!adminToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!) as {
        adminId: string
        isAdmin: boolean
      }
      
      if (!decoded.isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
      
      return response
    } catch (error) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      const response = NextResponse.redirect(url)
      response.cookies.delete('admin-token')
      return response
    }
  }

  // 一般保護ルートかチェック
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (!isProtectedPath) {
    return response
  }

  // Cookieからトークンを取得
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // トークンがない場合はログインページへリダイレクト
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  try {
    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      authenticated: boolean
      validUntil: string
    }

    // 有効期限をチェック
    const validUntil = new Date(decoded.validUntil)
    const now = new Date()
    
    if (now > validUntil) {
      // 有効期限切れの場合はログインページへリダイレクト
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      const response = NextResponse.redirect(url)
      
      // 期限切れのトークンを削除
      response.cookies.delete('auth-token')
      return response
    }

    // 認証成功
    return response
  } catch (error) {
    // トークンが無効な場合はログインページへリダイレクト
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    const response = NextResponse.redirect(url)
    
    // 無効なトークンを削除
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}