'use client'

import { useState, useEffect } from 'react'

interface PassPhrase {
  id: string
  phrase: string
  month: number
  year: number
  createdAt: string
}

export default function PassphraseManagementPage() {
  const [passphrases, setPassphrases] = useState<PassPhrase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    phrase: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPassphrases()
  }, [])

  const fetchPassphrases = async () => {
    try {
      const response = await fetch('/api/admin/passphrase')
      if (response.ok) {
        const data = await response.json()
        setPassphrases(data.passphrases)
      }
    } catch (error) {
      console.error('Failed to fetch passphrases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/admin/passphrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowAddForm(false)
        setFormData({
          phrase: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        })
        fetchPassphrases()
      } else {
        const data = await response.json()
        setError(data.error || '合言葉の追加に失敗しました')
      }
    } catch (error) {
      setError('エラーが発生しました')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この合言葉を削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/passphrase/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPassphrases()
      }
    } catch (error) {
      console.error('Failed to delete passphrase:', error)
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ]
    return months[month - 1]
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">合言葉管理</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          新規追加
        </button>
      </div>

      {/* 追加フォーム */}
      {showAddForm && (
        <div className="mb-6 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">新規合言葉追加</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                合言葉
              </label>
              <input
                type="text"
                required
                value={formData.phrase}
                onChange={(e) => setFormData({ ...formData, phrase: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
                placeholder="例: スキトレ2025"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  年
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
                >
                  {[0, 1, 2].map((offset) => {
                    const year = new Date().getFullYear() + offset
                    return (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  月
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                追加
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({
                    phrase: '',
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                  })
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

      {/* 合言葉一覧 */}
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
                  年月
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  合言葉
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  登録日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {passphrases.map((passphrase) => {
                const now = new Date()
                const isCurrent = passphrase.year === now.getFullYear() && passphrase.month === (now.getMonth() + 1)
                
                return (
                  <tr key={passphrase.id} className={isCurrent ? 'bg-gray-700' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {passphrase.year}年{getMonthName(passphrase.month)}
                      {isCurrent && (
                        <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                          現在
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {passphrase.phrase}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(passphrase.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(passphrase.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}