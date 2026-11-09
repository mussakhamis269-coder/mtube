/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { ShareModal } from './components/ShareModal';
import { DownloadModal } from './components/DownloadModal';
import { AuthModal } from './components/AuthModal';
import { VipModal } from './components/VipModal';

import { HomeView } from './views/HomeView';
import { MusicView } from './views/MusicView';
import { VideosView } from './views/VideosView';
import { SearchView } from './views/SearchView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AdminDashboardView } from './views/AdminDashboardView';

import { ShieldAlert } from 'lucide-react';
import { MediaItem, TabType, Category, RepeatMode, UserProfile, VipPlan, AppTheme, AppLanguage } from './types';
import { FEATURED_VIDEO, MEDIA_ITEMS } from './data/mockData';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  
  // Dynamic media list managed by Admin Dashboard
  const [mediaList, setMediaList] = useState<MediaItem[]>(MEDIA_ITEMS);

  // App Theme & Language
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [language, setLanguage] = useState<AppLanguage>('en');

  // User Authentication & VIP Membership State: Prompt: "Make owner account MK as Admin"
  const [user, setUser] = useState<UserProfile | null>(() => {
    return {
      id: 'user-mussa',
      name: 'Mussa Khamis',
      email: 'mussakhamis269@gmail.com',
      avatar: 'MK',
      isAdmin: true, // Owner MK is Admin!
      isVip: true,
      vipPlan: 'yearly',
      authProvider: 'google',
    };
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  // Media Playback State
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(FEATURED_VIDEO);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);

  // User Actions State: Likes & Downloads
  const [likedMediaIds, setLikedMediaIds] = useState<Set<string>>(() => {
    return new Set(['video-kidani-02', 'music-bongo-01']);
  });

  const [downloadedItems, setDownloadedItems] = useState<MediaItem[]>(() => {
    return [MEDIA_ITEMS[1]]; // Seeded Bongo Flava hit
  });

  const [shareItem, setShareItem] = useState<MediaItem | null>(null);
  const [downloadTargetItem, setDownloadTargetItem] = useState<MediaItem | null>(null);

  const downloadedIds = new Set(downloadedItems.map(item => item.id));

  // Audio Playback Timer
  useEffect(() => {
    let timer: number;
    if (isPlaying && activeMedia) {
      timer = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (activeMedia.duration || 100)) {
            if (repeatMode === 'one') {
              return 0;
            } else {
              handleNextTrack();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeMedia, repeatMode]);

  // Audio Engine connection
  useEffect(() => {
    if (isPlaying && activeMedia) {
      const bpm = activeMedia.bpm || 104;
      const genre = activeMedia.category === 'amapiano' ? 'amapiano' : 'bongo';
      audioEngine.playTrack(genre, bpm);
    } else {
      audioEngine.pauseTrack();
    }
  }, [isPlaying, activeMedia?.id]);

  // Play a media item
  const handlePlayMedia = (item: MediaItem) => {
    if (activeMedia?.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveMedia(item);
      setCurrentTime(0);
      setIsPlaying(true);
    }
    if (item.type === 'video') {
      setIsFullPlayerOpen(true);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleLike = (item: MediaItem) => {
    setLikedMediaIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  const handleOpenShare = (item: MediaItem) => {
    setShareItem(item);
  };

  const handleOpenDownload = (item: MediaItem) => {
    // If not VIP, suggest VIP for faster/lossless downloads, but still open download modal
    setDownloadTargetItem(item);
  };

  const handleDownloadComplete = (item: MediaItem) => {
    setDownloadedItems((prev) => {
      if (prev.some(d => d.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleRemoveDownload = (id: string) => {
    setDownloadedItems((prev) => prev.filter(d => d.id !== id));
  };

  const handleClearAllDownloads = () => {
    setDownloadedItems([]);
  };

  const handleNextTrack = () => {
    if (!activeMedia) return;
    const currentIndex = MEDIA_ITEMS.findIndex(m => m.id === activeMedia.id);
    let nextIndex = (currentIndex + 1) % MEDIA_ITEMS.length;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * MEDIA_ITEMS.length);
    }
    setActiveMedia(MEDIA_ITEMS[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (!activeMedia) return;
    const currentIndex = MEDIA_ITEMS.findIndex(m => m.id === activeMedia.id);
    const prevIndex = (currentIndex - 1 + MEDIA_ITEMS.length) % MEDIA_ITEMS.length;
    setActiveMedia(MEDIA_ITEMS[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleToggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const handleToggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  // Auth & VIP Handlers
  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const handleLogOut = () => {
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: 'guest@mtube.app',
      avatar: 'GU',
      isVip: false,
      authProvider: 'guest'
    });
    setActiveTab('profile');
  };

  const handleUpgradeSuccess = (plan: VipPlan) => {
    if (user) {
      setUser({
        ...user,
        isVip: true,
        vipPlan: plan,
        vipExpiry: plan === 'monthly' ? 'Dec 8, 2026' : 'Nov 8, 2027',
      });
    }
  };

  const handleToggleTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleLanguage = (newLang: AppLanguage) => {
    setLanguage(newLang);
  };

  const handleSwitchAccount = (newUser: UserProfile) => {
    // Only owner MK has admin rights
    const isOwner = newUser.email === 'mussakhamis269@gmail.com' || newUser.avatar === 'MK';
    setUser({
      ...newUser,
      isAdmin: isOwner
    });
  };

  // Admin Dashboard Actions
  const handleAdminAddMedia = (newItem: MediaItem) => {
    setMediaList((prev) => [newItem, ...prev]);
  };

  const handleAdminUpdateMedia = (updatedItem: MediaItem) => {
    setMediaList((prev) => prev.map(m => m.id === updatedItem.id ? updatedItem : m));
    if (activeMedia?.id === updatedItem.id) {
      setActiveMedia(updatedItem);
    }
  };

  const handleAdminDeleteMedia = (id: string) => {
    setMediaList((prev) => prev.filter(m => m.id !== id));
    if (activeMedia?.id === id) {
      setIsPlaying(false);
      setActiveMedia(null);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative selection:bg-rose-500 selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#090a10] text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      
      {/* Top Mobile/Desktop Navbar with Gold VIP Button & User status */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setActiveTab('search')}
        user={user}
        onOpenVip={() => setIsVipModalOpen(true)}
        onOpenAuth={() => handleOpenAuth('signin')}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto">
        {activeTab === 'home' && (
          <HomeView
            onPlayMedia={handlePlayMedia}
            likedMediaIds={likedMediaIds}
            onToggleLike={handleToggleLike}
            onOpenShare={handleOpenShare}
            onOpenDownload={handleOpenDownload}
            downloadedIds={downloadedIds}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activePlayingId={activeMedia?.id}
            isPlaying={isPlaying}
            onNavigateToVideos={() => setActiveTab('videos')}
            onNavigateToMusic={() => setActiveTab('music')}
            mediaItems={mediaList}
          />
        )}

        {activeTab === 'music' && (
          <MusicView
            onPlayMedia={handlePlayMedia}
            likedMediaIds={likedMediaIds}
            onToggleLike={handleToggleLike}
            onOpenShare={handleOpenShare}
            onOpenDownload={handleOpenDownload}
            downloadedIds={downloadedIds}
            activePlayingId={activeMedia?.id}
            isPlaying={isPlaying}
            mediaItems={mediaList}
          />
        )}

        {activeTab === 'videos' && (
          <VideosView
            onPlayMedia={handlePlayMedia}
            likedMediaIds={likedMediaIds}
            onToggleLike={handleToggleLike}
            onOpenShare={handleOpenShare}
            onOpenDownload={handleOpenDownload}
            downloadedIds={downloadedIds}
            activePlayingId={activeMedia?.id}
            isPlaying={isPlaying}
            mediaItems={mediaList}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onPlayMedia={handlePlayMedia}
            likedMediaIds={likedMediaIds}
            onToggleLike={handleToggleLike}
            onOpenShare={handleOpenShare}
            onOpenDownload={handleOpenDownload}
            downloadedIds={downloadedIds}
            activePlayingId={activeMedia?.id}
            isPlaying={isPlaying}
            mediaItems={mediaList}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onOpenAuth={handleOpenAuth}
            onOpenVip={() => setIsVipModalOpen(true)}
            onOpenSettings={() => setActiveTab('settings')}
            onOpenAdmin={() => setActiveTab('admin')}
            onPlayMedia={handlePlayMedia}
            likedMediaIds={likedMediaIds}
            onToggleLike={handleToggleLike}
            onOpenShare={handleOpenShare}
            onOpenDownload={handleOpenDownload}
            downloadedItems={downloadedItems}
            onRemoveDownload={handleRemoveDownload}
            onClearAllDownloads={handleClearAllDownloads}
            activePlayingId={activeMedia?.id}
            isPlaying={isPlaying}
            mediaItems={mediaList}
          />
        )}

        {/* Prompt Requirement: Add Settings page with Log Out button */}
        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            onLogOut={handleLogOut}
            onOpenAuth={() => handleOpenAuth('signin')}
            onOpenVip={() => setIsVipModalOpen(true)}
            downloadCount={downloadedItems.length}
            onClearDownloads={handleClearAllDownloads}
            onBackToProfile={() => setActiveTab('profile')}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onSwitchAccount={handleSwitchAccount}
          />
        )}

        {/* PROMPT REQUIREMENT: Block Admin for everyone except owner MK */}
        {activeTab === 'admin' && (
          user?.isAdmin && (user.email === 'mussakhamis269@gmail.com' || user.avatar === 'MK') ? (
            <AdminDashboardView
              owner={user}
              mediaItems={mediaList}
              onAddMedia={handleAdminAddMedia}
              onUpdateMedia={handleAdminUpdateMedia}
              onDeleteMedia={handleAdminDeleteMedia}
              onBackToApp={() => setActiveTab('profile')}
              onPlayMedia={handlePlayMedia}
            />
          ) : (
            <div className="py-20 px-4 max-w-md mx-auto text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-2xl">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                  Access Denied · Admin Protected
                </span>
                <h2 className="text-xl font-black text-white font-display">
                  Admin Dashboard Restricted
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Owner Admin Dashboard is strictly reserved for <strong>Mussa Khamis (Owner MK)</strong>. All other users are blocked from viewing or managing platform settings.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 font-mono">
                Current Account: {user?.email || 'Guest'} · Clearance: User (Blocked)
              </div>

              <button
                onClick={() => setActiveTab('profile')}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Return to Profile
              </button>
            </div>
          )
        )}

        {/* PROMPT REQUIREMENT: Copyright footer © 2026 MTUBE Owned by Mussa Khamis */}
        <footer className="mt-12 mb-20 px-4 py-8 border-t border-white/[0.06] text-center">
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-black tracking-widest text-white uppercase font-display">
                <span className="text-rose-500">M</span>TUBE
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-[11px] text-slate-400 font-semibold">East Africa No. 1 Media Hub</span>
            </div>
            
            <p className="text-xs font-bold text-slate-200">
              © 2026 MTUBE Owned by Mussa Khamis
            </p>
            <p className="text-[11px] text-slate-400">
              KIDANI Comedy, Bongo Flava & Amapiano. Watermark & Owner Protection Enabled.
            </p>
          </div>
        </footer>
      </main>

      {/* Floating MiniPlayer Bar (above bottom navigation) */}
      {activeMedia && (
        <MiniPlayer
          media={activeMedia}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onExpand={() => setIsFullPlayerOpen(true)}
          onClose={() => {
            setIsPlaying(false);
            setActiveMedia(null);
          }}
          isLiked={likedMediaIds.has(activeMedia.id)}
          onToggleLike={handleToggleLike}
          currentTime={currentTime}
        />
      )}

      {/* Fixed Bottom Menu: Home, Music, Videos, Search, Profile */}
      <BottomNav
        activeTab={activeTab === 'settings' || activeTab === 'admin' ? 'profile' : activeTab}
        setActiveTab={setActiveTab}
        downloadCount={downloadedItems.length}
      />

      {/* Full Screen Player Modal (for both Video and Music with ad engine and VIP status) */}
      <FullPlayerModal
        media={activeMedia}
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        currentTime={currentTime}
        onSeek={handleSeek}
        isLiked={activeMedia ? likedMediaIds.has(activeMedia.id) : false}
        onToggleLike={handleToggleLike}
        onOpenShare={handleOpenShare}
        onOpenDownload={handleOpenDownload}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        repeatMode={repeatMode}
        onToggleRepeat={handleToggleRepeat}
        shuffle={shuffle}
        onToggleShuffle={handleToggleShuffle}
        isDownloaded={activeMedia ? downloadedIds.has(activeMedia.id) : false}
        isVip={user?.isVip}
        onOpenVip={() => {
          setIsFullPlayerOpen(false);
          setIsVipModalOpen(true);
        }}
      />

      {/* Share Modal */}
      {shareItem && (
        <ShareModal
          item={shareItem}
          isOpen={!!shareItem}
          onClose={() => setShareItem(null)}
        />
      )}

      {/* Download Modal (Prompt: Disable download for free users) */}
      {downloadTargetItem && (
        <DownloadModal
          item={downloadTargetItem}
          isOpen={!!downloadTargetItem}
          onClose={() => setDownloadTargetItem(null)}
          onDownloadComplete={handleDownloadComplete}
          isAlreadyDownloaded={downloadedIds.has(downloadTargetItem.id)}
          isVip={user?.isVip || false}
          onOpenVip={() => {
            setDownloadTargetItem(null);
            setIsVipModalOpen(true);
          }}
        />
      )}

      {/* Prompt Requirement: Login and Sign Up modal/page with Google or Email and Password */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Prompt Requirement: VIP Modal with gold color button and plans: VIP Monthly and VIP Yearly */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        user={user}
        onUpgradeSuccess={handleUpgradeSuccess}
        onOpenAuth={() => {
          setIsVipModalOpen(false);
          handleOpenAuth('signin');
        }}
      />

    </div>
  );
}
