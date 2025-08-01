import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

// コンテンツ一覧のキャッシュ
export const getCachedContents = unstable_cache(
  async (tab?: string, category?: string, search?: string) => {
    const where: Record<string, any> = {
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (tab === 'pinned') {
      where.isPinned = true
    }

    let orderBy: Record<string, string> = {}
    if (tab === 'popular') {
      orderBy = { viewCount: 'desc' }
    } else {
      orderBy = { publishedAt: 'desc' }
    }

    const contents = await prisma.content.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    })

    return contents
  },
  ['contents'],
  {
    revalidate: 60, // 1分間キャッシュ
    tags: ['contents'],
  }
)

// カテゴリー一覧のキャッシュ
export const getCachedCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    return categories
  },
  ['categories'],
  {
    revalidate: 300, // 5分間キャッシュ
    tags: ['categories'],
  }
)

// 個別コンテンツのキャッシュ
export const getCachedContent = unstable_cache(
  async (id: string) => {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
    return content
  },
  ['content'],
  {
    revalidate: 60, // 1分間キャッシュ
    tags: ['content'],
  }
)

// 関連コンテンツのキャッシュ
export const getCachedRelatedContents = unstable_cache(
  async (categoryId: string, excludeId: string) => {
    const relatedContents = await prisma.content.findMany({
      where: {
        categoryId,
        id: { not: excludeId },
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      include: {
        category: true,
      },
      take: 4,
      orderBy: {
        viewCount: 'desc',
      },
    })
    return relatedContents
  },
  ['related-contents'],
  {
    revalidate: 120, // 2分間キャッシュ
    tags: ['related-contents'],
  }
)