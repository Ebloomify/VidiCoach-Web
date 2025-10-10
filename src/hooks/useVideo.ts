import { useVideoStore } from '@/store/videoStore'
import { useCallback } from 'react'

export function useVideo() {
  const {
    videos,
    currentVideo,
    loading,
    error,
    fetchVideos,
    getVideo,
    addVideo,
    updateVideo,
    deleteVideo
  } = useVideoStore()

  const handleVideoClick = useCallback((id: string) => {
    getVideo(id)
  }, [getVideo])

  const handleDeleteVideo = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(id)
    }
  }, [deleteVideo])

  return {
    videos,
    currentVideo,
    loading,
    error,
    fetchVideos,
    getVideo,
    addVideo,
    updateVideo,
    deleteVideo,
    handleVideoClick,
    handleDeleteVideo
  }
}
