import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, ArrowLeft, Check, Ticket, RotateCcw } from 'lucide-react';
import { CouponItem, ScrapbookData } from '../../types/scrapbook';
import { romanticAudio } from '../../utils/audioSynth';
import { fireHeartConfetti } from '../../utils/confetti';

interface Section4CouponsProps {
  data: ScrapbookData;
  onUpdateCoupons: (coupons: CouponItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Section4Coupons: React.FC<Section4CouponsProps> = ({
  data,
  onUpdateCoupons,
  onNext,
  onBack,
}) => {
  const [activeCelebration, setActiveCelebration] = useState<string | null>(null);

  const toggleRedeem = (couponId: string) => {
    const updated = data.coupons.map(c => {
      if (c.id === couponId) {
        const nextState = !c.redeemed;
        if (nextState) {
          romanticAudio.playSparkleChime();
          fireHeartConfetti();
          setActiveCelebration(c.title);
          setTimeout(() => setActiveCelebration(null), 3000);
        }
        return {
          ...c,
          redeemed: nextState,
          redeemedAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      }
      return c;
    });
    onUpdateCoupons(updated);
  };

  const redeemedCount = data.coupons.filter(c => c.redeemed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Decorative Washi Tape */}
      <div className="w-44 h-6 washi-tape-yellow rotate-2 rounded-xs mb-4 shadow-xs" />

      {/* Main Container Card */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100 relative">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            <Ticket className="w-3.5 h-3.5" /> No Expiration Date · 100% Guaranteed
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-romantic font-bold text-rose-950 flex items-center justify-center gap-2">
            LOVE COUPONS <Heart className="w-6 h-6 fill-rose-500 text-rose-500 inline-block animate-bounce" />
          </h2>
          <p className="text-sm sm:text-base font-handwriting text-pink-700 text-lg">
            Tap any coupon to claim it! Redeemable anytime by the birthday girl.
          </p>

          {/* Progress Tracker */}
          <div className="inline-flex items-center gap-2 text-xs font-cute text-pink-700 bg-pink-50/70 px-3 py-1 rounded-full border border-pink-200/50 mt-2">
            <span>Redeemed:</span>
            <span className="font-bold text-rose-600">{redeemedCount} of {data.coupons.length}</span>
            <span>coupons claimed!</span>
          </div>
        </div>

        {/* Celebration Floating Alert Banner */}
        {activeCelebration && (
          <div className="mb-6 p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl text-center shadow-lg animate-in zoom-in-95 duration-300">
            <p className="text-xs sm:text-sm font-cute font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Coupon Claimed: "{activeCelebration}"! Promise locked in my heart forever!</span>
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
        )}

        {/* Coupon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.coupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => toggleRedeem(coupon.id)}
              className={`group relative rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                coupon.redeemed
                  ? 'bg-rose-50/60 border-rose-300 shadow-xs'
                  : 'bg-white hover:bg-pink-50/40 border-pink-200 hover:border-pink-300 shadow-sm hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {/* Ticket Notch cutouts (left & right) */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#fdf6f7] rounded-full border border-pink-200" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#fdf6f7] rounded-full border border-pink-200" />

              {/* Perforation line */}
              <div className="border-b-2 border-dashed border-pink-200 my-2 -mx-5" />

              {/* Top part: Icon + Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl p-1 bg-pink-100/60 rounded-xl">
                    {coupon.icon}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/50">
                    PASS #{coupon.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-serif-romantic font-bold text-lg text-rose-950 mb-1">
                  {coupon.title}
                </h3>
                <p className="text-xs font-cute text-pink-800 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              {/* Bottom part: Redeem Status Button */}
              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between">
                <span className="text-[11px] font-cute text-pink-600">
                  {coupon.redeemed && coupon.redeemedAt ? `Claimed at ${coupon.redeemedAt}` : 'Tap to claim'}
                </span>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-cute font-bold transition-colors ${
                    coupon.redeemed
                      ? 'bg-rose-600 text-white'
                      : 'bg-pink-100 text-rose-800 group-hover:bg-rose-500 group-hover:text-white'
                  }`}
                >
                  {coupon.redeemed ? 'CLAIMED ❤️' : 'REDEEM'}
                </div>
              </div>

              {/* Stamp Overlay if Redeemed */}
              {coupon.redeemed && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="stamp-redeemed px-4 py-1.5 rounded-lg text-sm sm:text-base shadow-sm">
                    REDEEMED WITH LOVE! ❤️
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next & Back Section Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNext}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
          >
            <span>Step 5: Listen to Our Music 🎵</span>
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
            <span>Back to Letter</span>
          </button>
          <span>Page 4 of 8</span>
        </div>
      </div>
    </div>
  );
};
