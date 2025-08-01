// 環境変数の検証
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
  ]

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    )
  }

  // 本番環境では追加の検証
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production')
    }

    if (process.env.DATABASE_URL?.includes('file:')) {
      throw new Error('SQLite is not recommended for production. Use PostgreSQL instead.')
    }
  }
}

// アプリケーション起動時に検証を実行
if (typeof window === 'undefined') {
  validateEnv()
}