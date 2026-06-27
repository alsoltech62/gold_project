import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Wallet, ArrowRight, Lock } from 'lucide-react';

export default function SellFlowPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMetal = params.get('metal') === 'silver' ? 'silver' : 'gold';

  const [metalType, setMetalType] = useState(initialMetal);

  useEffect(() => {
    if (params.get('metal') === 'silver') {
      setMetalType('silver');
    } else if (params.get('metal') === 'gold') {
      setMetalType('gold');
    }
  }, [location.search]);

  const isGold = metalType === 'gold';
  const themeColor = isGold ? '#D4AF37' : '#9CA3AF';
  const themeColorText = isGold ? 'text-[#D4AF37]' : 'text-gray-300';
  const themeBorder = isGold ? 'border-[#D4AF37]/20' : 'border-gray-400/20';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Sell {isGold ? 'Gold' : 'Silver'}</h1>
        <p className="text-white/40 text-sm font-medium">Choose how you want to liquidate your assets</p>
      </header>

      <div className="flex justify-center gap-4 p-1 bg-white/5 rounded-xl border border-white/5 w-fit mx-auto">
        <button 
          onClick={() => setMetalType('gold')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${isGold ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-white/40 hover:text-white'}`}
        >
          Sell Gold
        </button>
        <button 
          onClick={() => setMetalType('silver')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${!isGold ? 'bg-gray-300 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Sell Silver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Link to={`/lock-in?metal=${metalType}`} className={`card-premium group hover:border-white/50 transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden ${themeBorder}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-colors ${isGold ? 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10' : 'bg-gray-400/5 group-hover:bg-gray-400/10'}`}></div>
          
          <div className={`absolute -top-3 right-8 bg-gradient-to-r text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isGold ? 'from-[#BF953F] to-[#FCF6BA]' : 'from-gray-300 to-white'}`}>
            Recommended
          </div>

          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center ${themeColorText} group-hover:scale-110 transition-all duration-500`}>
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Get up to 12% Extra</h2>
            <p className={`${themeColorText} font-bold mb-4`}>Lock your {metalType} for a period</p>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Instead of selling now, lock your {metalType} in our vault for 6-36 months and earn up to 12% guaranteed extra returns.</p>
          </div>
          <div className={`mt-auto flex items-center gap-2 ${themeColorText} font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all bg-white/5 px-6 py-3 rounded-xl`}>
            Explore Lock-In Plans <ArrowRight size={16} />
          </div>
        </Link>

        <Link to={isGold ? "/sell/now" : "/sell/silver/now"} className="card-premium group hover:border-red-500/50 transition-all p-8 flex flex-col items-center gap-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/20 to-transparent flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-500">
            <Wallet size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Sell Anyway</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Liquidate your {metalType} immediately at the current market rate. Funds will be transferred to your wallet instantly.</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            Continue to Sell <ArrowRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
}
