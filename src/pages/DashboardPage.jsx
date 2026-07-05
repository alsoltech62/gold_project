import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Bell, TrendingUp, Wallet, ArrowDownToLine, ShoppingCart, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { format } from 'date-fns';
import logo1 from '../assets/logo1.png';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    return `${baseUrl}/${path}`;
  };

  useEffect(() => {
    if (data?.banners?.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIdx(prev => (prev + 1) % data.banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data?.banners]);

  const fetchDashboard = () => {
    api.get('/user/dashboard.php')
      .then(r => { 
        setData(r.data.data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-pulse max-w-xl mx-auto p-4">
      <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
      <div className="h-40 bg-white/5 rounded-2xl w-full"></div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
      </div>
      <div className="h-32 bg-white/5 rounded-2xl w-full"></div>
    </div>
  );

  const pl = data?.profit_loss_inr ?? 0;
  const plPercentage = data?.total_invested_inr > 0 ? ((pl / data.total_invested_inr) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-24 px-4 pt-4 lg:pt-8 font-sans">
      
      {/* Top Section: Portfolio & Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Main Portfolio Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] p-6 lg:p-10 bg-gradient-to-br from-[#161616] to-[#0a0a0a] border border-[#D4AF37]/20 shadow-[0_8px_30px_rgba(212,175,55,0.1)] group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 lg:mb-10 relative z-10">
            <div>
              <p className="text-[#D4AF37] uppercase font-bold tracking-[0.25em] text-[10px] lg:text-xs mb-2 lg:mb-3 opacity-80">Total Portfolio Value</p>
              <h1 className="text-white font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-lg">₹ {formatINR(data?.current_value_inr)}</h1>
            </div>
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner group-hover:scale-105 transition-transform duration-500">
              <Wallet className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-xs lg:text-sm font-bold border backdrop-blur-md ${pl >= 0 ? 'border-green-500/30 text-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-red-500/30 text-red-400 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
              <TrendingUp className={`w-4 h-4 lg:w-5 lg:h-5 ${pl < 0 ? "rotate-180" : ""}`} /> 
              Today's {pl >= 0 ? 'Profit' : 'Loss'}: ₹ {formatINR(Math.abs(pl))} ({plPercentage}%)
            </div>
          </div>
        </div>

        {/* Live Rates Card */}
        <div className="relative overflow-hidden rounded-[2rem] p-6 lg:p-8 bg-gradient-to-br from-[#161616] to-[#0a0a0a] border border-white/5 shadow-xl flex flex-col justify-center gap-6 group">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-white/50 uppercase font-bold tracking-[0.2em] text-[10px] lg:text-xs">Live Market</p>
            </div>
            <button onClick={fetchDashboard} className="text-white/30 hover:text-[#D4AF37] transition-colors p-2 hover:bg-white/5 rounded-full active:rotate-180 duration-500">
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div className="flex items-center gap-4">
              <div className="text-3xl lg:text-4xl drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-300">🥇</div>
              <div>
                <p className="text-white/40 text-[9px] lg:text-[10px] uppercase tracking-widest mb-1 font-bold">24K Gold / gm</p>
                <p className="text-[#D4AF37] font-black text-xl lg:text-2xl tracking-wide">₹{formatINR(data?.gold_rate)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <div className="text-3xl lg:text-4xl drop-shadow-[0_0_10px_rgba(200,200,200,0.4)] group-hover:scale-110 transition-transform duration-300">🥈</div>
              <div>
                <p className="text-white/40 text-[9px] lg:text-[10px] uppercase tracking-widest mb-1 font-bold">999 Silver / gm</p>
                <p className="text-gray-200 font-black text-xl lg:text-2xl tracking-wide">₹{formatINR(data?.silver_rate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Link to="/buy" className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#FFDF73] via-[#D4AF37] to-[#B8860B] text-black shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-black tracking-[0.15em] text-[10px] lg:text-xs">BUY GOLD</Link>
        <Link to="/sell?metal=gold" className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-[#111] border border-[#D4AF37]/30 text-[#D4AF37] shadow-lg hover:shadow-[0_8px_25px_rgba(212,175,55,0.15)] hover:-translate-y-1 hover:bg-[#D4AF37]/5 transition-all flex items-center justify-center gap-2 font-black tracking-[0.15em] text-[10px] lg:text-xs">SELL GOLD</Link>
        <Link to="/silver" className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#E0E0E0] via-[#BDBDBD] to-[#9E9E9E] text-black shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-black tracking-[0.15em] text-[10px] lg:text-xs">BUY SILVER</Link>
        <Link to="/sell?metal=silver" className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-[#111] border border-white/20 text-white/90 shadow-lg hover:shadow-[0_8px_25px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-black tracking-[0.15em] text-[10px] lg:text-xs">SELL SILVER</Link>
      </div>

      {/* Banner & Vault Section (Same Row on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        
        {/* Banner Carousel (75% Width) */}
        <div className="lg:col-span-3 h-full">
          {data?.banners?.length > 0 ? (
            <div className="w-full h-full min-h-[160px] sm:min-h-[224px] lg:min-h-[320px] relative rounded-2xl lg:rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-[#050505] shadow-2xl group">
              {data.banners.map((banner, idx) => (
                <img 
                  key={banner.id} 
                  src={getImageUrl(banner.image_url)} 
                  alt="Banner" 
                  className={`absolute inset-0 w-full h-full object-contain p-2 lg:p-4 transition-opacity duration-1000 ${currentBannerIdx === idx ? 'opacity-100' : 'opacity-0'}`} 
                />
              ))}
              {data.banners.length > 1 && (
                <>
                  <button onClick={() => setCurrentBannerIdx((prev) => (prev - 1 + data.banners.length) % data.banners.length)} className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 lg:p-2 rounded-full bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <ChevronLeft size={16} className="lg:w-5 lg:h-5" />
                  </button>
                  <button onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % data.banners.length)} className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 lg:p-2 rounded-full bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <ChevronRight size={16} className="lg:w-5 lg:h-5" />
                  </button>
                  <div className="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 lg:gap-2">
                    {data.banners.map((_, idx) => (
                      <div key={idx} onClick={() => setCurrentBannerIdx(idx)} className={`h-1.5 lg:h-2 rounded-full cursor-pointer transition-all duration-300 ${currentBannerIdx === idx ? 'w-5 lg:w-8 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'w-1.5 lg:w-2.5 bg-white/30 hover:bg-white/60'}`}></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full min-h-[160px] sm:min-h-[224px] lg:min-h-[320px] rounded-2xl lg:rounded-3xl border border-white/5 bg-[#050505] flex items-center justify-center shadow-2xl">
              <p className="text-white/20 text-xs lg:text-sm tracking-widest uppercase font-bold">No Active Banner</p>
            </div>
          )}
        </div>

        {/* Vault Holdings (25% Width - 4 Cards) */}
        <div className="lg:col-span-1 flex flex-col h-full mt-2 lg:mt-0">
          <h3 className="text-[#D4AF37] font-bold text-[10px] lg:text-xs uppercase tracking-[0.25em] mb-3 lg:mb-4 px-1 flex items-center gap-2">
            <span className="w-1 h-3 lg:h-4 bg-[#D4AF37] rounded-full"></span>
            Your Vault
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4 flex-1">
            <div className="bg-[#111] border border-[#D4AF37]/10 rounded-xl lg:rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-[#151515] hover:border-[#D4AF37]/30 transition-all shadow-lg group">
              <p className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold group-hover:text-[#D4AF37]/80 transition-colors">Gold Vault</p>
              <p className="text-[#D4AF37] font-black text-sm lg:text-base">{formatGrams(data?.total_gold_grams)}<span className="text-[8px] font-medium text-white/40 ml-1">gm</span></p>
            </div>
            <div className="bg-[#111] border border-[#D4AF37]/10 rounded-xl lg:rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-[#151515] hover:border-[#D4AF37]/30 transition-all shadow-lg group">
              <p className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold group-hover:text-[#D4AF37]/80 transition-colors">Gold Value</p>
              <p className="text-[#D4AF37] font-black text-sm lg:text-base">₹{formatINR(data?.gold_current_value)}</p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-xl lg:rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-[#151515] hover:border-white/20 transition-all shadow-lg group">
              <p className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold group-hover:text-white/80 transition-colors">Silver Vault</p>
              <p className="text-gray-200 font-black text-sm lg:text-base">{formatGrams(data?.total_silver_grams)}<span className="text-[8px] font-medium text-white/40 ml-1">gm</span></p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-xl lg:rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-[#151515] hover:border-white/20 transition-all shadow-lg group">
              <p className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold group-hover:text-white/80 transition-colors">Silver Value</p>
              <p className="text-gray-200 font-black text-sm lg:text-base">₹{formatINR(data?.silver_current_value)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-4 lg:mb-6 px-1 lg:px-2">
          <h3 className="text-[#D4AF37] font-bold text-[10px] lg:text-xs uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>
            Recent Transactions
          </h3>
          <Link to="/transactions" className="text-white/40 hover:text-[#D4AF37] text-[9px] lg:text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 transition-colors group">
            View All <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar px-1 lg:px-2">
          {data?.recent_transactions?.map(t => (
            <div key={t.id} className="min-w-[200px] lg:min-w-[320px] border border-white/5 rounded-2xl p-4 lg:p-6 bg-[#0f0f0f] hover:bg-[#161616] transition-all snap-start shrink-0 flex flex-col justify-between gap-4 lg:gap-6 shadow-xl hover:-translate-y-1">
              <div className="flex flex-col gap-3 lg:gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-black border ${
                      t.type === 'buy' ? 'border-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 
                      t.type === 'sell' ? 'border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                      'border-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.1)]'
                    }`}>
                      {t.type === 'buy' ? <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5"/> : t.type === 'sell' ? <ArrowDownToLine className="w-4 h-4 lg:w-5 lg:h-5"/> : <Truck className="w-4 h-4 lg:w-5 lg:h-5"/>}
                    </div>
                    <div>
                      <p className="text-sm lg:text-base font-bold text-white capitalize tracking-wide">{t.type === 'delivery' ? 'Delivery' : `Gold ${t.type}`}</p>
                      <p className="text-[10px] lg:text-xs text-white/40 mt-0.5 font-medium">{t.gold_grams ? formatGrams(t.gold_grams) : '-'} gm</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-lg lg:text-2xl text-white font-black tracking-wider">₹ {t.amount_inr ? formatINR(t.amount_inr) : '-'}</p>
                  <p className="text-[9px] lg:text-[10px] text-white/30 mt-1 uppercase tracking-widest font-medium">{format(new Date(t.created_at), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className={`px-3 py-1 lg:px-4 lg:py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                  t.status === 'completed' ? 'text-green-400 bg-green-500/10' : 
                  t.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10' : 
                  'text-blue-400 bg-blue-500/10'
                }`}>
                  {t.status}
                </div>
              </div>
            </div>
          ))}
          {(!data?.recent_transactions || data.recent_transactions.length === 0) && (
            <div className="w-full text-center py-12 lg:py-20 border border-white/5 rounded-2xl bg-[#0f0f0f] text-white/30 text-xs lg:text-sm font-bold uppercase tracking-[0.2em]">No recent transactions</div>
          )}
        </div>
      </div>
    </div>
  );
}
