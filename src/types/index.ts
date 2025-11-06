// User types
export interface User {
  id: string
  name: string
  email: string
  image?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Video types
export interface Video {
  id: string
  title: string
  description?: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  duration: number
  thumbnail?: string
  url: string
  userId: string
  status: VideoStatus
  category: VideoCategory
  tags: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

// Video status for training system
export type VideoStatus = 'draft' | 'pending' | 'published' | 'archived'

// Video processing status (for upload and processing pipeline)
export type VideoProcessStatus = 'UPLOADING' | 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED'

// Video resolution types
export type VideoResolution = 'RES_360P' | 'RES_480P' | 'RES_720P' | 'RES_1080P' | 'RES_2K' | 'RES_4K'

// Video upload and processing types
export interface VideoUploadRecord {
  id: string
  userId: string
  title: string
  description?: string
  originalName: string
  filename: string
  mimeType: string
  fileSize: number
  duration?: number
  status: VideoProcessStatus
  processError?: string
  processAttempts: number
  uploadPath?: string
  s3Key?: string
  s3Bucket?: string
  hlsPlaylistUrl?: string
  dashManifestUrl?: string
  thumbnailUrl?: string
  versions: VideoVersion[]
  tags: string[]
  category?: string
  viewCount: number
  createdAt: string
  updatedAt: string
  processStartedAt?: string
  processCompletedAt?: string
}

export interface VideoVersion {
  id: string
  videoId: string
  resolution: VideoResolution
  bitrate: number
  fileSize: number
  s3Key: string
  url: string
  createdAt: string
}

export interface VideoUploadSession {
  id: string
  userId: string
  filename: string
  fileSize: number
  mimeType: string
  totalChunks: number
  uploadedChunks: number[]
  title: string
  description?: string
  category?: string
  tags: string[]
  tempPath?: string
  completed: boolean
  videoId?: string
  createdAt: string
  updatedAt: string
  expiresAt: string
}

// Video categories for training system
export type VideoCategory = 
  | 'flight-basics' 
  | 'equipment-maintenance' 
  | 'industry-applications' 
  | 'safety-procedures' 
  | 'advanced-techniques'
  | 'regulations'

// Dashboard statistics
export interface DashboardStats {
  // Content management KPIs
  pendingPublishCount: number
  todayUploadCount: number
  weekUploadCount: number
  archivedCount: number
  totalVideoCount: number
  
  // Category distribution
  categoryStats: CategoryStats[]
  
  // Status distribution
  statusStats: StatusStats[]
  
  // Recent activities
  recentUploads: RecentUpload[]
  recentOperations: OperationLog[]
}

export interface CategoryStats {
  category: VideoCategory
  count: number
  percentage: number
}

export interface StatusStats {
  status: VideoStatus
  count: number
  percentage: number
}

export interface RecentUpload {
  id: string
  title: string
  uploadTime: string
  status: VideoStatus
  category: VideoCategory
  uploader: string
}

export interface OperationLog {
  id: string
  action: 'publish' | 'archive' | 'categorize' | 'update'
  videoTitle: string
  operator: string
  timestamp: string
  details?: string
}

// Learning analytics
export interface LearningAnalytics {
  totalLearners: number
  activeLearners: number
  completedCourses: number
  averageCompletionRate: number
  popularCategories: CategoryStats[]
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// Upload types
export interface UploadProgress {
  id: string
  file: File
  type: 'video' | 'image'
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  result?: any
  error?: string
  uploadSessionId?: string
  videoId?: string
  checkStatusUrl?: string
}

export interface ChunkUploadProgress {
  chunkIndex: number
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
}

// Video upload request/response types
export interface InitUploadRequest {
  filename: string
  fileSize: number
  mimeType: string
  totalChunks: number
  title: string
  description?: string
  category?: string
  tags?: string[]
}

export interface InitUploadResponse {
  success: boolean
  data?: {
    uploadSessionId: string
    uploadedChunks: number[]
    expiresAt: string
  }
  error?: string
}

export interface UploadChunkRequest {
  uploadSessionId: string
  chunkIndex: number
  chunk: Blob
}

export interface UploadChunkResponse {
  success: boolean
  data?: {
    chunkIndex: number
    uploadedChunks: number[]
  }
  error?: string
}

export interface CompleteUploadRequest {
  uploadSessionId: string
}

export interface CompleteUploadResponse {
  success: boolean
  message?: string
  data?: {
    videoId: string
    status: VideoProcessStatus
    checkStatusUrl: string
  }
  error?: string
}

export interface VideoStatusResponse {
  success: boolean
  data?: {
    videoId: string
    status: VideoProcessStatus
    progress?: number
    processError?: string
    thumbnailUrl?: string
    hlsPlaylistUrl?: string
    dashManifestUrl?: string
    duration?: number
    createdAt?: string
    versions?: VideoVersion[]
  }
  error?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Component Props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Store types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export interface VideoState {
  videos: Video[]
  currentVideo: Video | null
  dashboardStats: DashboardStats | null
  loading: boolean
  error: string | null
  fetchVideos: () => Promise<void>
  getVideo: (id: string) => Promise<void>
  addVideo: (video: Video) => void
  updateVideo: (id: string, updates: Partial<Video>) => void
  deleteVideo: (id: string) => void
  updateVideoStatus: (id: string, status: VideoStatus) => void
  updateVideoCategory: (id: string, category: VideoCategory) => void
  fetchDashboardStats: () => Promise<void>
  setCurrentVideo: (video: Video | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export interface UploadState {
  uploads: UploadProgress[]
  isUploading: boolean
  error: string | null
  uploadFile: (file: File, type: 'video' | 'image') => Promise<void>
  updateProgress: (id: string, progress: number) => void
  removeUpload: (id: string) => void
  clearUploads: () => void
  setError: (error: string | null) => void
}
