'use client'

import { useState, useRef, useEffect } from 'react'
import { useUploadStore } from '@/store/uploadStore'
import axios from 'axios'

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string | null>(null)
  const [statusPolling, setStatusPolling] = useState<NodeJS.Timeout | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploads, uploadVideo, isUploading, error, removeUpload } = useUploadStore()

  // Get current upload for this file
  const currentUpload = uploads.find(u => u.file === selectedFile)

  // Poll video processing status
  useEffect(() => {
    if (currentUpload?.status === 'processing' && currentUpload.checkStatusUrl) {
      setVideoId(currentUpload.videoId || null)
      
      // Start polling
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(currentUpload.checkStatusUrl!)
          if (response.data.success) {
            const status = response.data.data.status
            setProcessingStatus(status)
            
            if (status === 'READY' || status === 'FAILED') {
              clearInterval(interval)
              setStatusPolling(null)
              
              if (status === 'READY') {
                alert('Video processing completed! Your video is ready.')
              } else {
                alert('Video processing failed. Please try again.')
              }
            }
          }
        } catch (error) {
          console.error('Error polling video status:', error)
        }
      }, 3000) // Poll every 3 seconds
      
      setStatusPolling(interval)
      
      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [currentUpload?.status, currentUpload?.checkStatusUrl, currentUpload?.videoId])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Check file size (max 2GB)
    const maxSize = 2 * 1024 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size must be less than 2GB')
      return
    }

    setSelectedFile(file)
    setTitle(file.name.replace(/\.[^/.]+$/, '')) // Remove extension
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      alert('Please provide a file and title')
      return
    }

    try {
      await uploadVideo(selectedFile, {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        tags: tags.length > 0 ? tags : undefined,
      })
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const handleReset = () => {
    if (currentUpload) {
      removeUpload(currentUpload.id)
    }
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setCategory('')
    setTags([])
    setVideoId(null)
    setProcessingStatus(null)
    if (statusPolling) {
      clearInterval(statusPolling)
      setStatusPolling(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600'
      case 'processing':
        return 'text-yellow-600'
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...'
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Video</h1>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${currentUpload ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="text-green-600">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Drop your video here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Metadata Form */}
        {selectedFile && !currentUpload && (
          <div className="mt-8 bg-white rounded-lg shadow p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Video Information</h3>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter video title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter video description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="flight-basics">Flight Basics</option>
                <option value="equipment-maintenance">Equipment Maintenance</option>
                <option value="industry-applications">Industry Applications</option>
                <option value="safety-procedures">Safety Procedures</option>
                <option value="advanced-techniques">Advanced Techniques</option>
                <option value="regulations">Regulations</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!title.trim() || isUploading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Start Upload
              </button>
              <button
                onClick={handleReset}
                disabled={isUploading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {currentUpload && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Progress</h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`text-sm font-semibold ${getStatusColor(currentUpload.status)}`}>
                  {getStatusText(currentUpload.status)}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(currentUpload.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      currentUpload.status === 'error'
                        ? 'bg-red-600'
                        : currentUpload.status === 'processing'
                        ? 'bg-yellow-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${currentUpload.progress}%` }}
                  />
                </div>
              </div>

              {/* Processing Status */}
              {currentUpload.status === 'processing' && processingStatus && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Processing Status:</strong> {processingStatus}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Your video is being transcoded and optimized. This may take several minutes.
                  </p>
                </div>
              )}

              {/* Error */}
              {currentUpload.status === 'error' && currentUpload.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {currentUpload.error}
                  </p>
                </div>
              )}

              {/* Success */}
              {processingStatus === 'READY' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Success!</strong> Your video has been processed and is ready to view.
                  </p>
                  {videoId && (
                    <a
                      href={`/videos/${videoId}`}
                      className="inline-block mt-2 text-sm text-green-700 underline hover:text-green-900"
                    >
                      View Video
                    </a>
                  )}
                </div>
              )}

              {/* Reset Button */}
              {(currentUpload.status === 'error' || processingStatus === 'READY' || processingStatus === 'FAILED') && (
                <button
                  onClick={handleReset}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Upload Another Video
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Supported formats: MP4, WebM, QuickTime (MOV)</li>
            <li>• Maximum file size: 2GB</li>
            <li>• Recommended resolution: 720p or higher</li>
            <li>• Upload supports chunked transfer for large files</li>
            <li>• Videos will be automatically transcoded to multiple resolutions</li>
            <li>• Processing time varies based on video length and quality</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
