'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const router = useRouter()

  const logout = useCallback(async () => {
    try {
      // ログアウトAPIを呼び出す
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // ログインページへリダイレクト
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
      })
      
      return response.ok
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    }
  }, [])

  return {
    logout,
    checkAuth,
  }
}