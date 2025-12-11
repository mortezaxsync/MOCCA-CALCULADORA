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
    <div className="w-full px-6 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-black text-[#3b4e8d] uppercase tracking-wide">Histórico</h2>
      </div>

      {!currentUser ? (
        <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200">
          <p className="text-slate-600 mb-6">Faça login com sua conta Google para visualizar suas extrações salvas na nuvem.</p>
          <button
            onClick={handleLogin}
            className="bg-white text-slate-800 border border-slate-300 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mx-auto shadow-sm hover:bg-gray-50 transition-colors"
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
             <div className="text-center py-10 text-slate-400">Carregando dados...</div>
           ) : history.length === 0 ? (
             <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
               Nenhuma extração salva encontrada.
             </div>
           ) : (
             history.map((item) => {
               // Cálculo de Produção Hora (Sample * 6 * 60 = 360)
               // Assume que o valor salvo é a amostra em kg
               const flourKgH = item.flour * 360;
               const branKgH = item.bran * 360;

               return (
               <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition-transform hover:scale-[1.01]">
                 <div className="flex flex-col gap-2">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                     {formatDate(item.date)}
                   </p>
                   
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                         <span className="text-xs font-semibold text-slate-500 uppercase w-14">Farinha</span>
                         <span className="font-bold text-slate-800">{Math.round(flourKgH).toLocaleString('pt-BR')} kg/h</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                         <span className="text-xs font-semibold text-slate-500 uppercase w-14">Farelo</span>
                         <span className="font-bold text-slate-800">{Math.round(branKgH).toLocaleString('pt-BR')} kg/h</span>
                      </div>
                   </div>
                 </div>
                 
                 <div className="flex flex-col items-end pl-4 border-l border-slate-100 ml-2 min-w-[80px]">
                    <span className="text-xl font-black text-[#3b4e8d]">
                      {item.yieldPercentage.toFixed(1)}%
                    </span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase text-center mt-1">
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
