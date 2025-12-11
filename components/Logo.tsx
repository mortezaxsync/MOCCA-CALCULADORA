import React, { useState } from 'react';

export const Logo: React.FC = () => {
  const [useImage, setUseImage] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center mb-6 select-none w-full">
      {/* 
         ÁREA DO ÍCONE / IMAGEM 
         Lógica: Tenta carregar "logo.png" (basta colocar este arquivo na pasta do app).
         Se falhar, mostra o SVG padrão.
      */}
      <div className="w-full max-w-[280px] mb-2 flex items-center justify-center relative h-40">
        {useImage ? (
          <img 
            src="logo.png" 
            alt="Logo Mocca"
            className="h-full w-auto object-contain drop-shadow-sm"
            onError={() => setUseImage(false)}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 180"
            className="w-full h-auto drop-shadow-sm"
          >
            {/* Logo Padrão (M Block Style) caso não tenha imagem */}
            <path
              fill="#3b4e8d"
              d="M85 145 V20 H120 L150 65 L180 20 H215 V145 H185 V70 L150 120 L115 70 V145 H85 Z"
            />
          </svg>
        )}
      </div>

      {/* Título e Subtítulo */}
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