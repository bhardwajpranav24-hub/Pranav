import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Disc, Upload, Music, Volume2, VolumeX, Sparkles, ArrowRight, ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { saveAudioToStorage } from '../../utils/mediaStorage';

interface Section5MusicProps {
  data: ScrapbookData;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onUpdateMusic: (title: string, artist: string, customUrl?: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Section5Music: React.FC<Section5MusicProps> = ({
  data,
  isMusicPlaying,
  onToggleMusic,
  onUpdateMusic,
  onNext,
  onBack,
}) => {
  const [progress, setProgress] = useState(35);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Simulate progress moving while playing
  useEffect(() => {
    if (!isMusicPlaying) return;
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMusicPlaying]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const storedUrl = await saveAudioToStorage('custom_song', file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        onUpdateMusic(cleanName, 'Your Uploaded Song', storedUrl);
        romanticAudio.play(storedUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        console.error('Audio upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleResetToSynth = () => {
    onUpdateMusic('Lover’s Music Box Waltz', 'Romantic Scrapbook Melodies', '');
    romanticAudio.play();
  };

  const isCustomUploaded = Boolean(data.customMusicUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Decorative Washi Tape */}
      <div className="w-48 h-6 washi-tape-blue -rotate-1 rounded-xs mb-4 shadow-xs" />

      {/* Main Container Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 text-center relative overflow-hidden">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            <Disc className="w-3.5 h-3.5" /> Our Soundtrack of Love
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950">
            Our Music 🎵
          </h2>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            "Every love story has a melody, but ours is my favourite song."
          </p>
        </div>

        {/* Center: Strip of Personal Photos Around the Large Animated Vinyl Record */}
        <div className="relative my-8 flex items-center justify-center">
          {/* Left Mini Polaroid Strip */}
          <div className="hidden md:flex flex-col gap-4 absolute left-4 lg:left-8 z-10">
            <div className="w-24 polaroid-frame -rotate-6 shadow-md hover:rotate-0 transition-transform">
              <div className="w-full aspect-square bg-pink-100 overflow-hidden">
                <img
                  src={data.memories?.[0]?.imageUrl || data.letterPhotoUrl}
                  alt="Memory 1"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-cute text-pink-800 text-center pt-1 truncate">Sunset Walk</p>
            </div>
            <div className="w-24 polaroid-frame rotate-3 shadow-md hover:rotate-0 transition-transform">
              <div className="w-full aspect-square bg-pink-100 overflow-hidden">
                <img
                  src={data.memories?.[1]?.imageUrl || data.letterPhotoUrl}
                  alt="Memory 2"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-cute text-pink-800 text-center pt-1 truncate">Sweet Picnic</p>
            </div>
          </div>

          {/* Right Mini Polaroid Strip */}
          <div className="hidden md:flex flex-col gap-4 absolute right-4 lg:right-8 z-10">
            <div className="w-24 polaroid-frame rotate-6 shadow-md hover:rotate-0 transition-transform">
              <div className="w-full aspect-square bg-pink-100 overflow-hidden">
                <img
                  src={data.memories?.[2]?.imageUrl || data.letterPhotoUrl}
                  alt="Memory 3"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-cute text-pink-800 text-center pt-1 truncate">Fairy Lights</p>
            </div>
            <div className="w-24 polaroid-frame -rotate-3 shadow-md hover:rotate-0 transition-transform">
              <div className="w-full aspect-square bg-pink-100 overflow-hidden">
                <img
                  src={data.memories?.[3]?.imageUrl || data.letterPhotoUrl}
                  alt="Memory 4"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-cute text-pink-800 text-center pt-1 truncate">Sweet Kitty</p>
            </div>
          </div>

          {/* Centerpiece: Large Animated Vinyl Record */}
          <div className="relative w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 mx-auto">
            {/* Vinyl Record Body */}
            <div
              className={`w-full h-full rounded-full bg-[#161616] p-4 sm:p-5 shadow-2xl relative border-4 border-slate-800 flex items-center justify-center transition-transform ${
                isMusicPlaying ? 'animate-vinyl-spin' : ''
              }`}
            >
              {/* Vinyl Grooves Rings */}
              <div className="w-full h-full rounded-full border border-slate-700/60 flex items-center justify-center">
                <div className="w-[82%] h-[82%] rounded-full border border-slate-700/40 flex items-center justify-center">
                  <div className="w-[66%] h-[66%] rounded-full border border-slate-700/60 flex items-center justify-center">
                    {/* Vinyl Center Pastel Sticker */}
                    <div className="w-[48%] h-[48%] rounded-full bg-gradient-to-tr from-pink-300 via-rose-200 to-sky-200 border-2 border-white shadow-md flex flex-col items-center justify-center p-2 text-center select-none">
                      <span className="text-[9px] sm:text-[10px] font-cute font-bold text-rose-950 uppercase tracking-wider truncate w-full">
                        {data.recipientName}
                      </span>
                      <Disc className="w-4 h-4 text-rose-800 my-0.5" />
                      <span className="text-[8px] font-mono text-rose-700 font-bold truncate max-w-full">
                        {isCustomUploaded ? 'CUSTOM TRACK' : 'WALTZ BOX'}
                      </span>
                      {/* Spindle hole */}
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-800 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tonearm / Needle */}
            <div
              className={`absolute -top-3 right-2 w-14 sm:w-20 h-28 pointer-events-none transition-transform duration-700 origin-top-right ${
                isMusicPlaying ? 'rotate-12 translate-x-1' : '-rotate-12'
              }`}
            >
              <div className="w-2 h-16 sm:h-20 bg-slate-400 rounded-full mx-auto shadow-sm" />
              <div className="w-4 h-6 bg-slate-700 rounded-xs mx-auto -mt-1 shadow-md" />
            </div>
          </div>
        </div>

        {/* Music Player Controls Box */}
        <div className="max-w-md mx-auto bg-pink-50/70 border border-pink-200 rounded-2xl p-5 shadow-xs">
          {/* Song Info */}
          <div className="text-center mb-3">
            <h4 className="font-serif-romantic font-bold text-lg text-rose-950 truncate px-2">
              {data.musicTitle}
            </h4>
            <p className="text-xs font-cute text-pink-700">
              {data.musicArtist}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 mb-4">
            <div className="w-full bg-pink-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-pink-600">
              <span>{Math.floor((progress * 180) / 100 / 60)}:{(Math.floor((progress * 180) / 100) % 60).toString().padStart(2, '0')}</span>
              <span>3:00</span>
            </div>
          </div>

          {/* Play / Pause Button */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onToggleMusic}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform active:scale-95"
            >
              {isMusicPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Prominent Audio File Upload Box */}
          <div className="mt-5 pt-4 border-t border-pink-200/60">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl border-2 border-dashed border-pink-300 hover:border-rose-400 bg-white/80 hover:bg-pink-50/50 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-10 h-10 rounded-full bg-pink-100 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
                <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-xs font-cute font-bold text-rose-900">
                {isUploading ? 'Uploading your song...' : 'Upload Your Music Track'}
              </span>
              <span className="text-[11px] font-cute text-pink-600">
                Choose MP3, M4A, or WAV file from your device
              </span>
            </div>

            {uploadSuccess && (
              <div className="mt-2 text-xs font-cute text-emerald-700 font-bold flex items-center justify-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your song was loaded and is playing now! 🎵</span>
              </div>
            )}

            {isCustomUploaded && (
              <div className="mt-3 flex items-center justify-between text-xs font-cute text-pink-700 bg-white px-3 py-1.5 rounded-xl border border-pink-200">
                <span className="truncate max-w-[200px]">Active: {data.musicTitle}</span>
                <button
                  onClick={handleResetToSynth}
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold underline ml-2 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Music Box</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Next & Back Section Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNext}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
          >
            <span>Step 6: Cute Surprise 🐱</span>
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
            <span>Back to Coupons</span>
          </button>
          <span>Page 5 of 8</span>
        </div>
      </div>
    </div>
  );
};
