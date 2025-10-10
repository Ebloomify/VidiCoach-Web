'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { AuthInitializer } from './AuthInitializer'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <AuthInitializer />
      {children}
    </NextAuthSessionProvider>
  )
}
