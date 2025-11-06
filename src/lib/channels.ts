import { Channel, parseM3U } from '@/utils/parseM3U';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function getChannels(): Promise<Channel[]> {
  try {
    // In a real application, this would fetch from a database or other data source
    // For this example, we'll read the M3U playlist file directly from the filesystem
    const filePath = join(process.cwd(), 'public', 'myplaylist.m3u');
    const content = await fs.readFile(filePath, 'utf8');
    const channels = parseM3U(content);
    
    // Add mock favorites data for demonstration
    // In a real app, this would come from a database
    return channels.map(channel => ({
      ...channel,
      favorites: Math.floor(Math.random() * 200) // Mock favorites count
    }));
  } catch (error) {
    console.error('Error fetching channels:', error);
    return []; // Return empty array on error
  }
}

// Helper function to get channel statistics
export function getChannelStats(channels: Channel[]) {
  const totalChannels = channels.length;
  
  // Get unique groups
  const groups = Array.from(new Set(channels.map(channel => channel.group)));
  
  // Count channels per group
  const channelsByGroup = channels.reduce((acc, channel) => {
    acc[channel.group] = (acc[channel.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate total favorites
  const totalFavorites = channels.reduce((sum, channel) => sum + (channel.favorites || 0), 0);
  
  // Get most popular channels by favorites
  const mostPopularChannels = [...channels]
    .sort((a, b) => (b.favorites || 0) - (a.favorites || 0))
    .slice(0, 5)
    .map(channel => ({
      name: channel.name,
      favorites: channel.favorites || 0
    }));
  
  return {
    totalChannels,
    groups,
    channelsByGroup,
    totalFavorites,
    mostPopularChannels
  };
}