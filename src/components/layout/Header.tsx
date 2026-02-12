// src/components/layout/Header.tsx
/**
 * Header Component
 * Responsive top navigation bar
 */

import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">
              AI App
            </span>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                {user?.name || user?.email || 'User'}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block">
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}