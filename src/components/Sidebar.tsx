'use client';

import { useState, useEffect, useRef } from 'react';
import { Channel } from '@/utils/parseM3U';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/ProfileModal';

interface ChannelWithAttributes extends Channel {
  attributes?: Record<string, string>;
}

interface SidebarProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  favorites: Set<string>;
  onToggleFavorite: (channelId: string) => void;
}

export default function Sidebar({ 
  channels, 
  selectedChannel, 
  onChannelSelect,
  favorites,
  onToggleFavorite
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [draggedChannel, setDraggedChannel] = useState<Channel | null>(null);
  const [showChannelInfo, setShowChannelInfo] = useState<Channel | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  
  const { user, logout, userPreferences } = useAuth();
  const favoritesRef = useRef<HTMLDivElement>(null);
  
  // Check if user is a developer
  const isDeveloper = user?.email?.includes('@flowtv.com') || user?.email === 'admin@example.com';
  
  // Get unique groups
  const groups = ['All', ...Array.from(new Set(channels.map(channel => channel.group || 'Ungrouped')))];
  
  // Group channels by category
  const groupedChannels = channels.reduce((acc, channel) => {
    const group = channel.group || 'Ungrouped';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  // Filter channels based on search term and group
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || channel.group === selectedGroup;
    const matchesFavorites = !showFavoritesOnly || favorites.has(channel.id);
    return matchesSearch && matchesGroup && matchesFavorites;
  });

  const handleImageError = (channelId: string) => {
    setImageErrors(prev => ({ ...prev, [channelId]: true }));
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowChannelInfo(null);
        setShowProfileModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Drag and drop for favorites reordering
  const handleDragStart = (e: React.DragEvent, channel: Channel) => {
    setDraggedChannel(channel);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetChannel: Channel) => {
    e.preventDefault();
    if (!draggedChannel || draggedChannel.id === targetChannel.id) return;
    
    // Reorder favorites logic would go here
    // For now, we'll just close the drag operation
    setDraggedChannel(null);
  };

  // Close channel info panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showChannelInfo && favoritesRef.current && !favoritesRef.current.contains(e.target as Node)) {
        setShowChannelInfo(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChannelInfo]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Sidebar */}
      <div className={`fixed md:relative z-20 h-full flex flex-col transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        w-80 bg-gray-800 border-r border-gray-700`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gradient">FlowTV</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2 rounded-full ${showFavoritesOnly ? 'text-yellow-400 bg-yellow-400 bg-opacity-10' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                title={showFavoritesOnly ? "Show all channels" : "Show favorites only"}
                aria-label={showFavoritesOnly ? "Show all channels" : "Show favorites only"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              
              {user ? (
                <div className="relative group">
                  <button 
                    className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowProfileModal(true)}
                  >
                    {userPreferences?.profileImage ? (
                      <img 
                        src={userPreferences.profileImage} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      user.email?.charAt(0).toUpperCase()
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">
                        {userPreferences?.displayName || user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Profile Settings
                    </button>
                    {isDeveloper && (
                      <button
                        onClick={() => router.push('/dev/stats')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Developer Stats
                      </button>
                    )}
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search channels"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-700'}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-700'}`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-400">
              {filteredChannels.length} channels
            </div>
          </div>
        </div>
        
        {/* Group Filters */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-2">
            {groups.map(group => (
              <button
                key={group}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedGroup === group 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
        
        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChannels.length > 0 ? (
            viewMode === 'list' ? (
              Object.entries(groupedChannels).map(([group, groupChannels]) => {
                const filteredGroupChannels = groupChannels.filter(channel => {
                  const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesGroup = selectedGroup === 'All' || channel.group === selectedGroup;
                  const matchesFavorites = !showFavoritesOnly || favorites.has(channel.id);
                  return matchesSearch && matchesGroup && matchesFavorites;
                });
                
                if (filteredGroupChannels.length === 0) return null;
                
                return (
                  <div key={group} className="mb-2">
                    <button
                      className="flex items-center justify-between w-full p-3 text-left font-medium text-gray-300 hover:bg-gray-700"
                      onClick={() => toggleGroup(group)}
                    >
                      <span>{group} ({filteredGroupChannels.length})</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform ${collapsedGroups[group] ? '' : 'rotate-180'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {!collapsedGroups[group] && (
                      <div>
                        {filteredGroupChannels.map(channel => (
                          <div
                            key={channel.id}
                            draggable={showFavoritesOnly}
                            onDragStart={(e) => showFavoritesOnly && handleDragStart(e, channel)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => showFavoritesOnly && handleDrop(e, channel)}
                            className={`flex items-center p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                              selectedChannel?.id === channel.id 
                                ? 'bg-gray-700 border-l-4 border-blue-500' 
                                : ''
                            }`}
                            onClick={() => {
                              onChannelSelect(channel);
                              // Close mobile menu when selecting a channel
                              setIsMobileMenuOpen(false);
                            }}
                            onDoubleClick={() => setShowChannelInfo(channel)}
                          >
                            {channel.logo && !imageErrors[channel.id] ? (
                              <img 
                                src={channel.logo} 
                                alt={channel.name} 
                                className="w-10 h-10 rounded-md mr-3 object-cover"
                                onError={() => handleImageError(channel.id)}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-gray-600 mr-3 flex items-center justify-center">
                                <span className="text-xs font-bold">{channel.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate text-white">{channel.name}</div>
                              <div className="text-xs text-gray-400 truncate">{channel.group}</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(channel.id);
                              }}
                              className={`p-1.5 rounded-full transition-colors ${
                                favorites.has(channel.id) 
                                  ? 'text-yellow-400 bg-yellow-400 bg-opacity-10' 
                                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
                              }`}
                              aria-label={favorites.has(channel.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Grid view
              <div className="grid grid-cols-2 gap-2 p-2">
                {filteredChannels.map(channel => (
                  <div
                    key={channel.id}
                    className={`rounded-lg p-2 cursor-pointer hover:bg-gray-700 transition-colors relative ${
                      selectedChannel?.id === channel.id 
                        ? 'bg-gray-700 border-2 border-blue-500' 
                        : 'bg-gray-800'
                    }`}
                    onClick={() => {
                      onChannelSelect(channel);
                      // Close mobile menu when selecting a channel
                      setIsMobileMenuOpen(false);
                    }}
                    onDoubleClick={() => setShowChannelInfo(channel)}
                  >
                    {channel.logo && !imageErrors[channel.id] ? (
                      <img 
                        src={channel.logo} 
                        alt={channel.name} 
                        className="w-full h-20 rounded-md object-cover mb-2"
                        onError={() => handleImageError(channel.id)}
                      />
                    ) : (
                      <div className="w-full h-20 rounded-md bg-gray-600 mb-2 flex items-center justify-center">
                        <span className="text-xs font-bold">{channel.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="font-medium truncate text-white text-sm">{channel.name}</div>
                    <div className="text-xs text-gray-400 truncate">{channel.group}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(channel.id);
                      }}
                      className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                        favorites.has(channel.id) 
                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-600'
                      }`}
                      aria-label={favorites.has(channel.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="p-4 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No channels found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Channel Info Panel */}
      {showChannelInfo && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <div 
            ref={favoritesRef}
            className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Channel Information</h3>
              <button 
                onClick={() => setShowChannelInfo(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                {showChannelInfo.logo && !imageErrors[showChannelInfo.id] ? (
                  <img 
                    src={showChannelInfo.logo} 
                    alt={showChannelInfo.name} 
                    className="w-16 h-16 rounded-md mr-4 object-cover"
                    onError={() => handleImageError(showChannelInfo.id)}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-gray-600 mr-4 flex items-center justify-center">
                    <span className="text-lg font-bold">{showChannelInfo.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-white">{showChannelInfo.name}</h4>
                  <p className="text-gray-400">{showChannelInfo.group}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">ID:</span>
                  <span className="text-white ml-2">{showChannelInfo.id}</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    onToggleFavorite(showChannelInfo.id);
                    setShowChannelInfo(null);
                  }}
                  className={`px-4 py-2 rounded-md ${
                    favorites.has(showChannelInfo.id) 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {favorites.has(showChannelInfo.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button
                  onClick={() => {
                    onChannelSelect(showChannelInfo);
                    setShowChannelInfo(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}