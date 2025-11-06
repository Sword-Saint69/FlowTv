'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const features = [
    {
      title: "Thousands of Channels",
      description: "Access to a vast library of live TV channels from around the world",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "High Quality Streaming",
      description: "Enjoy crystal clear HD and 4K streaming with minimal buffering",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Multi-Device Support",
      description: "Watch on your TV, phone, tablet, or computer - anywhere, anytime",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "24/7 Customer Support",
      description: "Our support team is always ready to help you with any issues",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    }
  ];

  const shareOnSocialMedia = (platform: string) => {
    const url = window.location.href;
    const text = "Check out FlowTV - Premium IPTV Streaming!";
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
  };

  // Check if user is a developer (you can implement your own logic here)
  const isDeveloper = user?.email?.includes('@flowtv.com') || user?.email === 'admin@example.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gradient">FlowTV</div>
            <div className="flex space-x-4">
              <a 
                href="/about" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              {isDeveloper && (
                <a 
                  href="/dev/stats" 
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Developer Stats
                </a>
              )}
              <a 
                href="/auth/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </a>
              <a 
                href="/auth/signup" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="block">Experience Premium</span>
                <span className="block text-gradient mt-2">IPTV Streaming</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-lg">
                Stream thousands of live TV channels and on-demand content with crystal clear quality and zero buffering.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a 
                  href="/auth/signup" 
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105 duration-300 text-center"
                >
                  Start Free Trial
                </a>
                <a 
                  href="/auth/login" 
                  className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105 duration-300 text-center"
                >
                  Login
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                <div className="bg-gray-800 p-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose FlowTV?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              The ultimate streaming experience with premium features
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex justify-center">
                    <div className="bg-gray-700 p-3 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white text-center">{feature.title}</h3>
                  <p className="mt-2 text-gray-300 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Join thousands of satisfied users enjoying premium IPTV streaming
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-white">User {i+1}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-300">
                  "FlowTV has completely transformed my entertainment experience. The quality is amazing and I love the variety of channels available."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Sharing Section */}
      <div className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Share FlowTV with Friends
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Love FlowTV? Share it with your friends and family
            </p>
            
            <div className="mt-10 flex justify-center space-x-6">
              <button 
                onClick={() => shareOnSocialMedia('facebook')}
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </button>
              
              <button 
                onClick={() => shareOnSocialMedia('twitter')}
                className="bg-blue-400 hover:bg-blue-500 p-3 rounded-full transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </button>
              
              <button 
                onClick={() => shareOnSocialMedia('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 p-3 rounded-full transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
              
              <button 
                onClick={() => shareOnSocialMedia('copy')}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-colors"
                aria-label="Copy link"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12 border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to Transform Your Entertainment Experience?
              </h2>
              <p className="mt-4 text-xl text-gray-300">
                Join thousands of satisfied users enjoying premium IPTV streaming
              </p>
              <div className="mt-10">
                <a 
                  href="/auth/signup" 
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105 duration-300 inline-block"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-gradient">FlowTV</h3>
              <p className="mt-4 text-gray-400 max-w-md">
                The ultimate IPTV streaming platform with thousands of channels and premium features.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Product</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Channels</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} FlowTV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}