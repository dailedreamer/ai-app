// src/pages/DashboardPage.tsx
/**
 * DashboardPage Component
 * Responsive dashboard with stats and recent activity
 */

import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Chats',
      value: '24',
      change: '+12%',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Messages Sent',
      value: '1,429',
      change: '+18%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Hours Saved',
      value: '47',
      change: '+23%',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'AI Credits',
      value: '850',
      change: '-5%',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const recentChats = [
    {
      id: '1',
      title: 'Marketing Strategy Discussion',
      preview: 'Help me create a marketing plan for...',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Code Review Assistant',
      preview: 'Can you review this React component...',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      title: 'Content Writing Help',
      preview: 'I need help writing a blog post about...',
      timestamp: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Welcome back! Here's your AI activity overview.
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => navigate('/chat')}
          icon={<MessageSquare className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">New Chat</span>
          <span className="sm:hidden">Chat</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} from last month
                </p>
              </div>
              
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Chats */}
      <Card padding="none">
        <div className="p-4 md:p-6">
          <CardHeader
            title="Recent Chats"
            subtitle="Your latest AI conversations"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/chat')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            }
          />
          
          <div className="space-y-3 md:space-y-4">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {chat.preview}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {chat.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/chat')}
            >
              <MessageSquare className="w-4 h-4" />
              Start New Chat
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </Button>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-3">
            Upgrade to Pro
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Get unlimited AI conversations, priority support, and advanced features.
          </p>
          <Button variant="primary" className="w-full">
            Upgrade Now
          </Button>
        </Card>
      </div>
    </div>
  );
}