'use client';

import { useState, useEffect, useCallback } from 'react';
import { parseM3U, Channel } from '@/utils/parseM3U';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, userPreferences, updateFavorites, updateLastWatched } = useAuth();

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const response = await fetch('/myplaylist.m3u');
        if (!response.ok) {
          throw new Error('Failed to load playlist');
        }
        const content = await response.text();
        const parsedChannels = parseM3U(content);
        setChannels(parsedChannels);
        
        // Load favorites - either from user preferences (if logged in) or localStorage
        if (user && userPreferences) {
          setFavorites(new Set(userPreferences.favorites));
        } else {
          const savedFavorites = localStorage.getItem('favorites');
          if (savedFavorites) {
            setFavorites(new Set(JSON.parse(savedFavorites)));
          }
        }
        
        // Load last watched channel - either from user preferences (if logged in) or localStorage
        let lastWatchedId = null;
        if (user && userPreferences) {
          lastWatchedId = userPreferences.lastWatched;
        } else {
          lastWatchedId = localStorage.getItem('lastWatchedChannel');
        }
        
        if (lastWatchedId) {
          const lastChannel = parsedChannels.find(ch => ch.id === lastWatchedId);
          if (lastChannel) {
            setSelectedChannel(lastChannel);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    // Only load playlist if user is authenticated
    if (user) {
      loadPlaylist();
    } else {
      setLoading(false);
    }
  }, [user, userPreferences]);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    
    // Save to user preferences (if logged in) or localStorage
    if (user) {
      updateLastWatched(channel.id);
    } else {
      localStorage.setItem('lastWatchedChannel', channel.id);
    }
  };

  const toggleFavorite = (channelId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(channelId)) {
        newFavorites.delete(channelId);
      } else {
        newFavorites.add(channelId);
      }
      
      // Save to user preferences (if logged in) or localStorage
      if (user) {
        updateFavorites(Array.from(newFavorites));
      } else {
        localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      }
      
      return newFavorites;
    });
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Space to toggle play/pause
    if (e.code === 'Space') {
      e.preventDefault();
      // Play/pause functionality would be handled by the Player component
    }
    
    // F for fullscreen
    if (e.code === 'KeyF') {
      // Fullscreen functionality would be handled by the Player component
    }
    
    // Up/Down arrows to navigate channels
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
      if (channels.length > 0) {
        let currentIndex = selectedChannel 
          ? channels.findIndex(ch => ch.id === selectedChannel.id) 
          : -1;
        
        if (e.code === 'ArrowUp') {
          currentIndex = currentIndex <= 0 ? channels.length - 1 : currentIndex - 1;
        } else {
          currentIndex = currentIndex >= channels.length - 1 ? 0 : currentIndex + 1;
        }
        
        handleChannelSelect(channels[currentIndex]);
      }
    }
  }, [channels, selectedChannel]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="h-8 bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-16 bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center p-3">
                <div className="w-10 h-10 rounded-md bg-gray-700 mr-3 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Player Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-gray-900 border-b border-gray-700">
            <div className="h-6 bg-gray-800 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-48 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to landing page if user is not authenticated
  if (!user) {
    router.push('/landing');
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        channels={channels} 
        selectedChannel={selectedChannel} 
        onChannelSelect={handleChannelSelect} 
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <Player channel={selectedChannel} />
    </div>
  );
}