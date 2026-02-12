// src/pages/SettingsPage.tsx
/**
 * SettingsPage Component
 * User settings and preferences
 */

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { Save, User as UserIcon, Lock, Bell } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card padding="none">
        <div className="p-4 md:p-6">
          <CardHeader
            title="Profile Information"
            subtitle="Update your personal details"
          />
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
              />
              
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <Button
              variant="primary"
              loading={saving}
              onClick={handleSaveProfile}
              icon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card padding="none">
        <div className="p-4 md:p-6">
          <CardHeader
            title="Security"
            subtitle="Manage your password and security settings"
          />
          
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />
              
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>

            <Button
              variant="primary"
              icon={<Lock className="w-4 h-4" />}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card padding="none">
        <div className="p-4 md:p-6">
          <CardHeader
            title="Notifications"
            subtitle="Choose what notifications you receive"
          />
          
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', description: 'Receive email updates about your activity' },
              { label: 'Push Notifications', description: 'Get notified about new messages' },
              { label: 'Marketing Emails', description: 'Receive tips and product updates' },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Preferences */}
      <Card padding="none">
        <div className="p-4 md:p-6">
          <CardHeader
            title="AI Preferences"
            subtitle="Customize your AI experience"
          />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default AI Model
              </label>
              <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>GPT-4 Turbo (Recommended)</option>
                <option>GPT-3.5 Turbo (Faster)</option>
                <option>Claude 3 Opus</option>
                <option>Claude 3 Sonnet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Length
              </label>
              <select className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Concise</option>
                <option>Balanced (Recommended)</option>
                <option>Detailed</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="none">
        <div className="p-4 md:p-6">
          <CardHeader
            title="Danger Zone"
            subtitle="Irreversible actions"
          />
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full sm:w-auto">
              Export My Data
            </Button>
            
            <Button variant="danger" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}