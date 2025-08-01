import { NextRequest } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // 時間枠（ミリ秒）
  maxRequests: number // 最大リクエスト数
}

export function rateLimit(config: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 100, // 100リクエスト
}) {
  return async (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const now = Date.now()
    const windowStart = now - config.windowMs

    // 古いエントリをクリーンアップ
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })

    // 現在のリクエスト情報を取得または作成
    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 0,
        resetTime: now + config.windowMs,
      }
    }

    store[ip].count++

    // レート制限チェック
    if (store[ip].count > config.maxRequests) {
      const retryAfter = Math.ceil((store[ip].resetTime - now) / 1000)
      return {
        limited: true,
        retryAfter,
      }
    }

    return {
      limited: false,
      remaining: config.maxRequests - store[ip].count,
      resetTime: store[ip].resetTime,
    }
  }
}

// 認証エンドポイント用の厳しいレート制限
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 5, // 5リクエストのみ
})

// 一般的なAPIエンドポイント用のレート制限
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 100, // 100リクエスト
})