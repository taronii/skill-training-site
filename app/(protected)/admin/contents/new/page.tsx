'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getYouTubeThumbnail, isValidYouTubeUrl } from '@/lib/youtube'

interface Category {
  id: string
  name: string
}

export default function NewContentPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'VIDEO' as 'VIDEO' | 'ARTICLE',
    youtubeUrl: '',
    articleContent: '',
    thumbnail: '',
    categoryId: '',
    isPinned: false,
    publishedAt: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    // YouTube URLからサムネイルを自動取得
    if (formData.type === 'VIDEO' && formData.youtubeUrl && isValidYouTubeUrl(formData.youtubeUrl)) {
      const thumbnail = getYouTubeThumbnail(formData.youtubeUrl)
      if (thumbnail) {
        setThumbnailPreview(thumbnail)
        setFormData(prev => ({ ...prev, thumbnail }))
      }
    }
  }, [formData.youtubeUrl, formData.type])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // バリデーション
    if (formData.type === 'VIDEO' && !formData.youtubeUrl) {
      setError('YouTube URLを入力してください')
      setIsLoading(false)
      return
    }

    if (formData.type === 'ARTICLE' && !formData.articleContent) {
      setError('記事内容を入力してください')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          youtubeUrl: formData.type === 'VIDEO' ? formData.youtubeUrl : null,
          articleContent: formData.type === 'ARTICLE' ? formData.articleContent : null,
          publishedAt: formData.publishedAt || new Date().toISOString(),
        }),
      })

      if (response.ok) {
        router.push('/admin/contents')
      } else {
        const data = await response.json()
        setError(data.error || 'コンテンツの作成に失敗しました')
      }
    } catch (error) {
      setError('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">新規コンテンツ投稿</h2>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* コンテンツタイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              コンテンツタイプ <span className="text-red-400">*</span>
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="VIDEO"
                  checked={formData.type === 'VIDEO'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'VIDEO' })}
                  className="mr-2"
                />
                <span className="text-white">動画</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="ARTICLE"
                  checked={formData.type === 'ARTICLE'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ARTICLE' })}
                  className="mr-2"
                />
                <span className="text-white">記事</span>
              </label>
            </div>
          </div>

          {/* YouTube URL（動画の場合） */}
          {formData.type === 'VIDEO' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">サムネイルプレビュー</p>
                  <img
                    src={thumbnailPreview}
                    alt="サムネイル"
                    className="w-48 h-auto rounded"
                  />
                </div>
              )}
            </div>
          )}

          {/* 記事内容（記事の場合） */}
          {formData.type === 'ARTICLE' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                記事内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={formData.articleContent}
                onChange={(e) => setFormData({ ...formData, articleContent: e.target.value })}
                rows={15}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none font-mono text-sm"
                placeholder="HTMLまたはMarkdownで記事を入力..."
              />
            </div>
          )}

          {/* カテゴリー */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              カテゴリー <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="">選択してください</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* カスタムサムネイルURL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              カスタムサムネイルURL（任意）
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          {/* ピックアップ設定 */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="mr-2"
              />
              <span className="text-white">ピックアップに設定する</span>
            </label>
          </div>

          {/* 公開日時 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              公開日時（空欄の場合は即時公開）
            </label>
            <input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 p-4 rounded">
              {error}
            </div>
          )}

          {/* ボタン */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '投稿中...' : '投稿する'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/contents')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}