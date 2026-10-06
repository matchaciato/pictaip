import React, { useRef, useEffect, useState } from 'react';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

export interface VideoPreviewProps {
  videoUrl: string;
  posterUrl: string;
  isHovered: boolean;
  className?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = React.memo(({
  videoUrl,
  posterUrl,
  isHovered,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isHovered) {
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let isCancelled = false;
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
          if (err.name !== 'AbortError') {
            console.debug('[VideoPreview] Autoplay restricted:', err.message);
          }
          if (!isCancelled) {
            setIsPlaying(false);
          }
        });
    }

    return () => {
      isCancelled = true;
      if (video) {
        video.pause();
      }
    };
  }, [isHovered]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  const optimizedPoster = optimizeImageUrl(posterUrl, { width: 540, quality: 75 });

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <img
        src={optimizedPoster}
        alt=""
        aria-hidden="true"
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {isHovered && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="none"
          onTimeUpdate={handleTimeUpdate}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

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
});

VideoPreview.displayName = 'VideoPreview';
