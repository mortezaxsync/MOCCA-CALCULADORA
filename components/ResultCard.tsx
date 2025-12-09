import React from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  unit: string;
  colorTheme: 'blue' | 'red' | 'green' | 'yellow';
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, colorTheme }) => {
  const getThemeClasses = () => {
    switch (colorTheme) {
      case 'blue':
        // Azul forte para Farinha
        return 'bg-blue-50 text-blue-900 border-blue-200 ring-1 ring-blue-100';
      case 'red':
        // Vermelho/Salmão para Farelo
        return 'bg-red-50 text-red-900 border-red-200 ring-1 ring-red-100';
      case 'green':
        // Verde para Total
        return 'bg-emerald-50 text-emerald-900 border-emerald-200 ring-1 ring-emerald-100';
      case 'yellow':
        // Amarelo/Dourado para Rendimento
        return 'bg-amber-50 text-amber-900 border-amber-200 ring-1 ring-amber-100';
      default:
        return 'bg-gray-50 text-gray-900 border-gray-200';
    }
  };

  return (
    <div className={`${getThemeClasses()} p-4 rounded-2xl shadow-sm border flex flex-col items-center justify-center text-center h-28 transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
      <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-black tracking-tight leading-none">{value}</span>
        {unit && <span className="text-[10px] font-bold opacity-60 mt-1">{unit}</span>}
      </div>
    </div>
  );
};