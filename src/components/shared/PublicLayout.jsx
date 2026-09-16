import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logoW from '../../assets/GoldBarPay.png';

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

      <footer className="border-t border-white/5 bg-[#050508]/80 backdrop-blur-md px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        <p className="text-xs text-white/40">© 2026 GoldBarPay. All Rights Reserved.</p>
        <a
          href="https://play.google.com/store/apps/details?id=com.japsan.goldbarpay"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black border border-white/15 hover:border-[#D4AF37] transition-all text-left group"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 512 512">
            <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
            <path fill="#34A853" d="M47 38.6c-4.4 9.1-7 19.5-7 30.7v373.4c0 11.2 2.6 21.6 7 30.7l217.1-217.4L47 38.6z" />
            <path fill="#FBBC04" d="M385.4 337.8L104.6 499l220.7-221.3 60.1 60.1z" />
            <path fill="#EA4335" d="M488.5 241.7L385.4 182.2l-60.1 52.1 60.1 52.1 103.1-59.5c9.2-5.3 14.9-15.1 14.9-25.6s-5.7-20.3-14.9-25.6z" />
          </svg>
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-white/40 font-bold leading-none">GET IT ON</span>
            <span className="block text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">Google Play</span>
          </div>
        </a>
      </footer>
    </div>
  );
}
