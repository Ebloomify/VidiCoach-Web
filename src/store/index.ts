import { useAuthStore } from './authStore'
import { useVideoStore } from './videoStore'
import { useUploadStore } from './uploadStore'

export { useAuthStore } from './authStore'
export { useVideoStore } from './videoStore'
export { useUploadStore } from './uploadStore'

// Combined store hook for accessing multiple stores
export function useAppState() {
  const auth = useAuthStore()
  const video = useVideoStore()
  const upload = useUploadStore()

  return {
    auth,
    video,
    upload
  }
}
