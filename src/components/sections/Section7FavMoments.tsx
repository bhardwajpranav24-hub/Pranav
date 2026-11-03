import React, { useState, useRef } from 'react';
import { Film, Upload, Heart, Sparkles, ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Edit3, Check, Plus, Trash2, Video } from 'lucide-react';
import { ScrapbookData, VideoMomentItem } from '../../types/scrapbook';
import { saveVideoToStorage } from '../../utils/mediaStorage';
import { romanticAudio } from '../../utils/audioSynth';
import { fireSurpriseConfetti } from '../../utils/confetti';

interface Section7FavMomentsProps {
  data: ScrapbookData;
  onUpdateVideoMoments: (moments: VideoMomentItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Section7FavMoments: React.FC<Section7FavMomentsProps> = ({
  data,
  onUpdateVideoMoments,
  onNext,
  onBack,
}) => {
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState<string | null>(null);
  
  // Adding new video moment state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Our Sweet Moment');
  const [newCaption, setNewCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState<string | null>(null);

  // Inline editing of an existing moment
  const [editingMomentId, setEditingMomentId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCaption, setEditCaption] = useState('');

  const cardFileInputRef = useRef<HTMLInputElement | null>(null);
  const newVideoFileInputRef = useRef<HTMLInputElement | null>(null);

  const moments = data.videoMoments && data.videoMoments.length > 0
    ? data.videoMoments
    : [
        {
          id: 'vm-1',
          title: 'Our Sweetest Moments & Laughter',
          date: 'Pure Joy',
          caption: 'Every time I watch this video, my heart skips a beat. You make every ordinary second feel magical.',
          videoUrl: data.videoUrl || '',
          rotationDeg: -1.5,
          tapeColor: 'pink' as const,
        },
      ];

  const getTapeClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'washi-tape-blue';
      case 'yellow':
        return 'washi-tape-yellow';
      default:
        return 'washi-tape-pink';
    }
  };

  const handleCardVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      try {
        setIsUploading(true);
        const storedUrl = await saveVideoToStorage(`vm_${activeUploadId}_${Date.now()}`, file);
        const updated = moments.map(m => (m.id === activeUploadId ? { ...m, videoUrl: storedUrl } : m));
        onUpdateVideoMoments(updated);
        romanticAudio.playSparkleChime();
        fireSurpriseConfetti();
        setUploadSuccessAlert('Video uploaded and saved to this moment! 🎬❤️');
        setTimeout(() => setUploadSuccessAlert(null), 3500);
      } catch (err) {
        console.error('Video upload failed:', err);
      } finally {
        setIsUploading(false);
        setActiveUploadId(null);
      }
    }
  };

  const handleNewVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const storedUrl = await saveVideoToStorage(`vm_new_${Date.now()}`, file);
        setNewVideoUrl(storedUrl);
        if (!newTitle) {
          setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      } catch (err) {
        console.error('New video file error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveNewMoment = () => {
    if (!newVideoUrl) return;

    const newMoment: VideoMomentItem = {
      id: `vm-${Date.now()}`,
      title: newTitle.trim() || 'My Fav Moment',
      date: newDate.trim() || 'Special Day',
      caption: newCaption.trim() || 'One of my absolute favourite memories with you.',
      videoUrl: newVideoUrl,
      rotationDeg: (Math.random() - 0.5) * 4,
      tapeColor: ['pink', 'blue', 'yellow'][Math.floor(Math.random() * 3)] as 'pink' | 'blue' | 'yellow',
    };

    onUpdateVideoMoments([...moments, newMoment]);
    romanticAudio.playSparkleChime();
    fireSurpriseConfetti();
    setIsAddingNew(false);
    setNewTitle('');
    setNewDate('Our Sweet Moment');
    setNewCaption('');
    setNewVideoUrl(null);
  };

  const startEditMoment = (moment: VideoMomentItem) => {
    setEditingMomentId(moment.id);
    setEditTitle(moment.title);
    setEditDate(moment.date);
    setEditCaption(moment.caption);
  };

  const saveEditMoment = (id: string) => {
    const updated = moments.map(m =>
      m.id === id
        ? {
            ...m,
            title: editTitle.trim() || m.title,
            date: editDate.trim() || m.date,
            caption: editCaption.trim() || m.caption,
          }
        : m
    );
    onUpdateVideoMoments(updated);
    setEditingMomentId(null);
    romanticAudio.playSparkleChime();
  };

  const handleDeleteMoment = (id: string) => {
    if (window.confirm('Delete this video moment from your scrapbook?')) {
      onUpdateVideoMoments(moments.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Decorative Washi Tape */}
      <div className="w-56 h-6 washi-tape-pink rotate-1 rounded-xs mb-4 shadow-xs" />

      {/* Main Scrapbook Container Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 relative">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            <Film className="w-3.5 h-3.5 text-rose-500" /> Cinema of Our Hearts
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950">
            {data.favMomentsHeading || 'My Fav Moments of Us 🎬'}
          </h2>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            "A scrapbook reel of our sweetest memories in motion — upload and replay our best videos!"
          </p>
        </div>

        {/* Hidden File Input for Card Video Upload */}
        <input
          type="file"
          ref={cardFileInputRef}
          accept="video/*"
          onChange={handleCardVideoUpload}
          className="hidden"
        />

        {/* Success Alert Banner */}
        {uploadSuccessAlert && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center text-xs font-cute font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{uploadSuccessAlert}</span>
          </div>
        )}

        {/* Video Moments Reel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {moments.map((moment, idx) => (
            <div
              key={moment.id}
              style={{ transform: `rotate(${moment.rotationDeg}deg)` }}
              className="group relative bg-[#ffffff] rounded-2xl p-4 sm:p-5 shadow-lg border border-pink-200/90 hover:shadow-2xl transition-all duration-300 hover:rotate-0 flex flex-col justify-between"
            >
              {/* Washi Tape */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-5 ${getTapeClass(
                  moment.tapeColor
                )} -rotate-1 z-20`}
              />

              {/* Milestone Badge */}
              <div className="absolute top-2 right-2 z-20 bg-rose-500 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                MOMENT #{idx + 1}
              </div>

              {/* Video Player or Upload Zone */}
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-rose-950/20 mb-3 flex items-center justify-center group/video">
                  {moment.videoUrl ? (
                    <>
                      <video
                        src={moment.videoUrl}
                        controls
                        playsInline
                        loop
                        className="w-full h-full object-contain"
                      />
                      {/* Floating corner button to change video */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveUploadId(moment.id);
                          cardFileInputRef.current?.click();
                        }}
                        className="absolute top-2 left-2 z-10 bg-black/60 hover:bg-black/80 text-white text-[10px] font-cute px-2 py-1 rounded-full opacity-0 group-hover/video:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-xs"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Replace Video</span>
                      </button>
                    </>
                  ) : (
                    /* Video Upload Prompt Box */
                    <div
                      onClick={() => {
                        setActiveUploadId(moment.id);
                        cardFileInputRef.current?.click();
                      }}
                      className="w-full h-full bg-gradient-to-br from-rose-950 via-slate-900 to-pink-950 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-pink-900/40 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 animate-bounce" />
                      </div>
                      <span className="text-xs font-cute font-bold text-white block">
                        Upload Video of This Moment 📹
                      </span>
                      <span className="text-[10px] font-cute text-pink-200 mt-0.5">
                        Click to select MP4, MOV, or WEBM from device
                      </span>
                    </div>
                  )}
                </div>

                {/* Moment Text Notes / Inline Editor */}
                {editingMomentId === moment.id ? (
                  <div className="space-y-2 p-2 bg-pink-50/70 rounded-xl border border-pink-200">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Moment Title"
                      className="w-full px-2 py-1 text-xs font-serif-romantic border border-pink-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      placeholder="Date or Milestone"
                      className="w-full px-2 py-1 text-[11px] font-cute border border-pink-300 rounded-lg bg-white"
                    />
                    <textarea
                      rows={2}
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Sweet caption..."
                      className="w-full px-2 py-1 text-xs font-handwriting text-base border border-pink-300 rounded-lg bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditMoment(moment.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-cute font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingMomentId(null)}
                        className="px-2 py-1 text-xs font-cute text-pink-700 hover:text-pink-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center sm:text-left px-1">
                    <div className="flex items-center justify-between border-b border-pink-100 pb-1">
                      <h3 className="font-serif-romantic font-bold text-base text-rose-950 truncate max-w-[200px]">
                        {moment.title}
                      </h3>
                      <span className="text-[10px] font-cute text-pink-600 font-semibold">
                        {moment.date}
                      </span>
                    </div>
                    <p className="font-handwriting text-rose-900 text-lg leading-snug pt-1">
                      "{moment.caption}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div className="mt-3 pt-2 border-t border-pink-100/80 flex items-center justify-between text-xs font-cute">
                <button
                  type="button"
                  onClick={() => {
                    setActiveUploadId(moment.id);
                    cardFileInputRef.current?.click();
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline inline-flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>{moment.videoUrl ? 'Change Video' : 'Upload Video'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditMoment(moment)}
                    className="text-[11px] text-pink-700 hover:text-pink-900 inline-flex items-center gap-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  {moments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMoment(moment.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                      title="Delete this moment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Video Moment Card / Uploader */}
        <div className="mt-10 flex justify-center">
          {!isAddingNew ? (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="py-3 px-6 rounded-2xl bg-pink-50 hover:bg-pink-100 border-2 border-dashed border-pink-300 text-rose-900 font-cute font-bold text-xs inline-flex items-center gap-2 shadow-2xs hover:shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-rose-500" />
              <span>+ Upload & Add Another Video Moment</span>
            </button>
          ) : (
            <div className="w-full max-w-md bg-white p-6 rounded-3xl border-2 border-pink-300 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                <h4 className="font-serif-romantic font-bold text-rose-950 text-base">
                  Add a New Video Moment
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs font-cute text-pink-600 hover:text-pink-900"
                >
                  Cancel
                </button>
              </div>

              <input
                type="file"
                ref={newVideoFileInputRef}
                accept="video/*"
                onChange={handleNewVideoFile}
                className="hidden"
              />

              {/* Upload Video Dropzone */}
              <div
                onClick={() => newVideoFileInputRef.current?.click()}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-pink-300 hover:border-rose-400 bg-pink-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
              >
                {newVideoUrl ? (
                  <video
                    src={newVideoUrl}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Film className="w-8 h-8 text-rose-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-cute font-bold text-rose-900 block">
                      {isUploading ? 'Uploading video...' : 'Click to select video from your phone or laptop'}
                    </span>
                    <span className="text-[10px] font-cute text-pink-600">
                      Supports MP4, MOV, WEBM files
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Moment Title (e.g. When You Smiled At Me)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-cute border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                />
                <input
                  type="text"
                  placeholder="Date or Milestone (e.g. Our Summer Picnic)"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-cute border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="Sweet caption about this video..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-handwriting text-base border border-pink-300 rounded-xl focus:outline-rose-500 bg-white"
                />
              </div>

              <button
                type="button"
                disabled={!newVideoUrl}
                onClick={handleSaveNewMoment}
                className={`w-full py-2.5 rounded-xl font-cute font-bold text-xs text-white shadow-md transition-all ${
                  newVideoUrl
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-rose-300 cursor-not-allowed'
                }`}
              >
                Save Video Moment to Scrapbook ✨
              </button>
            </div>
          )}
        </div>

        {/* Next Section Action */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNext}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
          >
            <span>Step 8: Final Birthday Celebration 💖</span>
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
            <span>Back to Cute Surprise</span>
          </button>
          <span>Page 7 of 8</span>
        </div>
      </div>
    </div>
  );
};
