'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Video {
  id: string
  title: string
  description?: string
  filename: string
  originalName: string
  size: number
  duration: number
  thumbnailUrl?: string
  status: string
  category?: string
  tags: string[]
  viewCount: number
  createdAt: string
}

export default function VideoListPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/v1/video/list')
      if (response.data.success) {
        setVideos(response.data.data)
      } else {
        setError(response.data.error || 'Failed to fetch videos')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

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
      case 'READY': return 'bg-green-100 text-green-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'UPLOADING': return 'bg-blue-100 text-blue-800'
      case 'UPLOADED': return 'bg-blue-100 text-blue-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'READY': return 'Ready'
      case 'PROCESSING': return 'Processing'
      case 'UPLOADING': return 'Uploading'
      case 'UPLOADED': return 'Uploaded'
      case 'FAILED': return 'Failed'
      default: return status
    }
  }

  const getCategoryText = (category?: string) => {
    if (!category) return 'Uncategorized'
    const categoryMap: Record<string, string> = {
      'flight-basics': 'Flight Basics',
      'equipment-maintenance': 'Equipment Maintenance',
      'industry-applications': 'Industry Applications',
      'safety-procedures': 'Safety Procedures',
      'advanced-techniques': 'Advanced Techniques',
      'regulations': 'Regulations'
    }
    return categoryMap[category] || category
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
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
          <button
            onClick={() => fetchVideos()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-600 mt-1">Manage your video content</p>
        </div>
        <button
          onClick={() => router.push('/videos/upload')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Video
        </button>
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
                placeholder="Search video title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 状态过滤 */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'READY', label: 'Ready' },
              { key: 'PROCESSING', label: 'Processing' },
              { key: 'FAILED', label: 'Failed' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
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
            {searchTerm || filter !== 'all' ? 'No matching videos found' : 'No videos available'}
          </p>
          {!searchTerm && filter === 'all' && (
            <button
              onClick={() => router.push('/videos/upload')}
              className="text-blue-600 hover:text-blue-700 inline-block mt-2"
            >
              Upload your first video
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* 缩略图 */}
              <div className="aspect-video bg-gray-200 flex items-center justify-center cursor-pointer" onClick={() => router.push(`/videos/${video.id}`)}>
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No thumbnail available</p>
                  </div>
                )}
              </div>

              {/* 视频信息 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 cursor-pointer hover:text-blue-600" onClick={() => router.push(`/videos/${video.id}`)}>
                    {video.title}
                  </h3>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(video.status)}`}>
                    {getStatusText(video.status)}
                  </span>
                </div>

                {video.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {video.category && (
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{getCategoryText(video.category)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(video.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span>{video.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => router.push(`/videos/${video.id}`)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    View
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
          Showing {filteredVideos.length} of {videos.length} videos
        </div>
      )}
    </div>
  )
}
