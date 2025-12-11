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
    <div className="w-full px-4 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center mb-8 pt-2">
        <button 
          onClick={onBack}
          className="mr-4 p-3 bg-white shadow-md shadow-slate-200/50 border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
           <h2 className="text-3xl font-black text-[#3b4e8d] uppercase tracking-tighter">Histórico</h2>
           <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Suas Produções</p>
        </div>
      </div>

      {!currentUser ? (
        <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-200 shadow-sm">
          <div className="bg-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <p className="text-slate-600 mb-6 font-medium px-4">Faça login para acessar suas extrações salvas na nuvem.</p>
          <button
            onClick={handleLogin}
            className="bg-white text-slate-800 border border-slate-300 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 mx-auto shadow-sm hover:bg-gray-50 transition-colors w-full"
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
        <div className="space-y-6">
           {loading ? (
             <div className="flex flex-col items-center py-20 text-slate-400">
               <div className="w-10 h-10 border-4 border-slate-200 border-t-[#3b4e8d] rounded-full animate-spin mb-4"></div>
               <span className="text-xs font-bold uppercase tracking-widest">Carregando dados...</span>
             </div>
           ) : history.length === 0 ? (
             <div className="text-center py-16 text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p className="font-bold text-lg text-slate-500">Nenhum registro.</p>
               <p className="text-sm">Faça um cálculo e salve para ver aqui.</p>
             </div>
           ) : (
             history.map((item) => {
               const flourKgH = item.flour * 360;
               const branKgH = item.bran * 360;

               return (
               <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                 
                 {/* Top Row: Date & Yield Badge */}
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          {formatDate(item.date)}
                        </span>
                    </div>

                    <div className="text-right">
                        <div className="flex items-baseline justify-end">
                            <span className="text-4xl font-black text-emerald-500 tracking-tighter leading-none filter drop-shadow-sm">
                                {item.yieldPercentage.toFixed(1)}
                            </span>
                            <span className="text-lg font-bold text-emerald-400 ml-0.5">%</span>
                        </div>
                        <div className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mt-1">
                            Rendimento
                        </div>
                    </div>
                 </div>

                 {/* Divider Line */}
                 <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6 opacity-60"></div>
                 
                 {/* Data Cards Row */}
                 <div className="grid grid-cols-2 gap-4">
                    
                    {/* Farinha Block */}
                    <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100/50 relative group">
                        <div className="absolute left-0 top-6 w-1.5 h-12 bg-blue-500 rounded-r-full"></div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1 pl-3">
                            Farinha
                        </p>
                        <div className="pl-2">
                             <span className="text-3xl font-black text-slate-800 tracking-tighter block leading-none">
                                {Math.round(flourKgH).toLocaleString('pt-BR')}
                             </span>
                             <span className="text-xs font-bold text-slate-400 mt-1 block">kg/h</span>
                        </div>
                    </div>

                    {/* Farelo Block */}
                    <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100/50 relative">
                        <div className="absolute left-0 top-6 w-1.5 h-12 bg-red-400 rounded-r-full"></div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1 pl-3">
                            Farelo
                        </p>
                        <div className="pl-2">
                             <span className="text-3xl font-black text-slate-800 tracking-tighter block leading-none">
                                {Math.round(branKgH).toLocaleString('pt-BR')}
                             </span>
                             <span className="text-xs font-bold text-slate-400 mt-1 block">kg/h</span>
                        </div>
                    </div>

                 </div>
               </div>
             )})
           )}
        </div>
      )}
    </div>
  );
};