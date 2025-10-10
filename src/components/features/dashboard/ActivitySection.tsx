'use client';

import React from 'react';
import { DashboardStats, VideoStatus, VideoCategory } from '@/types';

interface ActivitySectionProps {
  stats: DashboardStats;
}

// 分类名称映射
const categoryNames: Record<VideoCategory, string> = {
  'flight-basics': 'Flight Basics',
  'equipment-maintenance': 'Equipment Maintenance',
  'industry-applications': 'Industry Applications',
  'safety-procedures': 'Safety Procedures',
  'advanced-techniques': 'Advanced Techniques',
  'regulations': 'Regulations'
};

// 状态名称映射
const statusNames: Record<VideoStatus, string> = {
  'draft': 'Draft',
  'pending': 'Pending',
  'published': 'Published',
  'archived': 'Archived'
};

// 状态颜色映射
const statusColors: Record<VideoStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'published': 'bg-green-100 text-green-800',
  'archived': 'bg-red-100 text-red-800'
};

// 操作图标映射
const actionIcons: Record<string, React.ReactNode> = {
  publish: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  archive: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V4" />
    </svg>
  ),
  categorize: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  update: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
};

// 操作名称映射
const actionNames: Record<string, string> = {
  publish: 'Published',
  archive: 'Archived',
  categorize: 'Categorized',
  update: 'Updated'
};

// 操作颜色映射
const actionColors: Record<string, string> = {
  publish: 'text-green-600 bg-green-50',
  archive: 'text-red-600 bg-red-50',
  categorize: 'text-blue-600 bg-blue-50',
  update: 'text-yellow-600 bg-yellow-50'
};

// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

// 最新上传列表组件
const RecentUploadsList: React.FC<{ uploads: DashboardStats['recentUploads'] }> = ({ uploads }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
        <a href="/videos/list" className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </a>
      </div>
      
      <div className="space-y-3">
        {uploads.map((upload) => (
          <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {upload.title}
              </h4>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[upload.status]}`}>
                  {statusNames[upload.status]}
                </span>
                <span className="text-xs text-gray-500">
                  {categoryNames[upload.category]}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{formatTime(upload.uploadTime)}</p>
              <p className="text-xs text-gray-400">{upload.uploader}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 操作日志组件
const OperationLogsList: React.FC<{ operations: DashboardStats['recentOperations'] }> = ({ operations }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Operation Records</h3>
        <a href="/admin/logs" className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </a>
      </div>
      
      <div className="space-y-3">
        {operations.map((operation) => (
          <div key={operation.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-full ${actionColors[operation.action]}`}>
              {actionIcons[operation.action]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {operation.operator}
                </span>
                <span className="text-sm text-gray-600">
                  {actionNames[operation.action]}
                </span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {operation.videoTitle}
                </span>
              </div>
              {operation.details && (
                <p className="text-xs text-gray-500 mt-1">{operation.details}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{formatTime(operation.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivitySection: React.FC<ActivitySectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentUploadsList uploads={stats.recentUploads} />
      <OperationLogsList operations={stats.recentOperations} />
    </div>
  );
};

export default ActivitySection;
