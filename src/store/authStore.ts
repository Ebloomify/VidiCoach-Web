import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData, AuthState } from '@/types'

export const useAuthStore = create<AuthState>()(
  devtools(
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
          // TODO: Implement actual login API call
          console.log('Login attempt:', credentials)
          
          // Mock user data
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
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
        // Clear local storage
        localStorage.removeItem('token')
      },
      
      register: async (userData: RegisterData) => {
        set({ loading: true, error: null })
        try {
          // TODO: Implement actual register API call
          console.log('Register attempt:', userData)
          
          // Mock user data
          const user: User = {
            id: '1',
            name: userData.name,
            email: userData.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          set({ user, isAuthenticated: true, loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
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
    { name: 'auth-store' }
  )
)
