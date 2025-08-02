import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting production seed...')

  // 現在の年月を取得
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  try {
    // 既存の合言葉を確認
    const existingPassphrase = await prisma.passPhrase.findFirst({
      where: {
        month: currentMonth,
        year: currentYear,
      },
    })

    if (existingPassphrase) {
      console.log(`Passphrase already exists for ${currentYear}/${currentMonth}`)
    } else {
      // 合言葉を作成
      const passphrase = await prisma.passPhrase.create({
        data: {
          phrase: 'スキトレ2025',
          month: currentMonth,
          year: currentYear,
        },
      })
      console.log(`Created passphrase for ${currentYear}/${currentMonth}:`, passphrase.phrase)
    }

    // 管理者が存在しない場合は作成
    const adminCount = await prisma.admin.count()
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      const admin = await prisma.admin.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          name: '管理者',
        },
      })
      console.log('Created admin user:', admin.email)
    } else {
      console.log('Admin user already exists')
    }

    // カテゴリが存在しない場合は作成
    const categoryCount = await prisma.category.count()
    if (categoryCount === 0) {
      const categories = await prisma.category.createMany({
        data: [
          { name: 'プログラミング', slug: 'programming', order: 1 },
          { name: 'デザイン', slug: 'design', order: 2 },
          { name: 'マーケティング', slug: 'marketing', order: 3 },
        ],
      })
      console.log('Created categories:', categories.count)
    } else {
      console.log('Categories already exist')
    }

    console.log('Production seed completed successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })