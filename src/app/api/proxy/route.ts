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

// Function to make relative URLs absolute
function makeAbsoluteUrl(baseUrl: string, relativeUrl: string): string {
  try {
    // If it's already absolute, return as is
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    
    // Make relative URL absolute using base URL
    const base = new URL(baseUrl);
    const absolute = new URL(relativeUrl, base);
    return absolute.toString();
  } catch (error) {
    console.error('Error making URL absolute:', error);
    return relativeUrl;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

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
    
    // Fetch the stream with specific headers to handle CORS
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FlowTV-Player/1.0',
        'Accept': '*/*',
      }
    });
    
    console.log('Response status:', response.status, 'for URL:', url);
    
    // Create a new response with the stream data
    let stream = response.body;
    const headers = new Headers(response.headers);
    
    // Check if this is an HLS manifest (M3U8) and process it
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/vnd.apple.mpegurl') || 
        contentType.includes('application/x-mpegURL') || 
        url.endsWith('.m3u8')) {
      
      // Read the manifest content
      const manifestText = await response.text();
      
      // Process the manifest to rewrite URLs
      const baseUrl = url;
      let processedManifest = manifestText;
      
      // Handle EXT-X-KEY URIs specifically
      const keyRegex = /#EXT-X-KEY:METHOD=[^,]+,URI="([^"]+)"/g;
      processedManifest = processedManifest.replace(keyRegex, (match, keyUri) => {
        try {
          // Make relative key URI absolute
          const absoluteKeyUri = makeAbsoluteUrl(baseUrl, keyUri);
          
          // Check if this is a trusted URL
          if (isTrustedUrl(absoluteKeyUri)) {
            // Proxy trusted key URLs
            return `#EXT-X-KEY:METHOD=AES-128,URI="/api/proxy?url=${encodeURIComponent(absoluteKeyUri)}"`;
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
          const absoluteUrl = makeAbsoluteUrl(baseUrl, match);
          
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
      stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(processedManifest));
          controller.close();
        }
      });
    }
    
    // Remove headers that might cause issues
    headers.delete('content-encoding');
    headers.delete('content-length');
    headers.delete('access-control-allow-origin');
    
    // Set CORS headers for the proxy response
    headers.set('access-control-allow-origin', '*');
    headers.set('access-control-allow-methods', 'GET, OPTIONS');
    headers.set('access-control-allow-headers', 'Content-Type');
    
    // Add cache control headers to prevent caching issues
    headers.set('cache-control', 'no-cache, no-store, must-revalidate');
    headers.set('pragma', 'no-cache');
    headers.set('expires', '0');
    
    return new Response(stream, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Proxy error for URL:', url, error);
    return new Response('Error fetching stream: ' + (error as Error).message, { status: 500 });
  }
}