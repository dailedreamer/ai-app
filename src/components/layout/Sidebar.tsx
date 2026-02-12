// src/components/layout/Sidebar.tsx
/**
 * Sidebar Component
 * Responsive navigation sidebar
 */

import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  LayoutDashboard,
  Settings,
  X,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ className = '', onClose }: SidebarProps) {
  return (
    <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* New Chat Button */}
      <div className="p-4">
        <NavLink
          to="/chat"
          className="flex items-center gap-2 w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          onClick={onClose}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">New Chat</span>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="p-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">
            Upgrade to Pro
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Get unlimited AI conversations
          </p>
          <button className="mt-3 w-full px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}