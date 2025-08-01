'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getYouTubeThumbnail } from '@/lib/youtube'

interface Content {
  id: string
  title: string
  type: 'VIDEO' | 'ARTICLE'
  youtubeUrl: string | null
  thumbnail: string | null
  category: {
    id: string
    name: string
  }
  viewCount: number
  isPinned: boolean
  publishedAt: string | null
  createdAt: string
}

export default function ContentsManagementPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/admin/contents')
      if (response.ok) {
        const data = await response.json()
        setContents(data.contents)
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このコンテンツを削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/contents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchContents()
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
    }
  }

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      const response = await fetch(`/api/admin/contents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPinned: !currentPinned }),
      })

      if (response.ok) {
        fetchContents()
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error)
    }
  }

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">コンテンツ管理</h2>
        <Link
          href="/admin/contents/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          新規投稿
        </Link>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="コンテンツを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* コンテンツ一覧 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  サムネイル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  タイプ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  閲覧数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredContents.map((content) => {
                const thumbnailUrl = content.thumbnail || 
                  (content.youtubeUrl ? getYouTubeThumbnail(content.youtubeUrl) : null)
                
                return (
                  <tr key={content.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-12 bg-gray-700 rounded overflow-hidden">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {content.type === 'VIDEO' ? '🎥' : '📄'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {content.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 rounded text-xs ${
                        content.type === 'VIDEO' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'
                      }`}>
                        {content.type === 'VIDEO' ? '動画' : '記事'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {content.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {content.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        {content.isPinned && (
                          <span className="px-2 py-1 bg-red-900 text-red-200 text-xs rounded">
                            ピックアップ
                          </span>
                        )}
                        {content.publishedAt ? (
                          <span className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded">
                            公開中
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                            下書き
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePin(content.id, content.isPinned)}
                          className={`${
                            content.isPinned ? 'text-yellow-400' : 'text-gray-400'
                          } hover:text-yellow-300`}
                          title={content.isPinned ? 'ピックアップを解除' : 'ピックアップに設定'}
                        >
                          📌
                        </button>
                        <Link
                          href={`/admin/contents/${content.id}/edit`}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}