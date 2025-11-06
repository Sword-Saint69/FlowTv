'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Channel } from '@/utils/parseM3U';
import { useAuth } from '@/context/AuthContext';

interface PlayerProps {
  channel: Channel | null;
}

export default function Player({ channel }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const maxRetries = 3;
  
  const { user } = useAuth();

  // Function to destroy and recreate HLS instance
  const resetHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  // Function to retry loading the stream
  const retryLoad = useCallback(() => {
    if (retryCount < maxRetries) {
      setError(null);
      setLoading(true);
      setRetryCount(prev => prev + 1);
      resetHls();
    }
  }, [retryCount, resetHls]);

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  // Handle PiP change
  const handlePipChange = useCallback(() => {
    setIsPip(!!document.pictureInPictureElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('enterpictureinpicture', handlePipChange);
    document.addEventListener('leavepictureinpicture', handlePipChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('enterpictureinpicture', handlePipChange);
      document.removeEventListener('leavepictureinpicture', handlePipChange);
    };
  }, [handleFullscreenChange, handlePipChange]);

  useEffect(() => {
    // If user is not authenticated, don't attempt to load streams
    if (!user) {
      return;
    }
    
    if (!channel) return;

    const loadChannel = async () => {
      setLoading(true);
      setError(null);
      
      const video = videoRef.current;
      if (!video) return;

      // Clean up previous HLS instance
      resetHls();

      // Check if we're on HTTPS and the URL is HTTP (mixed content issue)
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isHttpUrl = channel.url.startsWith('http://');
      
      // Use proxy for HTTP URLs when on HTTPS to avoid mixed content issues
      const streamUrl = isHttps && isHttpUrl 
        ? `/api/proxy?url=${encodeURIComponent(channel.url)}`
        : channel.url;

      // Prioritize HLS.js for better compatibility
      if (Hls.isSupported()) {
        // Use HLS.js
        console.log('Using HLS.js for:', streamUrl);
        const hls = new Hls({
          // Configure HLS.js for better buffering
          maxBufferSize: 60 * 1000 * 1000, // 60MB
          maxBufferLength: 30, // 30 seconds
          maxMaxBufferLength: 60, // 60 seconds
          // Enable automatic recovery
          enableWorker: true,
          enableSoftwareAES: true,
        });
        hlsRef.current = hls;
        
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed');
          setLoading(false);
          setRetryCount(0); // Reset retry count on successful load
          video.play().catch((err) => {
            console.log('Autoplay blocked or failed:', err);
          });
        });
        
        hls.on(Hls.Events.LEVEL_LOADED, () => {
          console.log('HLS level loaded');
        });
        
        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Fragment loaded successfully
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          
          // Handle buffer stalled error specifically
          if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            setError(`Buffering issue - stream may be slow or unstable. Retrying... (${retryCount + 1}/${maxRetries})`);
            
            // Auto-retry on buffer stalled error
            if (retryCount < maxRetries) {
              setTimeout(() => {
                retryLoad();
              }, 2000);
            } else {
              setError(`Buffering issue - stream is too slow or unstable. Please try another channel.`);
            }
            return;
          }
          
          // Handle manifest load errors
          if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
            // Check if this is a mixed content error
            if (channel.url.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
              setError(`Mixed Content Error: Stream is loaded over HTTP but site is HTTPS. Retrying with proxy... (${retryCount + 1}/${maxRetries})`);
            } else if (retryCount < maxRetries) {
              setError(`Stream loading failed. Retrying... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => {
                retryLoad();
              }, 2000);
            } else {
              setError(`Failed to load stream: Server error or stream unavailable. Please try another channel.`);
            }
            return;
          }
          
          // Handle network errors
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            // Check if this is a mixed content error
            if (channel.url.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
              setError(`Mixed Content Error: Stream is loaded over HTTP but site is HTTPS. Retrying with proxy... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => {
                retryLoad();
              }, 2000);
            } else if (retryCount < maxRetries) {
              setError(`Network error. Retrying... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => {
                retryLoad();
              }, 2000);
            } else {
              setError(`Network error - unable to reach stream server. Please check your connection or try another channel.`);
            }
            return;
          }
          
          // Handle media errors
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            if (data.fatal) {
              // Try to recover fatal media errors
              hls.recoverMediaError();
              setError(`Media error - attempting to recover...`);
            } else {
              setError(`Media error - stream may be corrupted or incompatible.`);
            }
            return;
          }
          
          // Handle other fatal errors
          if (data.fatal) {
            let errorMessage = `Failed to load stream: ${data.type} - ${data.details}`;
            
            // Add more specific error information
            if (data.response && data.response.code !== undefined) {
              errorMessage += ` (HTTP ${data.response.code}: ${data.response.text})`;
            } else if (data.networkDetails) {
              // Try to extract status code from network details
              try {
                const networkDetails = data.networkDetails as Response;
                if (networkDetails.status) {
                  errorMessage += ` (HTTP ${networkDetails.status}: ${networkDetails.statusText})`;
                }
              } catch (e) {
                // Ignore errors when trying to access network details
              }
            }
            
            // Special handling for example URLs
            if (channel.url.includes('example.com')) {
              errorMessage = 'Example stream URL - please replace with a valid stream';
            }
            
            setError(errorMessage);
            setLoading(false);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        console.log('Using native HLS support for:', streamUrl);
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          console.log('Video metadata loaded');
          setLoading(false);
          setRetryCount(0); // Reset retry count on successful load
          video.play().catch((err) => {
            console.log('Autoplay blocked or failed:', err);
          });
        });
        video.addEventListener('error', (e) => {
          console.error('Native video error:', e);
          const errorTarget = e.target as HTMLVideoElement;
          let errorMessage = 'Failed to load stream';
          
          // Check for mixed content issues
          if (channel.url.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
            errorMessage = 'Mixed Content Error: Stream is loaded over HTTP but site is HTTPS. The browser blocked this request for security reasons.';
          } else if (errorTarget.error) {
            switch (errorTarget.error.code) {
              case errorTarget.error.MEDIA_ERR_ABORTED:
                errorMessage = 'Stream loading aborted';
                break;
              case errorTarget.error.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error - stream not accessible. This may be a CORS issue.';
                break;
              case errorTarget.error.MEDIA_ERR_DECODE:
                errorMessage = 'Stream decoding error';
                break;
              case errorTarget.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Stream format not supported';
                break;
              default:
                errorMessage = `Stream error: ${errorTarget.error.message || 'Unknown error'}`;
            }
          } else {
            // If no specific error code, try to infer from network status
            if (channel.url.includes('example.com')) {
              errorMessage = 'Example stream URL - please replace with a valid stream';
            } else {
              errorMessage = 'Unknown error loading stream - URL may be inaccessible or have CORS restrictions';
            }
          }
          
          setError(errorMessage);
          setLoading(false);
        });
      } else {
        // Fallback - try native video
        console.log('Using fallback for:', streamUrl);
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          console.log('Video metadata loaded (fallback)');
          setLoading(false);
          setRetryCount(0); // Reset retry count on successful load
          video.play().catch((err) => {
            console.log('Autoplay blocked or failed:', err);
          });
        });
        video.addEventListener('error', (e) => {
          console.error('Fallback video error:', e);
          const errorTarget = e.target as HTMLVideoElement;
          let errorMessage = 'Failed to load stream: Unsupported format or network error. This may be a CORS issue.';
          
          // Check for mixed content issues
          if (channel.url.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
            errorMessage = 'Mixed Content Error: Stream is loaded over HTTP but site is HTTPS. The browser blocked this request for security reasons.';
          } else if (errorTarget.error) {
            switch (errorTarget.error.code) {
              case errorTarget.error.MEDIA_ERR_ABORTED:
                errorMessage = 'Stream loading aborted';
                break;
              case errorTarget.error.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error - stream not accessible';
                break;
              case errorTarget.error.MEDIA_ERR_DECODE:
                errorMessage = 'Stream decoding error';
                break;
              case errorTarget.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Stream format not supported';
                break;
              default:
                errorMessage = `Stream error: ${errorTarget.error.message || 'Unknown error'}`;
            }
          } else {
            // If no specific error code, try to infer from network status
            if (channel.url.includes('example.com')) {
              errorMessage = 'Example stream URL - please replace with a valid stream';
            } else {
              errorMessage = 'Unknown error loading stream - URL may be inaccessible or have CORS restrictions';
            }
          }
          
          setError(errorMessage);
          setLoading(false);
        });
      }
    };

    loadChannel();

    return () => {
      // Clean up
      resetHls();
    };
  }, [channel, user, retryCount, resetHls, retryLoad]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Play error:', err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const togglePip = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => {
        console.error('Failed to exit PiP:', err);
      });
    } else {
      video.requestPictureInPicture().catch(err => {
        console.error('Failed to enter PiP:', err);
        setError('Picture-in-Picture not supported by your browser or device');
      });
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Space to toggle play/pause
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
    
    // F for fullscreen
    if (e.code === 'KeyF') {
      e.preventDefault();
      toggleFullscreen();
    }
    
    // M for mute/unmute
    if (e.code === 'KeyM') {
      e.preventDefault();
      const video = videoRef.current;
      if (video) {
        video.muted = !video.muted;
      }
    }
    
    // R for retry
    if (e.code === 'KeyR') {
      e.preventDefault();
      retryLoad();
    }
    
    // P for PiP
    if (e.code === 'KeyP') {
      e.preventDefault();
      togglePip();
    }
  }, [retryLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = volume;
    
    // Add event listeners for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, volume]);

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-4">Please log in to access IPTV content</p>
          <p className="text-sm text-gray-500">Authentication is required to protect content and ensure a premium viewing experience</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to FlowTV</h2>
          <p className="text-gray-400">Select a channel from the sidebar to start watching</p>
          <p className="text-sm text-gray-500 mt-4">Experience seamless streaming with our premium IPTV service</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 flex flex-col bg-black relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Channel Info Bar */}
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{channel.name}</h2>
            <p className="text-sm text-gray-400">{channel.group}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium">
              LIVE
            </span>
          </div>
        </div>
      </div>
      
      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center relative bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black bg-opacity-70">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-white text-lg">Loading stream from {channel.name}...</div>
            <div className="text-gray-400 text-sm mt-2">Please wait while we connect to the stream</div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-80">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md border border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Stream Error</h3>
                <p className="text-gray-300 text-sm mb-4 break-words">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={retryLoad}
                    className="btn btn-primary"
                  >
                    Retry Stream
                  </button>
                  <button
                    onClick={() => {
                      setError(null);
                      setRetryCount(0);
                    }}
                    className="btn btn-outline"
                  >
                    Clear Error
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Retries: {retryCount}/{maxRetries}</p>
                  <p className="mt-2">Troubleshooting tips:</p>
                  <ul className="text-left list-disc pl-5 mt-1">
                    <li>Check your internet connection</li>
                    <li>Try a different channel</li>
                    <li>Refresh the page</li>
                    <li>If you see a "Mixed Content" error, the stream source doesn't support HTTPS</li>
                    <li>Contact support if issue persists</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          className="w-full h-full max-h-full object-contain"
          onClick={handleVideoClick}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          controls={false}
        />
        
        {/* Video Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black bg-opacity-80 to-transparent p-4 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleVolumeChange(volume > 0 ? 0 : 1)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  aria-label={volume > 0 ? "Mute" : "Unmute"}
                >
                  {volume > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 accent-blue-500 hidden md:block"
                />
              </div>
              
              <div className="hidden md:block">
                <span className="text-sm text-white font-medium">{channel.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={togglePip}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                title="Picture-in-Picture"
                aria-label={isPip ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                </svg>
              </button>
              
              <button 
                onClick={retryLoad}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                title="Retry stream"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}