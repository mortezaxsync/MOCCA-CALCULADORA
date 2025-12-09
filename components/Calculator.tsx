import React, { useState, useRef, useEffect } from 'react';
import { ResultCard } from './ResultCard';
import { CalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Calculator: React.FC = () => {
  const [flourSample, setFlourSample] = useState<string>('');
  const [branSample, setBranSample] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
      if (!str) return 0; // Treat empty as 0 to allow optional inputs if needed, though validation checks below.
      // Remove thousand separators (.) and replace decimal separator (,) with dot (.)
      const cleanStr = str.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleanStr);
    };

    const flour = parseFormattedNumber(flourSample);
    const bran = parseFormattedNumber(branSample);

    // Basic validation: Ensure at least one value is provided to calculate total
    if (flour < 0 || bran < 0) {
      alert("Os valores não podem ser negativos.");
      return;
    }

    // Formulas
    // hourly_production = sample * 6 * 60
    const flourPerHour = flour * 6 * 60;
    const branPerHour = bran * 6 * 60;
    
    // total_hora = sum of all components
    const totalPerHour = flourPerHour + branPerHour;
    
    // Yield Percentages
    // Avoid division by zero
    const yieldPercentage = totalPerHour > 0 ? (flourPerHour / totalPerHour) * 100 : 0;

    setResults({
      flourPerHour,
      branPerHour,
      totalPerHour,
      yieldPercentage
    });

    // Scroll to results after a short delay to allow rendering
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  };

  const chartData = results ? [
    { name: 'Farinha', value: results.flourPerHour },
    { name: 'Farelo', value: results.branPerHour },
  ] : [];

  const COLORS = ['#2563EB', '#F87171']; // Blue (Farinha), Red (Farelo)

  return (
    <div className="w-full px-6 pb-8">
        
        {/* Input Section */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div>
            <label htmlFor="flourInput" className="block text-slate-600 font-bold mb-2 ml-1 text-sm uppercase tracking-wide">
              Amostra de Farinha (kg)
            </label>
            <input
              id="flourInput"
              type="text"
              inputMode="numeric"
              placeholder="0,00"
              value={flourSample}
              onChange={(e) => handleInputChange(e, setFlourSample)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-2xl font-semibold rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-4 shadow-sm transition-all outline-none text-center"
            />
          </div>

          <div>
            <label htmlFor="branInput" className="block text-slate-600 font-bold mb-2 ml-1 text-sm uppercase tracking-wide">
              Amostra de Farelo (kg)
            </label>
            <input
              id="branInput"
              type="text"
              inputMode="numeric"
              placeholder="0,00"
              value={branSample}
              onChange={(e) => handleInputChange(e, setBranSample)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-2xl font-semibold rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-4 shadow-sm transition-all outline-none text-center"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full text-white bg-[#3b4e8d] hover:bg-[#2d3b6b] focus:ring-4 focus:ring-blue-300 font-black rounded-xl text-lg px-5 py-5 text-center transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest mt-2 active:scale-[0.98]"
          >
            Calcular Rendimento
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div ref={resultsRef} className="mt-10 animate-fadeIn space-y-8 scroll-mt-6">
            
            <div className="flex items-center justify-center relative">
               <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-300"></div>
               </div>
               <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-slate-500 font-bold uppercase tracking-widest">Relatório de Produção</span>
               </div>
            </div>

            {/* Row 1: Products */}
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="Farinha / Hora"
                value={`${formatNumber(results.flourPerHour)}`}
                unit="kg/h"
                colorTheme="blue"
              />
              <ResultCard
                label="Farelo / Hora"
                value={`${formatNumber(results.branPerHour)}`}
                unit="kg/h"
                colorTheme="red"
              />
            </div>
            
            {/* Row 2: Total & Yield */}
            <div className="grid grid-cols-2 gap-4">
               <ResultCard
                label="Total Processado"
                value={`${formatNumber(results.totalPerHour)}`}
                unit="kg/h"
                colorTheme="green"
              />
              <ResultCard
                label="Rendimento Final"
                value={`${results.yieldPercentage.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`}
                unit=""
                colorTheme="yellow"
              />
            </div>

            {/* Visual Chart - Donut with Center Text */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center relative overflow-hidden">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gráfico de Rendimento</h3>
               
               <div className="relative h-72 w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={chartData}
                       cx="50%"
                       cy="50%"
                       innerRadius={85}
                       outerRadius={115}
                       paddingAngle={0}
                       dataKey="value"
                       startAngle={90}
                       endAngle={-270}
                       stroke="none"
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       formatter={(value: number) => [`${formatNumber(value)} kg/h`, 'Produção']}
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                       itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                     />
                   </PieChart>
                 </ResponsiveContainer>

                 {/* Center Content Overlay */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Farinha</span>
                    <span className="text-5xl font-black text-[#3b4e8d] tracking-tighter">
                      {results.yieldPercentage.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      <span className="text-2xl align-top">%</span>
                    </span>
                    <span className="text-xs font-medium text-slate-400 mt-2 bg-slate-100 px-2 py-1 rounded-md">
                      Rendimento Real
                    </span>
                 </div>
               </div>

               {/* Legend */}
               <div className="flex w-full justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                    <span className="text-sm font-semibold text-slate-600">Farinha</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F87171]"></div>
                    <span className="text-sm font-semibold text-slate-600">Farelo</span>
                  </div>
               </div>
            </div>

          </div>
        )}
    </div>
  );
};