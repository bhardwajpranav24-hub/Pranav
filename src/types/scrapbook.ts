export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageUrl: string;
  rotationDeg: number;
  tapeColor: 'pink' | 'blue' | 'yellow';
}

export interface CouponItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  redeemed: boolean;
  redeemedAt?: string;
  bgColor: string;
  borderColor: string;
}

export interface VideoMomentItem {
  id: string;
  title: string;
  date: string;
  caption: string;
  videoUrl?: string;
  rotationDeg: number;
  tapeColor: 'pink' | 'blue' | 'yellow';
}

export interface ScrapbookData {
  recipientName: string;
  senderName: string;
  passcode: string;
  passcodeHint: string;
  welcomeMessage: string;
  unlockedMessage: string;
  cakeWish: string;
  letterHeading: string;
  letterContent: string;
  letterPhotoUrl: string;
  letterDate: string;
  catSecretMessage: string;
  favMomentsHeading: string;
  videoMoments: VideoMomentItem[];
  videoTitle?: string;
  videoSubtitle?: string;
  videoCaption?: string;
  videoDate?: string;
  videoUrl?: string;
  memoriesHeading?: string;
  memories?: MemoryItem[];
  coupons: CouponItem[];
  finalHeading: string;
  finalMessage: string;
  finalEnding: string;
  musicTitle: string;
  musicArtist: string;
  customMusicUrl?: string;
}
