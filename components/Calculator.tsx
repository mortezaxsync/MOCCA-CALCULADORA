import React, { useState } from 'react';
import { ResultCard } from './ResultCard';
import { CalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Calculator: React.FC = () => {
  const [flourSample, setFlourSample] = useState<string>('');
  const [branSample, setBranSample] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);

  // Format the input value as if dividing by 100 (e.g., 123 -> 1,23)
  const formatValue = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    if (!digits) return '';

    // Convert to number and divide by 100 to get 2 decimal places
    const numberValue = Number(digits) / 100;
    
    // Format to PT-BR string (uses comma for decimals)
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const formatted = formatValue(e.target.value);
    setter(formatted);
  };

  const handleCalculate = () => {
    // Helper to parse the formatted string (e.g. "1.234,56" -> 1234.56)
    const parseFormattedNumber = (str: string) => {
      if (!str) return NaN;
      // Remove thousand separators (.) and replace decimal separator (,) with dot (.)
      const cleanStr = str.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleanStr);
    };

    const flour = parseFormattedNumber(flourSample);
    const bran = parseFormattedNumber(branSample);

    if (isNaN(flour) || isNaN(bran)) {
      alert("Por favor, insira valores numéricos válidos.");
      return;
    }

    if (flour < 0 || bran < 0) {
      alert("Os valores não podem ser negativos.");
      return;
    }

    // Formulas provided in the requirements
    // farinha_hora = farinha_amostra * 6 * 60
    const flourPerHour = flour * 6 * 60;
    
    // farelo_hora = farelo_amostra * 6 * 60
    const branPerHour = bran * 6 * 60;
    
    // total_hora = farinha_hora + farelo_hora
    const totalPerHour = flourPerHour + branPerHour;
    
    // rendimento = (farinha_hora / total_hora) * 100
    // Avoid division by zero
    const yieldPercentage = totalPerHour > 0 ? (flourPerHour / totalPerHour) * 100 : 0;

    setResults({
      flourPerHour,
      branPerHour,
      totalPerHour,
      yieldPercentage
    });
  };

  const formatNumber = (num: number, maximumSignificantDigits = 4) => {
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  };

  const chartData = results ? [
    { name: 'Farinha', value: results.flourPerHour },
    { name: 'Farelo', value: results.branPerHour },
  ] : [];

  const COLORS = ['#2563EB', '#F87171']; // Blue and Red to match cards

  return (
    <div className="w-full px-8 pb-8">
        
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="flourInput" className="block text-gray-700 font-semibold mb-2 ml-1">
              Peso da amostra de Farinha (kg)
            </label>
            <input
              id="flourInput"
              type="text"
              inputMode="numeric"
              placeholder="0,00"
              value={flourSample}
              onChange={(e) => handleInputChange(e, setFlourSample)}
              className="w-full bg-slate-50 border border-slate-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 shadow-sm transition-all outline-none"
            />
          </div>

          <div>
            <label htmlFor="branInput" className="block text-gray-700 font-semibold mb-2 ml-1">
              Peso da amostra de Farelo (kg)
            </label>
            <input
              id="branInput"
              type="text"
              inputMode="numeric"
              placeholder="0,00"
              value={branSample}
              onChange={(e) => handleInputChange(e, setBranSample)}
              className="w-full bg-slate-50 border border-slate-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 shadow-sm transition-all outline-none"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-lg px-5 py-4 text-center transition-colors shadow-lg shadow-blue-700/30 uppercase tracking-wide"
          >
            Calcular
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-8 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Farinha por hora"
                value={`${formatNumber(results.flourPerHour)}`}
                unit="kg/h"
                colorTheme="blue"
              />
              <ResultCard
                label="Farelo por hora"
                value={`${formatNumber(results.branPerHour)}`}
                unit="kg/h"
                colorTheme="red"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <ResultCard
                label="Total por hora"
                value={`${formatNumber(results.totalPerHour)}`}
                unit="kg/h"
                colorTheme="green"
              />
              <ResultCard
                label="Rendimento Farinha"
                value={`${results.yieldPercentage.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`}
                unit=""
                colorTheme="yellow"
              />
            </div>

            {/* Visual Chart */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center">
               <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Distribuição</h3>
               <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={chartData}
                       cx="50%"
                       cy="50%"
                       innerRadius={40}
                       outerRadius={60}
                       fill="#8884d8"
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       formatter={(value: number) => [`${formatNumber(value)} kg/h`, 'Produção']}
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}
    </div>
  );
};
