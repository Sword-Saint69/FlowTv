'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  // Check if user has developer access
  const hasDevAccess = typeof window !== 'undefined' && localStorage.getItem('devAccess') === 'true';
  const isDeveloper = user?.email?.includes('@flowtv.com') || user?.email === 'admin@example.com' || hasDevAccess;

  useEffect(() => {
    // If user doesn't have dev access, redirect to login
    if (typeof window !== 'undefined' && !isDeveloper) {
      router.push('/dev/login');
    }
  }, [isDeveloper, router]);

  if (typeof window !== 'undefined' && !isDeveloper) {
    return null; // Will redirect to login page
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Developer Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl font-bold text-gradient">FlowTV Dev</div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/dev/stats"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Statistics
                  </a>
                  <a
                    href="/dev/settings"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Settings
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem('devAccess');
                  router.push('/');
                }}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Exit Developer Mode
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
}