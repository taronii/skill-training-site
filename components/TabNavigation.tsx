import React from 'react'

type Tab = 'latest' | 'popular' | 'pinned'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactElement }[] = [
    {
      id: 'latest',
      label: '新着',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'popular',
      label: '人気',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'pinned',
      label: 'ピックアップ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}