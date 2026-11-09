import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Heart, 
  Share2, 
  Download, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Maximize, 
  Minimize, 
  Settings, 
  MessageSquare, 
  ListMusic, 
  FileText, 
  ThumbsUp, 
  Send, 
  Check, 
  Smile, 
  Subtitles,
  Flame,
  Laugh,
  Crown,
  Lock
} from 'lucide-react';
import { MediaItem, Comment, RepeatMode } from '../types';
import { audioEngine } from '../services/audioEngine';
import { INITIAL_COMMENTS } from '../data/mockData';

interface FullPlayerModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  isLiked: boolean;
  onToggleLike: (item: MediaItem) => void;
  onOpenShare: (item: MediaItem) => void;
  onOpenDownload: (item: MediaItem) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  isDownloaded: boolean;
  isVip?: boolean;
  onOpenVip?: () => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  media,
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek,
  isLiked,
  onToggleLike,
  onOpenShare,
  onOpenDownload,
  onNextTrack,
  onPrevTrack,
  repeatMode,
  onToggleRepeat,
  shuffle,
  onToggleShuffle,
  isDownloaded,
  isVip = false,
  onOpenVip,
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'chapters' | 'comments'>('player');
  const [speed, setSpeed] = useState<number>(1);
  const [resolution, setResolution] = useState<string>('1080p FHD');
  const [showSettings, setShowSettings] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [reactionCounts, setReactionCounts] = useState({ laugh: 1420, fire: 890, love: 2450 });
  const [adDismissed, setAdDismissed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize comments for the current media item
  useEffect(() => {
    if (media) {
      setComments(INITIAL_COMMENTS[media.id] || [
        {
          id: 'def-1',
          user: 'Mussa Khamis',
          avatar: 'MK',
          text: 'Kali sana hii! Mtube is the best platform for African entertainment 🔥',
          timeAgo: '10 mins ago',
          likes: 42,
          userLiked: false
        }
      ]);
    }
  }, [media?.id]);

  // Audio Visualizer loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = isPlaying ? audioEngine.getVisualizerData() : new Uint8Array(32);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 28;
      const barWidth = (canvas.width / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? (data[i] || Math.floor(Math.random() * 80 + 30)) : 8;
        const height = Math.max(4, (val / 255) * canvas.height);
        const x = i * (barWidth + 3);
        const y = (canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, '#f43f5e'); // rose
        grad.addColorStop(1, '#fbbf24'); // amber

        ctx.fillStyle = isPlaying ? grad : '#334155';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 3);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isOpen, activeTab]);

  if (!isOpen || !media) return null;

  const duration = media.duration || 100;
  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const triggerReaction = (type: 'laugh' | 'fire' | 'love', emoji: string) => {
    setReactionCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40
    };
    setReactions(prev => [...prev.slice(-8), newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 1500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC: Comment = {
      id: `comment-${Date.now()}`,
      user: 'You (Mussa)',
      avatar: 'MK',
      text: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 1,
      userLiked: true
    };
    setComments([newC, ...comments]);
    setNewCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          userLiked: !c.userLiked,
          likes: c.userLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090b12] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0c0e18]/80 backdrop-blur-md shrink-0">
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Collapse player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center max-w-[200px] sm:max-w-xs text-center truncate">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {media.type === 'video' ? 'PLAYING VIDEO' : 'PLAYING TRACK'}
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate w-full">
            {media.title}
          </span>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all ${
            showSettings ? 'bg-white/10 text-white' : ''
          }`}
          aria-label="Playback Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Overlay Drawer */}
      {showSettings && (
        <div className="absolute top-14 right-4 z-50 w-64 bg-[#141624] border border-white/10 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95">
          <div className="text-xs font-bold text-slate-300 mb-2 pb-1 border-b border-white/10 flex items-center justify-between">
            <span>Playback Quality & Speed</span>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="mb-3">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Speed</label>
            <div className="grid grid-cols-4 gap-1">
              {[0.75, 1, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-1 text-[11px] font-mono rounded-lg transition-colors ${
                    speed === s ? 'bg-rose-600 text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          {media.type === 'video' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Resolution</label>
              <div className="space-y-1">
                {['1080p FHD (Original)', '720p HD', '480p SD'].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      resolution.includes(res.slice(0, 4)) ? 'bg-rose-500/15 text-rose-400 font-semibold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{res}</span>
                    {resolution.includes(res.slice(0, 4)) && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Player Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center justify-between max-w-xl mx-auto w-full">
        
        {/* Floating animated reactions (floating upward) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
          {reactions.map(r => (
            <div
              key={r.id}
              className="absolute bottom-24 text-3xl animate-[bounce_1.5s_ease-out_forwards] transition-all"
              style={{ left: `${r.x}%`, opacity: 0.9 }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Media Viewport Screen: VIDEO vs MUSIC */}
        {media.type === 'video' ? (
          /* VIDEO PLAYER EXPERIENCE */
          <div className="w-full relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video border border-white/10 group mb-3">
            <img 
              src={media.thumbnail} 
              alt={media.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Subtitles Overlay */}
            {subtitlesEnabled && isPlaying && (
              <div className="absolute bottom-12 left-4 right-4 text-center pointer-events-none">
                <span className="bg-black/80 text-amber-300 text-xs sm:text-sm font-medium px-3 py-1 rounded-md shadow-lg border border-white/10">
                  {media.seriesTitle 
                    ? `[${media.seriesTitle}]: "♪ ${media.title} ♪"`
                    : `[Audio]: ♪ ${media.title} ♪`}
                </span>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
              <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>
            </div>

            {/* Top Video Badges & VIP Status */}
            <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                  {media.badge || 'HD'}
                </span>
                <span className="bg-black/60 backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                  {resolution}
                </span>

                {isVip ? (
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                    <Crown className="w-3 h-3 fill-current" />
                    VIP Ad-Free
                  </span>
                ) : (
                  <span className="bg-black/70 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-amber-400/30">
                    Free (With Ads)
                  </span>
                )}
              </div>

              {/* PROMPT REQUIREMENT: Watermark MTUBE on videos */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 shadow-xl pointer-events-none select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[11px] font-black tracking-widest text-white uppercase font-display">
                    <span className="text-rose-500 font-black">M</span>TUBE
                  </span>
                </div>

                {/* Subtitles Toggle */}
                <button
                  onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                  className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg backdrop-blur-sm border transition-colors ${
                    subtitlesEnabled ? 'bg-white/20 border-white/30 text-amber-300' : 'bg-black/50 border-white/10 text-slate-400'
                  }`}
                  title="Toggle Subtitles"
                >
                  <Subtitles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Corner MTUBE Watermark Stamp */}
            <div className="absolute bottom-2.5 left-3 z-20 pointer-events-none select-none flex items-center gap-1 opacity-80">
              <span className="text-[9px] font-black tracking-wider text-slate-200 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10 uppercase font-display">
                MTUBE • Owned by Mussa Khamis
              </span>
            </div>

            {/* Free User Ad Banner (Prompt: Free users watch with ads, VIP users pay monthly to watch without ads) */}
            {!isVip && !adDismissed && (
              <div className="absolute bottom-10 left-3 right-3 z-30 bg-black/90 backdrop-blur-md border border-amber-400/40 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xl animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="bg-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    AD
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-white truncate">
                      Vodacom Tanzania 5G High-Speed Data
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      Free users watch with ads · Upgrade to VIP for ad-free streaming
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onOpenVip && (
                    <button
                      onClick={onOpenVip}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow-md active:scale-95 transition-all"
                    >
                      <Crown className="w-3 h-3 fill-current" />
                      <span>Go VIP</span>
                    </button>
                  )}
                  <button
                    onClick={() => setAdDismissed(true)}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-semibold"
                  >
                    Skip Ad
                  </button>
                </div>
              </div>
            )}

            {/* Quick Live Reaction triggers on video */}
            <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-20">
              <button
                onClick={() => triggerReaction('laugh', '😂')}
                className="px-2 py-1 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm border border-white/10 text-xs flex items-center gap-1 active:scale-90 transition-transform"
                title="Laugh"
              >
                <Laugh className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-[10px] font-mono">{reactionCounts.laugh}</span>
              </button>
              <button
                onClick={() => triggerReaction('fire', '🔥')}
                className="px-2 py-1 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm border border-white/10 text-xs flex items-center gap-1 active:scale-90 transition-transform"
                title="Fire"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-mono">{reactionCounts.fire}</span>
              </button>
            </div>
          </div>
        ) : (
          /* MUSIC PLAYER EXPERIENCE */
          <div className="w-full flex flex-col items-center mb-4">
            {/* Spinning or Ambient Album Art */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group mb-4">
              <img 
                src={media.thumbnail} 
                alt={media.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Pulsing glow ring when playing */}
              {isPlaying && (
                <div className="absolute inset-0 ring-4 ring-rose-500/30 rounded-3xl animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Live Audio Equalizer Waveform */}
            <canvas 
              ref={canvasRef} 
              width={320} 
              height={38} 
              className="w-full max-w-sm rounded-xl mb-1 opacity-90"
            />
          </div>
        )}

        {/* Media Metadata & Essential Title */}
        <div className="w-full mb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1 font-display">
                {media.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 truncate mt-0.5">
                {media.subtitle} {media.views ? `· ${media.views}` : ''}
              </p>
            </div>

            {/* Prompt Requirement: Working Like Button */}
            <button
              onClick={() => onToggleLike(media)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border transition-all ${
                isLiked 
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-lg shadow-rose-950/40' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Prompt Specific Action Bar: PLAY, LIKE, SHARE, DOWNLOAD */}
        <div className="w-full grid grid-cols-4 gap-2 p-2 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 text-center">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 active:scale-95 transition-all"
            aria-label="Toggle Playback"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current mb-0.5" />
            ) : (
              <Play className="w-5 h-5 fill-current mb-0.5 ml-0.5" />
            )}
            <span className="text-[10px] font-bold text-slate-200">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>

          {/* Like Button */}
          <button
            onClick={() => onToggleLike(media)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border active:scale-95 transition-all ${
              isLiked 
                ? 'bg-rose-500/25 border-rose-500/50 text-rose-400 font-bold' 
                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-slate-300'
            }`}
          >
            <Heart className={`w-5 h-5 mb-0.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
            <span className="text-[10px] text-slate-200 font-medium">
              {isLiked ? 'Liked' : 'Like'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onOpenShare(media)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-slate-300 active:scale-95 transition-all"
          >
            <Share2 className="w-5 h-5 mb-0.5 text-sky-400" />
            <span className="text-[10px] text-slate-200 font-medium">Share</span>
          </button>

          {/* Download Button (Prompt: Disable download for free users) */}
          <button
            onClick={() => onOpenDownload(media)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border active:scale-95 transition-all ${
              isDownloaded
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : !isVip
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-slate-300'
            }`}
          >
            {isDownloaded ? (
              <Check className="w-5 h-5 mb-0.5 text-emerald-400" />
            ) : !isVip ? (
              <div className="relative mb-0.5">
                <Download className="w-5 h-5 text-amber-400 opacity-60" />
                <Lock className="w-2.5 h-2.5 text-amber-400 absolute -top-0.5 -right-1" />
              </div>
            ) : (
              <Download className="w-5 h-5 mb-0.5 text-amber-400" />
            )}
            <span className="text-[10px] text-slate-200 font-medium">
              {isDownloaded ? 'Saved' : !isVip ? 'VIP Lock' : 'Download'}
            </span>
          </button>
        </div>

        {/* Media Chapters / Lyrics / Comments Subtabs */}
        <div className="w-full flex items-center justify-around border-b border-white/10 mb-3 text-xs">
          <button
            onClick={() => setActiveTab('player')}
            className={`pb-2 px-3 font-semibold transition-colors relative ${
              activeTab === 'player' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Controls
            {activeTab === 'player' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />}
          </button>

          {media.type === 'video' && media.chapters && (
            <button
              onClick={() => setActiveTab('chapters')}
              className={`pb-2 px-3 font-semibold transition-colors relative ${
                activeTab === 'chapters' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chapters ({media.chapters.length})
              {activeTab === 'chapters' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />}
            </button>
          )}

          {media.type === 'music' && media.lyrics && (
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`pb-2 px-3 font-semibold transition-colors relative flex items-center gap-1 ${
                activeTab === 'lyrics' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Lyrics
              {activeTab === 'lyrics' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />}
            </button>
          )}

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2 px-3 font-semibold transition-colors relative flex items-center gap-1 ${
              activeTab === 'comments' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Comments ({comments.length})
            {activeTab === 'comments' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />}
          </button>
        </div>

        {/* Subtab Contents */}
        {activeTab === 'player' && (
          <div className="w-full space-y-4">
            {/* Scrubber / Progress Bar */}
            <div className="w-full">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onChange={handleSeekChange}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(duration)}</span>
              </div>
            </div>

            {/* Playback Controls (Shuffle, Prev, Rewind 10, Play, Forward 10, Next, Repeat) */}
            <div className="flex items-center justify-between px-2">
              <button
                onClick={onToggleShuffle}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
                  shuffle ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={onPrevTrack}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-300 hover:text-white active:scale-95 transition-all"
                title="Previous"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => onSeek(Math.max(0, currentTime - 10))}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-white active:scale-95 transition-all"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Central Main Big Play Button */}
              <button
                onClick={onTogglePlay}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-950 active:scale-95 transition-all"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>

              <button
                onClick={() => onSeek(Math.min(duration, currentTime + 10))}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-white active:scale-95 transition-all"
                title="Fast forward 10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={onNextTrack}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-300 hover:text-white active:scale-95 transition-all"
                title="Next"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={onToggleRepeat}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
                  repeatMode !== 'off' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume bar */}
            <div className="flex items-center gap-3 px-4 pt-1">
              <button onClick={toggleMute} className="text-slate-400 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-slate-300"
              />
            </div>
          </div>
        )}

        {/* Chapters Tab (for KIDANI comedy episodes) */}
        {activeTab === 'chapters' && media.chapters && (
          <div className="w-full space-y-2 max-h-56 overflow-y-auto no-scrollbar">
            {media.chapters.map((chap, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSeek(chap.time);
                  setActiveTab('player');
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all ${
                  currentTime >= chap.time && (idx === media.chapters!.length - 1 || currentTime < media.chapters![idx + 1].time)
                    ? 'bg-rose-500/15 border-rose-500/40 text-white font-semibold'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-xs truncate">{chap.title}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{formatSeconds(chap.time)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Lyrics Tab */}
        {activeTab === 'lyrics' && media.lyrics && (
          <div className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/5 max-h-56 overflow-y-auto no-scrollbar space-y-2 text-center">
            {media.lyrics.map((line, idx) => (
              <p 
                key={idx} 
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  idx === 1 ? 'text-amber-400 font-bold scale-105' : 'text-slate-300'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="w-full flex flex-col max-h-56">
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mb-2 pr-1">
              {comments.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center justify-center">
                        {c.avatar}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{c.user}</span>
                      <span className="text-[10px] text-slate-500">{c.timeAgo}</span>
                    </div>
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      className={`flex items-center gap-1 text-[11px] ${
                        c.userLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{c.likes}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 pl-7">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1 border-t border-white/10">
              <input
                type="text"
                placeholder="Add a comment on KIDANI..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="min-h-[36px] min-w-[36px] px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
