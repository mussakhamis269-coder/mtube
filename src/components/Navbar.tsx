import React, { useState } from 'react';
import { 
  Bell, 
  Cast, 
  Search, 
  Tv, 
  Sparkles, 
  Check, 
  X,
  Crown,
  LogIn
} from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSearch: () => void;
  user?: UserProfile | null;
  onOpenVip?: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  setActiveTab, 
  onOpenSearch,
  user,
  onOpenVip,
  onOpenAuth,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [castingDevice, setCastingDevice] = useState<string | null>(null);

  const isLoggedIn = user && user.authProvider !== 'guest';

  const notifications = [
    { id: 1, title: 'Trending Comedy & Music Live!', desc: 'New video episodes and hit songs are now streaming in 1080p FHD.', time: 'Just now' },
    { id: 2, title: 'VIP Ad-Free Access', desc: 'Free users watch with ads. Go VIP to stream without ads!', time: '1h ago' },
    { id: 3, title: 'Trending Bongo Flava', desc: 'Kelvin Kings hit #1 on East African charts.', time: '2h ago' }
  ];

  const castDevices = [
    { id: 'living-tv', name: 'Living Room Smart TV (Mtube 4K)' },
    { id: 'chromecast', name: 'Bedroom Chromecast Ultra' },
    { id: 'bt-speaker', name: 'JBL Boombox 3 (Bluetooth)' }
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#090a10]/95 backdrop-blur-md border-b border-white/[0.06] px-3 sm:px-4 py-2.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Wordmark & Logo */}
          <button 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2 text-left group focus:outline-none shrink-0"
            aria-label="Mtube Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/25 group-hover:scale-105 transition-transform">
              <span className="font-display font-extrabold text-white text-lg sm:text-xl tracking-tighter">M</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-[#090a10]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                  M<span className="text-rose-500">tube</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1 sm:px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20">
                  LIVE
                </span>
              </div>
            </div>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Prompt Requirement: VIP button gold color */}
            {onOpenVip && (
              <button
                onClick={onOpenVip}
                className="min-h-[38px] px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                title="VIP Plans: Monthly & Yearly"
              >
                <Crown className="w-3.5 h-3.5 fill-current text-slate-950" />
                <span className="hidden xs:inline">{user?.isVip ? 'VIP PASS' : 'VIP PLANS'}</span>
              </button>
            )}

            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
              aria-label="Search music and videos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cast to Smart TV */}
            <button
              onClick={() => setShowCastModal(true)}
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-all ${
                castingDevice 
                  ? 'text-rose-400 bg-rose-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5 active:scale-95'
              }`}
              aria-label="Cast to TV"
              title="Cast to TV / Speaker"
            >
              <Cast className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-[#12141d] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-colors">
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.desc}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Sign In Quick Link */}
            {isLoggedIn ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="ml-0.5 min-h-[40px] min-w-[40px] flex items-center justify-center group"
                aria-label="Go to Profile"
              >
                <div className={`w-8 h-8 rounded-full p-0.5 ring-2 transition-all ${
                  user?.isVip 
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-600 ring-amber-400/50' 
                    : 'bg-gradient-to-tr from-amber-500 to-rose-500 ring-white/10 group-hover:ring-rose-500/60'
                }`}>
                  <div className="w-full h-full rounded-full bg-[#0e1017] flex items-center justify-center text-xs font-bold text-amber-400">
                    {user?.avatar || 'MK'}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="ml-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Cast Modal */}
      {showCastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#12141f] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-rose-500" />
                <h3 className="font-display font-bold text-base text-white">Cast Mtube Screen</h3>
              </div>
              <button 
                onClick={() => setShowCastModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Select a screen or smart speaker on your local Wi-Fi to play KIDANI Comedy & music.
            </p>

            <div className="space-y-2 mb-4">
              {castDevices.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setCastingDevice(castingDevice === d.name ? null : d.name);
                    setShowCastModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    castingDevice === d.name
                      ? 'bg-rose-500/15 border-rose-500/40 text-white'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-slate-200'
                  }`}
                >
                  <span className="text-xs font-medium">{d.name}</span>
                  {castingDevice === d.name && (
                    <Check className="w-4 h-4 text-rose-400" />
                  )}
                </button>
              ))}
            </div>

            {castingDevice && (
              <button
                onClick={() => {
                  setCastingDevice(null);
                  setShowCastModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-colors"
              >
                Disconnect Cast ({castingDevice})
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
