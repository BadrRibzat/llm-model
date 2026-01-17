'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import SiteHeader from "@/components/SiteHeader";
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
    <div className={`nova-panel rounded-2xl shadow-lg p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <Icon className="h-12 w-12 text-slate-500" />
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center nova-panel p-8 rounded-2xl nova-soft-shadow">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">You need to be logged in to access the admin dashboard.</p>
          <Link href="/login" className="nova-button nova-neon-shadow text-white px-6 py-2 rounded-xl">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, monitor system performance, and oversee chat operations.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-slate-950/40 p-1 rounded-xl border border-white/10 backdrop-blur">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'users', label: 'Users', icon: UsersIcon },
              { id: 'chats', label: 'Chat Logs', icon: ChatBubbleLeftRightIcon },
              { id: 'system', label: 'System', icon: ServerIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'nova-button nova-neon-shadow text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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
            <div className="nova-panel rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <div>
                    <p className="text-sm font-medium text-white">New user registration</p>
                    <p className="text-xs text-slate-400">john_doe joined the platform</p>
                  </div>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <div>
                    <p className="text-sm font-medium text-white">Chat session completed</p>
                    <p className="text-xs text-slate-400">89 messages processed</p>
                  </div>
                  <span className="text-xs text-slate-500">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">System maintenance</p>
                    <p className="text-xs text-slate-400">Database optimization completed</p>
                  </div>
                  <span className="text-xs text-slate-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="nova-panel rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
              <p className="text-sm text-slate-400">Manage registered users and their accounts.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400">{user.date_joined}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="nova-text hover:opacity-80 mr-4">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="nova-panel rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Chat Logs</h2>
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400">Chat logging will be available after MongoDB integration.</p>
              <p className="text-sm text-slate-500 mt-2">Coming soon with model deployment.</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="nova-panel rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Backend Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Django Version:</span>
                      <span className="text-sm font-medium text-white">4.2.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Python Version:</span>
                      <span className="text-sm font-medium text-white">3.12.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Database:</span>
                      <span className="text-sm font-medium text-white">MongoDB Atlas</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Frontend Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Next.js Version:</span>
                      <span className="text-sm font-medium text-white">16.1.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">React Version:</span>
                      <span className="text-sm font-medium text-white">19.2.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">TypeScript:</span>
                      <span className="text-sm font-medium text-white">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="nova-panel rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                  <ServerIcon className="h-8 w-8 text-slate-500 mb-2 mx-auto" />
                  <div className="text-sm font-medium text-white">Clear Cache</div>
                  <div className="text-xs text-slate-500">Clear system cache</div>
                </button>
                <button className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-slate-500 mb-2 mx-auto" />
                  <div className="text-sm font-medium text-white">Export Data</div>
                  <div className="text-xs text-slate-500">Download system logs</div>
                </button>
                <button className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                  <CogIcon className="h-8 w-8 text-slate-500 mb-2 mx-auto" />
                  <div className="text-sm font-medium text-white">System Settings</div>
                  <div className="text-xs text-slate-500">Configure system options</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}