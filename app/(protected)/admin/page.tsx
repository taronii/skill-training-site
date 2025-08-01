export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">管理画面ダッシュボード</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">コンテンツ</h3>
          <p className="text-3xl font-bold text-indigo-400">0</p>
          <p className="text-gray-400 text-sm">公開中のコンテンツ</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">管理者</h3>
          <p className="text-3xl font-bold text-indigo-400">1</p>
          <p className="text-gray-400 text-sm">登録済み管理者</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">合言葉</h3>
          <p className="text-3xl font-bold text-indigo-400">1</p>
          <p className="text-gray-400 text-sm">今月の合言葉</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">クイックアクション</h3>
        <div className="space-y-2">
          <a href="/admin/contents" className="block text-indigo-400 hover:text-indigo-300">
            → 新しいコンテンツを追加
          </a>
          <a href="/admin/passphrase" className="block text-indigo-400 hover:text-indigo-300">
            → 合言葉を管理
          </a>
          <a href="/admin/admins" className="block text-indigo-400 hover:text-indigo-300">
            → 管理者を追加
          </a>
        </div>
      </div>
    </div>
  )
}