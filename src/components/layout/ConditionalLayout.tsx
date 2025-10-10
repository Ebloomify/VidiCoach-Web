'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // 不需要导航栏的页面
  const noHeaderPages = ['/login', '/register']
  const shouldShowHeader = !noHeaderPages.includes(pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && (
        <>
          {/* Header at the top */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Content area with sidebar and main content */}
          <div className="flex min-h-[calc(100vh-4rem)]">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </>
      )}
      {!shouldShowHeader && (
        <main>
          {children}
        </main>
      )}
    </div>
  )
}
