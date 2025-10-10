import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Video, VideoState, DashboardStats, VideoStatus, VideoCategory } from '@/types'

export const useVideoStore = create<VideoState>()(
  devtools(
    (set, get) => ({
      // Initial state
      videos: [],
      currentVideo: null,
      dashboardStats: null,
      loading: false,
      error: null,
      
      // Actions
      fetchVideos: async () => {
        set({ loading: true, error: null })
        try {
          // TODO: Implement actual API call
          console.log('Fetching videos...')
          
          // Mock video data for training system
          const videos: Video[] = [
            {
              id: '1',
              title: '无人机基础飞行操作',
              description: '学习无人机的基本飞行操作和安全注意事项',
              filename: 'drone_basic_flight.mp4',
              originalName: 'drone_basic_flight.mp4',
              mimeType: 'video/mp4',
              size: 245 * 1024 * 1024, // 245MB
              duration: 332, // 5:32 in seconds
              url: '/api/videos/1',
              userId: '1',
              status: 'published',
              category: 'flight-basics',
              tags: ['基础', '飞行', '安全'],
              viewCount: 1250,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              title: '设备维护与保养指南',
              description: '无人机日常维护和故障排除方法',
              filename: 'equipment_maintenance.mp4',
              originalName: 'equipment_maintenance.mp4',
              mimeType: 'video/mp4',
              size: 180 * 1024 * 1024, // 180MB
              duration: 225, // 3:45 in seconds
              url: '/api/videos/2',
              userId: '1',
              status: 'pending',
              category: 'equipment-maintenance',
              tags: ['维护', '保养', '故障'],
              viewCount: 0,
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              title: '农业植保应用案例',
              description: '无人机在农业植保中的实际应用案例',
              filename: 'agriculture_application.mp4',
              originalName: 'agriculture_application.mp4',
              mimeType: 'video/mp4',
              size: 320 * 1024 * 1024, // 320MB
              duration: 450, // 7:30 in seconds
              url: '/api/videos/3',
              userId: '2',
              status: 'published',
              category: 'industry-applications',
              tags: ['农业', '植保', '应用'],
              viewCount: 890,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '4',
              title: '安全飞行规范',
              description: '无人机安全飞行的基本规范和注意事项',
              filename: 'safety_procedures.mp4',
              originalName: 'safety_procedures.mp4',
              mimeType: 'video/mp4',
              size: 200 * 1024 * 1024, // 200MB
              duration: 280, // 4:40 in seconds
              url: '/api/videos/4',
              userId: '1',
              status: 'published',
              category: 'safety-procedures',
              tags: ['安全', '规范', '飞行'],
              viewCount: 2100,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '5',
              title: '高级飞行技巧',
              description: '无人机高级飞行技巧和复杂环境操作',
              filename: 'advanced_techniques.mp4',
              originalName: 'advanced_techniques.mp4',
              mimeType: 'video/mp4',
              size: 400 * 1024 * 1024, // 400MB
              duration: 600, // 10:00 in seconds
              url: '/api/videos/5',
              userId: '2',
              status: 'draft',
              category: 'advanced-techniques',
              tags: ['高级', '技巧', '复杂环境'],
              viewCount: 0,
              createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '6',
              title: '无人机法规解读',
              description: '最新无人机相关法规和政策解读',
              filename: 'regulations_guide.mp4',
              originalName: 'regulations_guide.mp4',
              mimeType: 'video/mp4',
              size: 150 * 1024 * 1024, // 150MB
              duration: 180, // 3:00 in seconds
              url: '/api/videos/6',
              userId: '1',
              status: 'archived',
              category: 'regulations',
              tags: ['法规', '政策', '解读'],
              viewCount: 750,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
          
          set({ videos, loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      
      getVideo: async (id: string) => {
        set({ loading: true, error: null })
        try {
          // TODO: Implement actual API call
          console.log('Fetching video:', id)
          
          const { videos } = get()
          const video = videos.find(v => v.id === id)
          
          if (video) {
            set({ currentVideo: video, loading: false })
          } else {
            set({ error: 'Video not found', loading: false })
          }
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      
      addVideo: (video: Video) => set((state) => ({
        videos: [...state.videos, video]
      })),
      
      updateVideo: (id: string, updates: Partial<Video>) => set((state) => ({
        videos: state.videos.map(video =>
          video.id === id ? { ...video, ...updates, updatedAt: new Date().toISOString() } : video
        )
      })),
      
      deleteVideo: (id: string) => set((state) => ({
        videos: state.videos.filter(video => video.id !== id)
      })),
      
      updateVideoStatus: (id: string, status: VideoStatus) => set((state) => ({
        videos: state.videos.map(video =>
          video.id === id ? { ...video, status, updatedAt: new Date().toISOString() } : video
        )
      })),
      
      updateVideoCategory: (id: string, category: VideoCategory) => set((state) => ({
        videos: state.videos.map(video =>
          video.id === id ? { ...video, category, updatedAt: new Date().toISOString() } : video
        )
      })),
      
      fetchDashboardStats: async () => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement actual API call
          console.log('Fetching dashboard stats...');
          
          const { videos } = get();
          
          // 计算统计数据
          const pendingPublishCount = videos.filter(v => v.status === 'pending').length;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayUploadCount = videos.filter(v => new Date(v.createdAt) >= today).length;
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const weekUploadCount = videos.filter(v => new Date(v.createdAt) >= weekAgo).length;
          const archivedCount = videos.filter(v => v.status === 'archived').length;
          const totalVideoCount = videos.length;
          
          // 分类统计
          const categoryStats = [
            { category: 'flight-basics' as VideoCategory, count: 0, percentage: 0 },
            { category: 'equipment-maintenance' as VideoCategory, count: 0, percentage: 0 },
            { category: 'industry-applications' as VideoCategory, count: 0, percentage: 0 },
            { category: 'safety-procedures' as VideoCategory, count: 0, percentage: 0 },
            { category: 'advanced-techniques' as VideoCategory, count: 0, percentage: 0 },
            { category: 'regulations' as VideoCategory, count: 0, percentage: 0 }
          ];
          
          videos.forEach(video => {
            const categoryIndex = categoryStats.findIndex(c => c.category === video.category);
            if (categoryIndex !== -1) {
              categoryStats[categoryIndex].count++;
            }
          });
          
          categoryStats.forEach(stat => {
            stat.percentage = totalVideoCount > 0 ? (stat.count / totalVideoCount) * 100 : 0;
          });
          
          // 状态统计
          const statusStats = [
            { status: 'draft' as VideoStatus, count: 0, percentage: 0 },
            { status: 'pending' as VideoStatus, count: 0, percentage: 0 },
            { status: 'published' as VideoStatus, count: 0, percentage: 0 },
            { status: 'archived' as VideoStatus, count: 0, percentage: 0 }
          ];
          
          videos.forEach(video => {
            const statusIndex = statusStats.findIndex(s => s.status === video.status);
            if (statusIndex !== -1) {
              statusStats[statusIndex].count++;
            }
          });
          
          statusStats.forEach(stat => {
            stat.percentage = totalVideoCount > 0 ? (stat.count / totalVideoCount) * 100 : 0;
          });
          
          // 最新上传
          const recentUploads = videos
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(video => ({
              id: video.id,
              title: video.title,
              uploadTime: video.createdAt,
              status: video.status,
              category: video.category,
              uploader: `用户${video.userId}`
            }));
          
          // 操作记录
          const recentOperations = [
            {
              id: '1',
              action: 'publish' as const,
              videoTitle: '无人机基础飞行操作',
              operator: '管理员',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              details: '审核通过并发布'
            },
            {
              id: '2',
              action: 'categorize' as const,
              videoTitle: '设备维护与保养指南',
              operator: '管理员',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              details: '分类为设备维护'
            },
            {
              id: '3',
              action: 'archive' as const,
              videoTitle: '无人机法规解读',
              operator: '管理员',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              details: '内容过时，已下架'
            },
            {
              id: '4',
              action: 'update' as const,
              videoTitle: '安全飞行规范',
              operator: '管理员',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              details: '更新安全标准'
            }
          ];
          
          const dashboardStats: DashboardStats = {
            pendingPublishCount,
            todayUploadCount,
            weekUploadCount,
            archivedCount,
            totalVideoCount,
            categoryStats,
            statusStats,
            recentUploads,
            recentOperations
          };
          
          set({ dashboardStats, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      
      setCurrentVideo: (video: Video | null) => set({ currentVideo: video }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    { name: 'video-store' }
  )
)
