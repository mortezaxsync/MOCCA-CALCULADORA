import React, { useState, useRef } from 'react';
import { ResultCard } from './ResultCard';
import { CalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { User } from 'firebase/auth';
import { saveExtraction, signInWithGoogle } from '../firebase';

interface CalculatorProps {
  onShowHistory: () => void;
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onShowHistory, currentUser, onLoginSuccess }) => {
  const [flourSample, setFlourSample] = useState<string>('');
  const [branSample, setBranSample] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Format the input value as if dividing by 100 (e.g., 123 -> 1,23)
  const formatValue = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const numberValue = Number(digits) / 100;
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
    const parseFormattedNumber = (str: string) => {
      if (!str) return 0;
      const cleanStr = str.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleanStr);
    };

    const flour = parseFormattedNumber(flourSample);
    const bran = parseFormattedNumber(branSample);

    if (flour < 0 || bran < 0) {
      alert("Os valores não podem ser negativos.");
      return;
    }

    if (flour === 0 && bran === 0) {
       return;
    }

    const flourPerHour = flour * 6 * 60;
    const branPerHour = bran * 6 * 60;
    const totalPerHour = flourPerHour + branPerHour;
    const yieldPercentage = totalPerHour > 0 ? (flourPerHour / totalPerHour) * 100 : 0;

    setResults({
      flourPerHour,
      branPerHour,
      totalPerHour,
      yieldPercentage
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSave = async () => {
    if (!results) return;

    let user = currentUser;

    // Se não estiver logado, tenta logar diretamente
    if (!user) {
      user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
      } else {
        return; // Login falhou ou cancelado
      }
    }

    setIsSaving(true);
    const parseFormattedNumber = (str: string) => {
        if (!str) return 0;
        const cleanStr = str.replace(/\./g, '').replace(',', '.');
        return parseFloat(cleanStr);
    };
    
    // Salvar os dados brutos da amostra
    const rawFlour = parseFormattedNumber(flourSample);
    const rawBran = parseFormattedNumber(branSample);

    const success = await saveExtraction(user, {
      flour: rawFlour,
      bran: rawBran,
      yieldPercentage: results.yieldPercentage
    });

    setIsSaving(false);

    if (success) {
      alert("Extração salva na nuvem com sucesso!");
    } else {
      // Se falhar (ex: falta de configuração no código), mostra msg genérica
      alert("Erro ao salvar. Verifique a conexão.");
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  };

  const chartData = results ? [
    { name: 'Farinha', value: results.flourPerHour },
    { name: 'Farelo', value: results.branPerHour },
  ] : [];

  const COLORS = ['#2563EB', '#F87171'];

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

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleCalculate}
              className="w-full text-white bg-[#3b4e8d] hover:bg-[#2d3b6b] focus:ring-4 focus:ring-blue-300 font-black rounded-xl text-lg px-5 py-4 text-center transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest active:scale-[0.98]"
            >
              Calcular Rendimento
            </button>
            
            <button
              onClick={onShowHistory}
              className="w-full text-slate-600 bg-slate-200 hover:bg-slate-300 font-bold rounded-xl text-sm px-5 py-3 text-center transition-all uppercase tracking-wider active:scale-[0.98]"
            >
              Extrações Anteriores
            </button>
          </div>
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

            {/* Cards Grid */}
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

            {/* Visual Chart */}
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

               {/* Botão de Guardar na Nuvem */}
               <div className="w-full mt-6 border-t border-slate-100 pt-6">
                 <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70"
                 >
                   {isSaving ? (
                     <span>Salvando...</span>
                   ) : (
                     <>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                       </svg>
                       GUARDAR EXTRAÇÃO
                     </>
                   )}
                 </button>
                 <p className="text-center text-[10px] text-slate-400 mt-2">
                   Salva no histórico da sua Conta Google
                 </p>
               </div>
            </div>

          </div>
        )}
    </div>
  );
};