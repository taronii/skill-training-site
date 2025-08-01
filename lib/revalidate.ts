import { revalidateTag } from 'next/cache'

// コンテンツが更新された時にキャッシュを無効化
export function revalidateContent() {
  revalidateTag('contents')
  revalidateTag('content')
  revalidateTag('related-contents')
}

// カテゴリーが更新された時にキャッシュを無効化
export function revalidateCategories() {
  revalidateTag('categories')
  revalidateTag('contents') // カテゴリーが変更されるとコンテンツ一覧も影響を受ける
}