import {useEffect, useRef, useState} from 'react';

// First-visit intro video. It is a real download (824 KB on phones, 2.6 MB on
// desktop), so it is shown at most once per session and skipped entirely when
// the device asks us to go easy: reduced-motion, Data Saver, or a slow link.
// A poster image paints straight away so the wait is never a black screen.
const SEEN_KEY = 'hs-intro-seen';

function shouldSkipSplash() {
  if (typeof window === 'undefined') return true;
  try {
    if (window.sessionStorage.getItem(SEEN_KEY)) return true;
  } catch (e) {}
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  } catch (e) {}
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (c && (c.saveData || ['slow-2g', '2g', '3g'].includes(c.effectiveType))) return true;
  return false;
}

export function VideoSplash({onComplete}) {
  const videoRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [isMobile] = useState(()=>typeof window!=='undefined'&&(window.innerWidth<1024||navigator.maxTouchPoints>0));
  const [skip] = useState(shouldSkipSplash);

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
    if (skip) {
      onCompleteRef.current();
      return;
    }
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch (e) {}
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked or error, user can click to continue
      });
    }
  }, [skip]);

  if (skip) return null;

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
        onError={handleVideoEnd}
        poster={isMobile ? '/assets/optimized/hero-768.webp' : '/assets/optimized/hero-1600.webp'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        muted
        playsInline
        preload={isMobile ? 'none' : 'metadata'}
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
        Tap to continue or video will auto-advance
      </div>
    </div>
  );
}
