'use client'

import { useEffect } from 'react'
import { useVideoStore } from '@/store/videoStore'
import KPICards from '@/components/features/dashboard/KPICards'
import ChartsSection from '@/components/features/dashboard/ChartsSection'
import ActivitySection from '@/components/features/dashboard/ActivitySection'

export default function DashboardPage() {
  const { dashboardStats, loading, error, fetchVideos, fetchDashboardStats } = useVideoStore()

  useEffect(() => {
    // 先获取视频数据，再获取dashboard统计
    const loadData = async () => {
      await fetchVideos()
      await fetchDashboardStats()
    }
    loadData()
  }, [fetchVideos, fetchDashboardStats])

  if (loading && !dashboardStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Loading Failed</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!dashboardStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">Please upload some video content first</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training System Dashboard</h1>
        <p className="text-gray-600">Content Management & Operations Efficiency Monitoring</p>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/videos/upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Video
          </a>
          <a
            href="/videos/list"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            View Videos
          </a>
          <a
            href="/videos?status=pending"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Review ({dashboardStats.pendingPublishCount})
          </a>
          <a
            href="/videos?status=archived"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V4" />
            </svg>
            Archived ({dashboardStats.archivedCount})
          </a>
        </div>
      </div>

      {/* KPI 卡片 - 内容管理核心指标 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Content Management Metrics</h2>
        <KPICards stats={dashboardStats} />
      </div>

      {/* 图表区域 - 视频内容结构与分类 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Content Structure & Classification</h2>
        <ChartsSection stats={dashboardStats} />
      </div>

      {/* 最新动态与操作记录 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Activities & Operation Records</h2>
        <ActivitySection stats={dashboardStats} />
      </div>

    </div>
  )
}
