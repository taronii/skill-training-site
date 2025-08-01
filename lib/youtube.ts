/**
 * YouTube URLから動画IDを抽出する
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    
    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v')
      }
      // youtube.com/embed/VIDEO_ID
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2]
      }
    }
    
    // youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }
    
    // m.youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname === 'm.youtube.com') {
      return urlObj.searchParams.get('v')
    }
    
    return null
  } catch (error) {
    return null
  }
}

/**
 * YouTube URLから埋め込み用URLを生成する
 */
export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url)
  
  if (!videoId) {
    // 無効なURLの場合は空の埋め込みURLを返す
    return 'about:blank'
  }
  
  // 埋め込み用URLを生成（自動再生なし、関連動画は同じチャンネルのみ）
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
}

/**
 * YouTube URLのバリデーション
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}

/**
 * YouTube動画のサムネイルURLを取得する
 */
export function getYouTubeThumbnail(url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string | null {
  const videoId = extractYouTubeId(url)
  
  if (!videoId) {
    return null
  }
  
  const qualityMap = {
    'default': 'default',
    'medium': 'mqdefault',
    'high': 'hqdefault',
    'maxres': 'maxresdefault'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}