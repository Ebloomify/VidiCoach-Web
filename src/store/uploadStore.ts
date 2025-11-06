import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UploadProgress, UploadState, ChunkUploadProgress } from '@/types'
import axios from 'axios'

const generateId = () => Math.random().toString(36).substr(2, 9)

// 分片大小：5MB
const CHUNK_SIZE = 5 * 1024 * 1024

/**
 * 扩展 UploadState 以支持分片上传
 */
interface ExtendedUploadState extends UploadState {
  chunkProgress: Map<string, ChunkUploadProgress[]>
  uploadVideo: (
    file: File,
    metadata: {
      title: string
      description?: string
      category?: string
      tags?: string[]
    }
  ) => Promise<void>
}

export const useUploadStore = create<ExtendedUploadState>()(
  devtools(
    (set, get) => ({
      // Initial state
      uploads: [],
      isUploading: false,
      error: null,
      chunkProgress: new Map(),
      
      // Actions
      uploadFile: async (file: File, type: 'video' | 'image') => {
        if (type === 'video') {
          console.error('Use uploadVideo for video files')
          return
        }
        
        const id = generateId()
        const upload: UploadProgress = {
          id,
          file,
          type,
          progress: 0,
          status: 'uploading'
        }
        
        set((state) => ({
          uploads: [...state.uploads, upload],
          isUploading: true,
          error: null
        }))
        
        try {
          // TODO: Implement actual upload API call for images
          console.log('Uploading file:', file.name)
          
          // Simulate upload progress
          const interval = setInterval(() => {
            const { uploads } = get()
            const currentUpload = uploads.find(u => u.id === id)
            if (currentUpload && currentUpload.progress < 100) {
              const newProgress = Math.min(currentUpload.progress + 10, 100)
              get().updateProgress(id, newProgress)
              
              if (newProgress >= 100) {
                clearInterval(interval)
                set((state) => ({
                  uploads: state.uploads.map(upload =>
                    upload.id === id ? { ...upload, status: 'completed' } : upload
                  ),
                  isUploading: false
                }))
              }
            }
          }, 200)
          
        } catch (error: any) {
          set((state) => ({
            uploads: state.uploads.map(upload =>
              upload.id === id ? { ...upload, status: 'error', error: error.message } : upload
            ),
            isUploading: false,
            error: error.message
          }))
        }
      },

      /**
       * 上传视频（支持分片上传和断点续传）
       */
      uploadVideo: async (file: File, metadata) => {
        const id = generateId()
        const { title, description, category, tags } = metadata
        
        // 计算分片数量
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
        
        const upload: UploadProgress = {
          id,
          file,
          type: 'video',
          progress: 0,
          status: 'uploading',
        }
        
        set((state) => ({
          uploads: [...state.uploads, upload],
          isUploading: true,
          error: null,
        }))

        try {
          // Step 1: 初始化上传
          console.log('[Upload] Initializing upload for:', file.name)
          const initResponse = await axios.post('/api/v1/video/upload/init', {
            filename: file.name,
            fileSize: file.size,
            mimeType: file.type,
            totalChunks,
            title,
            description,
            category,
            tags,
          })

          if (!initResponse.data.success) {
            throw new Error(initResponse.data.error || 'Failed to initialize upload')
          }

          const { uploadSessionId, uploadedChunks } = initResponse.data.data

          // 更新上传记录
          set((state) => ({
            uploads: state.uploads.map((u) =>
              u.id === id ? { ...u, uploadSessionId } : u
            ),
          }))

          // Step 2: 上传分片
          console.log(`[Upload] Uploading ${totalChunks} chunks`)
          const chunksToUpload = Array.from({ length: totalChunks }, (_, i) => i).filter(
            (i) => !uploadedChunks.includes(i)
          )

          let completedChunks = uploadedChunks.length

          for (const chunkIndex of chunksToUpload) {
            const start = chunkIndex * CHUNK_SIZE
            const end = Math.min(start + CHUNK_SIZE, file.size)
            const chunk = file.slice(start, end)

            const formData = new FormData()
            formData.append('uploadSessionId', uploadSessionId)
            formData.append('chunkIndex', chunkIndex.toString())
            formData.append('chunk', chunk)

            console.log(`[Upload] Uploading chunk ${chunkIndex + 1}/${totalChunks}`)

            const chunkResponse = await axios.post(
              '/api/v1/video/upload/chunk',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                  const chunkProgress = progressEvent.total
                    ? (progressEvent.loaded / progressEvent.total) * 100
                    : 0
                  
                  // 计算总进度
                  const totalProgress =
                    ((completedChunks + chunkProgress / 100) / totalChunks) * 90 // 90% for upload
                  
                  get().updateProgress(id, Math.round(totalProgress))
                },
              }
            )

            if (!chunkResponse.data.success) {
              throw new Error(chunkResponse.data.error || 'Failed to upload chunk')
            }

            completedChunks++
          }

          // Step 3: 完成上传
          console.log('[Upload] Completing upload')
          set((state) => ({
            uploads: state.uploads.map((u) =>
              u.id === id ? { ...u, status: 'processing', progress: 95 } : u
            ),
          }))

          const completeResponse = await axios.post('/api/v1/video/upload/complete', {
            uploadSessionId,
          })

          if (!completeResponse.data.success) {
            throw new Error(completeResponse.data.error || 'Failed to complete upload')
          }

          const { videoId, checkStatusUrl } = completeResponse.data.data

          // 上传完成
          set((state) => ({
            uploads: state.uploads.map((u) =>
              u.id === id
                ? {
                    ...u,
                    status: 'processing',
                    progress: 100,
                    videoId,
                    checkStatusUrl,
                    result: completeResponse.data.data,
                  }
                : u
            ),
            isUploading: false,
          }))

          console.log('[Upload] Upload completed successfully')
        } catch (error: any) {
          console.error('[Upload] Error:', error)
          set((state) => ({
            uploads: state.uploads.map((u) =>
              u.id === id
                ? {
                    ...u,
                    status: 'error',
                    error: error.message || 'Upload failed',
                  }
                : u
            ),
            isUploading: false,
            error: error.message || 'Upload failed',
          }))
        }
      },
      
      updateProgress: (id: string, progress: number) => set((state) => ({
        uploads: state.uploads.map(upload =>
          upload.id === id ? { ...upload, progress } : upload
        )
      })),
      
      removeUpload: (id: string) => set((state) => ({
        uploads: state.uploads.filter(upload => upload.id !== id)
      })),
      
      clearUploads: () => set({ uploads: [], chunkProgress: new Map() }),
      setError: (error: string | null) => set({ error }),
    }),
    { name: 'upload-store' }
  )
)
