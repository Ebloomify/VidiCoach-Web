'use client';

import React from 'react';
import { DashboardStats, VideoCategory, VideoStatus } from '@/types';

interface ChartsSectionProps {
  stats: DashboardStats;
}

// 分类名称映射
const categoryNames: Record<VideoCategory, string> = {
  'flight-basics': '飞行基础',
  'equipment-maintenance': '设备维护',
  'industry-applications': '行业应用',
  'safety-procedures': '安全程序',
  'advanced-techniques': '高级技巧',
  'regulations': '法规标准'
};

// 状态名称映射
const statusNames: Record<VideoStatus, string> = {
  'draft': '草稿',
  'pending': '待上架',
  'published': '已上架',
  'archived': '已下架'
};

// 状态颜色映射
const statusColors: Record<VideoStatus, string> = {
  'draft': 'bg-gray-500',
  'pending': 'bg-yellow-500',
  'published': 'bg-green-500',
  'archived': 'bg-red-500'
};

// 分类颜色映射
const categoryColors: Record<VideoCategory, string> = {
  'flight-basics': 'bg-blue-500',
  'equipment-maintenance': 'bg-green-500',
  'industry-applications': 'bg-purple-500',
  'safety-procedures': 'bg-red-500',
  'advanced-techniques': 'bg-yellow-500',
  'regulations': 'bg-indigo-500'
};

// 简单的饼图组件
const SimplePieChart: React.FC<{
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
}> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {/* 饼图区域 */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.reduce((acc, item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = acc.angle;
              const endAngle = acc.angle + (percentage / 100) * 360;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 40 * Math.cos(startAngleRad);
              const y1 = 50 + 40 * Math.sin(startAngleRad);
              const x2 = 50 + 40 * Math.cos(endAngleRad);
              const y2 = 50 + 40 * Math.sin(endAngleRad);
              
              const largeArcFlag = percentage > 50 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              acc.elements.push(
                <path
                  key={index}
                  d={pathData}
                  fill={item.color.replace('bg-', '').replace('-500', '')}
                  className="opacity-80"
                />
              );
              
              acc.angle = endAngle;
              return acc;
            }, { angle: 0, elements: [] as React.ReactNode[] }).elements}
          </svg>
        </div>
      </div>
      
      {/* 图例 */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <div className="text-sm text-gray-600">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 柱状图组件
const SimpleBarChart: React.FC<{
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
}> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 truncate mr-3">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className={`h-6 rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ stats }) => {
  // 准备分类分布数据
  const categoryData = stats.categoryStats.map(item => ({
    label: categoryNames[item.category],
    value: item.count,
    color: categoryColors[item.category]
  }));

  // 准备状态分布数据
  const statusData = stats.statusStats.map(item => ({
    label: statusNames[item.status],
    value: item.count,
    color: statusColors[item.status]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* 按分类分布 */}
      <SimplePieChart
        data={categoryData}
        title="视频分类分布"
      />
      
      {/* 视频状态分布 */}
      <SimpleBarChart
        data={statusData}
        title="视频状态分布"
      />
    </div>
  );
};

export default ChartsSection;
