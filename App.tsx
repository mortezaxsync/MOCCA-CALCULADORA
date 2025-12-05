import React from 'react';
import { Logo } from './components/Logo';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col justify-center py-6 sm:py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="pt-8 px-8">
                 <Logo />
            </div>
            {/* The calculator content now sits directly in this card */}
            <Calculator />
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} Mocca Moinho Comercial
        </p>
      </div>
    </div>
  );
};

export default App;
