import React, { useState, useRef } from 'react';
import { Maximize2, ZoomIn, ZoomOut, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { MediaItem } from '../../types/media';

export interface MediaViewerProps {
  item: MediaItem;
  selectedRatio?: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ item, selectedRatio }) => {
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

  const currentRatio = selectedRatio || item.metadata.aspectRatio;
  let numericRatio = '1 / 1';
  if (currentRatio.includes(':')) {
    const [w, h] = currentRatio.split(':');
    numericRatio = `${w} / ${h}`;
  } else if (item.metadata.width > 0 && item.metadata.height > 0) {
    numericRatio = `${item.metadata.width} / ${item.metadata.height}`;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[200px] sm:min-h-[300px] lg:min-h-[460px] bg-neutral-950/95 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden group select-none"
    >
      <div
        className="absolute inset-0 opacity-25 blur-3xl scale-125 pointer-events-none"
        style={{
          backgroundImage: `url(${item.previewUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        aria-hidden="true"
      />

      <div
        className="relative max-w-full max-h-[36vh] sm:max-h-[48vh] lg:max-h-[78vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          aspectRatio: numericRatio,
          backgroundColor: item.dominantColor,
        }}
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
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-2 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleVideoPlay}
                  className="p-1.5 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
                  title={isPlaying ? 'Jeda' : 'Putar'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={toggleVideoMute}
                  className="p-1.5 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
                  title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-1.5 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
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
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
            />

            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-md cursor-pointer transition-transform active:scale-95"
                title={isZoomed ? 'Perkecil Zoom' : 'Perbesar Zoom'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-md cursor-pointer transition-transform active:scale-95"
                title="Layar Penuh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
