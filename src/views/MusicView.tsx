import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  Download, 
  Check, 
  Radio, 
  Sparkles, 
  Flame, 
  Music,
  Headphones,
  Sliders,
  ListMusic
} from 'lucide-react';
import { MediaItem, Category } from '../types';
import { MEDIA_ITEMS } from '../data/mockData';

interface MusicViewProps {
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

export const MusicView: React.FC<MusicViewProps> = ({
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
  const [musicGenre, setMusicGenre] = useState<Category>('all');

  const allMusic = mediaItems.filter(item => item.type === 'music');
  const filteredMusic = musicGenre === 'all' 
    ? allMusic 
    : allMusic.filter(item => item.category === musicGenre);

  const heroTrack = allMusic[0]; // Bongo Flava #1
  const isHeroPlaying = activePlayingId === heroTrack?.id && isPlaying;
  const isHeroLiked = heroTrack ? likedMediaIds.has(heroTrack.id) : false;
  const isHeroDownloaded = heroTrack ? downloadedIds.has(heroTrack.id) : false;

  const genres: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Music' },
    { id: 'bongo', label: 'Bongo Flava' },
    { id: 'amapiano', label: 'Amapiano' },
    { id: 'afrobeats', label: 'Afrobeats' },
  ];

  return (
    <div className="pb-32 pt-2 px-3 sm:px-4 max-w-6xl mx-auto space-y-6">
      
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              Mtube Music
            </h1>
            <p className="text-xs text-slate-400">East African Hits, Amapiano & Afrobeats</p>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Music Track */}
      {heroTrack && (
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-950/60 via-[#131525] to-[#0c0d18] p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Album Cover */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10 group">
              <img
                src={heroTrack.thumbnail}
                alt={heroTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => onPlayMedia(heroTrack)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                  {isHeroPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </div>
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase border border-rose-500/30 mb-2">
                <Flame className="w-3 h-3 fill-current" />
                <span>#1 ON TOP BONGO CHARTS</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-extrabold text-white font-display tracking-tight">
                {heroTrack.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {heroTrack.subtitle} · {heroTrack.genre} · {heroTrack.durationFormatted}
              </p>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 max-w-lg">
                {heroTrack.description}
              </p>

              {/* Action Buttons: Play, Like, Share, Download */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                <button
                  onClick={() => onPlayMedia(heroTrack)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950 active:scale-95 transition-all"
                >
                  {isHeroPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isHeroPlaying ? 'Pause Track' : 'Listen Now'}</span>
                </button>

                <button
                  onClick={() => onToggleLike(heroTrack)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isHeroLiked
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isHeroLiked ? 'fill-current text-rose-500' : ''}`} />
                  <span>{isHeroLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={() => onOpenShare(heroTrack)}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => onOpenDownload(heroTrack)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isHeroDownloaded
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {isHeroDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                  <span>{isHeroDownloaded ? 'Saved' : 'Download'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Genre Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setMusicGenre(g.id)}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              musicGenre === g.id
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Top 10 Chart Countdown List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-rose-500" />
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              Top Trending Chart (East Africa & Beyond)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Updated today</span>
        </div>

        <div className="space-y-2">
          {filteredMusic.map((song, index) => {
            const isSongLiked = likedMediaIds.has(song.id);
            const isSongDownloaded = downloadedIds.has(song.id);
            const isSongPlaying = activePlayingId === song.id && isPlaying;

            return (
              <div
                key={song.id}
                onClick={() => onPlayMedia(song)}
                className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSongPlaying
                    ? 'bg-rose-500/15 border-rose-500/50 shadow-md'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                }`}
              >
                {/* Ranking Index + Thumbnail + Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <span className="w-6 text-center font-mono font-bold text-sm text-slate-500 group-hover:text-rose-400">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={`text-xs sm:text-sm font-bold truncate ${
                      isSongPlaying ? 'text-rose-400' : 'text-white'
                    }`}>
                      {song.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.subtitle} · {song.genre || 'Afrobeats'}
                    </p>
                  </div>
                </div>

                {/* Duration & Prompt Action Buttons */}
                <div 
                  className="flex items-center gap-1 shrink-0" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="hidden sm:inline-block text-xs font-mono text-slate-400 mr-2">
                    {song.durationFormatted}
                  </span>

                  <button
                    onClick={() => onToggleLike(song)}
                    className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors ${
                      isSongLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Like"
                  >
                    <Heart className={`w-4 h-4 ${isSongLiked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onOpenShare(song)}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenDownload(song)}
                    className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors ${
                      isSongDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Download"
                  >
                    {isSongDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onPlayMedia(song)}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-500 text-white ml-1 active:scale-95 transition-all"
                    title="Play"
                  >
                    {isSongPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
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

      {/* Curated Playlists Bento Box */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-white font-display">
          Curated Playlists
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Bongo Flava Gold', tracks: '45 Songs', color: 'from-amber-600 to-rose-700' },
            { title: 'Amapiano Grooves 2026', tracks: '38 Songs', color: 'from-indigo-600 to-purple-800' },
            { title: 'Afrobeat Workout', tracks: '52 Songs', color: 'from-red-600 to-orange-700' },
            { title: 'Acoustic Swahili Soul', tracks: '29 Songs', color: 'from-teal-600 to-emerald-800' },
          ].map((pl, idx) => (
            <div
              key={idx}
              onClick={() => onPlayMedia(heroTrack)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${pl.color} text-white cursor-pointer hover:scale-102 active:scale-98 transition-all shadow-lg flex flex-col justify-between min-h-[110px]`}
            >
              <div>
                <Headphones className="w-5 h-5 mb-2 opacity-80" />
                <h3 className="font-bold text-sm tracking-tight leading-snug">{pl.title}</h3>
              </div>
              <span className="text-[10px] uppercase font-mono opacity-80 font-bold">{pl.tracks}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
