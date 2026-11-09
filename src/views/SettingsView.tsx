import React, { useState } from 'react';
import { 
  ArrowLeft,
  User, 
  Users,
  LogOut, 
  ExternalLink,
  Bell, 
  Mail,
  PlaySquare,
  Sliders,
  Gauge,
  Download,
  Wifi,
  Trash2,
  History,
  EyeOff,
  Shield,
  Moon,
  Sun,
  Languages,
  Info,
  FileText,
  Lock,
  Code,
  Check,
  ChevronRight,
  Crown,
  X,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, AppTheme, AppLanguage, VipPlan } from '../types';

interface SettingsViewProps {
  user: UserProfile | null;
  onLogOut: () => void;
  onOpenAuth: () => void;
  onOpenVip: () => void;
  downloadCount: number;
  onClearDownloads: () => void;
  onBackToProfile: () => void;
  theme: AppTheme;
  onToggleTheme: (newTheme: AppTheme) => void;
  language: AppLanguage;
  onToggleLanguage: (newLang: AppLanguage) => void;
  onSwitchAccount: (newUser: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onLogOut,
  onOpenAuth,
  onOpenVip,
  downloadCount,
  onClearDownloads,
  onBackToProfile,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  onSwitchAccount,
}) => {
  // Modal / Sheet Dialog States
  const [activeDialog, setActiveDialog] = useState<
    | null
    | 'switchAccount'
    | 'googleAccount'
    | 'signOutConfirm'
    | 'videoQuality'
    | 'playbackSpeed'
    | 'downloadQuality'
    | 'clearWatchHistory'
    | 'clearSearchHistory'
    | 'manageActivity'
    | 'appearance'
    | 'language'
    | 'terms'
    | 'privacy'
    | 'licenses'
  >(null);

  // Notifications State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Playback State
  const [autoplay, setAutoplay] = useState(true);
  const [videoQuality, setVideoQuality] = useState<'Auto' | '360p' | '720p' | '1080p'>('Auto');
  const [playbackSpeed, setPlaybackSpeed] = useState<'0.75x' | '1.0x (Normal)' | '1.25x' | '1.5x'>('1.0x (Normal)');

  // Downloads State
  const [downloadQuality, setDownloadQuality] = useState<'1080p FHD' | '720p HD' | '360p Data Saver'>('1080p FHD');
  const [wifiOnly, setWifiOnly] = useState(true);

  // History & Privacy State
  const [pauseWatchHistory, setPauseWatchHistory] = useState(false);
  const [pauseSearchHistory, setPauseSearchHistory] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLoggedIn = user && user.authProvider !== 'guest';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isSwahili = language === 'sw';

  return (
    <div className="pb-36 pt-1 px-3 sm:px-4 max-w-2xl mx-auto space-y-4">
      
      {/* YouTube Style Top Header */}
      <div className="flex items-center gap-3 py-2 border-b border-white/[0.08]">
        <button
          onClick={onBackToProfile}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
          aria-label="Back to Profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-white font-display">
          {isSwahili ? 'Mipangilio' : 'Settings'}
        </h1>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto bg-slate-900 border border-emerald-500/40 text-emerald-400 p-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ACCOUNT SECTION */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Akaunti' : 'Account'}
          </span>
          {user?.isVip && (
            <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1">
              <Crown className="w-3 h-3 fill-current" /> VIP Active
            </span>
          )}
        </div>

        {/* Profile Details Row */}
        <div className="p-3.5 flex items-center justify-between gap-3 border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-display font-bold text-white text-sm shrink-0 shadow-md">
              {isLoggedIn ? (user?.avatar || 'MK') : 'G'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {isLoggedIn ? user?.name : (isSwahili ? 'Mtumiaji wa Wageni' : 'Guest User')}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {isLoggedIn ? user?.email : (isSwahili ? 'Hujaingia kwenye akaunti' : 'Not signed in')}
              </p>
            </div>
          </div>

          {!isLoggedIn ? (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
            >
              {isSwahili ? 'Ingia' : 'Sign In'}
            </button>
          ) : (
            <button
              onClick={onOpenVip}
              className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs shrink-0 flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>{user?.isVip ? 'VIP' : 'Upgrade'}</span>
            </button>
          )}
        </div>

        {/* Switch Account */}
        <button
          onClick={() => setActiveDialog('switchAccount')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Badilisha Akaunti' : 'Switch account'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isLoggedIn ? user?.name : 'Guest'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Google Account */}
        <button
          onClick={() => setActiveDialog('googleAccount')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Akaunti ya Google' : 'Google account'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Dhibiti akaunti yako ya Google' : 'Manage your Google Account'}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500" />
        </button>

        {/* Sign Out */}
        {isLoggedIn && (
          <button
            onClick={() => setActiveDialog('signOutConfirm')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-red-500/[0.08] transition-colors text-red-400"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold">
                {isSwahili ? 'Ondoka kwenye akaunti' : 'Sign out'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/60" />
          </button>
        )}
      </section>

      {/* 2. NOTIFICATIONS SECTION */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Arifa' : 'Notifications'}
          </span>
        </div>

        {/* Push Notifications */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Arifa za simu' : 'Push notifications'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Pata arifa za KIDANI na nyimbo mpya' : 'Notify me about KIDANI & trending music'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPushNotifications(!pushNotifications);
              showToast(pushNotifications ? 'Push notifications disabled' : 'Push notifications enabled');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              pushNotifications ? 'bg-rose-600' : 'bg-white/20'
            }`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              pushNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Email Notifications */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Arifa za barua pepe' : 'Email notifications'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Muhtasari wa kila wiki' : 'Weekly digest & product updates'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEmailNotifications(!emailNotifications);
              showToast(emailNotifications ? 'Email alerts disabled' : 'Email alerts enabled');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              emailNotifications ? 'bg-rose-600' : 'bg-white/20'
            }`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </section>

      {/* 3. PLAYBACK SECTION */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Uchezaji wa Video na Sauti' : 'Playback'}
          </span>
        </div>

        {/* Autoplay */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <PlaySquare className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Cheza kiotomatiki' : 'Autoplay'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Cheza video au wimbo unaofuata' : 'Autoplay next video or track'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAutoplay(!autoplay);
              showToast(autoplay ? 'Autoplay turned off' : 'Autoplay turned on');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              autoplay ? 'bg-rose-600' : 'bg-white/20'
            }`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              autoplay ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Video Quality (Auto, 360p, 720p, 1080p) */}
        <button
          onClick={() => setActiveDialog('videoQuality')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Ubora wa Video' : 'Video quality'}
              </p>
              <p className="text-[11px] text-slate-400">
                {videoQuality === 'Auto' ? 'Auto (Recommended)' : `${videoQuality} HD`}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Playback Speed */}
        <button
          onClick={() => setActiveDialog('playbackSpeed')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Gauge className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Kasi ya Uchezaji' : 'Playback speed'}
              </p>
              <p className="text-[11px] text-slate-400">
                {playbackSpeed}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </section>

      {/* 4. DOWNLOADS SECTION */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Vipakuliwa (Offline)' : 'Downloads'}
          </span>
        </div>

        {/* Download Quality */}
        <button
          onClick={() => setActiveDialog('downloadQuality')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Ubora wa Kupakua' : 'Download quality'}
              </p>
              <p className="text-[11px] text-slate-400">
                {downloadQuality}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Download over Wi-Fi only */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <Wifi className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Pakua kwa Wi-Fi pekee' : 'Download over Wi-Fi only'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Zuia matumizi ya data ya simu' : 'Save mobile cellular data'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setWifiOnly(!wifiOnly);
              showToast(wifiOnly ? 'Wi-Fi only disabled' : 'Wi-Fi only enabled');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              wifiOnly ? 'bg-rose-600' : 'bg-white/20'
            }`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              wifiOnly ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Delete All Downloads */}
        <button
          onClick={onClearDownloads}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-red-500/[0.08] transition-colors text-red-400"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-xs font-bold">
                {isSwahili ? 'Futa vipakuliwa vyote' : 'Delete all downloads'}
              </p>
              <p className="text-[11px] text-slate-400">
                {downloadCount} {isSwahili ? 'faili zimehifadhiwa' : 'files stored'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400/60" />
        </button>
      </section>

      {/* 5. HISTORY AND PRIVACY SECTION */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Historia na Faragha' : 'History and privacy'}
          </span>
        </div>

        {/* Clear Watch History */}
        <button
          onClick={() => setActiveDialog('clearWatchHistory')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Futa historia ya video ulizotazama' : 'Clear watch history'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Futa historia ya KIDANI na muziki' : 'Clear from all accounts on this device'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Clear Search History */}
        <button
          onClick={() => setActiveDialog('clearSearchHistory')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Futa historia ya utafutaji' : 'Clear search history'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Futa maneno uliyotafuta' : 'Clear searches made from this app'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Pause Watch History */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Sitisha historia ya kutazama' : 'Pause watch history'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPauseWatchHistory(!pauseWatchHistory);
              showToast(pauseWatchHistory ? 'Watch history resumed' : 'Watch history paused');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              pauseWatchHistory ? 'bg-rose-600' : 'bg-white/20'
            }`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              pauseWatchHistory ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Pause Search History */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Sitisha historia ya utafutaji' : 'Pause search history'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPauseSearchHistory(!pauseSearchHistory);
              showToast(pauseSearchHistory ? 'Search history resumed' : 'Search history paused');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              pauseSearchHistory ? 'bg-rose-600' : 'bg-white/20'
            }`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              pauseSearchHistory ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Manage all activity */}
        <button
          onClick={() => setActiveDialog('manageActivity')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Dhibiti shughuli zote' : 'Manage all activity'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSwahili ? 'Tazama na udhibiti faragha yako' : 'Review your Mtube data & interactions'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </section>

      {/* 6. APPEARANCE SECTION (Dark theme, Light theme) */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Muonekano' : 'Appearance'}
          </span>
        </div>

        <button
          onClick={() => setActiveDialog('appearance')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Mandhari ya Mtube' : 'Theme'}
              </p>
              <p className="text-[11px] text-slate-400">
                {theme === 'dark' ? 'Dark theme (AMOLED)' : 'Light theme'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </section>

      {/* 7. LANGUAGE SECTION (English, Swahili) */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Lugha' : 'Language'}
          </span>
        </div>

        <button
          onClick={() => setActiveDialog('language')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Languages className="w-4 h-4 text-sky-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Lugha ya Programu' : 'App language'}
              </p>
              <p className="text-[11px] text-slate-400">
                {language === 'sw' ? 'Kiswahili (East Africa)' : 'English (United States)'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </section>

      {/* 8. ABOUT SECTION (Version, Terms, Privacy Policy) */}
      <section className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {isSwahili ? 'Kuhusu' : 'About'}
          </span>
        </div>

        {/* Version */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSwahili ? 'Toleo la Mtube' : 'Version'}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Mtube 24.12.35 (Build 82926)
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
            Latest
          </span>
        </div>

        {/* Terms of Service */}
        <button
          onClick={() => setActiveDialog('terms')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-200">
              {isSwahili ? 'Sheria na Masharti' : 'Terms of Service'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Privacy Policy */}
        <button
          onClick={() => setActiveDialog('privacy')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-200">
              {isSwahili ? 'Sera ya Faragha' : 'Privacy Policy'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Open Source Licenses */}
        <button
          onClick={() => setActiveDialog('licenses')}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Code className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-200">
              {isSwahili ? 'Leseni za Programu' : 'Open source licenses'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </section>

      {/* PROMPT REQUIREMENT: Copyright footer © 2026 MTUBE Owned by Mussa Khamis */}
      <div className="pt-6 pb-2 text-center space-y-1 text-slate-400">
        <p className="text-xs font-bold text-slate-300">
          © 2026 MTUBE Owned by Mussa Khamis
        </p>
        <p className="text-[11px] text-slate-500">
          All Rights Reserved · Version 24.12.35 · Watermark & Owner Protection
        </p>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE MODAL DIALOGS */}
      {/* ============================================================ */}

      {/* Switch Account Dialog */}
      {activeDialog === 'switchAccount' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white">Accounts</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {/* Account 1: Owner MK */}
              <button
                onClick={() => {
                  onSwitchAccount({
                    id: 'user-mussa',
                    name: 'Mussa Khamis',
                    email: 'mussakhamis269@gmail.com',
                    avatar: 'MK',
                    isVip: user?.isVip || false,
                    isAdmin: true,
                    authProvider: 'google',
                  });
                  setActiveDialog(null);
                  showToast('Switched to Mussa Khamis (Owner MK)');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  user?.email === 'mussakhamis269@gmail.com'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white">
                    MK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white">Mussa Khamis</p>
                      <span className="px-1.5 py-0.2 bg-rose-600 text-[9px] font-black rounded text-white uppercase">
                        Owner
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">mussakhamis269@gmail.com</p>
                  </div>
                </div>
                {user?.email === 'mussakhamis269@gmail.com' && <Check className="w-4 h-4 text-rose-400" />}
              </button>

              {/* Account 2: Kidani Fan (Non-Owner) */}
              <button
                onClick={() => {
                  onSwitchAccount({
                    id: 'user-kidani-fan',
                    name: 'Kidani Comedy Fan',
                    email: 'kidanifan@gmail.com',
                    avatar: 'KF',
                    isVip: true,
                    isAdmin: false,
                    authProvider: 'email',
                  });
                  setActiveDialog(null);
                  showToast('Switched to Kidani Comedy Fan (Admin Blocked)');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  user?.email === 'kidanifan@gmail.com'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-950">
                    KF
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white">Kidani Comedy Fan</p>
                      <Crown className="w-3 h-3 text-amber-400 fill-current" />
                    </div>
                    <p className="text-[11px] text-slate-400">kidanifan@gmail.com</p>
                  </div>
                </div>
                {user?.email === 'kidanifan@gmail.com' && <Check className="w-4 h-4 text-rose-400" />}
              </button>
            </div>

            <button
              onClick={() => {
                setActiveDialog(null);
                onOpenAuth();
              }}
              className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-bold text-white transition-colors"
            >
              + Add another account
            </button>
          </div>
        </div>
      )}

      {/* Google Account Modal */}
      {activeDialog === 'googleAccount' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border border-white/10 rounded-3xl p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Google Account Sync</h3>
            <p className="text-xs text-slate-300 mb-4">
              Your Mtube preferences, watch history, and playlists are linked to <strong>{user?.email || 'your account'}</strong>.
            </p>
            <button
              onClick={() => setActiveDialog(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {activeDialog === 'signOutConfirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#131524] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">
              {isSwahili ? 'Ungependa kuondoka?' : 'Sign out of Mtube?'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isSwahili 
                ? 'Utaondolewa kwenye akaunti ya Mtube. Vipakuliwa vyako vitasalia kwenye kifaa hiki.' 
                : 'You will be signed out of your account. Downloaded videos and songs will remain available offline.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveDialog(null);
                  onLogOut();
                  showToast('You have been signed out');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Quality Dialog (Auto, 360p, 720p, 1080p) */}
      {activeDialog === 'videoQuality' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white">Video Quality</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 mb-4">
              {[
                { id: 'Auto' as const, label: 'Auto (Recommended)', desc: 'Adjusts to give you the best experience' },
                { id: '1080p' as const, label: 'Higher picture quality (1080p FHD)', desc: 'Uses more data, crisp cinematic detail' },
                { id: '720p' as const, label: 'Standard quality (720p HD)', desc: 'Good balance of quality and data' },
                { id: '360p' as const, label: 'Data saver (360p SD)', desc: 'Lower picture quality, uses minimum data' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setVideoQuality(opt.id);
                    setActiveDialog(null);
                    showToast(`Default video quality set to ${opt.id}`);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    videoQuality === opt.id
                      ? 'bg-rose-500/15 border-rose-500/40 text-white'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                  {videoQuality === opt.id && <Check className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Playback Speed Dialog */}
      {activeDialog === 'playbackSpeed' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white">Playback Speed</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 mb-4">
              {(['0.75x', '1.0x (Normal)', '1.25x', '1.5x'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setPlaybackSpeed(spd);
                    setActiveDialog(null);
                    showToast(`Speed set to ${spd}`);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    playbackSpeed === spd
                      ? 'bg-rose-500/15 border-rose-500/40 text-white'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{spd}</span>
                  {playbackSpeed === spd && <Check className="w-4 h-4 text-rose-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Download Quality Dialog */}
      {activeDialog === 'downloadQuality' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white">Download Quality</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { id: '1080p FHD' as const, label: 'Full HD (1080p)', size: '~86 MB / video' },
                { id: '720p HD' as const, label: 'High (720p)', size: '~42 MB / video' },
                { id: '360p Data Saver' as const, label: 'Low (360p)', size: '~18 MB / video' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setDownloadQuality(opt.id);
                    setActiveDialog(null);
                    showToast(`Download quality set to ${opt.id}`);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    downloadQuality === opt.id
                      ? 'bg-rose-500/15 border-rose-500/40 text-white'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{opt.size}</p>
                  </div>
                  {downloadQuality === opt.id && <Check className="w-4 h-4 text-rose-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clear Watch History Confirm */}
      {activeDialog === 'clearWatchHistory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#131524] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Clear watch history?</h3>
            <p className="text-xs text-slate-400 mb-4">
              Your Mtube watch history will be cleared from this device. Video recommendations will be reset.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveDialog(null);
                  showToast('Watch history cleared successfully');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Search History Confirm */}
      {activeDialog === 'clearSearchHistory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#131524] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Clear search history?</h3>
            <p className="text-xs text-slate-400 mb-4">
              All search queries made from this device will be cleared from your search suggestions.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveDialog(null);
                  showToast('Search history cleared successfully');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Clear Searches
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage All Activity Dialog */}
      {activeDialog === 'manageActivity' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Mtube Activity & Privacy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Mtube uses your watch history and likes to personalize recommendations for KIDANI comedy, Bongo Flava, and Amapiano hits. Your data is never sold to 3rd party brokers.
            </p>
            <button
              onClick={() => setActiveDialog(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Appearance Modal (Dark theme, Light theme) */}
      {activeDialog === 'appearance' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white">Appearance</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  onToggleTheme('dark');
                  setActiveDialog(null);
                  showToast('Dark theme applied');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-xs font-bold">Dark theme</p>
                    <p className="text-[11px] text-slate-400">AMOLED dark, easy on eyes</p>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-rose-400" />}
              </button>

              <button
                onClick={() => {
                  onToggleTheme('light');
                  setActiveDialog(null);
                  showToast('Light theme applied');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  theme === 'light'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold">Light theme</p>
                    <p className="text-[11px] text-slate-400">Crisp clean daytime style</p>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-rose-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal (English, Swahili) */}
      {activeDialog === 'language' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white">App Language</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  onToggleLanguage('en');
                  setActiveDialog(null);
                  showToast('Language changed to English');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  language === 'en'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">English (US)</p>
                  <p className="text-[11px] text-slate-400">Default language</p>
                </div>
                {language === 'en' && <Check className="w-4 h-4 text-rose-400" />}
              </button>

              <button
                onClick={() => {
                  onToggleLanguage('sw');
                  setActiveDialog(null);
                  showToast('Lugha imebadilishwa kuwa Kiswahili');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  language === 'sw'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Kiswahili (East Africa)</p>
                  <p className="text-[11px] text-slate-400">Tanzania, Kenya, Uganda, Rwanda</p>
                </div>
                {language === 'sw' && <Check className="w-4 h-4 text-rose-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeDialog === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#121422] border border-white/10 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
              <h3 className="text-sm font-bold text-white">Mtube Terms of Service</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar text-xs text-slate-300 space-y-3 pr-1">
              <p>Welcome to Mtube. By using our mobile streaming application, you agree to these terms.</p>
              <h4 className="font-bold text-white">1. Content Usage</h4>
              <p>All comedy series, music tracks, and videos are streamed under license or public broadcast terms. Offline downloads are for personal non-commercial use only.</p>
              <h4 className="font-bold text-white">2. VIP Subscriptions</h4>
              <p>VIP Monthly and VIP Yearly provide ad-free playback. Subscriptions renew automatically unless cancelled prior to the renewal date.</p>
              <h4 className="font-bold text-white">3. User Conduct</h4>
              <p>Comments and interactions must remain respectful and abide by East African communication ethics.</p>
            </div>
            <button
              onClick={() => setActiveDialog(null)}
              className="mt-3 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeDialog === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#121422] border border-white/10 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
              <h3 className="text-sm font-bold text-white">Mtube Privacy Policy</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar text-xs text-slate-300 space-y-3 pr-1">
              <p>Your privacy is paramount. Mtube collects minimal device telemetry strictly necessary to deliver high-quality media streaming.</p>
              <h4 className="font-bold text-white">Data Encryption</h4>
              <p>All downloaded songs and KIDANI episodes are encrypted locally on your device storage.</p>
              <h4 className="font-bold text-white">Ad Preferences</h4>
              <p>Free users receive non-intrusive sponsor ads. VIP users have all advertisements disabled.</p>
            </div>
            <button
              onClick={() => setActiveDialog(null)}
              className="mt-3 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Accept Policy
            </button>
          </div>
        </div>
      )}

      {/* Licenses Modal */}
      {activeDialog === 'licenses' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121422] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="text-sm font-bold text-white">Open Source Licenses</h3>
              <button onClick={() => setActiveDialog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Mtube utilizes React 19, Tailwind CSS, Lucide Icons, and Web Audio API technologies under MIT and Apache-2.0 licenses.
            </p>
            <button
              onClick={() => setActiveDialog(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
