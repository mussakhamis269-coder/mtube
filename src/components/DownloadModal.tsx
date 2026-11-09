import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  HardDrive, 
  Wifi, 
  Zap,
  Play,
  Lock,
  Crown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { MediaItem } from '../types';

interface DownloadModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onDownloadComplete: (item: MediaItem, quality: string) => void;
  isAlreadyDownloaded?: boolean;
  isVip?: boolean;
  onOpenVip?: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  item,
  isOpen,
  onClose,
  onDownloadComplete,
  isAlreadyDownloaded = false,
  isVip = false,
  onOpenVip
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'high' | 'medium' | 'saver'>('high');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('8.4 MB/s');
  const [completed, setCompleted] = useState(isAlreadyDownloaded);

  useEffect(() => {
    if (isAlreadyDownloaded) {
      setCompleted(true);
      setProgress(100);
    } else {
      setCompleted(false);
      setProgress(0);
    }
  }, [isAlreadyDownloaded, item.id]);

  if (!isOpen) return null;

  const qualityOptions = item.type === 'video' ? [
    {
      id: 'high' as const,
      name: 'Full HD 1080p',
      size: '86.4 MB',
      detail: 'Crisp cinematic clarity & 5.1 surround sound',
      badge: 'RECOMMENDED'
    },
    {
      id: 'medium' as const,
      name: 'Standard 720p',
      size: '42.1 MB',
      detail: 'Balanced quality and fast download'
    },
    {
      id: 'saver' as const,
      name: 'Data Saver 480p',
      size: '18.5 MB',
      detail: 'Uses minimum mobile data'
    }
  ] : [
    {
      id: 'high' as const,
      name: 'Master Audio (320 kbps)',
      size: '9.8 MB',
      detail: 'Studio lossless punch with deep sub bass',
      badge: 'RECOMMENDED'
    },
    {
      id: 'medium' as const,
      name: 'Standard MP3 (192 kbps)',
      size: '5.2 MB',
      detail: 'Great sound quality for earphones'
    },
    {
      id: 'saver' as const,
      name: 'Data Saver (96 kbps)',
      size: '2.4 MB',
      detail: 'Fastest download for low storage'
    }
  ];

  const startDownload = () => {
    setIsDownloading(true);
    setProgress(5);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setIsDownloading(false);
          setCompleted(true);
          onDownloadComplete(item, selectedQuality);
          return 100;
        }
        const step = Math.floor(Math.random() * 15) + 10;
        const newSpeed = (6 + Math.random() * 5).toFixed(1) + ' MB/s';
        setDownloadSpeed(newSpeed);
        return Math.min(prev + step, 100);
      });
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#131522] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-rose-500" />
            <h3 className="font-display font-bold text-base text-white">Download for Offline</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Brief */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-4">
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-14 h-14 object-cover rounded-xl shrink-0 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
            <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
            <span className="text-[10px] text-emerald-400 font-medium inline-flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3" /> Offline Playback Supported
            </span>
          </div>
        </div>

        {/* PROMPT REQUIREMENT: Disable download for free users */}
        {!isVip ? (
          <div className="space-y-4 mb-2 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/15 via-[#1a1715] to-[#121422] border border-amber-400/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-400/30 inline-flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-current" /> VIP Exclusive
                </span>
                <h4 className="text-base font-black text-white mt-1.5 font-display">
                  Downloads Disabled for Free Users
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 max-w-sm mx-auto">
                  Free users can stream videos with sponsor ads. Downloading for offline playback requires an active <strong>Mtube VIP</strong> subscription.
                </p>
              </div>

              {/* Comparison Box */}
              <div className="bg-black/40 rounded-xl p-3 border border-white/10 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold">Free Plan</span>
                  </span>
                  <span className="text-rose-400 font-bold">Downloads Disabled ✕</span>
                </div>
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>VIP Plan ($2.99/mo)</span>
                  </span>
                  <span className="text-emerald-400 font-bold">Unlimited 1080p Offline ✓</span>
                </div>
              </div>
            </div>

            {/* Prompt Requirement: VIP button gold color */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenVip) onOpenVip();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-98 transition-all"
              >
                <Crown className="w-4 h-4 fill-current text-slate-950" />
                <span>Upgrade to VIP to Download</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* VIP USERS CAN DOWNLOAD NORMALLY */
          <>
            {/* Quality Selector */}
            {!isDownloading && !completed && (
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Select Quality
                  </label>
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-current" /> VIP UNLOCKED
                  </span>
                </div>
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedQuality(opt.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      selectedQuality === opt.id
                        ? 'bg-rose-500/15 border-rose-500/50 text-white shadow-lg shadow-rose-900/20'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{opt.name}</span>
                        {opt.badge && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.detail}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-300 tabular-nums shrink-0 ml-2">
                      {opt.size}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Downloading Progress Screen */}
            {isDownloading && (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 animate-bounce" /> Downloading to Device...
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{progress}%</span>
                </div>
                
                {/* Progress track */}
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-emerald-400" /> {downloadSpeed}
                  </span>
                  <span>Encrypted Offline Cache</span>
                </div>
              </div>
            )}

            {/* Completed Screen */}
            {completed && !isDownloading && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center mb-5 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">Downloaded Successfully!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  This media is now saved in your offline Mtube library. You can listen or watch anytime without internet connection.
                </p>
              </div>
            )}

            {/* Action Button */}
            <div>
              {!completed && !isDownloading && (
                <button
                  onClick={startDownload}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Start Download</span>
                </button>
              )}

              {isDownloading && (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl bg-white/10 text-slate-400 font-semibold text-sm flex items-center justify-center gap-2 cursor-wait"
                >
                  <HardDrive className="w-4 h-4 animate-pulse" />
                  <span>Saving to storage...</span>
                </button>
              )}

              {completed && (
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs active:scale-98 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Offline</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
