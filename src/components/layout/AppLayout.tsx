// src/components/layout/AppLayout.tsx
/**
 * AppLayout Component
 * Responsive layout wrapper with header and sidebar
 */

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={isMobile}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <Sidebar className="hidden md:block" />
        )}

        {/* Sidebar - Mobile (Overlay) */}
        {isMobile && sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNav />
      )}
    </div>
  );
}