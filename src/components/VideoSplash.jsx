import {useEffect, useRef} from 'react';

export function VideoSplash({onComplete}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleClick = () => {
    onComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked, user will click
      });
    }
  }, []);

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
    >
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        muted
        playsInline
      >
        <source src="/assets/intro-video.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          fontSize: '0.9rem',
          opacity: 0.6,
        }}
      >
        Click to continue or video will auto-advance
      </div>
    </div>
  );
}
