'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  order: number
  createdAt: string
  _count?: {
    contents: number
  }
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    order: 0,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const url = editingId 
      ? `/api/admin/categories/${editingId}`
      : '/api/admin/categories'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowAddForm(false)
        setEditingId(null)
        setFormData({ name: '', slug: '', order: 0 })
        fetchCategories()
      } else {
        const data = await response.json()
        setError(data.error || 'カテゴリーの保存に失敗しました')
      }
    } catch (error) {
      setError('エラーが発生しました')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      order: category.order,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string, hasContents: boolean) => {
    if (hasContents) {
      alert('コンテンツが存在するカテゴリーは削除できません')
      return
    }

    if (!confirm('このカテゴリーを削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const handleMoveUp = async (id: string, currentOrder: number) => {
    const targetCategory = categories.find(c => c.order === currentOrder - 1)
    if (!targetCategory) return

    try {
      await Promise.all([
        fetch(`/api/admin/categories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentOrder - 1 }),
        }),
        fetch(`/api/admin/categories/${targetCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ])
      fetchCategories()
    } catch (error) {
      console.error('Failed to reorder categories:', error)
    }
  }

  const handleMoveDown = async (id: string, currentOrder: number) => {
    const targetCategory = categories.find(c => c.order === currentOrder + 1)
    if (!targetCategory) return

    try {
      await Promise.all([
        fetch(`/api/admin/categories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentOrder + 1 }),
        }),
        fetch(`/api/admin/categories/${targetCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentOrder }),
        }),
      ])
      fetchCategories()
    } catch (error) {
      console.error('Failed to reorder categories:', error)
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">カテゴリー管理</h2>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ name: '', slug: '', order: categories.length })
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          新規追加
        </button>
      </div>

      {/* 追加・編集フォーム */}
      {showAddForm && (
        <div className="mb-6 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'カテゴリー編集' : '新規カテゴリー追加'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                カテゴリー名
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
                placeholder="例: プログラミング基礎"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                スラッグ（URL用）
              </label>
              <input
                type="text"
                required
                pattern="[a-z0-9-]+"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
                placeholder="例: programming-basics"
              />
              <p className="mt-1 text-xs text-gray-400">
                半角英数字とハイフンのみ使用可能
              </p>
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {editingId ? '更新' : '追加'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({ name: '', slug: '', order: 0 })
                  setError('')
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* カテゴリー一覧 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  順序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  カテゴリー名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  スラッグ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  コンテンツ数
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedCategories.map((category, index) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveUp(category.id, category.order)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveDown(category.id, category.order)}
                        disabled={index === sortedCategories.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {category._count?.contents || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, (category._count?.contents || 0) > 0)}
                      className="text-red-400 hover:text-red-300"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}