// src/components/layout/MobileNav.tsx
/**
 * MobileNav Component
 * Bottom navigation for mobile devices
 */

import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  LayoutDashboard,
  Settings,
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 py-3 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}