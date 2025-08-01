import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 管理者の作成
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '管理者',
    },
  })
  console.log(`Created admin with id: ${admin.id}`)

  // 今月の合言葉を作成
  const now = new Date()
  const passPhrase = await prisma.passPhrase.create({
    data: {
      phrase: 'スキトレ2025',
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  })
  console.log(`Created pass phrase for ${passPhrase.year}/${passPhrase.month}`)

  // カテゴリーの作成
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'プログラミング基礎',
        slug: 'programming-basics',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Web開発',
        slug: 'web-development',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'データベース',
        slug: 'database',
        order: 3,
      },
    }),
  ])
  console.log(`Created ${categories.length} categories`)

  // サンプルコンテンツの作成
  const contents = await Promise.all([
    // 動画コンテンツ
    prisma.content.create({
      data: {
        title: 'JavaScript入門 - 変数と関数',
        type: 'VIDEO',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '/thumbnails/js-basics.jpg',
        categoryId: categories[0].id,
        isPinned: true,
        publishedAt: new Date(),
      },
    }),
    prisma.content.create({
      data: {
        title: 'React Hooks完全ガイド',
        type: 'VIDEO',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '/thumbnails/react-hooks.jpg',
        categoryId: categories[1].id,
        publishedAt: new Date(),
      },
    }),
    // 記事コンテンツ
    prisma.content.create({
      data: {
        title: 'TypeScript型システム入門',
        type: 'ARTICLE',
        articleContent: `# TypeScript型システム入門

TypeScriptの型システムについて学びましょう。

## 基本的な型

- string: 文字列型
- number: 数値型
- boolean: 真偽値型
- array: 配列型
- object: オブジェクト型

## 高度な型

- Union型
- Intersection型
- Generics
- Type Guards

詳しい内容は実際の記事で...`,
        thumbnail: '/thumbnails/typescript.jpg',
        categoryId: categories[0].id,
        publishedAt: new Date(),
      },
    }),
    prisma.content.create({
      data: {
        title: 'Prismaで始めるモダンなデータベース開発',
        type: 'ARTICLE',
        articleContent: `# Prismaで始めるモダンなデータベース開発

Prismaは次世代のORMです。

## Prismaの特徴

- 型安全なクエリ
- 自動補完
- マイグレーション管理
- 複数のデータベースサポート

実装例やベストプラクティスについて...`,
        thumbnail: '/thumbnails/prisma.jpg',
        categoryId: categories[2].id,
        isPinned: true,
        publishedAt: new Date(),
      },
    }),
  ])
  console.log(`Created ${contents.length} contents`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })