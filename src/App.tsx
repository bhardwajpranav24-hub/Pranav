import React, { useState, useEffect } from 'react';
import { ScrapbookData, MemoryItem, CouponItem, VideoMomentItem } from './types/scrapbook';
import { loadScrapbookData, saveScrapbookData, DEFAULT_SCRAPBOOK_DATA } from './utils/defaultData';
import { romanticAudio } from './utils/audioSynth';
import { HeaderNav } from './components/HeaderNav';
import { FloatingDecorations } from './components/FloatingDecorations';
import { CustomizerModal } from './components/CustomizerModal';
import { ShareModal } from './components/ShareModal';

import { loadAudioFromStorage, loadVideoFromStorage } from './utils/mediaStorage';
import { decodeSharePayload } from './utils/shareEncoder';

// 8 Sections in exact requested order
import { Section1Passcode } from './components/sections/Section1Passcode';
import { Section2Cake } from './components/sections/Section2Cake';
import { Section3Letter } from './components/sections/Section3Letter';
import { Section4Coupons } from './components/sections/Section4Coupons';
import { Section5Music } from './components/sections/Section5Music';
import { Section6Cats } from './components/sections/Section6Cats';
import { Section7FavMoments } from './components/sections/Section7FavMoments';
import { Section8Final } from './components/sections/Section8Final';

const STEP_TITLES = [
  { title: 'Secret Entry', icon: '🗝️' },
  { title: 'Birthday Cake', icon: '🎂' },
  { title: 'Love Letter', icon: '💌' },
  { title: 'Love Coupons', icon: '🎟️' },
  { title: 'Our Music', icon: '🎵' },
  { title: 'Cute Surprise', icon: '🐱' },
  { title: 'My Fav Moments', icon: '🎬' },
  { title: 'Birthday Grand Finale', icon: '💖' },
];

function getInitialData(): { initial: ScrapbookData; isShared: boolean } {
  if (typeof window !== 'undefined' && window.location.hash) {
    const decoded = decodeSharePayload(window.location.hash);
    if (decoded && Object.keys(decoded).length > 0) {
      const merged: ScrapbookData = {
        ...DEFAULT_SCRAPBOOK_DATA,
        ...loadScrapbookData(),
        ...decoded,
      };
      saveScrapbookData(merged);
      return { initial: merged, isShared: true };
    }
  }
  return { initial: loadScrapbookData(), isShared: false };
}

export default function App() {
  const [initResult] = useState(() => getInitialData());
  const [data, setData] = useState<ScrapbookData>(initResult.initial);
  const [isLoadedFromShare, setIsLoadedFromShare] = useState(initResult.isShared);
  const [currentStep, setCurrentStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Listen for hash change if recipient opens a new link while tab is open
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const decoded = decodeSharePayload(window.location.hash);
        if (decoded && Object.keys(decoded).length > 0) {
          setData(prev => {
            const merged = { ...prev, ...decoded };
            saveScrapbookData(merged);
            return merged;
          });
          setIsLoadedFromShare(true);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync audio state listener and restore uploaded audio & video from IndexedDB if present
  useEffect(() => {
    romanticAudio.registerStateChange((playing) => {
      setIsMusicPlaying(playing);
    });

    loadAudioFromStorage('custom_song').then((storedUrl) => {
      if (storedUrl && data.customMusicUrl) {
        setData(prev => ({ ...prev, customMusicUrl: storedUrl }));
      }
    });

    loadVideoFromStorage('custom_fav_video').then((storedUrl) => {
      if (storedUrl) {
        setData(prev => ({ ...prev, videoUrl: storedUrl }));
      }
    });
  }, []);

  // Save changes to localStorage
  const handleUpdateData = (newData: ScrapbookData) => {
    setData(newData);
    saveScrapbookData(newData);
  };

  const handleUpdateLetterPhoto = (photoUrl: string) => {
    const updated = { ...data, letterPhotoUrl: photoUrl };
    handleUpdateData(updated);
  };

  const handleUpdateVideoMoments = (moments: VideoMomentItem[]) => {
    const updated = { ...data, videoMoments: moments };
    handleUpdateData(updated);
  };

  const handleUpdateFinalWish = (heading: string, message: string, ending: string) => {
    const updated = {
      ...data,
      finalHeading: heading,
      finalMessage: message,
      finalEnding: ending,
    };
    handleUpdateData(updated);
  };

  const handleUpdateVideo = (videoUrl: string, title?: string, caption?: string, date?: string) => {
    const updated = {
      ...data,
      videoUrl: videoUrl || data.videoUrl,
      videoTitle: title !== undefined ? title : data.videoTitle,
      videoCaption: caption !== undefined ? caption : data.videoCaption,
      videoDate: date !== undefined ? date : data.videoDate,
    };
    handleUpdateData(updated);
  };

  const handleResetData = () => {
    setData(DEFAULT_SCRAPBOOK_DATA);
    saveScrapbookData(DEFAULT_SCRAPBOOK_DATA);
  };

  const handleToggleMusic = () => {
    const playing = romanticAudio.toggle(data.customMusicUrl);
    setIsMusicPlaying(playing);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    // Automatically start soft background music when unlocked
    if (!romanticAudio.isPlaying()) {
      romanticAudio.play(data.customMusicUrl);
      setIsMusicPlaying(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectStep = (step: number) => {
    if (isUnlocked) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateLetter = (heading: string, content: string) => {
    const updated = { ...data, letterHeading: heading, letterContent: content };
    handleUpdateData(updated);
  };

  const handleUpdateCoupons = (coupons: CouponItem[]) => {
    const updated = { ...data, coupons };
    handleUpdateData(updated);
  };

  const handleUpdateMusic = (title: string, artist: string, customUrl?: string) => {
    const updated = { ...data, musicTitle: title, musicArtist: artist, customMusicUrl: customUrl };
    handleUpdateData(updated);
  };

  return (
    <div className="min-h-screen bg-gingham relative flex flex-col font-cute selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
      {/* Floating Pastel Hearts and Balloon Ornaments */}
      <FloatingDecorations />

      {/* Top Header & Navigation Bar */}
      <HeaderNav
        currentStep={currentStep}
        totalSteps={STEP_TITLES.length}
        stepTitles={STEP_TITLES}
        isUnlocked={isUnlocked}
        onSelectStep={handleSelectStep}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Personalized Welcome Banner if loaded from a shared custom link */}
      {isLoadedFromShare && (
        <div className="relative z-20 max-w-xl mx-auto px-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl px-4 py-2 text-xs flex items-center justify-between shadow-md border border-rose-300 font-cute">
            <span className="flex items-center gap-1.5">
              <span>✨</span>
              <span>Loaded your personalized birthday surprise for <strong>{data.recipientName}</strong>!</span>
            </span>
            <button
              onClick={() => setIsLoadedFromShare(false)}
              className="text-white/80 hover:text-white font-bold ml-3 text-xs bg-white/20 px-2 py-0.5 rounded-md hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <main className="flex-1 relative z-10 px-2 sm:px-4 pb-16">
        {currentStep === 0 && (
          <Section1Passcode
            data={data}
            isUnlocked={isUnlocked}
            onUnlock={handleUnlock}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 1 && (
          <Section2Cake
            data={data}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 2 && (
          <Section3Letter
            data={data}
            onUpdateLetter={handleUpdateLetter}
            onUpdateLetterPhoto={handleUpdateLetterPhoto}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 3 && (
          <Section4Coupons
            data={data}
            onUpdateCoupons={handleUpdateCoupons}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 4 && (
          <Section5Music
            data={data}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
            onUpdateMusic={handleUpdateMusic}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 5 && (
          <Section6Cats
            data={data}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 6 && (
          <Section7FavMoments
            data={data}
            onUpdateVideoMoments={handleUpdateVideoMoments}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 7 && (
          <Section8Final
            data={data}
            onRestart={handleRestart}
            onBack={handlePrevStep}
            onOpenShare={() => setIsShareOpen(true)}
            onUpdateFinalWish={handleUpdateFinalWish}
          />
        )}
      </main>

      {/* Subtle Scrapbook Footer */}
      <footer className="relative z-10 py-6 text-center text-xs font-cute text-pink-700/80 border-t border-pink-200/50 bg-white/40 backdrop-blur-2xs">
        <p className="flex items-center justify-center gap-1.5">
          <span>Crafted with all my heart for your special day</span>
          <span className="text-rose-500">❤️</span>
        </p>
      </footer>

      {/* Scrapbook Personalizer / Customizer Modal */}
      <CustomizerModal
        data={data}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleUpdateData}
        onReset={handleResetData}
      />

      {/* Share Surprise Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={data}
        passcode={data.passcode}
        recipientName={data.recipientName}
      />
    </div>
  );
}
