type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry)
  }

  private log(level: LogLevel, message: string, context?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    }

    // 開発環境では見やすい形式で出力
    if (this.isDevelopment) {
      const color = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        debug: '\x1b[90m',
      }[level]
      const reset = '\x1b[0m'
      
      console.log(`${color}[${level.toUpperCase()}]${reset} ${message}`, context || '')
    } else {
      // 本番環境ではJSON形式で出力（ログ収集サービス用）
      console.log(this.formatLog(entry))
    }
  }

  info(message: string, context?: any) {
    this.log('info', message, context)
  }

  warn(message: string, context?: any) {
    this.log('warn', message, context)
  }

  error(message: string, context?: any) {
    this.log('error', message, context)
  }

  debug(message: string, context?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  // APIエラーを記録
  logApiError(error: any, request: Request) {
    this.error('API Error', {
      error: error.message || error,
      stack: error.stack,
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    })
  }

  // 認証エラーを記録
  logAuthError(type: string, details: any) {
    this.warn(`Authentication Error: ${type}`, details)
  }

  // パフォーマンスメトリクスを記録
  logPerformance(operation: string, duration: number, metadata?: any) {
    this.info('Performance Metric', {
      operation,
      duration,
      ...metadata,
    })
  }
}

export const logger = new Logger()