import React from 'react';
import { Volume2, VolumeX, Music, Settings, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderNavProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: { title: string; icon: string }[];
  isUnlocked: boolean;
  onSelectStep: (step: number) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenCustomizer: () => void;
  onOpenShare: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  isUnlocked,
  onSelectStep,
  isMusicPlaying,
  onToggleMusic,
  onOpenCustomizer,
  onOpenShare,
}) => {
  const currentInfo = stepTitles[currentStep] || { title: '', icon: '' };
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-pink-100/80 shadow-xs transition-all">
      {/* Top Bar Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl" role="img" aria-label="gift">🎁</span>
          <div className="flex flex-col">
            <span className="font-serif-romantic font-bold text-base sm:text-lg text-rose-900 tracking-tight leading-tight">
              Our Birthday Scrapbook
            </span>
            <span className="text-[11px] font-cute text-pink-700/80 tracking-wide font-medium">
              Made with endless love ❤️
            </span>
          </div>
        </div>

        {/* Center: Current Page & Progress Indicator */}
        {isUnlocked && (
          <div className="hidden md:flex items-center gap-3 bg-pink-50/80 border border-pink-200/60 rounded-full px-4 py-1.5 shadow-2xs">
            <span className="text-sm">{currentInfo.icon}</span>
            <span className="text-xs font-cute font-semibold text-rose-900 whitespace-nowrap">
              Part {currentStep + 1} of {totalSteps}: {currentInfo.title}
            </span>
            <div className="w-20 bg-pink-200/70 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-rose-600 font-bold tabular-nums">
              {progressPercent}%
            </span>
          </div>
        )}

        {/* Right: Actions (Music, Customize, Quick Navigation) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Music Play/Mute Button */}
          <button
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Mute Background Music' : 'Play Romantic Music'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cute font-semibold transition-all duration-200 ${
              isMusicPlaying
                ? 'bg-rose-500 text-white shadow-xs hover:bg-rose-600'
                : 'bg-rose-100/70 text-rose-800 hover:bg-rose-200/80'
            }`}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Playing</span>
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Play Song</span>
              </>
            )}
          </button>

          {/* Share Scrapbook Link Button */}
          <button
            onClick={onOpenShare}
            title="Share surprise website link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cute font-semibold bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 transition-colors shadow-2xs"
          >
            <span className="text-xs">💌</span>
            <span className="hidden sm:inline">Share Link</span>
          </button>

          {/* Customize Scrapbook Modal Trigger */}
          <button
            onClick={onOpenCustomizer}
            title="Customize text, photos, password & music"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cute font-semibold bg-white border border-pink-200 text-pink-800 hover:bg-pink-50 transition-colors shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">Personalize</span>
          </button>
        </div>
      </div>

      {/* Mobile progress line */}
      {isUnlocked && (
        <div className="block md:hidden w-full bg-pink-100 h-1">
          <div
            className="bg-rose-500 h-full transition-all duration-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Interactive Page Dots / Steps Navigation Ribbon (Visible when unlocked) */}
      {isUnlocked && (
        <div className="bg-pink-50/50 border-t border-pink-100/60 py-1.5 px-4 overflow-x-auto scrollbar-none">
          <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2">
            {stepTitles.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <button
                  key={step.title}
                  onClick={() => onSelectStep(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-cute transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs font-bold scale-105'
                      : isPast
                      ? 'bg-white/80 text-rose-800 hover:bg-rose-100/60 border border-pink-200/50 font-medium'
                      : 'bg-white/40 text-pink-400 hover:bg-white/70'
                  }`}
                >
                  <span className="text-xs">{step.icon}</span>
                  <span className="hidden lg:inline text-[11px]">{step.title}</span>
                  <span className="lg:hidden text-[10px] font-mono">{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
