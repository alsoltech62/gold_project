import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, ArrowRight } from 'lucide-react';

export default function BuyFlowPage() {
  const [metal, setMetal] = useState('gold');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Buy Metal</h1>
        <p className="text-white/40 text-sm font-medium">Choose your preferred investment method</p>
      </header>

      <div className="flex justify-center mt-6">
        <div className="bg-[#111] p-1.5 rounded-2xl flex items-center gap-1 border border-white/10">
          <button 
            onClick={() => setMetal('gold')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${metal === 'gold' ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Gold
          </button>
          <button 
            onClick={() => setMetal('silver')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${metal === 'silver' ? 'bg-gradient-to-r from-gray-300/20 to-gray-300/5 text-gray-300 shadow-lg shadow-gray-300/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Silver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Link to={metal === 'gold' ? "/buy/one-time" : "/silver"} className={`card-premium group transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden ${metal === 'gold' ? 'hover:border-[#D4AF37]/50' : 'hover:border-gray-400/50'}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-colors ${metal === 'gold' ? 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10' : 'bg-gray-400/5 group-hover:bg-gray-400/10'}`}></div>
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${metal === 'gold' ? 'bg-gradient-to-br from-[#D4AF37]/20 to-transparent text-[#D4AF37] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'bg-gradient-to-br from-gray-400/20 to-transparent text-gray-400 group-hover:shadow-[0_0_30px_rgba(156,163,175,0.3)]'}`}>
            <ShoppingCart size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Invest One Time</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Make a single purchase at the current market rate and add it directly to your vault.</p>
          </div>
          <div className={`mt-auto flex items-center gap-2 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all ${metal === 'gold' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
            Continue <ArrowRight size={16} />
          </div>
        </Link>

        <Link to={metal === 'gold' ? "/buy/sip" : "/silver/sip"} className={`card-premium group transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden ${metal === 'gold' ? 'hover:border-[#D4AF37]/50' : 'hover:border-gray-400/50'}`}>
          <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none transition-colors ${metal === 'gold' ? 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10' : 'bg-gray-400/5 group-hover:bg-gray-400/10'}`}></div>
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${metal === 'gold' ? 'bg-gradient-to-br from-[#D4AF37]/20 to-transparent text-[#D4AF37] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'bg-gradient-to-br from-gray-400/20 to-transparent text-gray-400 group-hover:shadow-[0_0_30px_rgba(156,163,175,0.3)]'}`}>
            <Calendar size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">SIP Investment</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Automate your investments with regular installments to average out the market price.</p>
          </div>
          <div className={`mt-auto flex items-center gap-2 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all ${metal === 'gold' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
            Setup SIP <ArrowRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
}
