import React, { useState } from 'react';
import { 
  Play, 
  Heart, 
  Share2, 
  Download, 
  Check, 
  Film, 
  Laugh, 
  Flame, 
  Clock, 
  Eye, 
  Tv, 
  Sparkles,
  Subtitles
} from 'lucide-react';
import { MediaItem } from '../types';
import { MEDIA_ITEMS } from '../data/mockData';

interface VideosViewProps {
  onPlayMedia: (item: MediaItem) => void;
  likedMediaIds: Set<string>;
  onToggleLike: (item: MediaItem) => void;
  onOpenShare: (item: MediaItem) => void;
  onOpenDownload: (item: MediaItem) => void;
  downloadedIds: Set<string>;
  activePlayingId?: string;
  isPlaying?: boolean;
  mediaItems?: MediaItem[];
}

export const VideosView: React.FC<VideosViewProps> = ({
  onPlayMedia,
  likedMediaIds,
  onToggleLike,
  onOpenShare,
  onOpenDownload,
  downloadedIds,
  activePlayingId,
  isPlaying,
  mediaItems = MEDIA_ITEMS,
}) => {
  const [videoFilter, setVideoFilter] = useState<'all' | 'kidani' | 'comedy' | 'dance'>('all');

  const allVideos = mediaItems.filter(item => item.type === 'video');

  const filteredVideos = allVideos.filter(v => {
    if (videoFilter === 'kidani') return v.id.includes('kidani');
    if (videoFilter === 'comedy') return v.category === 'comedy';
    if (videoFilter === 'dance') return v.id.includes('dance') || v.category === 'amapiano';
    return true;
  });

  const kidaniEpisodes = allVideos.filter(v => v.id.includes('kidani'));

  return (
    <div className="pb-32 pt-2 px-3 sm:px-4 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              Mtube Videos
            </h1>
            <p className="text-xs text-slate-400">Watch Trending Comedy, Series & Sketches</p>
          </div>
        </div>
      </div>

      {/* KIDANI COMEDY SERIES PROMINENT SHOWCASE */}
      <section className="rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-rose-950/40 via-[#131525] to-[#0c0d17] border border-rose-500/20 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laugh className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight">
              KIDANI COMEDY SERIES · Season 1
            </h2>
          </div>
          <span className="text-[11px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            OFFICIAL RELEASE
          </span>
        </div>

        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Mfululizo wa vicheko vya Kidani akiwa kwenye mikasa ya elimu, mapenzi ya mtaa, na majaribu ya maisha ya kila siku.
        </p>

        {/* Kidani Episodes Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kidaniEpisodes.map((ep) => {
            const isLiked = likedMediaIds.has(ep.id);
            const isDownloaded = downloadedIds.has(ep.id);
            const isCurrentPlaying = activePlayingId === ep.id && isPlaying;

            return (
              <div 
                key={ep.id}
                className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-rose-500/40 transition-all flex flex-col justify-between"
              >
                {/* Video Image Frame */}
                <div 
                  onClick={() => onPlayMedia(ep)}
                  className="relative aspect-video w-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="bg-rose-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                      EPISODE 0{ep.episodeNumber || 1}
                    </span>
                    <span className="bg-black/70 text-slate-200 text-[9px] font-mono px-1.5 py-0.5 rounded">
                      1080p
                    </span>
                  </div>

                  {/* PROMPT REQUIREMENT: Watermark MTUBE on videos */}
                  <div className="absolute top-2 right-2 pointer-events-none select-none bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-black tracking-wider text-white uppercase font-display">
                    <span className="text-rose-500">M</span>TUBE
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded font-semibold">
                    {ep.durationFormatted}
                  </span>

                  {/* Play overlay button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-3">
                  <h3 
                    onClick={() => onPlayMedia(ep)}
                    className={`font-bold text-sm truncate cursor-pointer ${
                      isCurrentPlaying ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {ep.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ep.description}</p>
                  
                  {/* Action Strip */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                    <button
                      onClick={() => onPlayMedia(ep)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrentPlaying ? 'Watching' : 'Watch'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleLike(ep)}
                        className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl transition-colors ${
                          isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Like"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => onOpenShare(ep)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenDownload(ep)}
                        className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl transition-colors ${
                          isDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Download"
                      >
                        {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Videos' },
          { id: 'kidani', label: 'Kidani Comedy' },
          { id: 'comedy', label: 'Standup & Sketches' },
          { id: 'dance', label: 'Amapiano Dance' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setVideoFilter(f.id as typeof videoFilter)}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              videoFilter === f.id
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Full Video Stream Feed */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => {
            const isLiked = likedMediaIds.has(video.id);
            const isDownloaded = downloadedIds.has(video.id);
            const isCurrentPlaying = activePlayingId === video.id && isPlaying;

            return (
              <div
                key={video.id}
                className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div 
                  onClick={() => onPlayMedia(video)}
                  className="relative aspect-video w-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded font-semibold">
                    {video.durationFormatted}
                  </span>

                  {video.badge && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                      {video.badge}
                    </span>
                  )}

                  {/* PROMPT REQUIREMENT: Watermark MTUBE on videos */}
                  <div className="absolute top-2 right-2 pointer-events-none select-none bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-black tracking-wider text-white uppercase font-display">
                    <span className="text-rose-500">M</span>TUBE
                  </div>

                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div onClick={() => onPlayMedia(video)} className="cursor-pointer">
                    <h3 className={`text-sm font-bold line-clamp-1 ${
                      isCurrentPlaying ? 'text-rose-400' : 'text-white'
                    }`}>
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {video.subtitle} · {video.views} · {video.releaseDate}
                    </p>
                  </div>

                  {/* Actions: Play, Like, Share, Download */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                    <button
                      onClick={() => onPlayMedia(video)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleLike(video)}
                        className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl transition-colors ${
                          isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Like"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => onOpenShare(video)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenDownload(video)}
                        className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl transition-colors ${
                          isDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Download"
                      >
                        {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
