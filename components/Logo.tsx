import React from 'react';

export const Logo: React.FC = () => {
  // Grain shape path (pointed tear-drop)
  const grainPath = "M0 0 Q 4 8 0 16 Q -4 8 0 0";

  return (
    <div className="flex flex-col items-center justify-center mb-6 select-none w-full">
      {/* Icon Container */}
      <div className="w-64 h-48 relative mb-2">
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          
          {/* Left Wheat Stalk */}
          <g transform="translate(55, 30) scale(0.9)">
             {/* Main Stem */}
             <path d="M40 140 Q 55 90 25 10" stroke="#dfa936" strokeWidth="3" fill="none" strokeLinecap="round" />
             
             {/* Left side grains */}
             <g transform="translate(25, 15) rotate(-30)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(32, 35) rotate(-25)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(38, 55) rotate(-20)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(42, 75) rotate(-15)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(44, 95) rotate(-10)"><path d={grainPath} fill="#dfa936" /></g>
             
             {/* Right side grains */}
             <g transform="translate(35, 20) rotate(20)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(42, 40) rotate(15)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(48, 60) rotate(10)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(52, 80) rotate(5)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(52, 100) rotate(0)"><path d={grainPath} fill="#dfa936" /></g>
          </g>

          {/* Right Wheat Stalk (Mirrored) */}
          <g transform="translate(245, 30) scale(-0.9, 0.9)">
             {/* Main Stem */}
             <path d="M40 140 Q 55 90 25 10" stroke="#dfa936" strokeWidth="3" fill="none" strokeLinecap="round" />
             
             {/* Left side grains (relative to flipped coord) */}
             <g transform="translate(25, 15) rotate(-30)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(32, 35) rotate(-25)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(38, 55) rotate(-20)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(42, 75) rotate(-15)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(44, 95) rotate(-10)"><path d={grainPath} fill="#dfa936" /></g>
             
             {/* Right side grains */}
             <g transform="translate(35, 20) rotate(20)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(42, 40) rotate(15)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(48, 60) rotate(10)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(52, 80) rotate(5)"><path d={grainPath} fill="#dfa936" /></g>
             <g transform="translate(52, 100) rotate(0)"><path d={grainPath} fill="#dfa936" /></g>
          </g>

          {/* Center M (Geometric Block) */}
          {/* Defined manually to match the V cut in the reference */}
          <path 
            d="M95 140 L95 20 L125 20 L150 65 L175 20 L205 20 L205 140 L175 140 L175 80 L150 120 L125 80 L125 140 Z" 
            fill="#2c6cb0" 
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="text-center flex flex-col items-center w-full transform -translate-y-4">
        <h1 className="text-6xl font-black text-[#2c6cb0] tracking-tight leading-none mb-2 font-inter">
          MOCCA
        </h1>
        
        <div className="flex flex-col items-center w-full space-y-1">
          <h2 className="text-xl sm:text-2xl font-stencil text-[#2c6cb0] tracking-widest leading-none whitespace-nowrap">
            MOINHO COMERCIAL
          </h2>
          <h2 className="text-xl sm:text-2xl font-stencil text-[#2c6cb0] tracking-widest leading-none whitespace-nowrap">
            DE CÉU AZUL
          </h2>
        </div>
      </div>
    </div>
  );
};
