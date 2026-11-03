import React from 'react';

export const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft floating pastel hearts */}
      <span className="absolute top-[8%] left-[5%] text-pink-300/60 text-2xl animate-float select-none">
        💖
      </span>
      <span className="absolute top-[22%] right-[8%] text-pink-300/50 text-xl animate-float select-none [animation-delay:1.5s]">
        ✨
      </span>
      <span className="absolute top-[45%] left-[3%] text-sky-300/60 text-xl animate-float select-none [animation-delay:0.8s]">
        🌸
      </span>
      <span className="absolute top-[68%] right-[4%] text-pink-300/60 text-2xl animate-float select-none [animation-delay:2.2s]">
        💕
      </span>
      <span className="absolute top-[82%] left-[7%] text-amber-200/60 text-xl animate-float select-none [animation-delay:3s]">
        ⭐
      </span>
      <span className="absolute top-[14%] left-[48%] text-pink-200/50 text-lg animate-float select-none [animation-delay:2.6s]">
        🎀
      </span>
      <span className="absolute top-[90%] right-[15%] text-sky-300/50 text-xl animate-float select-none [animation-delay:1.1s]">
        ☁️
      </span>

      {/* Floating balloons subtle corner accents */}
      <div className="hidden lg:block absolute -top-8 -right-8 w-44 h-44 rounded-full bg-pink-100/40 blur-2xl" />
      <div className="hidden lg:block absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-sky-100/40 blur-2xl" />
    </div>
  );
};
