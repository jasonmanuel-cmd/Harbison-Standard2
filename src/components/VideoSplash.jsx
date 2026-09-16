import {useEffect, useRef, useState} from 'react';

export function VideoSplash({onComplete}) {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const getVideoUrl = () => {
    // Use mobile-optimized video for devices under 768px or touch screens
    return isMobile ? '/assets/intro-video-mobile.mp4' : '/assets/intro-video.mp4';
  };

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleClick = () => {
    onComplete();
  };

  useEffect(() => {
    // Detect if device is mobile or tablet
    const checkDevice = () => {
      const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
      };
      const width = window.innerWidth;
      const mobile = width < 1024 || isTouchDevice();
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Update video source when device type changes
      const source = video.querySelector('source');
      if (source) {
        source.src = getVideoUrl();
        video.load();
      }
      video.play().catch(() => {
        // Autoplay blocked or error, user can click to continue
      });
    }
  }, [isMobile]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9999,
      }}
      role="presentation"
    >
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        muted
        playsInline
        preload="auto"
      >
        <source src={getVideoUrl()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          opacity: 0.6,
          textAlign: 'center',
          padding: '0 1rem',
          pointerEvents: 'none',
        }}
      >
        Click to continue or video will auto-advance
      </div>
    </div>
  );
}
