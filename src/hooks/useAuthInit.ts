'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/authStore'

export function useAuthInit() {
  const { data: session, status } = useSession()
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // 初始化时同步NextAuth状态到Zustand
    if (status === 'loading') {
      setLoading(true)
      return
    }

    setLoading(false)

    if (session?.user) {
      const user = {
        id: session.user.id || session.user.email || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setUser(user)
    } else {
      setUser(null)
    }
  }, [session, status, setUser, setLoading])

  return { session, status }
}

