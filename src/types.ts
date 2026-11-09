export type MediaType = 'video' | 'music';

export type Category = 
  | 'all' 
  | 'comedy' 
  | 'bongo' 
  | 'amapiano' 
  | 'afrobeats' 
  | 'trending';

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  userLiked?: boolean;
}

export interface VideoChapter {
  title: string;
  time: number; // in seconds
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle: string; // Artist or creator
  type: MediaType;
  category: Category;
  duration: number; // in seconds
  durationFormatted: string;
  thumbnail: string;
  views?: string;
  likesCount: number;
  description: string;
  releaseDate: string;
  badge?: string;
  // Audio specific
  genre?: string;
  bpm?: number;
  lyrics?: string[];
  // Video specific
  videoUrl?: string;
  resolution?: string;
  chapters?: VideoChapter[];
  episodeNumber?: number;
  seriesTitle?: string;
  channelName?: string;
  channelAvatar?: string;
  subscribersCount?: string;
  isSubscribed?: boolean;
  commentsCount?: number;
}

export type TabType = 'home' | 'music' | 'videos' | 'search' | 'profile' | 'settings' | 'admin';

export type RepeatMode = 'off' | 'all' | 'one';

export type VipPlan = 'monthly' | 'yearly';

export type AppTheme = 'dark' | 'light';

export type AppLanguage = 'en' | 'sw';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isVip: boolean;
  vipPlan?: VipPlan;
  vipExpiry?: string;
  authProvider: 'google' | 'email' | 'guest';
  isAdmin?: boolean; // Only owner MK has isAdmin = true
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Owner' | 'VIP Member' | 'Free User' | 'Creator';
  isVip: boolean;
  vipPlan?: VipPlan;
  isBlocked: boolean;
  joinedDate: string;
  downloadsCount: number;
}

export interface VipTransaction {
  id: string;
  user: string;
  plan: 'VIP Monthly' | 'VIP Yearly';
  amount: string;
  method: 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Card';
  time: string;
  status: 'Completed' | 'Pending';
}
