'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalFavorites: number;
  mostFavoritedChannels: { name: string; favorites: number }[];
}

interface SystemStats {
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  totalStreams: number;
  activeStreams: number;
}

export default function DeveloperStats() {
  const { user } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');

  // Check if user has developer access
  const hasDevAccess = typeof window !== 'undefined' && localStorage.getItem('devAccess') === 'true';
  const isDeveloper = user?.email?.includes('@flowtv.com') || user?.email === 'admin@example.com' || hasDevAccess;

  useEffect(() => {
    // If user doesn't have dev access, redirect to login
    if (!isDeveloper) {
      router.push('/dev/login');
      return;
    }

    // Fetch real statistics from API
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch statistics: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setUserStats(data.userStats);
        setSystemStats(data.systemStats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
        setLoading(false);
        
        // Fallback to mock data if API fails
        const mockUserStats: UserStats = {
          totalUsers: 1240,
          activeUsers: 856,
          newUsersToday: 24,
          totalFavorites: 3420,
          mostFavoritedChannels: [
            { name: 'Sports Channel 1', favorites: 120 },
            { name: 'News Network', favorites: 98 },
            { name: 'Movie Channel', favorites: 87 },
            { name: 'Kids TV', favorites: 65 },
            { name: 'Documentary Hub', favorites: 54 }
          ]
        };

        const mockSystemStats: SystemStats = {
          uptime: '15 days, 4 hours, 22 minutes',
          cpuUsage: 42,
          memoryUsage: 68,
          totalStreams: 542,
          activeStreams: 298
        };

        setUserStats(mockUserStats);
        setSystemStats(mockSystemStats);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [isDeveloper, router]);

  if (!isDeveloper) {
    return null; // Will redirect to login page
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          Loading statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Statistics</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Displaying fallback mock data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Statistics</h1>
            <p className="text-gray-400">Real-time system and user analytics dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* System Stats */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">System Statistics</h2>
            <span className="text-sm text-gray-400">Updated just now</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Uptime</p>
                  <p className="text-2xl font-bold">{systemStats?.uptime}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">CPU Usage</p>
                  <p className="text-2xl font-bold">{systemStats?.cpuUsage}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${systemStats?.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Memory Usage</p>
                  <p className="text-2xl font-bold">{systemStats?.memoryUsage}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${systemStats?.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Streams</p>
                  <p className="text-2xl font-bold">{systemStats?.activeStreams}/{systemStats?.totalStreams}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Statistics</h2>
            <span className="text-sm text-gray-400">Live data</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{userStats?.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold">{userStats?.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">New Users Today</p>
                  <p className="text-2xl font-bold">{userStats?.newUsersToday}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Most Favorited Channels</h3>
              <span className="text-sm text-gray-400">{userStats?.totalFavorites} total favorites</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Channel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Favorites</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {userStats?.mostFavoritedChannels.map((channel, index) => (
                    <tr key={index} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{channel.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{channel.favorites}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(channel.favorites / (userStats?.mostFavoritedChannels[0]?.favorites || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-10">
                            {Math.round((channel.favorites / (userStats?.totalFavorites || 1)) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Developer Tools */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">System Logs</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">View application logs and error reports</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                View Logs
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg mr-3 group-hover:bg-green-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Database Stats</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Monitor database performance and usage</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                View Stats
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">API Monitoring</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Track API performance and response times</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                View Metrics
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}