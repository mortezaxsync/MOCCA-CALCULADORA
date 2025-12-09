import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Calculator } from './components/Calculator';
import { HistoryView } from './components/HistoryView';
import { auth } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

type ViewState = 'calculator' | 'history';

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('calculator');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // PWA Install Prompt Logic
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      unsubscribe();
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    // Removido py-6 sm:py-12 para usar melhor a tela do celular
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-start pt-4 pb-4 px-4 sm:justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[85vh] flex flex-col">
            <div className="pt-8 px-8 shrink-0">
                 <Logo />
            </div>
            
            <div className="flex-grow">
              {currentView === 'calculator' ? (
                <Calculator 
                  onShowHistory={() => setCurrentView('history')} 
                  currentUser={currentUser}
                  onLoginSuccess={(user) => setCurrentUser(user)}
                />
              ) : (
                <HistoryView 
                  currentUser={currentUser}
                  onBack={() => setCurrentView('calculator')}
                  onLoginSuccess={(user) => setCurrentUser(user)}
                />
              )}
            </div>
        </div>
        
        {/* Install Button - Only shows if browser supports installation */}
        {showInstallBtn && currentView === 'calculator' && (
          <button
            onClick={handleInstallClick}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 mb-safe"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            INSTALAR APLICATIVO
          </button>
        )}

        <p className="text-center text-slate-400 text-xs mt-6 mb-safe pb-2">
          &copy; {new Date().getFullYear()} Mocca Moinho Comercial
        </p>
      </div>
    </div>
  );
};

export default App;