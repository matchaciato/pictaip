import React, { useRef, useEffect, useState } from 'react';

export interface VideoPreviewProps {
  videoUrl: string;
  posterUrl: string;
  isHovered: boolean;
  className?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUrl,
  posterUrl,
  isHovered,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isCancelled = false;

    if (isHovered) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isCancelled) {
              setIsPlaying(true);
            }
          })
          .catch((err) => {
            // Autoplay rejection or abort on quick mouseout is normal
            if (err.name !== 'AbortError') {
              console.debug('[VideoPreview] Autoplay restricted:', err.message);
            }
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }

    return () => {
      isCancelled = true;
    };
  }, [isHovered]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Poster Image */}
      <img
        src={posterUrl}
        alt=""
        aria-hidden="true"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* Video Element (Muted & Loop) */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Playback Progress Indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-10">
          <div
            className="h-full bg-red-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
