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
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'red':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'green':
        return 'bg-green-100 text-green-900 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  return (
    <div className={`${getThemeClasses()} p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center text-center h-full transition-all duration-300 hover:shadow-md`}>
      <span className="text-sm font-medium opacity-80 mb-1">{label}</span>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {unit && <span className="text-xs font-semibold opacity-70">{unit}</span>}
      </div>
    </div>
  );
};