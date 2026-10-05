import React, { useState, useRef } from 'react';
import { Maximize2, ZoomIn, ZoomOut, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { MediaItem } from '../../types/media';

export interface MediaViewerProps {
  item: MediaItem;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ item }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[360px] sm:min-h-[480px] lg:min-h-[580px] bg-neutral-950 flex items-center justify-center overflow-hidden group select-none"
      style={{ backgroundColor: item.dominantColor }}
    >
      {item.type === 'video' && item.videoUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.previewUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full max-h-[80vh] object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Video Control Overlays */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-2 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVideoPlay}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={toggleVideoMute}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
                title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Layar Penuh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative w-full h-full flex items-center justify-center cursor-zoom-in ${
            isZoomed ? 'cursor-zoom-out' : ''
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={item.mediaUrl}
            alt={item.title}
            className={`transition-all duration-300 object-contain max-h-[82vh] ${
              isZoomed ? 'scale-150 max-h-none' : 'w-full h-full'
            }`}
          />

          {/* Image Floating Tools */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-md cursor-pointer transition-transform active:scale-95"
              title={isZoomed ? 'Perkecil Zoom' : 'Perbesar Zoom'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreen();
              }}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-md cursor-pointer transition-transform active:scale-95"
              title="Layar Penuh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
