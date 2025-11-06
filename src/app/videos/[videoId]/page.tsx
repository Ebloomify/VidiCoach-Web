'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface VideoDetail {
  id: string
  title: string
  description?: string
  status: string
  thumbnailUrl?: string
  hlsPlaylistUrl?: string
  duration?: number
  createdAt?: string
}

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.videoId as string
  
  const [video, setVideo] = useState<VideoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoId) return

    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/v1/video/status/${videoId}`)
        if (response.data.success) {
          setVideo(response.data.data)
        } else {
          setError(response.data.error || 'Failed to load video')
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load video')
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [videoId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading video...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error || 'Video not found'}</p>
            <button
              onClick={() => router.push('/videos/list')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Video List
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      UPLOADING: 'bg-blue-100 text-blue-800',
      UPLOADED: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-orange-100 text-orange-800',
      READY: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/videos/list')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Videos
          </button>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(video.status)}`}>
            {video.status}
          </span>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {video.status === 'READY' ? (
            <div className="aspect-video bg-black">
              <video
                controls
                className="w-full h-full"
                preload="metadata"
              >
                <source src={`/api/videos/${videoId}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {video.thumbnailUrl ? (
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">
                    {video.status === 'PROCESSING' ? 'Processing video...' : 'Video not ready'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
          
          {video.description && (
            <p className="text-gray-700 mb-6">{video.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">{formatDuration(video.duration)}</span>
            </div>
            <div>
              <span className="text-gray-500">Uploaded:</span>
              <span className="ml-2 font-medium">
                {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Processing Status */}
          {video.status === 'PROCESSING' && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
                <p className="text-yellow-800">
                  Your video is being processed. This may take a few minutes...
                </p>
              </div>
            </div>
          )}

          {video.status === 'FAILED' && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Video processing failed. Please try uploading again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

