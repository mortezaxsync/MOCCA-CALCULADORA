import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getHistory, SavedExtraction, signInWithGoogle } from '../firebase';

interface HistoryViewProps {
  currentUser: User | null;
  onBack: () => void;
  onLoginSuccess: (user: User) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ currentUser, onBack, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SavedExtraction[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser]);

  const loadData = async (user: User) => {
    setLoading(true);
    const data = await getHistory(user);
    setHistory(data);
    setLoading(false);
  };

  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onLoginSuccess(user);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return "Data desconhecida";
    return timestamp.toDate().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="w-full px-5 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="mr-4 p-3 bg-white shadow-sm border border-slate-100 rounded-full text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#3b4e8d] uppercase tracking-wide">Histórico</h2>
      </div>

      {!currentUser ? (
        <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-200">
          <p className="text-slate-600 mb-6 font-medium">Faça login com sua conta Google para visualizar suas extrações salvas na nuvem.</p>
          <button
            onClick={handleLogin}
            className="bg-white text-slate-800 border border-slate-300 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mx-auto shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                <path fill="#EA4335" d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
           {loading ? (
             <div className="flex flex-col items-center py-12 text-slate-400">
               <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-3"></div>
               <span className="text-xs font-bold uppercase tracking-widest">Carregando dados...</span>
             </div>
           ) : history.length === 0 ? (
             <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p className="font-medium">Nenhuma extração salva.</p>
             </div>
           ) : (
             history.map((item) => {
               const flourKgH = item.flour * 360;
               const branKgH = item.bran * 360;

               return (
               <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md hover:scale-[1.01]">
                 {/* Lado Esquerdo: Info e Dados */}
                 <div className="flex flex-col gap-3">
                   {/* Data Badge */}
                   <div className="flex items-center gap-2">
                       <div className="bg-slate-100 p-1.5 rounded-lg text-slate-400">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                       </div>
                       <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                         {formatDate(item.date)}
                       </p>
                   </div>
                   
                   <div className="flex flex-col gap-1.5 pl-1">
                      <div className="flex items-baseline gap-2 text-sm text-slate-700">
                         <span className="w-2 h-2 rounded-full bg-blue-500 relative top-[-1px]"></span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase w-14">Farinha</span>
                         <span className="font-bold text-slate-700 font-mono text-base">{Math.round(flourKgH).toLocaleString('pt-BR')} <span className="text-xs text-slate-400 font-sans">kg/h</span></span>
                      </div>
                      
                      <div className="flex items-baseline gap-2 text-sm text-slate-700">
                         <span className="w-2 h-2 rounded-full bg-red-400 relative top-[-1px]"></span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase w-14">Farelo</span>
                         <span className="font-bold text-slate-700 font-mono text-base">{Math.round(branKgH).toLocaleString('pt-BR')} <span className="text-xs text-slate-400 font-sans">kg/h</span></span>
                      </div>
                   </div>
                 </div>
                 
                 {/* Lado Direito: Rendimento (Modernizado) */}
                 <div className="flex flex-col items-end justify-center pl-6 border-l border-slate-100 ml-2">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                          {item.yieldPercentage.toFixed(1)}
                        </span>
                        <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>
                    </div>
                    {/* Badge Verde solicitado */}
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold uppercase tracking-widest mt-1.5 shadow-sm">
                      Rendimento
                    </span>
                 </div>
               </div>
             )})
           )}
        </div>
      )}
    </div>
  );
};