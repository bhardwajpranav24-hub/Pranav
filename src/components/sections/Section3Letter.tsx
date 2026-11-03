import React, { useState, useRef } from 'react';
import { Mail, MailOpen, Heart, Sparkles, ArrowRight, ArrowLeft, Edit3, Check, Camera, Upload } from 'lucide-react';
import { ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { fireSurpriseConfetti } from '../../utils/confetti';
import { fileToOptimizedDataUrl } from '../../utils/mediaStorage';

interface Section3LetterProps {
  data: ScrapbookData;
  onUpdateLetter: (heading: string, content: string) => void;
  onUpdateLetterPhoto: (photoUrl: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Section3Letter: React.FC<Section3LetterProps> = ({
  data,
  onUpdateLetter,
  onUpdateLetterPhoto,
  onNext,
  onBack,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeading, setEditedHeading] = useState(data.letterHeading);
  const [editedContent, setEditedContent] = useState(data.letterContent);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleEnvelope = () => {
    romanticAudio.playSparkleChime();
    if (!isOpen) {
      fireSurpriseConfetti();
    }
    setIsOpen(!isOpen);
  };

  const handleSaveEdit = () => {
    onUpdateLetter(editedHeading, editedContent);
    setIsEditing(false);
    romanticAudio.playSparkleChime();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        const dataUrl = await fileToOptimizedDataUrl(file);
        onUpdateLetterPhoto(dataUrl);
        romanticAudio.playSparkleChime();
        fireSurpriseConfetti();
      } catch (err) {
        console.error('Image compression failed:', err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Decorative Washi Tape */}
      <div className="w-48 h-6 washi-tape-pink -rotate-1 rounded-xs mb-4 shadow-xs" />

      {/* Main Container Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 relative">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            <Heart className="w-3.5 h-3.5 fill-pink-500" /> From My Heart to Yours
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950">
            {data.letterHeading}
          </h2>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            Every word written with infinite warmth and love for you.
          </p>
        </div>

        {/* Envelope Trigger (If Not Yet Opened) */}
        {!isOpen ? (
          <div className="py-8 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div
              onClick={toggleEnvelope}
              className="group relative w-72 sm:w-96 h-48 sm:h-56 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl shadow-lg border-2 border-pink-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:scale-102 transition-all duration-300"
            >
              {/* Envelope flap triangle simulation */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-pink-200/90 to-pink-100/40 clip-envelope-flap border-b border-pink-300/40" />

              {/* Heart Wax Seal */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-700 shadow-md flex items-center justify-center text-white transition-all transform group-hover:scale-110">
                <Heart className="w-8 h-8 fill-white animate-pulse" />
              </div>

              <div className="relative z-10 mt-3 text-center">
                <span className="font-handwriting text-xl sm:text-2xl text-rose-950 font-bold">
                  Tap to Break Seal & Open 💌
                </span>
                <p className="text-[11px] font-cute text-rose-700 mt-0.5">
                  Private & Confidential · Only For Birthday Girl
                </p>
              </div>

              {/* Corner Stamp */}
              <div className="absolute top-3 right-4 rotate-6 border border-pink-400 bg-white/70 px-2 py-1 rounded-xs text-[10px] font-cute text-pink-700">
                FIRST CLASS LOVE
              </div>
            </div>
          </div>
        ) : (
          /* Opened Scrapbook Spread: Left Photograph + Right Handwritten Letter */
          <div className="animate-in fade-in duration-500">
            {/* Quick Action Ribbon */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-100 mb-6">
              <button
                onClick={toggleEnvelope}
                className="inline-flex items-center gap-1.5 text-xs font-cute text-pink-600 hover:text-pink-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Fold Back Into Envelope</span>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cute font-semibold bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Letter & Photo'}</span>
              </button>
            </div>

            {/* Hidden file input for direct photo upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Dreamy Polaroid Photo (4 cols) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative polaroid-frame rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-full max-w-[280px] group">
                  {/* Washi tape on photo */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape-pink rotate-2 z-10" />

                  <div className="w-full aspect-4/3 bg-pink-100 rounded-xs overflow-hidden mb-3 relative">
                    <img
                      src={data.letterPhotoUrl}
                      alt="Us together"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Direct Upload Photo Hover / Click Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 cursor-pointer"
                      title="Upload your own picture"
                    >
                      <Camera className="w-6 h-6 animate-bounce" />
                      <span className="text-[11px] font-cute font-bold bg-rose-600 px-3 py-1 rounded-full shadow-sm">
                        {isUploadingPhoto ? 'Uploading...' : 'Upload Picture 📷'}
                      </span>
                    </button>
                  </div>

                  <div className="text-center px-1">
                    <p className="font-handwriting text-rose-900 text-base leading-snug">
                      "With you, every day feels like a blessing."
                    </p>
                    <span className="text-[10px] font-cute text-pink-600 block mt-1 uppercase tracking-wider font-semibold">
                      {data.letterDate}
                    </span>

                    {/* Mobile Friendly Visible Upload Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-[11px] font-cute font-semibold text-rose-600 hover:text-rose-800 underline inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Change Picture</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Handwritten Romantic Letter (7 cols) */}
              <div className="md:col-span-7 bg-[#fffdfa] rounded-2xl p-6 sm:p-8 border border-pink-200/80 shadow-inner relative">
                {/* Lined Paper Texture Styling */}
                <div className="absolute top-3 right-4 text-xs font-handwriting text-pink-400 rotate-3">
                  With all my devotion 💖
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-cute font-bold text-pink-800 mb-1">
                        Letter Heading:
                      </label>
                      <input
                        type="text"
                        value={editedHeading}
                        onChange={(e) => setEditedHeading(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-serif-romantic border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                      />
                    </div>

                    {/* Direct Upload Photo Section inside Edit Mode */}
                    <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-cute font-bold text-rose-900">
                          Polaroid Photo:
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-cute font-bold inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload New Picture</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-cute font-bold text-pink-800 mb-1">
                        Your Personal Romantic Message:
                      </label>
                      <textarea
                        rows={9}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-handwriting text-lg border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                      />
                    </div>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-cute font-bold inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Romantic Letter</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-serif-romantic font-bold text-xl text-rose-950">
                      Dearest {data.recipientName},
                    </h3>
                    <div className="font-handwriting text-xl sm:text-2xl text-rose-950 leading-relaxed whitespace-pre-line">
                      {data.letterContent}
                    </div>
                    <div className="pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-cute text-pink-700">
                      <span>Forever in love,</span>
                      <span className="font-handwriting text-lg font-bold text-rose-800">
                        {data.senderName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Section Action */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onNext}
                className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group"
              >
                <span>Step 4: Redeem Love Coupons ❤️</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Back navigation button */}
        <div className="mt-8 pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-cute text-pink-600">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 hover:text-pink-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Birthday Cake</span>
          </button>
          <span>Page 3 of 8</span>
        </div>
      </div>
    </div>
  );
};
