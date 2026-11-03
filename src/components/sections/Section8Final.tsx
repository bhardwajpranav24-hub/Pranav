import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Flame, RotateCcw, PartyPopper, Check, Edit3, X } from 'lucide-react';
import { ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { fireContinuousFireworks, fireSurpriseConfetti } from '../../utils/confetti';
import { buildPersonalizedShareUrl } from '../../utils/shareEncoder';

interface Section8FinalProps {
  data: ScrapbookData;
  onRestart: () => void;
  onBack: () => void;
  onOpenShare?: () => void;
  onUpdateFinalWish?: (heading: string, message: string, ending: string) => void;
}

export const Section8Final: React.FC<Section8FinalProps> = ({
  data,
  onRestart,
  onBack,
  onOpenShare,
  onUpdateFinalWish,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingWish, setIsEditingWish] = useState(false);
  const [editedHeading, setEditedHeading] = useState(data.finalHeading || 'A Birthday Wish From My Soul');
  const [editedMessage, setEditedMessage] = useState(data.finalMessage || '');
  const [editedEnding, setEditedEnding] = useState(data.finalEnding || 'Happy Birthday, my favourite person. I am so lucky to have you in my life. ❤️');

  useEffect(() => {
    // Start joyful fireworks celebration on arrival
    const stopFireworks = fireContinuousFireworks(7000);
    romanticAudio.playSparkleChime();
    return () => {
      stopFireworks();
    };
  }, []);

  const triggerMoreFireworks = () => {
    romanticAudio.playSparkleChime();
    fireContinuousFireworks(5000);
  };

  const triggerConfetti = () => {
    romanticAudio.playSparkleChime();
    fireSurpriseConfetti();
  };

  const handleShare = () => {
    if (onOpenShare) {
      onOpenShare();
      return;
    }
    const shareUrl = buildPersonalizedShareUrl(data);
    navigator.clipboard?.writeText(shareUrl);
    romanticAudio.playSparkleChime();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveWish = () => {
    if (onUpdateFinalWish) {
      onUpdateFinalWish(editedHeading, editedMessage, editedEnding);
    }
    setIsEditingWish(false);
    romanticAudio.playSparkleChime();
    fireSurpriseConfetti();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-14 flex flex-col items-center">
      {/* Top Cute Washi Tape */}
      <div className="w-56 h-6 washi-tape-pink -rotate-1 rounded-xs mb-4 shadow-xs" />

      {/* Main Celebration Box */}
      <div className="w-full bg-gradient-to-b from-white via-pink-50/40 to-white rounded-3xl p-6 sm:p-12 shadow-2xl border-2 border-pink-200 text-center relative overflow-hidden">
        {/* Glowing Decorative Backlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-pink-300/20 blur-3xl rounded-full pointer-events-none" />

        {/* Floating Celebration Badges */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl animate-bounce">🎂</span>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-600 font-bold bg-white px-4 py-1.5 rounded-full border border-pink-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-rose-500" /> A Wish Forever Sealed
          </span>
          <span className="text-2xl animate-bounce [animation-delay:0.2s]">💖</span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-3xl sm:text-5xl font-serif-romantic font-bold text-rose-950 mb-6 leading-tight">
          Happy Birthday, {data.recipientName}! 🎉
        </h1>

        {/* Center Romantic Couple / Sunset Polaroid */}
        <div className="relative mx-auto my-6 w-60 sm:w-72 polaroid-frame rotate-1 hover:rotate-0 transition-transform duration-300 shadow-xl">
          <div className="w-full aspect-4/3 bg-pink-100 rounded-xs overflow-hidden mb-2">
            <img
              src={data.letterPhotoUrl}
              alt="Birthday Celebration"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="font-handwriting text-rose-900 text-lg">
            "Blessed to celebrate another year of you."
          </p>
        </div>

        {/* Heartfelt Birthday Message Content - Editable "Birthday Wish From My Soul" */}
        <div className="max-w-2xl mx-auto bg-white/95 rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-md my-6 text-left relative transition-all">
          {/* Top header row with Edit Button */}
          <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="text-xs font-cute uppercase tracking-wider font-bold text-rose-700">
                Personal Soul Message
              </span>
            </div>

            <button
              onClick={() => setIsEditingWish(!isEditingWish)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cute font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors shadow-2xs"
            >
              {isEditingWish ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Soul Wish ✏️</span>
                </>
              )}
            </button>
          </div>

          {isEditingWish ? (
            /* Editing State: Write on your own */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-cute font-bold text-pink-900 mb-1">
                  Wish Heading:
                </label>
                <input
                  type="text"
                  value={editedHeading}
                  onChange={(e) => setEditedHeading(e.target.value)}
                  placeholder="A Birthday Wish From My Soul"
                  className="w-full px-3 py-2 text-sm font-serif-romantic font-bold border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-cute font-bold text-pink-900 mb-1">
                  Write Your Own Birthday Wish Message:
                </label>
                <textarea
                  rows={7}
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  placeholder="Pour your heart out here... Write everything you want to wish and promise her on her special day."
                  className="w-full px-3 py-2.5 text-base font-handwriting text-rose-950 border border-pink-300 rounded-xl focus:outline-rose-500 bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-cute font-bold text-pink-900 mb-1">
                  Final Climax Love Statement:
                </label>
                <input
                  type="text"
                  value={editedEnding}
                  onChange={(e) => setEditedEnding(e.target.value)}
                  placeholder="Happy Birthday, my favourite person. I am so lucky to have you in my life. ❤️"
                  className="w-full px-3 py-2 text-xs font-cute font-semibold border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveWish}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-cute font-bold shadow-md inline-flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save My Birthday Wish ✨</span>
                </button>
                <button
                  onClick={() => setIsEditingWish(false)}
                  className="px-3 py-2 text-xs font-cute text-pink-700 hover:text-pink-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Display State */
            <div className="space-y-4">
              <h3 className="font-serif-romantic font-bold text-xl sm:text-2xl text-rose-950 text-center">
                {data.finalHeading || 'A Birthday Wish From My Soul'}
              </h3>
              <div className="font-handwriting text-xl sm:text-2xl text-rose-950 leading-relaxed whitespace-pre-line text-center px-2">
                {data.finalMessage}
              </div>
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsEditingWish(true)}
                  className="text-xs font-cute text-rose-600 hover:text-rose-800 underline inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Click here to edit this message in your own words</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Climax Ending Statement */}
        <div className="my-8 py-6 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-2xl text-white shadow-xl max-w-2xl mx-auto">
          <h2 className="font-serif-romantic font-bold text-xl sm:text-3xl leading-snug drop-shadow-sm">
            "{data.finalEnding}"
          </h2>
          <p className="text-xs sm:text-sm font-cute text-pink-100 mt-2 font-medium">
            From {data.senderName} with endless devotion
          </p>
        </div>

        {/* Interactive Fireworks & Confetti Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-6">
          <button
            onClick={triggerMoreFireworks}
            className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-cute font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch More Fireworks 🎆</span>
          </button>

          <button
            onClick={triggerConfetti}
            className="py-3 px-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-cute font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 active:scale-95"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Confetti Shower 🎉</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-5 rounded-2xl bg-white border border-pink-200 text-pink-800 hover:bg-pink-50 font-cute font-semibold text-xs shadow-2xs transition-all inline-flex items-center gap-1.5"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Share Scrapbook Link</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation: Replay & Back */}
        <div className="mt-10 pt-6 border-t border-pink-100 flex items-center justify-between text-xs font-cute text-pink-700">
          <button
            onClick={onBack}
            className="hover:text-pink-900 transition-colors"
          >
            ← Back to Fav Moments
          </button>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-900 font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay From Beginning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
