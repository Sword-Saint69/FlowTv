'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeveloperLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In a real application, you would verify the password against a secure backend
    // For this demo, we'll use a simple check
    if (password === 'dev-password-123') {
      // Set a cookie or session to indicate developer access
      localStorage.setItem('devAccess', 'true');
      router.push('/dev/stats');
    } else {
      setError('Invalid developer password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient mb-3">FlowTV</h1>
          <p className="text-gray-400">Developer Statistics Portal</p>
        </div>

        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
          <div className="card-header py-6">
            <h2 className="text-2xl font-bold text-white text-center">Developer Login</h2>
            <p className="text-gray-400 text-center mt-2">Enter developer credentials to access statistics</p>
          </div>
          
          <div className="card-body px-8 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                  Developer Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter developer password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Access Developer Portal'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-sm text-gray-500">
                This portal is for authorized developers only.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FlowTV. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}