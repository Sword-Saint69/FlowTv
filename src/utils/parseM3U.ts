export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  group: string;
  favorites?: number; // Add optional favorites property
}

export const parseM3U = (content: string): Channel[] => {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  const idCounts: Record<string, number> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse the metadata line
      const metadata = line.substring(8); // Remove '#EXTINF:' prefix
      
      // Extract attributes
      const attributes: Record<string, string> = {};
      const attrRegex = /([a-zA-Z0-9-]+)="([^"]*)"/g;
      let match;
      
      while ((match = attrRegex.exec(metadata)) !== null) {
        attributes[match[1]] = match[2];
      }
      
      // Extract the name (everything after the last comma)
      const nameStart = metadata.lastIndexOf(',') + 1;
      const name = metadata.substring(nameStart).trim();
      
      // Get the URL from the next non-empty line
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') {
        j++;
      }
      
      if (j < lines.length) {
        const url = lines[j].trim();
        
        // Create a unique ID
        let baseId = attributes['tvg-id'] || `${name.replace(/\s+/g, '-')}`;
        let uniqueId = baseId;
        
        // If this ID already exists, append a counter
        if (idCounts[baseId]) {
          idCounts[baseId]++;
          uniqueId = `${baseId}-${idCounts[baseId]}`;
        } else {
          idCounts[baseId] = 1;
        }
        
        // Create channel object
        channels.push({
          id: uniqueId,
          name: attributes['tvg-name'] || name,
          url,
          logo: attributes['tvg-logo'] || '',
          group: attributes['group-title'] || 'General'
        });
        
        i = j; // Skip to the URL line
      }
    }
  }
  
  return channels;
};