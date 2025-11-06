'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-bold text-gradient mb-3 inline-block">
            FlowTV
          </Link>
          <p className="text-gray-400 mt-2">Stream your favorite channels with FlowTV</p>
        </div>

        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
          <div className="card-header py-6">
            <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>
            <p className="text-gray-400 text-center mt-2">Join FlowTV today</p>
          </div>
          
          <div className="card-body px-8 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">
                  At least 6 characters required
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in
                </Link>
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