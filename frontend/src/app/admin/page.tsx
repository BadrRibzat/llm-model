'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  ClockIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

interface ChatStat {
  total_chats: number;
  total_users: number;
  active_today: number;
  avg_response_time: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<ChatStat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      // This would be replaced with actual API calls
      setStats({
        total_chats: 1247,
        total_users: 89,
        active_today: 23,
        avg_response_time: 2.3
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // This would be replaced with actual API call to get users
      setUsers([
        { id: 1, username: 'john_doe', email: 'john@example.com', date_joined: '2024-01-15' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', date_joined: '2024-01-14' },
        { id: 3, username: 'admin', email: 'admin@example.com', date_joined: '2024-01-10' },
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access the admin dashboard.</p>
          <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">AI Chat Model</Link>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Admin Dashboard</span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">← Back to App</Link>
              <Link href="/support" className="text-gray-500 hover:text-gray-900">Support</Link>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-900"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, monitor system performance, and oversee chat operations.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'users', label: 'Users', icon: UsersIcon },
              { id: 'chats', label: 'Chat Logs', icon: ChatBubbleLeftRightIcon },
              { id: 'system', label: 'System', icon: ServerIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats?.total_users || 0}
                icon={UserGroupIcon}
                color="border-blue-500"
              />
              <StatCard
                title="Total Chats"
                value={stats?.total_chats || 0}
                icon={ChatBubbleLeftRightIcon}
                color="border-green-500"
              />
              <StatCard
                title="Active Today"
                value={stats?.active_today || 0}
                icon={ClockIcon}
                color="border-yellow-500"
              />
              <StatCard
                title="Avg Response Time"
                value={`${stats?.avg_response_time || 0}s`}
                icon={CogIcon}
                color="border-purple-500"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">New user registration</p>
                    <p className="text-xs text-gray-500">john_doe joined the platform</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chat session completed</p>
                    <p className="text-xs text-gray-500">89 messages processed</p>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">System maintenance</p>
                    <p className="text-xs text-gray-500">Database optimization completed</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600">Manage registered users and their accounts.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.date_joined}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat Logs</h2>
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Chat logging will be available after MongoDB integration.</p>
              <p className="text-sm text-gray-400 mt-2">Coming soon with model deployment.</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Backend Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Django Version:</span>
                      <span className="text-sm font-medium">4.2.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Python Version:</span>
                      <span className="text-sm font-medium">3.12.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Database:</span>
                      <span className="text-sm font-medium">MongoDB Atlas</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Frontend Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Next.js Version:</span>
                      <span className="text-sm font-medium">16.1.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">React Version:</span>
                      <span className="text-sm font-medium">19.2.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TypeScript:</span>
                      <span className="text-sm font-medium">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ServerIcon className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                  <div className="text-sm font-medium text-gray-900">Clear Cache</div>
                  <div className="text-xs text-gray-500">Clear system cache</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                  <div className="text-sm font-medium text-gray-900">Export Data</div>
                  <div className="text-xs text-gray-500">Download system logs</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CogIcon className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                  <div className="text-sm font-medium text-gray-900">System Settings</div>
                  <div className="text-xs text-gray-500">Configure system options</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}