import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Heart } from 'lucide-react';
import { ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { fireSurpriseConfetti } from '../../utils/confetti';

interface Section2CakeProps {
  data: ScrapbookData;
  onNext: () => void;
  onBack: () => void;
}

export const Section2Cake: React.FC<Section2CakeProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [hasBlownAll, setHasBlownAll] = useState(false);
  const [wished, setWished] = useState(false);

  const allOut = candlesLit.every(lit => !lit);

  const extinguishCandle = (index: number) => {
    if (!candlesLit[index]) return;
    romanticAudio.playBlowSound();

    const updated = [...candlesLit];
    updated[index] = false;
    setCandlesLit(updated);

    if (updated.every(lit => !lit)) {
      handleAllBlownOut();
    }
  };

  const blowAllCandles = () => {
    romanticAudio.playBlowSound();
    setCandlesLit([false, false, false, false, false]);
    handleAllBlownOut();
  };

  const handleAllBlownOut = () => {
    setHasBlownAll(true);
    romanticAudio.playSparkleChime();
    fireSurpriseConfetti();
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
    setHasBlownAll(false);
    setWished(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Decorative Washi Tape */}
      <div className="w-40 h-6 washi-tape-blue rotate-1 rounded-xs mb-4 shadow-xs" />

      {/* Cake Container Scrapbook Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 text-center relative overflow-hidden">
        {/* Cute banner */}
        <div className="space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            <Sparkles className="w-3.5 h-3.5" /> Birthday Wish Ceremony
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950">
            {allOut ? data.cakeWish : 'Blow the candles! 🕯️'}
          </h2>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            {allOut
              ? 'Your wish has been dispatched straight to the stars! ✨'
              : 'Tap each candle or tap the cake to make your deepest birthday wish come true.'}
          </p>
        </div>

        {/* Interactive Birthday Cake Illustration */}
        <div
          onClick={allOut ? undefined : blowAllCandles}
          className={`relative mx-auto my-6 w-72 sm:w-80 h-72 cursor-pointer transition-transform duration-300 ${
            !allOut ? 'hover:scale-102' : ''
          }`}
          title={allOut ? 'Candles blown out!' : 'Click to blow candles!'}
        >
          {/* Cake Stand */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-4 bg-pink-200 rounded-full shadow-inner" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-pink-300 rounded-t-lg" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-2 bg-pink-400 rounded-full" />

          {/* Bottom Cake Layer */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-56 h-22 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 rounded-2xl border-2 border-pink-300 shadow-md flex items-center justify-around px-4">
            {/* Strawberry & Pearl details */}
            <span className="text-lg">🍓</span>
            <span className="text-sm">🌸</span>
            <span className="text-lg">🍓</span>
            <span className="text-sm">🌸</span>
            <span className="text-lg">🍓</span>
          </div>

          {/* Top Cake Layer */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-40 h-18 bg-gradient-to-r from-pink-100 via-white to-pink-100 rounded-xl border-2 border-pink-300 shadow-md flex items-center justify-around px-3">
            <span className="text-base">✨</span>
            <span className="text-base">🍓</span>
            <span className="text-base">✨</span>
          </div>

          {/* Whipped Frosting Drips */}
          <div className="absolute bottom-43 left-1/2 -translate-x-1/2 w-42 flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-5 h-4 bg-white rounded-b-full shadow-xs border-b border-pink-200" />
            ))}
          </div>

          {/* 5 Birthday Candles */}
          <div className="absolute bottom-44 left-1/2 -translate-x-1/2 w-40 flex justify-between px-3">
            {candlesLit.map((isLit, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  extinguishCandle(idx);
                }}
                className="relative flex flex-col items-center group cursor-pointer"
              >
                {/* Candle Flame / Smoke */}
                <div className="h-8 flex items-center justify-center">
                  {isLit ? (
                    <div className="w-3.5 h-6 bg-gradient-to-t from-amber-400 via-yellow-300 to-white rounded-full animate-flame transition-all" />
                  ) : (
                    <div className="w-1.5 h-4 bg-slate-300/60 rounded-full animate-pulse opacity-70">
                      <div className="text-[10px] -mt-3 text-slate-400">💨</div>
                    </div>
                  )}
                </div>

                {/* Candle Stick */}
                <div
                  className={`w-2.5 h-10 rounded-t-xs shadow-2xs border border-pink-300 transition-colors ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-b from-sky-200 to-sky-300'
                      : 'bg-gradient-to-b from-pink-200 to-pink-300'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons & Wish Status */}
        <div className="mt-4 space-y-4">
          {!allOut ? (
            <button
              onClick={blowAllCandles}
              className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 active:scale-95"
            >
              <span>💨 Blow All Candles</span>
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 max-w-md mx-auto text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-rose-600 font-bold font-cute">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span>WISH SEALED WITH LOVE</span>
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <p className="text-xs text-rose-900 font-cute">
                  "May every wish you whisper in your heart today find its way to you in the sweetest possible way."
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={relightCandles}
                  className="py-2.5 px-4 rounded-xl bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 text-xs font-cute font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Relight Candles</span>
                </button>

                <button
                  onClick={onNext}
                  className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group"
                >
                  <span>Step 3: Read Your Birthday Letter 💌</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back navigation button */}
        <div className="mt-8 pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-cute text-pink-600">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 hover:text-pink-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Secret Entry</span>
          </button>
          <span>Page 2 of 8</span>
        </div>
      </div>
    </div>
  );
};
