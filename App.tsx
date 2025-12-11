import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Calculator } from './components/Calculator';
import { HistoryView } from './components/HistoryView';
import { SplashScreen } from './components/SplashScreen';
import { auth } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

type ViewState = 'calculator' | 'history';

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('calculator');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Timer para a Tela de Abertura (2.5 segundos)
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

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
      clearTimeout(splashTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      unsubscribe();
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBtn(false);
    }
  };

  // Se estiver mostrando o Splash, renderiza apenas ele
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-start pt-4 pb-4 px-4 sm:justify-center animate-fadeIn">
      
      <div className="w-full max-w-md mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[85vh] flex flex-col">
            
            {/* Top Bar - Apenas botão de Instalar (se disponível) */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
               {/* Install Button (Small icon version) */}
               {showInstallBtn && (
                 <button
                    onClick={handleInstallClick}
                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg animate-bounce"
                    aria-label="Instalar App"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                 </button>
               )}
            </div>

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
        
        {/* Install Banner - Bottom Floating if not installed */}
        {showInstallBtn && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between md:hidden animate-fadeIn">
            <div className="flex items-center gap-3">
               <div className="bg-[#3b4e8d] p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
               </div>
               <div className="text-sm">
                  <p className="font-bold text-slate-800">Instalar Mocca App</p>
                  <p className="text-xs text-slate-500">Adicione à sua tela inicial</p>
               </div>
            </div>
            <button
                onClick={handleInstallClick}
                className="bg-[#3b4e8d] text-white text-sm font-bold py-2 px-4 rounded-lg"
            >
                INSTALAR
            </button>
          </div>
        )}

        <p className="text-center text-slate-400 text-xs mt-6 mb-safe pb-2">
          &copy; {new Date().getFullYear()} Mocca Moinho Comercial
        </p>
      </div>
    </div>
  );
};

export default App;