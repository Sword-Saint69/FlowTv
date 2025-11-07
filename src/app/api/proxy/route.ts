import { NextRequest } from 'next/server';

// Allowlist of trusted domains (add your stream domains here)
const TRUSTED_DOMAINS = [
  'torpedopt.dwpaskdwsisasedhsa.shop',
  // Add more trusted domains as needed
];

// Function to validate if a URL is from a trusted domain
function isTrustedUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return TRUSTED_DOMAINS.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain)
    );
  } catch (error) {
    console.error('Error parsing URL:', url, error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encodedUrl = searchParams.get('url');

  // Decode the URL parameter
  let url = '';
  try {
    url = encodedUrl ? decodeURIComponent(encodedUrl) : '';
  } catch (error) {
    console.error('Error decoding URL parameter:', encodedUrl, error);
    return new Response('Invalid URL parameter', { status: 400 });
  }

  console.log('Proxy request for URL:', url);

  if (!url) {
    console.error('Missing URL parameter');
    return new Response('Missing URL parameter', { status: 400 });
  }

  // Validate URL
  if (!isTrustedUrl(url)) {
    console.error('URL not allowed:', url);
    return new Response('URL not allowed', { status: 403 });
  }

  try {
    console.log('Fetching URL:', url);
    
    // Prepare headers to forward
    const forwardHeaders: Record<string, string> = {};
    const requestHeaders = request.headers;
    
    // Forward important headers
    if (requestHeaders.has('range')) {
      forwardHeaders['range'] = requestHeaders.get('range') || '';
    }
    if (requestHeaders.has('accept')) {
      forwardHeaders['accept'] = requestHeaders.get('accept') || '';
    }
    
    // Add our user agent
    forwardHeaders['user-agent'] = 'FlowTV-Player/1.0';

    // Fetch the stream with specific headers to handle CORS
    const response = await fetch(url, {
      headers: forwardHeaders
    });
    
    console.log('Response status:', response.status, 'for URL:', url);
    
    // Get the headers from the upstream response
    const headers = new Headers(response.headers);
    
    // Check if this is an HLS manifest (M3U8) and process it
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/vnd.apple.mpegurl') || 
        contentType.includes('application/x-mpegURL') || 
        url.endsWith('.m3u8')) {
      
      // Read the manifest content as text
      const manifestText = await response.text();
      
      // Process the manifest to rewrite URLs
      const baseUrl = url;
      let processedManifest = manifestText;
      
      // Handle EXT-X-KEY URIs specifically (both with and without IV)
      // We need to be careful not to double-encode URLs
      const keyRegex1 = /#EXT-X-KEY:METHOD=([^,]+),URI="([^"]+)",IV=([^,\n]+)/g;
      processedManifest = processedManifest.replace(keyRegex1, (match, method, keyUri, iv) => {
        // Check if the key URI is already proxied
        if (keyUri.includes('/api/proxy?url=')) {
          return match; // Already proxied, don't modify
        }
        
        try {
          // Make relative key URI absolute
          const absoluteKeyUri = new URL(keyUri, baseUrl).toString();
          
          // Check if this is a trusted URL
          if (isTrustedUrl(absoluteKeyUri)) {
            // Proxy trusted key URLs
            return `#EXT-X-KEY:METHOD=${method},URI="/api/proxy?url=${encodeURIComponent(absoluteKeyUri)}",IV=${iv}`;
          }
        } catch (e) {
          console.warn('Failed to process key URI with IV:', keyUri, e);
        }
        return match;
      });
      
      const keyRegex2 = /#EXT-X-KEY:METHOD=([^,]+),URI="([^"]+)"/g;
      processedManifest = processedManifest.replace(keyRegex2, (match, method, keyUri) => {
        // Check if the key URI is already proxied
        if (keyUri.includes('/api/proxy?url=')) {
          return match; // Already proxied, don't modify
        }
        
        try {
          // Make relative key URI absolute
          const absoluteKeyUri = new URL(keyUri, baseUrl).toString();
          
          // Check if this is a trusted URL
          if (isTrustedUrl(absoluteKeyUri)) {
            // Proxy trusted key URLs
            return `#EXT-X-KEY:METHOD=${method},URI="/api/proxy?url=${encodeURIComponent(absoluteKeyUri)}"`;
          }
        } catch (e) {
          console.warn('Failed to process key URI:', keyUri, e);
        }
        return match;
      });
      
      // Rewrite relative URLs in the manifest to use the proxy
      // This regex matches URLs in the manifest that need to be proxied
      const urlRegex = /((?:https?:\/\/[^\s"<>]+)|(?:[^\s"<>]+\.(?:m3u8|ts|key)(?:\?[^\s"<>]*)?))/g;
      processedManifest = processedManifest.replace(urlRegex, (match) => {
        // Skip already proxied URLs
        if (match.includes('/api/proxy?url=')) {
          return match;
        }
        
        try {
          // Make relative URLs absolute
          const absoluteUrl = new URL(match, baseUrl).toString();
          
          // Check if this is a trusted URL
          if (isTrustedUrl(absoluteUrl)) {
            // Proxy trusted URLs
            return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
          }
        } catch (e) {
          // If URL processing fails, return original
          console.warn('Failed to process URL in manifest:', match);
        }
        
        return match;
      });
      
      // Convert processed manifest back to stream
      const encoder = new TextEncoder();
      const processedStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(processedManifest));
          controller.close();
        }
      });
      
      // Remove headers that might cause issues
      headers.delete('content-encoding');
      headers.delete('content-length');
      headers.delete('access-control-allow-origin');
      
      // Set CORS headers for the proxy response
      headers.set('access-control-allow-origin', '*');
      headers.set('access-control-allow-methods', 'GET, OPTIONS');
      headers.set('access-control-allow-headers', 'Content-Type, Range, Accept');
      
      // Add cache control headers to prevent caching issues for manifests
      headers.set('cache-control', 'no-cache, no-store, must-revalidate');
      headers.set('pragma', 'no-cache');
      headers.set('expires', '0');
      
      return new Response(processedStream, {
        status: response.status,
        headers
      });
    } else {
      // For binary content (keys, .ts segments, etc.), handle properly as arrayBuffer
      
      // Remove headers that might cause issues
      headers.delete('content-encoding');
      headers.delete('content-length');
      headers.delete('access-control-allow-origin');
      
      // Set CORS headers for the proxy response
      headers.set('access-control-allow-origin', '*');
      headers.set('access-control-allow-methods', 'GET, OPTIONS');
      headers.set('access-control-allow-headers', 'Content-Type, Range, Accept');
      
      // Add cache control headers appropriately
      // For segments and keys, we might want to allow some caching
      if (!url.endsWith('.key')) {
        headers.set('cache-control', 'public, max-age=3600'); // Cache for 1 hour
      }
      
      // Get the response as arrayBuffer for binary content
      const arrayBuffer = await response.arrayBuffer();
      
      // Return the binary data with proper headers
      return new Response(arrayBuffer, {
        status: response.status,
        headers
      });
    }
  } catch (error) {
    console.error('Proxy error for URL:', url, error);
    return new Response('Error fetching stream: ' + (error as Error).message, { status: 500 });
  }
}