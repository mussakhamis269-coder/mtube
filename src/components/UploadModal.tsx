import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Check, 
  Sparkles, 
  AlertCircle,
  FileVideo,
  Image as ImageIcon,
  Play,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MediaItem, Category } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newVideo: MediaItem) => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  currentUserEmail,
  currentUserName = 'Mussa Khamis'
}) => {
  const [title, setTitle] = useState('');
  const [channelName, setChannelName] = useState(currentUserName || 'Mtube Creator');
  const [category, setCategory] = useState<Category>('comedy');
  const [description, setDescription] = useState('');
  const [durationMin, setDurationMin] = useState('5');
  const [durationSec, setDurationSec] = useState('30');
  const [badge, setBadge] = useState('NEW UPLOAD');
  const [resolution, setResolution] = useState('1080p FHD');
  const [selectedPresetVideo, setSelectedPresetVideo] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoFileName, setCustomVideoFileName] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState('/src/assets/images/video_comedy_street_1794131858344.jpg');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle local video file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setErrorMsg('Please select a valid video file (MP4, WebM, MOV, etc.)');
        return;
      }
      setErrorMsg(null);
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoFileName(file.name);
      if (!title) {
        // Auto-fill title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  // Handle thumbnail upload
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSelectedThumbnail(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a video title');
      return;
    }

    const min = parseInt(durationMin) || 5;
    const sec = parseInt(durationSec) || 0;
    const totalDuration = min * 60 + sec;

    setIsUploading(true);
    setUploadProgress(15);

    // Simulated fast progressive upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsUploading(false);

          const finalVideoUrl = customVideoUrl || selectedPresetVideo;
          const newMedia: MediaItem = {
            id: `video-upload-${Date.now()}`,
            title: title.trim(),
            subtitle: channelName.trim() || 'Mtube Creator',
            type: 'video',
            category,
            duration: totalDuration,
            durationFormatted: `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`,
            thumbnail: selectedThumbnail,
            videoUrl: finalVideoUrl,
            views: '1 view',
            likesCount: 1,
            description: description.trim() || `Published on Mtube by ${channelName}`,
            releaseDate: 'Just now',
            badge: badge.trim() || 'NEW',
            resolution,
            channelName: channelName.trim(),
            channelAvatar: channelName.slice(0, 2).toUpperCase(),
            subscribersCount: '1 subscriber',
            commentsCount: 0,
            seriesTitle: category === 'comedy' ? 'MTUBE COMEDY' : undefined,
          };

          onUploadSuccess(newMedia);
          onClose();
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-[#121422] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Upload Video to Mtube
              </h3>
              <p className="text-xs text-slate-400">
                Publish comedy episodes, music videos, and sketches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
          
          {/* File Picker or Preset Stream */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Select Video File</span>
              <span className="text-[10px] text-rose-400 font-normal">MP4, WebM, MOV supported</span>
            </label>

            <input 
              type="file" 
              ref={fileInputRef} 
              accept="video/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                customVideoUrl 
                  ? 'border-emerald-500/50 bg-emerald-500/5' 
                  : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30'
              }`}
            >
              {customVideoUrl ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Video Selected: <strong>{customVideoFileName || 'Custom Video'}</strong></span>
                </div>
              ) : (
                <>
                  <FileVideo className="w-8 h-8 text-rose-500 mb-2" />
                  <p className="text-xs font-bold text-white">Click to browse your device video</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">or choose from trending comedy presets below</p>
                </>
              )}
            </div>

            {/* Presets if user doesn't have a file ready */}
            {!customVideoUrl && (
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Presets:</span>
                {[
                  { label: 'Comedy Skit', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
                  { label: 'Market Escapade', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
                  { label: 'Dance & Vibes', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setSelectedPresetVideo(p.url)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all shrink-0 ${
                      selectedPresetVideo === p.url
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Video Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. KIDANI EP 03 - Urithi wa Babu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Channel Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Channel / Creator Name
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. Kidani Comedy TV"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d2e] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="comedy">Kidani Comedy</option>
                <option value="bongo">Bongo Flava</option>
                <option value="amapiano">Amapiano</option>
                <option value="afrobeats">Afrobeats</option>
              </select>
            </div>
          </div>

          {/* Duration & Resolution */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Duration (Min : Sec)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs text-center"
                  placeholder="Min"
                />
                <span className="text-slate-400 font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSec}
                  onChange={(e) => setDurationSec(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs text-center"
                  placeholder="Sec"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Resolution & Badge
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1a1d2e] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="1080p FHD">1080p FHD (High Quality)</option>
                <option value="4K UHD">4K Ultra HD</option>
                <option value="720p HD">720p HD</option>
              </select>
            </div>
          </div>

          {/* Thumbnail Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Thumbnail Cover
              </label>
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
              >
                + Upload Custom Image
              </button>
              <input 
                type="file" 
                ref={thumbInputRef} 
                accept="image/*" 
                onChange={handleThumbChange} 
                className="hidden" 
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Street Comedy', src: '/src/assets/images/video_comedy_street_1794131858344.jpg' },
                { label: 'Bongo Vibes', src: '/src/assets/images/music_bongo_flava_1794131857519.jpg' },
                { label: 'Sunset Glow', src: '/src/assets/images/music_amapiano_sunset_1794131858146.jpg' },
              ].map(th => (
                <div
                  key={th.src}
                  onClick={() => setSelectedThumbnail(th.src)}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer aspect-video transition-all ${
                    selectedThumbnail === th.src ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={th.src} alt={th.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 px-1 rounded text-white font-medium">
                    {th.label}
                  </span>
                  {selectedThumbnail === th.src && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this video about? Add episode highlights, punchlines, and hashtags..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                <span>Encoding & Uploading video...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 active:scale-95 transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Publishing...' : 'Publish Video'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
