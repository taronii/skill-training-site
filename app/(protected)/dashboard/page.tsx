'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ContentCard from '@/components/ContentCard'
import TabNavigation from '@/components/TabNavigation'
import CategoryFilter from '@/components/CategoryFilter'
import SearchBar from '@/components/SearchBar'

type Tab = 'latest' | 'popular' | 'pinned'

interface Content {
  id: string
  title: string
  type: 'VIDEO' | 'ARTICLE'
  thumbnail: string | null
  viewCount: number
  category: {
    id: string
    name: string
  }
  publishedAt: string | null
  isPinned: boolean
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('latest')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    fetchContents()
  }, [activeTab, selectedCategory, searchQuery])

  const fetchContents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        tab: activeTab,
        category: selectedCategory,
        search: searchQuery,
      })
      
      const response = await fetch(`/api/contents?${params}`)
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">スキトレ会員サイト</h1>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 検索バー */}
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* タブナビゲーション */}
        <div className="mb-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* カテゴリーフィルター */}
        <div className="mb-6">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>

        {/* コンテンツグリッド */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}

        {!isLoading && contents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">コンテンツが見つかりませんでした</p>
          </div>
        )}
      </main>
    </div>
  )
}