import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ArrowRight, ArrowLeft, MessageCircleHeart, X, Gift, Smile } from 'lucide-react';
import { ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { fireHeartConfetti, fireSurpriseConfetti } from '../../utils/confetti';

interface Section6CatsProps {
  data: ScrapbookData;
  onNext: () => void;
  onBack: () => void;
}

interface FallingHeart {
  id: number;
  left: number; // 0 - 100%
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  drift: number; // px
  color: string;
  char: string;
}

export const Section6Cats: React.FC<Section6CatsProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [fallingHearts, setFallingHearts] = useState<FallingHeart[]>([]);
  const [isWiggling, setIsWiggling] = useState(false);

  const EASTER_EGG_THRESHOLD = 4;

  const triggerFallingHeartsShower = () => {
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '💝', '🌸', '✨'];
    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#f43f5e'];

    const hearts: FallingHeart[] = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 96 + 2,
      size: Math.floor(Math.random() * 22) + 16,
      duration: Math.random() * 2.5 + 3,
      delay: Math.random() * 2,
      drift: (Math.random() - 0.5) * 80,
      color: colors[Math.floor(Math.random() * colors.length)],
      char: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
    }));

    setFallingHearts(hearts);

    // Clear after animation completes
    setTimeout(() => {
      setFallingHearts([]);
    }, 6000);
  };

  const handleCatClick = () => {
    romanticAudio.playSparkleChime();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // Wiggle kittens on click
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 350);

    // Regular secret message reveal on first click
    setShowSecretMessage(true);

    if (nextCount % 2 === 0) {
      fireHeartConfetti();
    } else {
      fireSurpriseConfetti();
    }

    // Easter Egg Trigger when threshold reached!
    if (nextCount % EASTER_EGG_THRESHOLD === 0) {
      setShowEasterEgg(true);
      triggerFallingHeartsShower();
      fireSurpriseConfetti();
      romanticAudio.playSparkleChime();
    }
  };

  const handleManualHeartRain = () => {
    romanticAudio.playSparkleChime();
    fireHeartConfetti();
    triggerFallingHeartsShower();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center relative">
      {/* Falling Hearts Shower Layer */}
      {fallingHearts.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {fallingHearts.map(h => (
            <div
              key={h.id}
              className="absolute animate-heart-fall select-none drop-shadow-sm"
              style={{
                left: `${h.left}%`,
                fontSize: `${h.size}px`,
                ['--fall-duration' as string]: `${h.duration}s`,
                ['--drift' as string]: `${h.drift}px`,
                animationDelay: `${h.delay}s`,
                color: h.color,
              }}
            >
              {h.char}
            </div>
          ))}
        </div>
      )}

      {/* Top Decorative Washi Tape */}
      <div className="w-40 h-6 washi-tape-pink rotate-2 rounded-xs mb-4 shadow-xs" />

      {/* Main Scrapbook Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 text-center relative overflow-hidden">
        {/* Cute Floating Balloons */}
        <div className="absolute top-6 left-6 text-2xl sm:text-3xl animate-float-balloon select-none pointer-events-none">
          🎈
        </div>
        <div className="absolute top-8 right-6 text-2xl sm:text-3xl animate-float-balloon select-none pointer-events-none [animation-delay:1.5s]">
          🎈
        </div>

        {/* Section Header */}
        <div className="space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            <Sparkles className="w-3.5 h-3.5" /> Adorable Little Companions
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950">
            One last surprise... 🐱✨
          </h2>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            Look who stopped by with party hats and balloons to wish you a happy birthday!
          </p>
        </div>

        {/* Interactive Cats Illustration Card */}
        <div className="relative my-4 flex flex-col items-center">
          <div
            onClick={handleCatClick}
            className={`group relative max-w-[320px] sm:max-w-[360px] polaroid-frame cursor-pointer transition-all duration-300 hover:scale-103 hover:shadow-2xl ${
              isWiggling ? 'scale-95 rotate-1' : ''
            }`}
            title="Click the kittens multiple times for a secret easter egg!"
          >
            {/* Top Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-5 washi-tape-blue -rotate-1 z-10" />

            {/* Illustration */}
            <div className="w-full aspect-square rounded-xs overflow-hidden bg-pink-50 relative">
              <img
                src="/src/assets/images/cute_cartoon_cats_balloons_1793727077579.jpg"
                alt="Two cute cats with balloons"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Tap Prompt Overlay */}
              <div className="absolute bottom-2 inset-x-2 bg-white/90 backdrop-blur-xs rounded-xl py-1.5 px-2 text-center border border-pink-200 shadow-xs">
                <span className="text-[11px] font-cute font-bold text-rose-800 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-ping" />
                  <span>Tap us multiple times for secret easter egg!</span>
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                </span>
              </div>
            </div>

            <div className="pt-3 text-center">
              <span className="font-handwriting text-rose-900 text-lg sm:text-xl font-bold">
                "Meow you have the happiest birthday ever!"
              </span>
            </div>
          </div>

          {/* Secret Easter Egg Click Progress Tracker */}
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-cute text-pink-700 bg-pink-50/80 px-3.5 py-1 rounded-full border border-pink-200">
            <span>🐾 Cat clicks:</span>
            <span className="font-bold text-rose-600 font-mono">{clickCount}</span>
            <span>·</span>
            <span className="text-[11px] text-pink-600">
              {clickCount < EASTER_EGG_THRESHOLD
                ? `(Tap ${EASTER_EGG_THRESHOLD - clickCount} more times for secret rain! 🤫)`
                : `(Easter egg unlocked! Tap again for another shower 💖)`}
            </span>
          </div>
        </div>

        {/* Hidden Secret Message Reveal */}
        {showSecretMessage && (
          <div className="mt-6 max-w-lg mx-auto bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-dashed border-rose-300 rounded-2xl p-5 sm:p-6 text-center shadow-md animate-in zoom-in-95 duration-400 relative">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-500 text-white mb-2 shadow-xs">
              <MessageCircleHeart className="w-5 h-5" />
            </div>

            <h3 className="font-serif-romantic font-bold text-lg text-rose-950 mb-2">
              Secret Message Unlocked! 💌
            </h3>

            <p className="font-handwriting text-xl sm:text-2xl text-rose-950 leading-relaxed">
              "{data.catSecretMessage}"
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={handleManualHeartRain}
                className="inline-flex items-center gap-1.5 text-xs font-cute font-bold text-rose-600 hover:text-rose-800 bg-white px-3 py-1 rounded-full border border-pink-200 shadow-2xs transition-colors"
              >
                <span>Trigger Hearts Shower</span>
                <span>💖</span>
              </button>
            </div>
          </div>
        )}

        {/* Next Section Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNext}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
          >
            <span>Step 7: My Fav Moments 🎬</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Back navigation */}
        <div className="mt-8 pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-cute text-pink-600">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 hover:text-pink-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Our Music</span>
          </button>
          <span>Page 6 of 8</span>
        </div>
      </div>

      {/* Secret 'I LOVE YOU' Easter Egg Animated Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="relative max-w-lg w-full bg-gradient-to-b from-white via-rose-50 to-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-300 text-center overflow-hidden animate-in zoom-in-95 duration-400"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Washi Tape */}
            <div className="w-36 h-5 washi-tape-pink -rotate-1 mx-auto mb-3" />

            {/* Close Button */}
            <button
              onClick={() => setShowEasterEgg(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Heart Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white mb-3 shadow-lg animate-bounce">
              <Heart className="w-9 h-9 fill-white" />
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-xs uppercase tracking-widest text-rose-600 font-bold bg-white px-3 py-1 rounded-full border border-rose-200 shadow-2xs inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" /> Secret Kitten Easter Egg Found!
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-romantic font-bold text-rose-950 pt-2 leading-tight">
                I LOVE YOU! ❤️
              </h2>
              <p className="text-sm font-handwriting text-pink-700 text-xl font-bold">
                More than all words, songs, and stars combined.
              </p>
            </div>

            {/* Sweet Message Body */}
            <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-pink-200 shadow-inner text-left my-4 space-y-2">
              <p className="font-handwriting text-xl sm:text-2xl text-rose-950 leading-relaxed text-center">
                "You found the secret treasure! Every beat of my heart belongs to you, today on your birthday and every second for the rest of our lives."
              </p>
              <div className="text-center pt-2">
                <span className="text-xs font-cute text-rose-800 font-bold">
                  Forever & always your biggest fan 🥰
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleManualHeartRain}
                className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-cute font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>Rain Hearts Again! 🌧️💖</span>
              </button>

              <button
                onClick={() => setShowEasterEgg(false)}
                className="py-2.5 px-5 rounded-2xl bg-white border border-pink-200 hover:bg-pink-50 text-pink-800 font-cute font-semibold text-xs transition-colors"
              >
                Back to Scrapbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
