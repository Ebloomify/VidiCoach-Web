import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthSync } from './useAuthSync'

export function useAuth() {
  const router = useRouter()
  const { session, status } = useAuthSync()
  const {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile
  } = useAuthStore()

  // Auto redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated' && !loading) {
      router.push('/login')
    }
  }, [status, loading, router])

  return {
    user,
    isAuthenticated,
    loading: loading || status === 'loading',
    error,
    login,
    logout,
    register,
    updateProfile,
    session
  }
}
