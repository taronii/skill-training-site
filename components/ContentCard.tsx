import Link from 'next/link'
import Image from 'next/image'

interface ContentCardProps {
  content: {
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
}

export default function ContentCard({ content }: ContentCardProps) {
  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatDuration = () => {
    // 仮の動画時間（実際はコンテンツに含める）
    return '15:30'
  }

  return (
    <Link href={`/content/${content.id}`} className="block group">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105">
        {/* サムネイル */}
        <div className="relative aspect-video bg-gray-700">
          {content.thumbnail ? (
            <Image
              src={content.thumbnail}
              alt={content.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {content.type === 'VIDEO' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                )}
              </svg>
            </div>
          )}
          
          {/* ピン留めバッジ */}
          {content.isPinned && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              ピックアップ
            </div>
          )}
          
          {/* 動画時間 */}
          {content.type === 'VIDEO' && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {formatDuration()}
            </div>
          )}
          
          {/* タイプアイコン */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded">
            {content.type === 'VIDEO' ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* コンテンツ情報 */}
        <div className="p-3">
          <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {content.title}
          </h3>
          
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span className="bg-gray-700 px-2 py-1 rounded">
              {content.category.name}
            </span>
            <span>{formatViewCount(content.viewCount)} 回視聴</span>
          </div>
        </div>
      </div>
    </Link>
  )
}