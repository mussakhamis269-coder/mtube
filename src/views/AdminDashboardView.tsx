import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Upload, 
  Film, 
  Users, 
  DollarSign, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Crown, 
  Search, 
  Eye, 
  Download, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  TrendingUp,
  CreditCard,
  Smartphone,
  Calendar,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { MediaItem, Category, ManagedUser, VipTransaction, UserProfile } from '../types';

interface AdminDashboardViewProps {
  owner: UserProfile;
  mediaItems: MediaItem[];
  onAddMedia: (newItem: MediaItem) => void;
  onUpdateMedia: (updatedItem: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onBackToApp: () => void;
  onPlayMedia: (item: MediaItem) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  owner,
  mediaItems,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onBackToApp,
  onPlayMedia,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'videos' | 'users' | 'earnings' | 'analytics'>('upload');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 1. Upload Video Form State
  const [newTitle, setNewTitle] = useState('KIDANI EP 03 - Urithi wa Babu');
  const [newSubtitle, setNewSubtitle] = useState('Kidani Comedy Series');
  const [newCategory, setNewCategory] = useState<Category>('comedy');
  const [newDurationMin, setNewDurationMin] = useState('8');
  const [newDurationSec, setNewDurationSec] = useState('45');
  const [newThumbnail, setNewThumbnail] = useState('/src/assets/images/featured_kidani_ep01_1794131856605.jpg');
  const [newDescription, setNewDescription] = useState('Kidani anarudi tena kwenye mikasa mipya ya urithi wa shamba la babu yake kijijini! Kicheko mwanzo mwisho.');
  const [newBadge, setNewBadge] = useState('EXCLUSIVE PREMIERE');
  const [newResolution, setNewResolution] = useState('1080p FHD');

  // 2. Manage Videos State
  const [searchVideoQuery, setSearchVideoQuery] = useState('');
  const [editingVideo, setEditingVideo] = useState<MediaItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 3. Manage Users State
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'vip' | 'blocked'>('all');
  const [usersList, setUsersList] = useState<ManagedUser[]>([
    {
      id: 'u-owner',
      name: 'Mussa Khamis (You)',
      email: 'mussakhamis269@gmail.com',
      avatar: 'MK',
      role: 'Owner',
      isVip: true,
      vipPlan: 'yearly',
      isBlocked: false,
      joinedDate: 'Jan 12, 2026',
      downloadsCount: 42
    },
    {
      id: 'u-1',
      name: 'Juma Shabani',
      email: 'juma.shabani@gmail.com',
      avatar: 'JS',
      role: 'VIP Member',
      isVip: true,
      vipPlan: 'monthly',
      isBlocked: false,
      joinedDate: 'Feb 18, 2026',
      downloadsCount: 18
    },
    {
      id: 'u-2',
      name: 'Amina Mrema',
      email: 'amina.mrema@gmail.com',
      avatar: 'AM',
      role: 'VIP Member',
      isVip: true,
      vipPlan: 'yearly',
      isBlocked: false,
      joinedDate: 'Mar 01, 2026',
      downloadsCount: 65
    },
    {
      id: 'u-3',
      name: 'Kelvin Kings',
      email: 'kelvin.kings@records.tz',
      avatar: 'KK',
      role: 'Creator',
      isVip: true,
      vipPlan: 'yearly',
      isBlocked: false,
      joinedDate: 'Jan 28, 2026',
      downloadsCount: 110
    },
    {
      id: 'u-4',
      name: 'Baraka King',
      email: 'baraka.king@gmail.com',
      avatar: 'BK',
      role: 'Free User',
      isVip: false,
      isBlocked: false,
      joinedDate: 'Feb 24, 2026',
      downloadsCount: 4
    },
    {
      id: 'u-5',
      name: 'Zawadi Bakari',
      email: 'zawadi.b@yahoo.com',
      avatar: 'ZB',
      role: 'Free User',
      isVip: false,
      isBlocked: false,
      joinedDate: 'Mar 10, 2026',
      downloadsCount: 1
    },
    {
      id: 'u-6',
      name: 'SpamBot_Clicker99',
      email: 'bot99@trafficdark.ru',
      avatar: 'SB',
      role: 'Free User',
      isVip: false,
      isBlocked: true,
      joinedDate: 'Mar 14, 2026',
      downloadsCount: 0
    }
  ]);

  // 4. VIP Earnings State
  const [vipTransactions] = useState<VipTransaction[]>([
    { id: 'tx-101', user: 'Amina Mrema', plan: 'VIP Yearly', amount: '$24.99', method: 'M-Pesa', time: '12 mins ago', status: 'Completed' },
    { id: 'tx-102', user: 'Juma Shabani', plan: 'VIP Monthly', amount: '$2.99', method: 'Tigo Pesa', time: '48 mins ago', status: 'Completed' },
    { id: 'tx-103', user: 'Kelvin Kings', plan: 'VIP Yearly', amount: '$24.99', method: 'Card', time: '2 hours ago', status: 'Completed' },
    { id: 'tx-104', user: 'Daudi Makamba', plan: 'VIP Monthly', amount: '$2.99', method: 'Airtel Money', time: '3 hours ago', status: 'Completed' },
    { id: 'tx-105', user: 'Grace Mwita', plan: 'VIP Monthly', amount: '$2.99', method: 'M-Pesa', time: '5 hours ago', status: 'Completed' },
    { id: 'tx-106', user: 'Fatma Rashid', plan: 'VIP Yearly', amount: '$24.99', method: 'M-Pesa', time: '6 hours ago', status: 'Completed' },
  ]);

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Submit New Video
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a video title');
      return;
    }

    const min = parseInt(newDurationMin) || 5;
    const sec = parseInt(newDurationSec) || 0;
    const totalSec = min * 60 + sec;

    const newItem: MediaItem = {
      id: `custom-video-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Mtube Exclusive',
      type: 'video',
      category: newCategory,
      duration: totalSec,
      durationFormatted: `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`,
      thumbnail: newThumbnail,
      views: '1.2K views',
      likesCount: 140,
      description: newDescription.trim() || 'Uploaded by Owner Admin',
      releaseDate: 'Just now',
      badge: newBadge.trim() || 'NEW',
      resolution: newResolution,
      seriesTitle: newCategory === 'comedy' ? 'KIDANI COMEDY' : undefined,
    };

    onAddMedia(newItem);
    showToast(`Video "${newItem.title}" published to Mtube!`);
    setActiveTab('videos');
  };

  // Toggle Block User
  const handleToggleBlockUser = (userId: string) => {
    if (userId === 'u-owner') {
      showToast('Cannot block the owner account');
      return;
    }
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.isBlocked;
        showToast(`${u.name} is now ${nextStatus ? 'BLOCKED' : 'UNBLOCKED'}`);
        return { ...u, isBlocked: nextStatus };
      }
      return u;
    }));
  };

  // Save Video Edit
  const handleSaveVideoEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      onUpdateMedia(editingVideo);
      showToast(`Updated "${editingVideo.title}"`);
      setEditingVideo(null);
    }
  };

  const filteredVideos = mediaItems.filter(item => {
    return (
      item.title.toLowerCase().includes(searchVideoQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchVideoQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchVideoQuery.toLowerCase())
    );
  });

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (userFilter === 'vip') return u.isVip;
    if (userFilter === 'blocked') return u.isBlocked;
    return true;
  });

  return (
    <div className="pb-36 pt-1 px-3 sm:px-4 max-w-5xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto bg-slate-900 border border-emerald-500/50 text-emerald-400 p-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-red-950/60 via-[#18121d] to-[#0f111e] border border-rose-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0"
            title="Back to Mtube App"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-1.5">
                <span>Owner Admin Dashboard</span>
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                  MK
                </span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED OWNER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back, <strong>Mussa Khamis</strong> ({owner.email}) · Full Administrator Control
            </p>
          </div>
        </div>

        {/* Quick Back to App Button */}
        <button
          onClick={onBackToApp}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>Exit Dashboard</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Subtabs: 1. Upload Video, 2. Manage Videos, 3. Manage Users, 4. VIP Earnings, 5. Analytics */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'upload', label: '1. Upload Video', icon: Upload },
          { id: 'videos', label: `2. Manage Videos (${mediaItems.length})`, icon: Film },
          { id: 'users', label: `3. Manage Users (${usersList.length})`, icon: Users },
          { id: 'earnings', label: '4. VIP Earnings', icon: DollarSign },
          { id: 'analytics', label: '5. Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: UPLOAD VIDEO */}
      {/* ============================================================ */}
      {activeTab === 'upload' && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Upload New Video to Mtube
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Publish new KIDANI comedy episodes, Bongo Flava music videos, or Amapiano tracks directly into the live app feed.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
              OWNER STUDIO
            </span>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. KIDANI EP 03 - Urithi wa Babu"
                  className="w-full bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              {/* Creator / Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Creator / Channel Name
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Kidani Comedy Series"
                  className="w-full bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Category)}
                  className="w-full bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="comedy">Kidani Comedy Series</option>
                  <option value="bongo">Bongo Flava Video</option>
                  <option value="amapiano">Amapiano Dance & Beat</option>
                  <option value="afrobeats">Afrobeats</option>
                </select>
              </div>

              {/* Duration (Min & Sec) */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Duration (Minutes & Seconds)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={newDurationMin}
                    onChange={(e) => setNewDurationMin(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                  <span className="text-slate-400 font-mono">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={newDurationSec}
                    onChange={(e) => setNewDurationSec(e.target.value)}
                    placeholder="Sec"
                    className="w-1/2 bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Badge Label */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="e.g. NEW EPISODE, EXCLUSIVE"
                  className="w-full bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Resolution */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Video Resolution
                </label>
                <select
                  value={newResolution}
                  onChange={(e) => setNewResolution(e.target.value)}
                  className="w-full bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="1080p FHD">1080p Full HD</option>
                  <option value="4K UHD">4K Ultra HD</option>
                  <option value="720p HD">720p HD</option>
                </select>
              </div>
            </div>

            {/* Thumbnail Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Select Thumbnail Artwork
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Kidani Classroom Poster', url: '/src/assets/images/featured_kidani_ep01_1794131856605.jpg' },
                  { label: 'Sokoni Street Comedy', url: '/src/assets/images/video_comedy_street_1794131858344.jpg' },
                  { label: 'Bongo Flava Neon Cover', url: '/src/assets/images/music_bongo_flava_1794131857519.jpg' },
                  { label: 'Amapiano Sunset Silhouette', url: '/src/assets/images/music_amapiano_sunset_1794131858146.jpg' },
                ].map((th, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setNewThumbnail(th.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border text-left p-1 transition-all group ${
                      newThumbnail === th.url
                        ? 'border-rose-500 ring-2 ring-rose-500/40'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={th.url} alt={th.label} className="w-full h-full object-cover rounded-lg" />
                    {newThumbnail === th.url && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 bg-black/80 text-[8px] text-white px-1 rounded truncate max-w-[90%]">
                      {th.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Episode Synopsis / Description
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe what happens in this episode..."
                className="w-full bg-[#121422] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Upload CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950 active:scale-98 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Publish Video to Mtube (Live Feed)</span>
            </button>
          </form>
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MANAGE VIDEOS */}
      {/* ============================================================ */}
      {activeTab === 'videos' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                All Published Videos & Songs
              </h2>
              <p className="text-xs text-slate-400">
                Edit episode metadata, remove videos, or preview directly.
              </p>
            </div>

            {/* Search filter input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchVideoQuery}
                onChange={(e) => setSearchVideoQuery(e.target.value)}
                placeholder="Filter videos by title..."
                className="w-full bg-[#121422] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Videos Grid / List */}
          <div className="space-y-2.5">
            {filteredVideos.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono text-white px-1 rounded">
                      {item.durationFormatted}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.subtitle} · {item.category.toUpperCase()} · {item.views || '1.2K views'} · {item.likesCount} likes
                    </p>
                  </div>
                </div>

                {/* Actions: Preview, Edit, Delete */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onPlayMedia(item)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
                    title="Preview Media"
                  >
                    <Eye className="w-3.5 h-3.5 text-rose-400" />
                    <span>Watch</span>
                  </button>

                  <button
                    onClick={() => setEditingVideo(item)}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-semibold flex items-center gap-1"
                    title="Edit Video"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirm Modal */}
          {deleteConfirmId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="w-full max-w-sm bg-[#131524] border border-white/10 rounded-3xl p-5 shadow-2xl">
                <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white text-center mb-1">Delete Video?</h3>
                <p className="text-xs text-slate-400 text-center mb-4">
                  This will remove the video immediately from the Mtube feed and users will no longer be able to watch it.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDeleteMedia(deleteConfirmId);
                      setDeleteConfirmId(null);
                      showToast('Video deleted successfully');
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Video Modal */}
          {editingVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
              <div className="w-full max-w-md bg-[#121422] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Edit Video Metadata</h3>
                  <button onClick={() => setEditingVideo(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveVideoEdit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Title</label>
                    <input
                      type="text"
                      value={editingVideo.title}
                      onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                      className="w-full bg-[#181a2b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Subtitle / Channel</label>
                    <input
                      type="text"
                      value={editingVideo.subtitle}
                      onChange={(e) => setEditingVideo({ ...editingVideo, subtitle: e.target.value })}
                      className="w-full bg-[#181a2b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Badge</label>
                    <input
                      type="text"
                      value={editingVideo.badge || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, badge: e.target.value })}
                      placeholder="e.g. HOT MIX, SEASON FINALE"
                      className="w-full bg-[#181a2b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingVideo.description}
                      onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                      className="w-full bg-[#181a2b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingVideo(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 3: MANAGE USERS */}
      {/* ============================================================ */}
      {activeTab === 'users' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Mtube Registered Users ({usersList.length})
              </h2>
              <p className="text-xs text-slate-400">
                View user account roles, VIP subscription plans, and block abusive users.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Users' },
                { id: 'vip', label: 'VIP Only' },
                { id: 'blocked', label: 'Blocked' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setUserFilter(f.id as typeof userFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    userFilter === f.id
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Table/List */}
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  u.isBlocked
                    ? 'bg-red-500/5 border-red-500/20 opacity-80'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    u.role === 'Owner'
                      ? 'bg-gradient-to-tr from-amber-400 to-rose-600 text-white ring-2 ring-amber-400/50'
                      : u.isVip
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/10 text-slate-300'
                  }`}>
                    {u.avatar}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {u.name}
                      </h4>
                      {u.role === 'Owner' && (
                        <span className="px-2 py-0.2 rounded bg-rose-600 text-white font-extrabold text-[9px] uppercase">
                          OWNER ADMIN
                        </span>
                      )}
                      {u.isVip && (
                        <span className="px-2 py-0.2 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30 font-bold text-[9px] uppercase flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 fill-current" />
                          {u.vipPlan?.toUpperCase() || 'VIP'}
                        </span>
                      )}
                      {u.isBlocked && (
                        <span className="px-2 py-0.2 rounded bg-red-600 text-white font-black text-[9px] uppercase">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {u.email} · Joined {u.joinedDate} · {u.downloadsCount} downloads
                    </p>
                  </div>
                </div>

                {/* Block / Unblock action */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {u.role !== 'Owner' ? (
                    <button
                      onClick={() => handleToggleBlockUser(u.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                        u.isBlocked
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                      }`}
                    >
                      {u.isBlocked ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Unblock User</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>Block User</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded-lg">
                      Master Key
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 4: VIP EARNINGS */}
      {/* ============================================================ */}
      {activeTab === 'earnings' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                VIP Revenue & Subscription Metrics
              </h2>
              <p className="text-xs text-slate-400">
                Track payments from M-Pesa, Tigo Pesa, Airtel Money, and Cards for ad-free VIP memberships.
              </p>
            </div>
            <button
              onClick={() => showToast('Simulated payout of $18,240 requested to M-Pesa account')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <DollarSign className="w-4 h-4 fill-current text-slate-950" />
              <span>Withdraw Earnings</span>
            </button>
          </div>

          {/* Earnings Key Figures Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total VIP Users</span>
              <div className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-1.5">
                <span>2,040</span>
                <Crown className="w-4 h-4 text-amber-400 fill-current" />
              </div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">+142 this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-400/30">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Total VIP Revenue</span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                $19,557.80
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">TZS 48,894,500</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">VIP Monthly ($2.99)</span>
              <div className="text-xl sm:text-2xl font-black text-white font-display">
                1,428
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">$4,269 / month</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">VIP Yearly ($24.99)</span>
              <div className="text-xl sm:text-2xl font-black text-white font-display">
                612
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">$15,288 / year</span>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live VIP Payment Transactions
            </h3>

            <div className="space-y-2">
              {vipTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{tx.user}</p>
                      <p className="text-[11px] text-slate-400">
                        {tx.plan} · via {tx.method} · {tx.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold font-mono text-emerald-400 block">{tx.amount}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 5: ANALYTICS */}
      {/* ============================================================ */}
      {activeTab === 'analytics' && (
        <section className="space-y-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              Mtube Platform Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Real-time video views, total offline downloads, and audience geographic reach.
            </p>
          </div>

          {/* Metrics Top Row: Total views & Total downloads */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/20">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mb-1">
                <Eye className="w-4 h-4" />
                <span>Total Views</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                12.4M
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">+18.4% this month</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                <Download className="w-4 h-4" />
                <span>Total Downloads</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                485.2K
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">+32.1% offline saves</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Daily Active Users</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                184K
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Average 24 mins / user</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Episode Completion</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                88.2%
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Kidani Episode 1 retention</span>
            </div>
          </div>

          {/* 7-Day View Trend Bars */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Weekly Views Trend (Millions)
              </h3>
              <span className="text-xs text-rose-400 font-mono font-bold">+2.4M on Kidani release</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40">
              {[
                { day: 'Mon', views: '1.4M', pct: 50 },
                { day: 'Tue', views: '1.6M', pct: 57 },
                { day: 'Wed', views: '1.9M', pct: 68 },
                { day: 'Thu', views: '1.7M', pct: 60 },
                { day: 'Fri', views: '2.1M', pct: 75 },
                { day: 'Sat', views: '2.8M', pct: 100 },
                { day: 'Sun', views: '2.5M', pct: 89 },
              ].map((b, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {b.views}
                  </span>
                  <div className="w-full bg-white/10 rounded-xl overflow-hidden h-full flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-rose-600 to-amber-500 rounded-xl transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${b.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Audience Geographic Breakdown */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Top Audiences By Country
            </h3>
            
            <div className="space-y-2.5">
              {[
                { country: 'Tanzania (Dar es Salaam, Arusha, Mwanza)', pct: 62, count: '7.68M views' },
                { country: 'Kenya (Nairobi, Mombasa)', pct: 21, count: '2.60M views' },
                { country: 'Uganda (Kampala)', pct: 9, count: '1.11M views' },
                { country: 'South Africa & Rest of World', pct: 8, count: '0.99M views' },
              ].map((g, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{g.country}</span>
                    <span className="font-mono text-slate-400">{g.count} ({g.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
