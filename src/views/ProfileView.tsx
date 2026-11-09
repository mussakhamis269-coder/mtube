import React, { useState } from 'react';
import { 
  User, 
  Download, 
  Heart, 
  ListMusic, 
  Settings as SettingsIcon, 
  HardDrive, 
  Trash2, 
  Play, 
  Share2, 
  Check, 
  ShieldCheck, 
  Moon, 
  Wifi, 
  Smartphone,
  ChevronRight,
  Plus,
  Crown,
  Sparkles,
  Zap,
  LogIn,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { MediaItem, UserProfile, VipPlan } from '../types';
import { MEDIA_ITEMS } from '../data/mockData';

interface ProfileViewProps {
  user: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenVip: () => void;
  onOpenSettings: () => void;
  onOpenAdmin?: () => void;
  onPlayMedia: (item: MediaItem) => void;
  likedMediaIds: Set<string>;
  onToggleLike: (item: MediaItem) => void;
  onOpenShare: (item: MediaItem) => void;
  onOpenDownload: (item: MediaItem) => void;
  downloadedItems: MediaItem[];
  onRemoveDownload: (id: string) => void;
  onClearAllDownloads: () => void;
  activePlayingId?: string;
  isPlaying?: boolean;
  mediaItems?: MediaItem[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onOpenAuth,
  onOpenVip,
  onOpenSettings,
  onOpenAdmin,
  onPlayMedia,
  likedMediaIds,
  onToggleLike,
  onOpenShare,
  onOpenDownload,
  downloadedItems,
  onRemoveDownload,
  onClearAllDownloads,
  activePlayingId,
  isPlaying,
  mediaItems = MEDIA_ITEMS,
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'downloads' | 'liked' | 'playlists'>('downloads');
  const [playlists, setPlaylists] = useState([
    { id: 'p1', title: 'Kidani Comedy Marathon', count: 4, cover: '/src/assets/images/featured_kidani_ep01_1794131856605.jpg' },
    { id: 'p2', title: 'Dar Bongo Bangers', count: 12, cover: '/src/assets/images/music_bongo_flava_1794131857519.jpg' },
    { id: 'p3', title: 'Late Night Amapiano', count: 18, cover: '/src/assets/images/music_amapiano_sunset_1794131858146.jpg' },
  ]);

  const isLoggedIn = user && user.authProvider !== 'guest';
  const isOwner = Boolean(user && user.isAdmin && (user.email === 'mussakhamis269@gmail.com' || user.avatar === 'MK'));
  const likedItems = mediaItems.filter(item => likedMediaIds.has(item.id));

  // Calculate simulated storage
  const totalStorageMb = downloadedItems.reduce((acc, item) => {
    return acc + (item.type === 'video' ? 86.4 : 9.8);
  }, 0);

  return (
    <div className="pb-32 pt-2 px-3 sm:px-4 max-w-6xl mx-auto space-y-5">
      
      {/* User Profile Identity Section */}
      <section className="relative rounded-3xl p-5 bg-gradient-to-r from-[#171a2c] via-[#121422] to-[#0c0d16] border border-white/10 shadow-2xl overflow-hidden">
        
        {isLoggedIn ? (
          /* LOGGED IN USER */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-red-600 p-0.5 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-[#0e1019] flex items-center justify-center font-display font-extrabold text-2xl text-amber-400">
                    {user.avatar || 'MK'}
                  </div>
                </div>
                {user.isVip && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full ring-2 ring-[#0e1019] shadow-md shadow-amber-500/40">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-extrabold text-white font-display tracking-tight truncate">
                    {user.name}
                  </h1>
                  {user.isVip ? (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-400 border border-amber-400/40 text-[10px] font-black uppercase flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-current" />
                      VIP {user.vipPlan?.toUpperCase() || 'MEMBER'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15 text-[10px] font-semibold uppercase">
                      Free User (With Ads)
                    </span>
                  )}
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      OWNER MK
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {user.email} · {user.authProvider === 'google' ? 'Google Account' : 'Email Account'}
                </p>

                {/* Quick stats */}
                <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 font-mono">
                  <div>
                    <strong className="text-white font-bold">{downloadedItems.length}</strong> Downloads
                  </div>
                  <div>
                    <strong className="text-white font-bold">{likedItems.length}</strong> Liked
                  </div>
                  <div>
                    <strong className="text-white font-bold">{playlists.length}</strong> Playlists
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Button (Only for Owner MK) & Settings Gear Icon */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
              {isOwner && onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-rose-950/60 active:scale-95 transition-all"
                  title="Owner Admin Dashboard"
                >
                  <ShieldCheck className="w-4 h-4 fill-current text-white" />
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={onOpenSettings}
                className="min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-md group"
                aria-label="Open Settings"
                title="Settings"
              >
                <SettingsIcon className="w-4 h-4 text-slate-300 group-hover:rotate-45 transition-transform duration-200" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        ) : (
          /* GUEST / NOT LOGGED IN STATE - Prompt requirement: Add Profile page with Sign In button */
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-display">
                    Welcome to Mtube
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Sign in to save your favorite KIDANI episodes & songs offline.
                  </p>
                </div>
              </div>

              {/* Gear icon for guest users as well */}
              <button
                onClick={onOpenSettings}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-slate-300 hover:text-white active:scale-95 transition-all"
                aria-label="Open Settings"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Requirement: Sign In Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onOpenAuth('signin')}
                className="flex-1 sm:flex-initial min-h-[44px] px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950 active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold active:scale-95 transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </section>

      {/* PROMPT REQUIREMENT: OWNER ADMIN DASHBOARD FOR MTUBE (Only owner MK can access it) */}
      {isOwner && onOpenAdmin && (
        <section className="relative rounded-3xl p-5 bg-gradient-to-r from-rose-950/70 via-[#1e131d] to-[#121424] border border-rose-500/40 shadow-xl overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-[11px] shadow-md">
                  MK
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Owner Administrator Access
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white font-display">
                Mtube Owner Admin Dashboard
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Publish new videos, edit or remove catalog items, manage and block users, track VIP earnings ($19.5K), and monitor view & download analytics.
              </p>

              <div className="flex items-center gap-3 text-[11px] text-rose-300/90 font-mono pt-1">
                <span>• Upload & Edit Videos</span>
                <span>• Manage & Block Users</span>
                <span>• VIP Earnings & Analytics</span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={onOpenAdmin}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950/70 active:scale-95 transition-all"
              >
                <ShieldCheck className="w-4 h-4 fill-current text-white" />
                <span>Open Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        </section>
      )}

      {/* PROMPT REQUIREMENT: VIP SECTION (Free users watch with ads, VIP users pay monthly to watch without ads and download videos) */}
      <section className="relative rounded-3xl p-5 bg-gradient-to-r from-amber-500/20 via-[#181512] to-[#12131e] border border-amber-400/40 shadow-xl overflow-hidden group">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                {user?.isVip ? 'Mtube VIP Member Status' : 'Mtube VIP Membership'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white font-display">
              {user?.isVip ? 'Enjoying 100% Ad-Free Entertainment' : 'Free Users Watch With Ads · VIP Users Watch Ad-Free'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {user?.isVip ? (
                'You have full access to ad-free KIDANI comedy episodes, unlimited 1080p offline downloads, and background audio.'
              ) : (
                'Free users watch with sponsor ads. VIP users pay monthly or yearly to watch completely without ads and download all videos & music offline!'
              )}
            </p>

            <div className="flex items-center gap-4 text-[11px] text-amber-300/90 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> No Video Ads
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3 text-amber-400" /> Offline Downloads
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 320 kbps Hi-Fi
              </span>
            </div>
          </div>

          {/* Prompt Requirement: VIP Button GOLD COLOR with plans: VIP Monthly and VIP Yearly */}
          <div className="shrink-0 flex flex-col gap-1.5">
            <button
              onClick={onOpenVip}
              className="min-h-[46px] px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 active:scale-95 transition-all"
            >
              <Crown className="w-4 h-4 fill-current text-slate-950" />
              <span>{user?.isVip ? 'Manage VIP Plans' : 'Get VIP Plans'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-amber-300/80 font-mono text-center">
              <span>VIP Monthly ($2.99)</span>
              <span>·</span>
              <span>VIP Yearly ($24.99)</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Tabs: Downloads, Liked, Playlists */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'downloads', label: `Downloads (${downloadedItems.length})`, icon: Download },
          { id: 'liked', label: `Liked (${likedItems.length})`, icon: Heart },
          { id: 'playlists', label: 'Playlists', icon: ListMusic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as typeof activeProfileTab)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OFFLINE DOWNLOADS */}
      {activeProfileTab === 'downloads' && (
        <section className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-200">
                <HardDrive className="w-4 h-4 text-rose-500" />
                <span>Offline Storage Used</span>
              </div>
              <span className="font-mono text-slate-300">
                {totalStorageMb.toFixed(1)} MB of 64.0 GB
              </span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all"
                style={{ width: `${Math.max(2, (totalStorageMb / 1024) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Saved for flight mode and offline travel</span>
              {downloadedItems.length > 0 && (
                <button
                  onClick={onClearAllDownloads}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {downloadedItems.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              <Download className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">No Downloads Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tap the download button on any video or song to save it for offline listening!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {downloadedItems.map((item) => {
                const isPlayingThis = activePlayingId === item.id && isPlaying;
                return (
                  <div
                    key={item.id}
                    onClick={() => onPlayMedia(item)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-emerald-600 text-[8px] font-mono text-white px-1 rounded">
                          OFFLINE
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold truncate ${
                          isPlayingThis ? 'text-rose-400' : 'text-white'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {item.subtitle} · {item.durationFormatted}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="flex items-center gap-1 shrink-0" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onPlayMedia(item)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </button>

                      <button
                        onClick={() => onRemoveDownload(item.id)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete download"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: LIKED ITEMS */}
      {activeProfileTab === 'liked' && (
        <section className="space-y-3">
          {likedItems.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">No Liked Media Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tap the heart icon on KIDANI or any song to add it to your favorites.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {likedItems.map((item) => {
                const isPlayingThis = activePlayingId === item.id && isPlaying;
                return (
                  <div
                    key={item.id}
                    onClick={() => onPlayMedia(item)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold truncate ${
                          isPlayingThis ? 'text-rose-400' : 'text-white'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {item.subtitle} · {item.type.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="flex items-center gap-1 shrink-0" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onToggleLike(item)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-rose-500"
                        title="Unlike"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => onPlayMedia(item)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: PLAYLISTS */}
      {activeProfileTab === 'playlists' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Playlists</h3>
            <button
              onClick={() => {
                const newTitle = prompt('Enter new playlist name:');
                if (newTitle) {
                  setPlaylists([
                    { id: `pl-${Date.now()}`, title: newTitle, count: 0, cover: '/src/assets/images/featured_kidani_ep01_1794131856605.jpg' },
                    ...playlists
                  ]);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Playlist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {playlists.map((pl) => (
              <div 
                key={pl.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 flex items-center gap-3 cursor-pointer group transition-all"
              >
                <img 
                  src={pl.cover} 
                  alt={pl.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{pl.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{pl.count} items</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROMPT REQUIREMENT: Copyright footer © 2026 MTUBE Owned by Mussa Khamis */}
      <div className="pt-6 border-t border-white/5 text-center space-y-1 text-slate-400">
        <p className="text-xs font-bold text-slate-300">
          © 2026 MTUBE Owned by Mussa Khamis
        </p>
        <p className="text-[11px] text-slate-500">
          Exclusive Media Streaming Platform · Dar es Salaam, Tanzania
        </p>
      </div>

    </div>
  );
};
