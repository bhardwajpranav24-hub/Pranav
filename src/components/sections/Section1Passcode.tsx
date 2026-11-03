import React, { useState } from 'react';
import { Lock, Unlock, Heart, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { fireSurpriseConfetti } from '../../utils/confetti';

interface Section1PasscodeProps {
  data: ScrapbookData;
  isUnlocked: boolean;
  onUnlock: () => void;
  onNext: () => void;
}

export const Section1Passcode: React.FC<Section1PasscodeProps> = ({
  data,
  isUnlocked,
  onUnlock,
  onNext,
}) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleKeyPress = (num: string) => {
    if (isUnlocked) return;
    if (enteredCode.length >= 6) return;
    
    romanticAudio.playSparkleChime();
    const newCode = enteredCode + num;
    setEnteredCode(newCode);
    setErrorMessage('');

    // Check if code matches
    if (newCode === data.passcode) {
      triggerSuccess();
    } else if (newCode.length >= data.passcode.length) {
      // Trigger error shake if length reached but wrong
      setIsShaking(true);
      setErrorMessage('Oopsie! Wrong secret key, try again sweetie 💭');
      setTimeout(() => {
        setIsShaking(false);
        setEnteredCode('');
      }, 700);
    }
  };

  const handleBackspace = () => {
    setEnteredCode(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    setEnteredCode('');
    setErrorMessage('');
  };

  const triggerSuccess = () => {
    romanticAudio.playSparkleChime();
    fireSurpriseConfetti();
    onUnlock();
  };

  return (
    <div className="relative max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Top Cute Washi Tape */}
      <div className="w-36 h-6 washi-tape-pink -rotate-2 rounded-xs mb-4 shadow-xs" />

      {/* Main Welcome Scrapbook Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 text-center relative overflow-hidden">
        {/* Subtle decorative stamp */}
        <div className="absolute top-4 right-4 text-xs font-handwriting text-pink-400 rotate-12 border border-pink-300 rounded-sm px-2 py-0.5 select-none">
          TOP SECRET SURPRISE 💌
        </div>

        {/* Big Romantic Quote */}
        <div className="space-y-3 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-500 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200/60">
            <Sparkles className="w-3.5 h-3.5" /> For {data.recipientName}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950 leading-tight">
            "{data.welcomeMessage}"
          </h1>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            A special digital keepsake crafted just for your birthday...
          </p>
        </div>

        {/* Polaroid Picture Teaser */}
        <div className="relative mx-auto my-6 w-44 sm:w-52 polaroid-frame rotate-1 transition-transform hover:rotate-0 duration-300">
          <div className="w-full aspect-4/3 bg-pink-100 rounded-xs overflow-hidden relative">
            <img
              src={data.letterPhotoUrl}
              alt="Our sweet moments"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {!isUnlocked && (
              <div className="absolute inset-0 backdrop-blur-xs bg-rose-900/20 flex flex-col items-center justify-center text-white p-2">
                <Lock className="w-7 h-7 mb-1 text-white animate-bounce" />
                <span className="text-[11px] font-bold tracking-wider uppercase font-cute">Locked</span>
              </div>
            )}
          </div>
          <div className="text-center pt-2">
            <span className="text-xs font-handwriting text-rose-800 text-base">
              {isUnlocked ? 'Unlocked with love! 💕' : 'Enter secret key to view...'}
            </span>
          </div>
        </div>

        {/* State: Unlocked vs Locked Screen */}
        {isUnlocked ? (
          <div className="mt-6 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500 text-white mb-2 shadow-sm animate-bounce">
                <Unlock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-romantic font-bold text-rose-950">
                {data.unlockedMessage}
              </h3>
              <p className="text-xs text-rose-700 font-cute mt-1">
                Your birthday surprise is waiting for you! Let's blow the candles!
              </p>
            </div>

            <button
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Step 2: Blow Birthday Candles 🎂</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {/* Passcode dots display */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-cute text-pink-700 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Enter Secret Passcode</span>
              </div>

              {/* Code Dots Container */}
              <div
                className={`flex items-center justify-center gap-3 py-2 ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                {Array.from({ length: Math.max(4, data.passcode.length) }).map((_, i) => {
                  const isFilled = i < enteredCode.length;
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                        isFilled
                          ? 'bg-rose-500 border-rose-500 scale-110 shadow-xs'
                          : 'bg-pink-50 border-pink-300'
                      }`}
                    >
                      {isFilled && <Heart className="w-2.5 h-2.5 text-white fill-white" />}
                    </div>
                  );
                })}
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium font-cute animate-pulse">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Cute Birthday Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="h-12 sm:h-14 rounded-2xl bg-pink-50/80 hover:bg-pink-100 text-rose-900 font-cute font-bold text-lg border border-pink-200 shadow-2xs active:scale-95 transition-all flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              {/* Clear button */}
              <button
                onClick={handleClear}
                title="Clear code"
                className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 font-cute text-xs border border-pink-200 shadow-2xs active:scale-95 transition-all flex items-center justify-center"
              >
                Clear
              </button>
              {/* Zero */}
              <button
                onClick={() => handleKeyPress('0')}
                className="h-12 sm:h-14 rounded-2xl bg-pink-50/80 hover:bg-pink-100 text-rose-900 font-cute font-bold text-lg border border-pink-200 shadow-2xs active:scale-95 transition-all flex items-center justify-center"
              >
                0
              </button>
              {/* Backspace */}
              <button
                onClick={handleBackspace}
                title="Delete last digit"
                className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-pink-50 text-rose-700 font-cute text-xs border border-pink-200 shadow-2xs active:scale-95 transition-all flex items-center justify-center"
              >
                ⌫
              </button>
            </div>

            {/* Hint Section */}
            <div className="pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 font-cute underline underline-offset-4"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Secret Hint' : 'Need a hint?'}</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 bg-pink-50/90 rounded-xl border border-pink-200 text-xs text-pink-900 font-cute animate-in fade-in duration-200">
                  💡 <span className="font-semibold">Hint:</span> {data.passcodeHint}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom cute sticker */}
      <div className="mt-4 flex items-center gap-2 text-xs font-handwriting text-pink-600 text-base">
        <span>✨ Only authorized cuties allowed past this point ✨</span>
      </div>
    </div>
  );
};
