import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logoW from '../../assets/logo-w.png';

export default function PublicLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#BF953F]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>
      
      <header className="h-20 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-8 z-30 sticky top-0">
        <button 
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2 text-white/50 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Home</span>
        </button>
        <div className="ml-auto">
          <img src={logoW} alt="Logo" className="h-8 object-contain" />
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
}
