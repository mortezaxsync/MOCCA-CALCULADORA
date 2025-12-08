import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col justify-center py-6 sm:py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="pt-8 px-8">
                 <Logo />
            </div>
            {/* The calculator content now sits directly in this card */}
            <Calculator />
        </div>
        
        {/* Install Button - Only shows if browser supports installation */}
        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            INSTALAR APLICATIVO
          </button>
        )}

        <p className="text-center text-slate-400 text-xs mt-6 mb-4">
          &copy; {new Date().getFullYear()} Mocca Moinho Comercial
        </p>
      </div>
    </div>
  );
};

export default App;