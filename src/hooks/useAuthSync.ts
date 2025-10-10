'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

export function useAuthSync() {
  const { data: session, status } = useSession()
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    setLoading(false)

    if (session?.user) {
      const user: User = {
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

