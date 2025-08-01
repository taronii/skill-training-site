'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ContentCard from '@/components/ContentCard'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

interface Content {
  id: string
  title: string
  type: 'VIDEO' | 'ARTICLE'
  youtubeUrl: string | null
  articleContent: string | null
  thumbnail: string | null
  viewCount: number
  category: {
    id: string
    name: string
  }
  publishedAt: string | null
  isPinned: boolean
}

export default function ContentDetailPage() {
  const params = useParams()
  const [content, setContent] = useState<Content | null>(null)
  const [relatedContents, setRelatedContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchContent(params.id as string)
      incrementViewCount(params.id as string)
    }
  }, [params.id])

  const fetchContent = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/contents/${id}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
        
        // 関連コンテンツを取得
        if (data.content.categoryId) {
          fetchRelatedContents(data.content.categoryId, id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedContents = async (categoryId: string, currentId: string) => {
    try {
      const response = await fetch(`/api/contents?category=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        // 現在のコンテンツを除外して最大4件表示
        const filtered = data.contents
          .filter((c: Content) => c.id !== currentId)
          .slice(0, 4)
        setRelatedContents(filtered)
      }
    } catch (error) {
      console.error('Failed to fetch related contents:', error)
    }
  }

  const incrementViewCount = async (id: string) => {
    try {
      await fetch(`/api/contents/${id}/view`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">コンテンツが見つかりませんでした</p>
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* タイトルとメタ情報 */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {content.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="bg-gray-700 px-3 py-1 rounded">
                  {content.category.name}
                </span>
                <span>{content.viewCount} 回視聴</span>
                {content.publishedAt && (
                  <span>
                    {new Date(content.publishedAt).toLocaleDateString('ja-JP')}
                  </span>
                )}
              </div>
            </div>

            {/* コンテンツ本体 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {content.type === 'VIDEO' && content.youtubeUrl ? (
                <div className="relative aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(content.youtubeUrl)}
                    title={content.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : content.type === 'ARTICLE' && content.articleContent ? (
                <div className="p-6 prose prose-invert max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: content.articleContent }}
                    className="text-gray-300"
                  />
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  コンテンツが利用できません
                </div>
              )}
            </div>
          </div>

          {/* サイドバー：関連コンテンツ */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-white mb-4">
              関連コンテンツ
            </h2>
            
            {relatedContents.length > 0 ? (
              <div className="space-y-4">
                {relatedContents.map((relatedContent) => (
                  <div key={relatedContent.id} className="transform scale-90 origin-top-left">
                    <ContentCard content={relatedContent} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                関連コンテンツがありません
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}