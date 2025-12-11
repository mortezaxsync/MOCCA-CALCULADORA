import React from 'react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-200 flex flex-col items-center justify-center h-screen w-screen transition-opacity duration-700">
      <div className="scale-125 transform transition-all duration-1000 animate-fadeIn">
        <Logo />
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
         <div className="w-8 h-8 border-4 border-[#3b4e8d] border-t-transparent rounded-full animate-spin"></div>
         <p className="text-[#3b4e8d] text-xs font-bold tracking-[0.2em] uppercase opacity-60 animate-pulse">
           Carregando
         </p>
      </div>
    </div>
  );
};