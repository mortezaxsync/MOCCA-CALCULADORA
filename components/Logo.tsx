
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-6 select-none w-full">
      <div className="w-full max-w-[280px] mb-2 flex items-center justify-center relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 180"
          className="w-full h-auto drop-shadow-sm"
        >
          {/* 
             Logo trimmed:
             1. Solid Blue Block "M" in the center.
             2. Removed yellow wheat stalks.
          */}

          {/* --- M Shape (Block Style) --- */}
          {/* 
             Matches the reference: Vertical legs, flat top, sharp V in center.
             Color: Brand Blue
          */}
          <path
            fill="#3b4e8d"
            d="M85 145 V20 H120 L150 65 L180 20 H215 V145 H185 V70 L150 120 L115 70 V145 H85 Z"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="text-center transform -translate-y-2">
        <h1 className="text-5xl font-black text-[#3b4e8d] tracking-tight mb-1 font-inter">
          MOCCA
        </h1>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-stencil text-[#3b4e8d] tracking-widest leading-none">
            MOINHO COMERCIAL
          </h2>
          <h2 className="text-xl font-stencil text-[#3b4e8d] tracking-widest leading-none">
            DE CÉU AZUL
          </h2>
        </div>
      </div>
    </div>
  );
};
