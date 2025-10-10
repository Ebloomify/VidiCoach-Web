import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth() {
  const router = useRouter()
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
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile
  }
}
