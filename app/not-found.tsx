import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-400 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            ダッシュボードに戻る
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}