'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーログを送信（本番環境では外部サービスに送信）
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-indigo-500 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          エラーが発生しました
        </h2>
        <p className="text-gray-400 mb-8">
          申し訳ございません。予期しないエラーが発生しました。
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            もう一度試す
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  )
}