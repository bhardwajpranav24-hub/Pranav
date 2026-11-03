import React, { useState, useRef } from 'react';
import { X, Check, RotateCcw, Sparkles, Key, Camera, Music, FileText, Upload, Film, Trash2, Heart } from 'lucide-react';
import { ScrapbookData } from '../types/scrapbook';
import { DEFAULT_SCRAPBOOK_DATA } from '../utils/defaultData';
import { romanticAudio } from '../utils/audioSynth';
import { fileToOptimizedDataUrl, saveAudioToStorage, saveVideoToStorage } from '../utils/mediaStorage';

interface CustomizerModalProps {
  data: ScrapbookData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: ScrapbookData) => void;
  onReset: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<ScrapbookData>(data);
  const [activeTab, setActiveTab] = useState<'basics' | 'letter' | 'video' | 'music'>('basics');
  const [savedAlert, setSavedAlert] = useState(false);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  const letterPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (key: keyof ScrapbookData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleLetterPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingMedia(true);
        const dataUrl = await fileToOptimizedDataUrl(file);
        setFormData(prev => ({ ...prev, letterPhotoUrl: dataUrl }));
      } catch (err) {
        console.error('Letter photo upload error:', err);
      } finally {
        setIsProcessingMedia(false);
      }
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingMedia(true);
        const storedUrl = await saveAudioToStorage('custom_song', file);
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({
          ...prev,
          musicTitle: cleanTitle,
          musicArtist: 'Uploaded Track',
          customMusicUrl: storedUrl,
        }));
      } catch (err) {
        console.error('Audio upload error:', err);
      } finally {
        setIsProcessingMedia(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingMedia(true);
        const storedUrl = await saveVideoToStorage('custom_fav_video', file);
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({
          ...prev,
          videoUrl: storedUrl,
          videoTitle: cleanTitle || 'My Favourite Video of Us ❤️',
        }));
      } catch (err) {
        console.error('Video upload error:', err);
      } finally {
        setIsProcessingMedia(false);
      }
    }
  };

  const handleSave = () => {
    onSave(formData);
    if (formData.customMusicUrl) {
      romanticAudio.play(formData.customMusicUrl);
    }
    romanticAudio.playSparkleChime();
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 900);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all scrapbook contents back to the sweet defaults?')) {
      onReset();
      setFormData(DEFAULT_SCRAPBOOK_DATA);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-pink-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={letterPhotoInputRef}
          accept="image/*"
          onChange={handleLetterPhotoUpload}
          className="hidden"
        />
        <input
          type="file"
          ref={audioFileInputRef}
          accept="audio/*"
          onChange={handleAudioUpload}
          className="hidden"
        />
        <input
          type="file"
          ref={videoFileInputRef}
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif-romantic font-bold text-lg text-rose-950">
              Personalize Your Birthday Scrapbook
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-pink-100 bg-pink-50/40 px-6 gap-2 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('basics')}
            className={`px-3 py-2 text-xs font-cute font-bold rounded-t-xl transition-colors border-t border-x whitespace-nowrap shrink-0 ${
              activeTab === 'basics'
                ? 'bg-white border-pink-200 text-rose-900 border-b-white -mb-px'
                : 'border-transparent text-pink-600 hover:text-pink-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Names & Passcode</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3 py-2 text-xs font-cute font-bold rounded-t-xl transition-colors border-t border-x whitespace-nowrap shrink-0 ${
              activeTab === 'letter'
                ? 'bg-white border-pink-200 text-rose-900 border-b-white -mb-px'
                : 'border-transparent text-pink-600 hover:text-pink-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Love Letter & Picture</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-2 text-xs font-cute font-bold rounded-t-xl transition-colors border-t border-x whitespace-nowrap shrink-0 ${
              activeTab === 'video'
                ? 'bg-white border-pink-200 text-rose-900 border-b-white -mb-px'
                : 'border-transparent text-pink-600 hover:text-pink-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>Fav Video of Us</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-3 py-2 text-xs font-cute font-bold rounded-t-xl transition-colors border-t border-x whitespace-nowrap shrink-0 ${
              activeTab === 'music'
                ? 'bg-white border-pink-200 text-rose-900 border-b-white -mb-px'
                : 'border-transparent text-pink-600 hover:text-pink-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Upload Song</span>
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 font-cute">
          {activeTab === 'basics' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-pink-900 mb-1">
                    Birthday Person's Name:
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleTextChange('recipientName', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                    placeholder="My Sweetheart"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-pink-900 mb-1">
                    Your Name / Signature:
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleTextChange('senderName', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                    placeholder="Yours Forever"
                  />
                </div>
              </div>

              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <Key className="w-4 h-4 text-rose-500" />
                  <span>Secret Lock Passcode Configuration</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-pink-900 mb-1">
                      Secret Keypad Code (digits):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.passcode}
                      onChange={(e) => handleTextChange('passcode', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                      placeholder="1103"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-pink-900 mb-1">
                      Passcode Hint:
                    </label>
                    <input
                      type="text"
                      value={formData.passcodeHint}
                      onChange={(e) => handleTextChange('passcodeHint', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                      placeholder="Our special anniversary date"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Welcome Screen Quote:
                </label>
                <input
                  type="text"
                  value={formData.welcomeMessage}
                  onChange={(e) => handleTextChange('welcomeMessage', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Unlocked Success Quote:
                </label>
                <input
                  type="text"
                  value={formData.unlockedMessage}
                  onChange={(e) => handleTextChange('unlockedMessage', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Letter Title / Heading:
                </label>
                <input
                  type="text"
                  value={formData.letterHeading}
                  onChange={(e) => handleTextChange('letterHeading', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>

              {/* Direct Photo Upload Card with Preview */}
              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
                <label className="block text-xs font-bold text-pink-900">
                  Letter Photograph (Upload from your device):
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-pink-300 overflow-hidden bg-white shrink-0 shadow-2xs">
                    <img
                      src={formData.letterPhotoUrl}
                      alt="Letter preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => letterPhotoInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isProcessingMedia ? 'Uploading...' : 'Choose Picture File'}</span>
                    </button>
                    <p className="text-[11px] text-pink-700">
                      Select any photo from your phone or laptop.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Handwritten Romantic Letter Message:
                </label>
                <textarea
                  rows={8}
                  value={formData.letterContent}
                  onChange={(e) => handleTextChange('letterContent', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20 font-handwriting text-lg"
                />
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
                <label className="block text-xs font-bold text-pink-900">
                  Upload Your Favourite Video of Us:
                </label>

                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-pink-300 hover:border-rose-400 bg-white cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
                >
                  <Film className="w-8 h-8 text-rose-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-rose-900">
                    {isProcessingMedia ? 'Uploading video file...' : 'Click to select video from phone or laptop'}
                  </span>
                  <span className="text-[10px] text-pink-600">
                    Supports MP4, MOV, WEBM video formats
                  </span>
                </div>

                {formData.videoUrl && (
                  <div className="flex items-center justify-between text-xs text-rose-900 bg-white p-2.5 rounded-xl border border-pink-200">
                    <span className="font-bold truncate">✓ Video file is loaded and ready</span>
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="text-rose-600 hover:text-rose-800 underline text-[11px] shrink-0"
                    >
                      Change Video
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Video Heading:
                </label>
                <input
                  type="text"
                  value={formData.videoTitle}
                  onChange={(e) => handleTextChange('videoTitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Milestone / Date:
                </label>
                <input
                  type="text"
                  value={formData.videoDate}
                  onChange={(e) => handleTextChange('videoDate', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Romantic Video Caption:
                </label>
                <textarea
                  rows={3}
                  value={formData.videoCaption}
                  onChange={(e) => handleTextChange('videoCaption', e.target.value)}
                  className="w-full px-3 py-2 text-sm font-handwriting text-lg border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
                <label className="block text-xs font-bold text-pink-900">
                  Upload Your Music Audio File:
                </label>
                <div
                  onClick={() => audioFileInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-pink-300 hover:border-rose-400 bg-white cursor-pointer transition-all flex flex-col items-center justify-center gap-1 text-center"
                >
                  <Music className="w-8 h-8 text-rose-500 mb-1" />
                  <span className="text-xs font-bold text-rose-900">
                    {isProcessingMedia ? 'Uploading audio...' : 'Click to select song from device'}
                  </span>
                  <span className="text-[10px] text-pink-600">
                    Supports MP3, M4A, WAV audio files
                  </span>
                </div>

                {formData.customMusicUrl ? (
                  <div className="flex items-center justify-between text-xs text-rose-900 bg-white p-2.5 rounded-xl border border-pink-200">
                    <span className="font-bold truncate">Uploaded: {formData.musicTitle}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          musicTitle: 'Lover’s Music Box Waltz',
                          musicArtist: 'Romantic Scrapbook Melodies',
                          customMusicUrl: '',
                        }))
                      }
                      className="text-rose-600 hover:text-rose-800 underline ml-2 shrink-0 text-[11px]"
                    >
                      Restore Music Box
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-pink-700 text-center">
                    Using romantic Music Box Waltz synthesizer by default.
                  </p>
                )}
              </div>

              <div className="p-4 bg-pink-50/70 rounded-2xl border border-pink-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-cute font-bold text-rose-900">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>A Birthday Wish From My Soul (Grand Finale Message)</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-pink-900 mb-1">
                    Soul Wish Heading:
                  </label>
                  <input
                    type="text"
                    value={formData.finalHeading}
                    onChange={(e) => handleTextChange('finalHeading', e.target.value)}
                    className="w-full px-3 py-2 text-sm font-serif-romantic border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-pink-900 mb-1">
                    Write on Your Own (Birthday Wish Message):
                  </label>
                  <textarea
                    rows={5}
                    value={formData.finalMessage}
                    onChange={(e) => handleTextChange('finalMessage', e.target.value)}
                    className="w-full px-3 py-2 text-sm font-handwriting text-lg border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-pink-900 mb-1">
                    Final Ending Climax Quote:
                  </label>
                  <input
                    type="text"
                    value={formData.finalEnding}
                    onChange={(e) => handleTextChange('finalEnding', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-cute font-semibold border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Cute Cats Secret Message:
                </label>
                <textarea
                  rows={2}
                  value={formData.catSecretMessage}
                  onChange={(e) => handleTextChange('catSecretMessage', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-pink-300 rounded-xl focus:outline-rose-500 bg-pink-50/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-pink-100 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-pink-700 hover:text-pink-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{savedAlert ? 'Saved with Love!' : 'Save & Update Scrapbook'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
