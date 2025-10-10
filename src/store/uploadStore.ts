import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UploadProgress, UploadState } from '@/types'

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useUploadStore = create<UploadState>()(
  devtools(
    (set, get) => ({
      // Initial state
      uploads: [],
      isUploading: false,
      error: null,
      
      // Actions
      uploadFile: async (file: File, type: 'video' | 'image') => {
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
          // TODO: Implement actual upload API call
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
              upload.id === id ? { ...upload, status: 'error' } : upload
            ),
            isUploading: false,
            error: error.message
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
      
      clearUploads: () => set({ uploads: [] }),
      setError: (error: string | null) => set({ error }),
    }),
    { name: 'upload-store' }
  )
)
