// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile'
  },
  VIDEOS: {
    LIST: '/api/videos',
    UPLOAD: '/api/videos/upload',
    GET: (id: string) => `/api/videos/${id}`,
    UPDATE: (id: string) => `/api/videos/${id}`,
    DELETE: (id: string) => `/api/videos/${id}`
  }
} as const

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
} as const

// UI constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  PAGINATION_SIZE: 12
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  VIDEOS: '/videos',
  VIDEO_UPLOAD: '/videos/upload',
  VIDEO_DETAIL: (id: string) => `/videos/${id}`
} as const

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_preference'
} as const
