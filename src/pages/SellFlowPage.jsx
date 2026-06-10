import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, ArrowRight, Lock } from 'lucide-react';

export default function SellFlowPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Sell Gold</h1>
        <p className="text-white/40 text-sm font-medium">Choose how you want to liquidate your assets</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Link to="/lock-in" className="card-premium group hover:border-[#D4AF37]/50 transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden border-[#D4AF37]/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          
          <div className="absolute -top-3 right-8 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Recommended
          </div>

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Get up to 12% Extra</h2>
            <p className="text-[#D4AF37] font-bold mb-4">Lock your gold for a period</p>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Instead of selling now, lock your gold in our vault for 6-36 months and earn up to 12% guaranteed extra returns.</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-[#D4AF37] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all bg-[#D4AF37]/10 px-6 py-3 rounded-xl">
            Explore Lock-In Plans <ArrowRight size={16} />
          </div>
        </Link>

        <Link to="/sell/now" className="card-premium group hover:border-red-500/50 transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/20 to-transparent flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-500">
            <Wallet size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Sell Anyway</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Liquidate your gold immediately at the current market rate. Funds will be transferred to your wallet instantly.</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            Continue to Sell <ArrowRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
}
