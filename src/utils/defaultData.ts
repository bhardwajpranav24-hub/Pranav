import { ScrapbookData } from '../types/scrapbook';

export const DEFAULT_SCRAPBOOK_DATA: ScrapbookData = {
  recipientName: 'My Sweetheart',
  senderName: 'Yours Forever',
  passcode: '1103',
  passcodeHint: 'Our special anniversary or birthday code (Try: 1103)',
  welcomeMessage: 'I won in life coz God made this for me!',
  unlockedMessage: 'You found your way in! ❤️',
  cakeWish: 'Make a wish, birthday girl! 🎂',
  letterHeading: 'A letter for you...',
  letterDate: 'On Your Special Day',
  letterPhotoUrl: '/src/assets/images/romantic_couple_sunset_1793727076810.jpg',
  letterContent: `Happy Birthday to the most breathtaking person in my entire universe!

From the moment you stepped into my life, everything turned softer, brighter, and infinitely more magical. Your laugh is my favourite melody, your smile makes my hardest days melt away, and your kind, gentle soul inspires me every single day.

Thank you for choosing to share your world with me, for all the quiet morning coffees, the late-night talks, and every little inside joke we hold dear. I promise to keep making you smile, to stand by you in every season, and to love you more with every sunrise.

May this new year bring you all the warmth, joy, and dreams your heart holds. You deserve the absolute moon and every single star in the night sky.

Forever & always yours,
With all my heart ❤️`,
  catSecretMessage: 'Psst! You are the absolute sweetest part of my life! I love you more than all the stars in the cosmos (and that is a whole lot!). Sending 10,000 warm kitten hugs to you right now! 🐾💕',
  favMomentsHeading: 'My Fav Moments of Us 🎬',
  videoMoments: [
    {
      id: 'vm-1',
      title: 'Our Sweetest Moments & Laughter',
      date: 'Pure Joy',
      caption: 'Every time I watch this video, my heart skips a beat. You make every ordinary second feel magical.',
      videoUrl: '',
      rotationDeg: -1.5,
      tapeColor: 'pink',
    },
    {
      id: 'vm-2',
      title: 'A Spontaneous Little Adventure',
      date: 'Our Secret Day',
      caption: 'The silly jokes, your gorgeous smile, and us being completely ourselves together.',
      videoUrl: '',
      rotationDeg: 1.5,
      tapeColor: 'blue',
    },
  ],
  videoTitle: 'My Favourite Video of Us ❤️',
  videoSubtitle: 'A timeless moment of pure happiness',
  videoCaption: 'Every time I replay this video, my heart skips a beat. You make every ordinary second feel extraordinary. Happy Birthday my love!',
  videoDate: 'Our Unforgettable Moment',
  videoUrl: '',
  memoriesHeading: 'Every moment with you is special.',
  memories: [
    {
      id: 'mem-1',
      title: 'Our Golden Sunset Walk',
      date: 'Autumn Evening',
      caption: 'The way the sun touched your hair made me realize heaven is right here beside you.',
      imageUrl: '/src/assets/images/romantic_couple_sunset_1793727076810.jpg',
      rotationDeg: -3,
      tapeColor: 'pink',
    },
    {
      id: 'mem-2',
      title: 'Strawberries & Sunshine Picnic',
      date: 'Spring Blossom Day',
      caption: 'Our spontaneous afternoon under the peony trees. You ate all the strawberries and I fell deeper in love.',
      imageUrl: '/src/assets/images/romantic_picnic_date_1793727077810.jpg',
      rotationDeg: 2,
      tapeColor: 'yellow',
    },
    {
      id: 'mem-3',
      title: 'Fairy Lights & Late Night Coffee',
      date: 'Starry Evening',
      caption: 'When the cafe closed and we stayed talking until the streetlights dimmed. Pure peace with you.',
      imageUrl: '/src/assets/images/romantic_fairground_night_1793727078779.jpg',
      rotationDeg: -2,
      tapeColor: 'blue',
    },
    {
      id: 'mem-4',
      title: 'Two Cats, One Big Love',
      date: 'Every Single Day',
      caption: 'Us in cat form! Cuddled up, silly, and holding onto each other through every adventure.',
      imageUrl: '/src/assets/images/cute_cartoon_cats_balloons_1793727077579.jpg',
      rotationDeg: 3,
      tapeColor: 'pink',
    },
  ],
  coupons: [
    {
      id: 'c-1',
      title: 'One Unlimited Hug',
      description: 'Redeem anytime, anywhere. Valid for warm, cozy, tight bear hugs that last as long as you need.',
      icon: '🤗',
      redeemed: false,
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
    },
    {
      id: 'c-2',
      title: 'One Romantic Date',
      description: 'Your dream evening planned entirely by me: candlelight, favorite dinner, and sweet surprises.',
      icon: '🕯️',
      redeemed: false,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
    },
    {
      id: 'c-3',
      title: 'One Princess Treatment Day',
      description: 'Breakfast in bed, feet pampered, compliments all day, zero chores allowed. You are royalty.',
      icon: '👑',
      redeemed: false,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
    },
    {
      id: 'c-4',
      title: 'One Surprise Gift',
      description: 'A handpicked mystery gift specially curated to bring the biggest smile to your gorgeous face.',
      icon: '🎁',
      redeemed: false,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
    },
    {
      id: 'c-5',
      title: 'Unlimited Kisses',
      description: 'Forehead kisses, sweet cheek pecks, and romantic kisses on demand without any expiration date.',
      icon: '💋',
      redeemed: false,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
    },
    {
      id: 'c-6',
      title: 'You Choose Everything Day',
      description: 'Where we eat, what movies we watch, what time we wake up. You have 100% total authority today!',
      icon: '✨',
      redeemed: false,
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-300',
    },
  ],
  musicTitle: 'Lover’s Music Box Waltz',
  musicArtist: 'Romantic Scrapbook Melodies',
  customMusicUrl: '',
  finalHeading: 'A Birthday Wish From My Soul',
  finalMessage: `You are the poetry I never knew I was writing, the blessing I prayed for, and the calm in all my storms. Today we celebrate the wonderful miracle that is you.

Every smile you give the world makes it softer. Every dream you chase makes me prouder. I hope this year wraps you in good health, immense happiness, boundless love, and gentle days.`,
  finalEnding: 'Happy Birthday, my favourite person. I am so lucky to have you in my life. ❤️',
};

const STORAGE_KEY = 'birthday_scrapbook_data_v1';

export function loadScrapbookData(): ScrapbookData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SCRAPBOOK_DATA, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load saved scrapbook data:', e);
  }
  return DEFAULT_SCRAPBOOK_DATA;
}

export function saveScrapbookData(data: ScrapbookData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save scrapbook data:', e);
  }
}
