import {useEffect, useRef, useState} from 'react';

// First-visit intro video (824 KB mobile, 2.6 MB desktop).
// Shown at most once per user. Skipped when reduced-motion, Data Saver, or slow link.
const SEEN_KEY = 'video_seen';

function shouldSkipSplash() {
  if (typeof window === 'undefined') return true;
  try {
    if (window.localStorage.getItem(SEEN_KEY) || window.sessionStorage.getItem(SEEN_KEY) || window.sessionStorage.getItem('hs-intro-seen')) {
      return true;
    }
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
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [skip] = useState(shouldSkipSplash);

  const getVideoUrl = () => {
    return isMobile ? '/assets/hero-mobile.mp4' : '/assets/hero.mp4';
  };

  const finish = () => {
    try {
      window.localStorage.setItem(SEEN_KEY, 'true');
      window.sessionStorage.setItem(SEEN_KEY, 'true');
    } catch (e) {}
    onCompleteRef.current();
  };

  useEffect(() => {
    if (skip) {
      finish();
      return;
    }

    try {
      window.localStorage.setItem(SEEN_KEY, 'true');
      window.sessionStorage.setItem(SEEN_KEY, 'true');
    } catch (e) {}

    const video = videoRef.current;
    if (video) {
      // Ensure muted and playsInline for iOS WebKit
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked (e.g. iOS Low Power Mode) — auto advance after 2.5s
          const t = setTimeout(finish, 2500);
          return () => clearTimeout(t);
        });
      }
    }

    // Safety timeout: intro video is ~20s. Never trap user longer than 22s.
    const safetyTimer = setTimeout(finish, 22000);
    return () => clearTimeout(safetyTimer);
  }, [skip]);

  if (skip) return null;

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        background: '#031c2b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 99999,
        overflow: 'hidden',
      }}
      role="presentation"
    >
      <video
        ref={videoRef}
        src={getVideoUrl()}
        onEnded={finish}
        onError={finish}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          background: '#031c2b',
        }}
      >
        <source src={getVideoUrl()} type="video/mp4" />
      </video>

      {/* Prominent Accessible Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 16px) + 16px)',
          right: 'calc(env(safe-area-inset-right, 16px) + 16px)',
          background: 'rgba(3, 28, 43, 0.85)',
          color: '#edc66f',
          border: '1px solid #b78b43',
          borderRadius: '24px',
          padding: '10px 18px',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          zIndex: 100000,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        aria-label="Skip intro video"
      >
        Skip ✕
      </button>

      {/* Bottom Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(env(safe-area-inset-bottom, 20px) + 16px)',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffdc85',
          fontSize: isMobile ? '0.75rem' : '0.85rem',
          letterSpacing: '0.5px',
          opacity: 0.85,
          textAlign: 'center',
          padding: '6px 14px',
          background: 'rgba(3, 28, 43, 0.65)',
          borderRadius: '16px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        Tap anywhere to enter
      </div>
    </div>
  );
}
