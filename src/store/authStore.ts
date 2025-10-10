import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData, AuthState } from '@/types'
import { signIn, signOut, useSession } from 'next-auth/react'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      
      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null })
        try {
          const result = await signIn('credentials', {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
          })
          
          if (result?.error) {
            set({ error: 'Invalid credentials', loading: false })
            return
          }
          
          // Mock user data for now
          const user: User = {
            id: '1',
            name: 'Test User',
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          set({ user, isAuthenticated: true, loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      
      logout: async () => {
        set({ user: null, isAuthenticated: false })
        // Clear local storage
        localStorage.removeItem('token')
        // Sign out from NextAuth
        await signOut({ redirect: false })
      },
      
      register: async (userData: RegisterData) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error || '注册失败')
          }

          if (result.success) {
            // 注册成功后自动登录
            const loginResult = await signIn('credentials', {
              email: userData.email,
              password: userData.password,
              redirect: false,
            })

            if (loginResult?.error) {
              throw new Error('注册成功，但自动登录失败，请手动登录')
            }

            // 从API响应中获取用户信息
            const user: User = {
              id: result.data.user.id,
              name: result.data.user.name,
              email: result.data.user.email,
              createdAt: result.data.user.createdAt,
              updatedAt: result.data.user.updatedAt
            }
            
            set({ user, isAuthenticated: true, loading: false })
          } else {
            throw new Error(result.error || '注册失败')
          }
        } catch (error: any) {
          set({ error: error.message, loading: false })
          throw error
        }
      },
      
      updateProfile: async (updates: Partial<User>) => {
        const { user } = get()
        if (!user) return
        
        set({ loading: true, error: null })
        try {
          // TODO: Implement actual update API call
          const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() }
          set({ user: updatedUser, loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      
        setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: string | null) => set({ error }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
)
