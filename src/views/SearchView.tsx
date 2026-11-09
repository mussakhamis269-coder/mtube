import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  Download, 
  Check, 
  TrendingUp, 
  History, 
  Film, 
  Music, 
  Clock 
} from 'lucide-react';
import { MediaItem } from '../types';
import { MEDIA_ITEMS } from '../data/mockData';

interface SearchViewProps {
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

export const SearchView: React.FC<SearchViewProps> = ({
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
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'songs' | 'videos' | 'comedy'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'KIDANI Comedy Series',
    'Bongo Flava',
    'Amapiano 2026',
    'Kelvin Kings',
  ]);

  const trendingTags = [
    '#KidaniComedy',
    '#HarusiYaMtaa',
    '#BongoFlava',
    '#AmapianoNights',
    '#SokoniLeo',
    '#Afrobeats',
  ];

  const handleSelectTag = (tag: string) => {
    const clean = tag.replace('#', '');
    setQuery(clean);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  // Filter items
  const filteredResults = mediaItems.filter((item) => {
    const matchesQuery = 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (activeFilter === 'songs') return item.type === 'music';
    if (activeFilter === 'videos') return item.type === 'video';
    if (activeFilter === 'comedy') return item.category === 'comedy';
    return true;
  });

  return (
    <div className="pb-32 pt-2 px-3 sm:px-4 max-w-6xl mx-auto space-y-5">
      
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center bg-[#131522] border border-white/10 rounded-2xl shadow-xl focus-within:border-rose-500/80 transition-colors">
          <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search KIDANI comedy, songs, artists, videos..."
            className="w-full bg-transparent px-3 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'songs', label: 'Songs Only' },
          { id: 'videos', label: 'Videos Only' },
          { id: 'comedy', label: 'Kidani & Comedy' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as typeof activeFilter)}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* When Query is Empty: Trending Tags & Recent Searches */}
      {!query && (
        <div className="space-y-5">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="text-slate-500 hover:text-rose-400 transition-colors capitalize text-[11px]"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(term)}
                    className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-300 hover:text-white text-xs flex items-center gap-2 transition-colors"
                  >
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Hot Queries */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span>Trending Searches on Mtube</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTag(tag)}
                  className="min-h-[38px] px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600/10 to-amber-500/10 hover:from-rose-600/20 hover:to-amber-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:text-white transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results List */}
      {query && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Found <strong className="text-white">{filteredResults.length}</strong> results for "{query}"
            </span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching "Kidani", "Bongo", or "Amapiano"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredResults.map((item) => {
                const isLiked = likedMediaIds.has(item.id);
                const isDownloaded = downloadedIds.has(item.id);
                const isItemPlaying = activePlayingId === item.id && isPlaying;

                return (
                  <div
                    key={item.id}
                    onClick={() => onPlayMedia(item)}
                    className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isItemPlaying
                        ? 'bg-rose-500/15 border-rose-500/40 shadow-lg'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono text-white px-1 rounded">
                          {item.type === 'video' ? 'VIDEO' : 'AUDIO'}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold truncate ${
                          isItemPlaying ? 'text-rose-400' : 'text-white'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {item.subtitle} · {item.durationFormatted}
                        </p>
                        <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Play, Like, Share, Download */}
                    <div 
                      className="flex items-center gap-1 shrink-0" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onToggleLike(item)}
                        className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors ${
                          isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Like"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => onOpenShare(item)}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenDownload(item)}
                        className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors ${
                          isDownloaded ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Download"
                      >
                        {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => onPlayMedia(item)}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-500 text-white ml-1 active:scale-95 transition-all"
                        title="Play"
                      >
                        {isItemPlaying ? (
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
          )}
        </div>
      )}

    </div>
  );
};
