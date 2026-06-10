import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, ArrowRight } from 'lucide-react';

export default function BuyFlowPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Buy Gold</h1>
        <p className="text-white/40 text-sm font-medium">Choose your preferred investment method</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Link to="/buy/one-time" className="card-premium group hover:border-[#D4AF37]/50 transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors"></div>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Invest One Time</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Make a single purchase at the current market rate and add it directly to your vault.</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-[#D4AF37] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            Continue <ArrowRight size={16} />
          </div>
        </Link>

        <Link to="/buy/sip" className="card-premium group hover:border-green-500/50 transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none group-hover:bg-green-500/10 transition-colors"></div>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500/20 to-transparent flex items-center justify-center text-green-400 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-500">
            <Calendar size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">SIP Investment</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Automate your investments with regular installments to average out the market price.</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            Setup SIP <ArrowRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
}
