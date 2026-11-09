import React from 'react';
import { 
  Play, 
  Heart, 
  Share2, 
  Download, 
  Flame, 
  Clock, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Laugh,
  ChevronRight,
  Disc3
} from 'lucide-react';
import { MediaItem, Category } from '../types';
import { MEDIA_ITEMS } from '../data/mockData';

interface HomeViewProps {
  onPlayMedia: (item: MediaItem) => void;
  likedMediaIds: Set<string>;
  onToggleLike: (item: MediaItem) => void;
  onOpenShare: (item: MediaItem) => void;
  onOpenDownload: (item: MediaItem) => void;
  downloadedIds: Set<string>;
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  activePlayingId?: string;
  isPlaying?: boolean;
  onNavigateToVideos: () => void;
  onNavigateToMusic: () => void;
  mediaItems?: MediaItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onPlayMedia,
  likedMediaIds,
  onToggleLike,
  onOpenShare,
  onOpenDownload,
  downloadedIds,
  activeCategory,
  setActiveCategory,
  activePlayingId,
  isPlaying,
  onNavigateToVideos,
  onNavigateToMusic,
  mediaItems = MEDIA_ITEMS,
}) => {
  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'comedy', label: 'Kidani Comedy' },
    { id: 'bongo', label: 'Bongo Flava' },
    { id: 'amapiano', label: 'Amapiano' },
    { id: 'afrobeats', label: 'Afrobeats' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeCategory);

  const trendingSongs = filteredItems.filter(item => item.type === 'music');
  const trendingVideos = filteredItems.filter(item => item.type === 'video');

  // Dynamic featured video from active media list
  const featuredVideo = mediaItems.find(item => item.type === 'video') || mediaItems[0];
  const isFeaturedLiked = featuredVideo ? likedMediaIds.has(featuredVideo.id) : false;
  const isFeaturedDownloaded = featuredVideo ? downloadedIds.has(featuredVideo.id) : false;
  const isFeaturedPlaying = featuredVideo ? (activePlayingId === featuredVideo.id && isPlaying) : false;

  return (
    <div className="pb-32 pt-2 px-3 sm:px-4 max-w-6xl mx-auto space-y-6">
      
      {/* Category Pills (Interactive Filter Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                  : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FEATURED SPOTLIGHT BANNER */}
      {featuredVideo && (
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-950">
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-[#090b12]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090b12]/90 via-[#090b12]/40 to-transparent" />

            {/* Top Featured Badges */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2">
              <span className="bg-rose-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                {featuredVideo.badge || 'FEATURED VIDEO'}
              </span>
              <span className="bg-black/60 backdrop-blur-md text-slate-200 text-[11px] font-mono px-2 py-1 rounded-lg border border-white/10">
                {featuredVideo.resolution || '1080p FHD'}
              </span>
            </div>

            {/* PROMPT REQUIREMENT: Watermark MTUBE on videos */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 shadow-xl pointer-events-none select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-black tracking-widest text-white uppercase font-display">
                <span className="text-rose-500 font-black">M</span>TUBE
              </span>
            </div>

            {/* Hero Content Information */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Flame className="w-4 h-4 fill-current text-rose-500" />
                <span>#1 Trending Video · {featuredVideo.subtitle}</span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display mb-1.5 drop-shadow-md">
                {featuredVideo.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 mb-4 leading-relaxed">
                {featuredVideo.description}
              </p>

              {/* Prompt Actions: Play, Like, Share, Download */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Play Button */}
                <button
                  onClick={() => onPlayMedia(featuredVideo)}
                  className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-rose-950/60 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isFeaturedPlaying ? 'Now Playing' : 'Watch Now'}</span>
                </button>

                {/* Like Button */}
                <button
                  onClick={() => onToggleLike(featuredVideo)}
                  className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isFeaturedLiked
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-400'
                      : 'bg-black/50 backdrop-blur-md border-white/15 text-slate-200 hover:bg-white/10'
                  }`}
                  title="Like"
                >
                  <Heart className={`w-4 h-4 ${isFeaturedLiked ? 'fill-current text-rose-500' : ''}`} />
                  <span>{isFeaturedLiked ? 'Liked' : (featuredVideo.views || 'Like')}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => onOpenShare(featuredVideo)}
                  className="min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-slate-200 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={() => onOpenDownload(featuredVideo)}
                  className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isFeaturedDownloaded
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-black/50 backdrop-blur-md border-white/15 text-slate-200 hover:bg-white/10'
                  }`}
                  title="Download"
                >
                  {isFeaturedDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRENDING SONGS SECTION (Spotify Style) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-rose-500 animate-[spin_8s_linear_infinite]" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
              Trending Songs
            </h2>
          </div>
          <button
            onClick={onNavigateToMusic}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>See all music</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Songs Grid / Tap List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {trendingSongs.map((song) => {
            const isSongLiked = likedMediaIds.has(song.id);
            const isSongDownloaded = downloadedIds.has(song.id);
            const isSongPlaying = activePlayingId === song.id && isPlaying;

            return (
              <div
                key={song.id}
                onClick={() => onPlayMedia(song)}
                className={`group relative flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSongPlaying
                    ? 'bg-rose-500/15 border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15'
                }`}
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className={`text-xs sm:text-sm font-bold truncate ${
                        isSongPlaying ? 'text-rose-400' : 'text-white'
                      }`}>
                        {song.title}
                      </h3>
                      {song.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-rose-500/20 text-rose-400">
                          {song.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.subtitle} · {song.durationFormatted}
                    </p>
                  </div>
                </div>

                {/* Prompt Actions for Song: Play, Like, Share, Download */}
                <div 
                  className="flex items-center gap-1 shrink-0" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onToggleLike(song)}
                    className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors ${
                      isSongLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label="Like song"
                  >
                    <Heart className={`w-4 h-4 ${isSongLiked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onOpenShare(song)}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                    aria-label="Share song"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenDownload(song)}
                    className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors ${
                      isSongDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label="Download song"
                  >
                    {isSongDownloaded ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onPlayMedia(song)}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95 transition-all ml-0.5"
                    aria-label="Play song"
                  >
                    {isSongPlaying ? (
                      <span className="w-2.5 h-2.5 bg-white rounded-xs animate-pulse" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRENDING VIDEOS SECTION (YouTube Style) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laugh className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
              Trending Comedy & Videos
            </h2>
          </div>
          <button
            onClick={onNavigateToVideos}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>See all videos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingVideos.map((video) => {
            const isVideoLiked = likedMediaIds.has(video.id);
            const isVideoDownloaded = downloadedIds.has(video.id);
            const isVideoPlaying = activePlayingId === video.id && isPlaying;

            return (
              <div
                key={video.id}
                className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all group flex flex-col"
              >
                {/* Video Frame */}
                <div 
                  onClick={() => onPlayMedia(video)}
                  className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Duration Badge */}
                  <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
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

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info and Actions */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div onClick={() => onPlayMedia(video)} className="cursor-pointer">
                    <h3 className={`text-sm font-bold line-clamp-1 ${
                      isVideoPlaying ? 'text-rose-400' : 'text-white'
                    }`}>
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {video.subtitle} · {video.views} · {video.releaseDate}
                    </p>
                  </div>

                  {/* Bottom Action Strip: Play, Like, Share, Download */}
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
                          isVideoLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Like"
                      >
                        <Heart className={`w-4 h-4 ${isVideoLiked ? 'fill-current' : ''}`} />
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
                          isVideoDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Download"
                      >
                        {isVideoDownloaded ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
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
