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
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  // Validate URL
  if (!isTrustedUrl(url)) {
    return new Response('URL not allowed', { status: 403 });
  }

  try {
    // Fetch the stream with specific headers to handle CORS
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FlowTV-Player/1.0',
        'Accept': '*/*',
      }
    });
    
    // Create a new response with the stream data
    const stream = response.body;
    const headers = new Headers(response.headers);
    
    // Remove headers that might cause issues
    headers.delete('content-encoding');
    headers.delete('content-length');
    headers.delete('access-control-allow-origin');
    
    // Set CORS headers for the proxy response
    headers.set('access-control-allow-origin', '*');
    headers.set('access-control-allow-methods', 'GET, OPTIONS');
    headers.set('access-control-allow-headers', 'Content-Type');
    
    return new Response(stream, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Error fetching stream', { status: 500 });
  }
}