'use client'

import { useState, useEffect } from 'react'
import { useVideoStore } from '@/store/videoStore'

export default function VideoListPage() {
  const { videos, loading, error, fetchVideos } = useVideoStore()
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'draft' | 'archived'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // 过滤和搜索视频
  const filteredVideos = videos.filter(video => {
    const matchesFilter = filter === 'all' || video.status === filter
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '已发布'
      case 'pending': return '待审核'
      case 'draft': return '草稿'
      case 'archived': return '已下架'
      default: return status
    }
  }

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'flight-basics': '飞行基础',
      'equipment-maintenance': '设备维护',
      'industry-applications': '行业应用',
      'safety-procedures': '安全程序',
      'advanced-techniques': '高级技巧',
      'regulations': '法规标准'
    }
    return categoryMap[category] || category
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载视频中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">加载失败</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">视频列表</h1>
          <p className="text-gray-600 mt-1">管理您的培训视频内容</p>
        </div>
        <a
          href="/videos/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          上传视频
        </a>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索视频标题或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 状态过滤 */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'published', label: '已发布' },
              { key: 'pending', label: '待审核' },
              { key: 'draft', label: '草稿' },
              { key: 'archived', label: '已下架' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 视频列表 */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filter !== 'all' ? '没有找到匹配的视频' : '暂无视频'}
          </p>
          {!searchTerm && filter === 'all' && (
            <a
              href="/videos/upload"
              className="text-blue-600 hover:text-blue-700 inline-block"
            >
              上传您的第一个视频
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* 缩略图 */}
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">暂无缩略图</p>
                  </div>
                )}
              </div>

              {/* 视频信息 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(video.status)}`}>
                    {getStatusText(video.status)}
                  </span>
                </div>

                {video.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>分类:</span>
                    <span>{getCategoryText(video.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>时长:</span>
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>大小:</span>
                    <span>{formatFileSize(video.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>播放量:</span>
                    <span>{video.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>上传时间:</span>
                    <span>{new Date(video.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                    查看
                  </button>
                  <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                    编辑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 统计信息 */}
      {filteredVideos.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          显示 {filteredVideos.length} 个视频，共 {videos.length} 个
        </div>
      )}
    </div>
  )
}
