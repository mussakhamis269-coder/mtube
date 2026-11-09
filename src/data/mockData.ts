import { MediaItem, Comment } from '../types';

export const FEATURED_VIDEO: MediaItem = {
  id: 'video-kidani-02',
  title: 'KIDANI EP 02 - Harusi ya Mtaa',
  subtitle: 'Kidani Comedy Series',
  type: 'video',
  category: 'comedy',
  duration: 520, // ~8 mins
  durationFormatted: '08:40',
  thumbnail: '/src/assets/images/video_comedy_street_1794131858344.jpg',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  views: '1.2M views',
  likesCount: 88100,
  channelName: 'Kidani Comedy Official',
  channelAvatar: 'KC',
  subscribersCount: '1.45M',
  commentsCount: 428,
  description: 'Muendelezo wa visa vya Kidani! Safari hii amejipenyeza kama MC kwenye harusi ya bosi wake bila kualikwa. Kicheko mwanzo mwisho.',
  releaseDate: '1 week ago',
  badge: 'TRENDING COMEDY',
  seriesTitle: 'KIDANI COMEDY',
  episodeNumber: 2,
  resolution: '1080p FHD',
  chapters: [
    { title: 'Kuingia Ukumbini Bila Mwaliko', time: 0 },
    { title: 'Kuchukua Maikrofoni ya MC', time: 140 },
    { title: 'Vurugu Meza Kuu', time: 290 },
    { title: 'Kukimbizwa na Walinzi', time: 420 }
  ]
};

export const MEDIA_ITEMS: MediaItem[] = [
  FEATURED_VIDEO,
  {
    id: 'music-bongo-01',
    title: 'Vibez & Rhythms (Bongo Flava)',
    subtitle: 'Kelvin Kings ft. Zuchu',
    type: 'music',
    category: 'bongo',
    duration: 218,
    durationFormatted: '03:38',
    thumbnail: '/src/assets/images/music_bongo_flava_1794131857519.jpg',
    views: '1.8M streams',
    likesCount: 92400,
    channelName: 'Kelvin Kings Music',
    channelAvatar: 'KK',
    subscribersCount: '890K',
    commentsCount: 310,
    description: 'The sensational hit single blending modern Bongo Flava guitars with infectious Afro-swing percussion.',
    releaseDate: 'Yesterday',
    badge: 'TRENDING #1',
    genre: 'Bongo Flava',
    bpm: 104,
    lyrics: [
      "[Intro] Ye-yehh, Kelvin Kings baby, Dar es Salaam to the world",
      "[Verse 1] Moyo wangu umepata pumziko, popote ulipo ndio niko",
      "Hata upepo ukivuma kwa nguvu, mapenzi yetu yana nguvu",
      "[Chorus] Vibez and rhythms, cheza nami pole pole",
      "Vibez and rhythms, mtoto wa kishua don't worry",
      "[Verse 2] Beat inagonga mgongoni, Amapiano na Bongo hewani",
      "[Outro] Mtube exclusive track, turn the volume up!"
    ]
  },
  {
    id: 'music-amapiano-01',
    title: 'Amapiano Nights (Sunset Groove)',
    subtitle: 'Groove Wave ft. Kabza Beats',
    type: 'music',
    category: 'amapiano',
    duration: 342,
    durationFormatted: '05:42',
    thumbnail: '/src/assets/images/music_amapiano_sunset_1794131858146.jpg',
    views: '3.1M streams',
    likesCount: 165000,
    channelName: 'Groove Wave Sound',
    channelAvatar: 'GW',
    subscribersCount: '620K',
    commentsCount: 198,
    description: 'Deep heavy log drums, smooth Rhodes chords, and hypnotic vocal chops from Johannesburg to Nairobi.',
    releaseDate: '3 days ago',
    badge: 'HOT MIX',
    genre: 'Amapiano',
    bpm: 112,
    lyrics: [
      "[Intro] Log drums kick in... feel the sub bass",
      "[Verse 1] As the sun goes down over the city skyline",
      "We let the heavy baseline take over our minds",
      "[Drop] (Heavy Log Drum sequence: Boom-tak-boom)",
      "[Chorus] Amapiano nights, keeping the energy alive until daylight",
      "[Outro] Deep bass reverberation fading into harmony"
    ]
  },
  {
    id: 'video-comedy-02',
    title: 'Sokoni Leo: Duka La Vicheko (Comedy Special)',
    subtitle: 'Masanja & Joti Comedy Club',
    type: 'video',
    category: 'comedy',
    duration: 395,
    durationFormatted: '06:35',
    thumbnail: '/src/assets/images/video_comedy_street_1794131858344.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    views: '890K views',
    likesCount: 64200,
    channelName: 'Masanja & Joti Comedy Club',
    channelAvatar: 'MJ',
    subscribersCount: '2.1M',
    commentsCount: 512,
    description: 'Vicheko visivyokoma sokoni! Muuza vitambaa na muuza ndizi wakigombania eneo la biashara kwa misemo na kejeli.',
    releaseDate: '5 days ago',
    seriesTitle: 'VICHEKO VYA MITAANI',
    episodeNumber: 14,
    resolution: '1080p FHD',
    chapters: [
      { title: 'Kufungua Duka Asubuhi', time: 0 },
      { title: 'Bei ya Ndizi na Mzozo', time: 130 },
      { title: 'Mteja wa Ajabu', time: 270 }
    ]
  },
  {
    id: 'video-comedy-03',
    title: 'Mganga wa Mchongo: Dawa ya Utajiri',
    subtitle: 'Bongo Comedy Masters',
    type: 'video',
    category: 'comedy',
    duration: 460,
    durationFormatted: '07:40',
    thumbnail: '/src/assets/images/video_comedy_street_1794131858344.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    views: '940K views',
    likesCount: 71200,
    channelName: 'Bongo Comedy Masters',
    channelAvatar: 'BC',
    subscribersCount: '580K',
    commentsCount: 284,
    description: 'Kijana aenda kwa mganga kutafuta utajiri wa haraka, akakutana na masharti ya kuchekesha yasiyowezekana!',
    releaseDate: '3 days ago',
    seriesTitle: 'VICHEKO VYA BONGO',
    episodeNumber: 5,
    resolution: '1080p FHD'
  },
  {
    id: 'music-afrobeats-02',
    title: 'City Lights & Fire',
    subtitle: 'Burna Rhythm & Wizkid Crew',
    type: 'music',
    category: 'afrobeats',
    duration: 198,
    durationFormatted: '03:18',
    thumbnail: '/src/assets/images/music_bongo_flava_1794131857519.jpg',
    views: '5.2M streams',
    likesCount: 310000,
    description: 'High energy West African Afrobeats anthem dominating dancefloors and airwaves worldwide.',
    releaseDate: '2 weeks ago',
    genre: 'Afrobeats',
    bpm: 108,
    lyrics: [
      "[Intro] Turn the lights low, let the Afro rhythm flow",
      "[Chorus] City lights shine bright tonight, we dancing till sunrise",
      "[Verse] Good vibes only, no bad energy allowed here"
    ]
  },
  {
    id: 'video-amapiano-dance',
    title: 'Dance Challenge: Bacardi vs Log Drum 2026',
    subtitle: 'Street Dancers Dar & Soweto',
    type: 'video',
    category: 'amapiano',
    duration: 254,
    durationFormatted: '04:14',
    thumbnail: '/src/assets/images/music_amapiano_sunset_1794131858146.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    views: '740K views',
    likesCount: 51200,
    channelName: 'Soweto & Dar Dancers Hub',
    channelAvatar: 'SD',
    subscribersCount: '410K',
    commentsCount: 164,
    description: 'Top viral dancers executing crisp Amapiano footwork, Tshwala Bam moves, and infectious synchronization.',
    releaseDate: '4 days ago',
    resolution: '1080p FHD'
  },
  {
    id: 'music-bongo-acoustic',
    title: 'Penzi Halina Mfano (Acoustic)',
    subtitle: 'Mbosso & Alikiba',
    type: 'music',
    category: 'bongo',
    duration: 245,
    durationFormatted: '04:05',
    thumbnail: '/src/assets/images/music_bongo_flava_1794131857519.jpg',
    views: '950K streams',
    likesCount: 78000,
    description: 'Heartfelt soulful ballad performed with live Spanish acoustic guitar and warm traditional strings.',
    releaseDate: '6 days ago',
    genre: 'Bongo Flava',
    bpm: 92
  }
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  'video-kidani-02': [
    {
      id: 'c1',
      user: 'Juma Shabani',
      avatar: 'JS',
      text: 'Kidani hana adabu kabisa! Yaani anajifanya MC kwenye harusi ya watu bila kualikwa 😂😂😂 Kicheko mwanzo mwisho!',
      timeAgo: '45 mins ago',
      likes: 1240,
      userLiked: false
    },
    {
      id: 'c2',
      user: 'Amina Mrema',
      avatar: 'AM',
      text: 'Hii comedy ya Kidani ndio kiboko ya 2026! Kipaji kikubwa sana.',
      timeAgo: '1 hour ago',
      likes: 854,
      userLiked: true
    },
    {
      id: 'c3',
      user: 'Baraka King',
      avatar: 'BK',
      text: 'Hiyo sura yake akichukua mic nimecheka mpaka machozi!',
      timeAgo: '3 hours ago',
      likes: 412,
      userLiked: false
    }
  ],
  'music-bongo-01': [
    {
      id: 'c4',
      user: 'Hassan Ali',
      avatar: 'HA',
      text: 'This beat is pure fire! Dar es Salaam to Lagos we rocking this track 🚀🔥',
      timeAgo: '2 hours ago',
      likes: 310,
      userLiked: true
    }
  ]
};
