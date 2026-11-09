import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  X, 
  Maximize2 
} from 'lucide-react';
import { MediaItem } from '../types';
import { audioEngine } from '../services/audioEngine';

interface MiniPlayerProps {
  media: MediaItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onExpand: () => void;
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: (item: MediaItem) => void;
  currentTime: number;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  media,
  isPlaying,
  onTogglePlay,
  onExpand,
  onClose,
  isLiked,
  onToggleLike,
  currentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate mini visualizer bars
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = isPlaying ? audioEngine.getVisualizerData() : new Uint8Array(16);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 12;
      const barWidth = 2.5;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? (data[i * 2] || 30) : 10;
        const height = Math.max(2, (val / 255) * canvas.height);
        const x = i * (barWidth + gap);
        const y = canvas.height - height;

        ctx.fillStyle = isPlaying ? '#f43f5e' : '#64748b';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 1);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  if (!media) return null;

  const progressPercent = Math.min(100, (currentTime / (media.duration || 1)) * 100);

  return (
    <div 
      className="fixed bottom-[60px] left-2 right-2 sm:left-4 sm:right-4 z-40 max-w-md sm:max-w-xl mx-auto animate-in slide-in-from-bottom-2 duration-200"
    >
      <div 
        onClick={onExpand}
        className="relative flex items-center justify-between p-2 rounded-2xl bg-[#141724]/95 backdrop-blur-xl border border-white/10 shadow-2xl cursor-pointer hover:border-white/20 transition-all select-none overflow-hidden"
      >
        {/* Subtle top progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Media info + Thumbnail */}
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10">
            <img 
              src={media.thumbnail} 
              alt={media.title}
              className={`w-full h-full object-cover ${isPlaying && media.type === 'music' ? 'animate-[spin_10s_linear_infinite]' : ''}`}
              referrerPolicy="no-referrer"
            />
            {media.type === 'video' && (
              <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono text-white px-1 rounded">
                HD
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>{media.title}</span>
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="truncate">{media.subtitle}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-300 uppercase font-mono">
                {media.type}
              </span>
            </div>
          </div>

          {/* Mini Waveform Visualizer */}
          <canvas 
            ref={canvasRef} 
            width={54} 
            height={18} 
            className="hidden sm:block shrink-0 opacity-80"
          />
        </div>

        {/* Quick controls */}
        <div 
          className="flex items-center gap-1 shrink-0" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Like button */}
          <button
            onClick={() => onToggleLike(media)}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full transition-colors ${
              isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
            }`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Expand Full Player */}
          <button
            onClick={onExpand}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-colors"
            aria-label="Open full player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Close Player */}
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-colors"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
