import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coins, TrendingUp, TrendingDown, ShoppingCart, Truck, BarChart2, History, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import StatCard from '../components/shared/StatCard';
import api, { formatINR, formatGrams } from '../utils/api';
import { format } from 'date-fns';

const typeColors = { 
  buy: 'text-green-400', 
  sell: 'text-red-400', 
  delivery: 'text-blue-400' 
};

const statusColors = { 
  completed: 'bg-green-500/10 text-green-400 border-green-500/20', 
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', 
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20', 
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  useEffect(() => {
    api.get('/user/dashboard.php')
      .then(r => { 
        setData(r.data.data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
      </div>
    </div>
  );

  const pl = data?.profit_loss_inr ?? 0;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Market Overview</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Real-time valuation of your gold assets</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
          <div className="px-4 py-2 text-right">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Today's Rate</p>
            <p className="text-[#D4AF37] font-black">{formatINR(data?.gold_rate)}/g</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black">
            <TrendingUp size={20} />
          </div>
        </div>
      </header>

      {/* Main Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="INR Wallet" value={formatINR(data?.inr_wallet)} sub="Available for Purchase" icon={Coins} color="blue" />
        <StatCard label="Gold Portfolio" value={formatGrams(data?.total_gold_grams)} sub="Pure 24K Gold" icon={Coins} color="yellow" />
        <StatCard label="Silver Portfolio" value={formatGrams(data?.total_silver_grams)} sub="Pure 99.9% Silver" icon={Coins} color="blue" />
        
        <StatCard label="Total Invested" value={formatINR(data?.total_invested_inr)} sub="Acquisition Cost" icon={BarChart2} color="blue" />
        <StatCard label="Market Value" value={formatINR(data?.current_value_inr)} sub="Gold + Silver Value" icon={TrendingUp} color="green" />
        <StatCard label="Profit / Loss" value={formatINR(Math.abs(pl))} sub={pl >= 0 ? "Total Unrealized Gain" : "Total Unrealized Loss"} icon={pl >= 0 ? ArrowUpRight : ArrowDownRight} color={pl >= 0 ? "green" : "red"} />
      </section>

      {/* Quick Actions */}
      <section>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-6">Asset Management</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <button onClick={() => setShowBuyModal(true)} className="card-premium group hover:border-[#D4AF37]/50 transition-all p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-white font-bold tracking-wide">Buy</p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Instant Purchase</p>
            </div>
          </button>
          <button onClick={() => setShowSellModal(true)} className="card-premium group hover:border-red-500/50 transition-all p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-black transition-all duration-500">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-white font-bold tracking-wide">Sell</p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Liquidate Assets</p>
            </div>
          </button>
          <Link to="/delivery" className="card-premium group hover:border-blue-500/50 transition-all p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
              <Package size={24} />
            </div>
            <div>
              <p className="text-white font-bold tracking-wide">Delivery</p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Physical Pickup</p>
            </div>
          </Link>
          <Link to="/transactions" className="card-premium group hover:border-white/30 transition-all p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <History size={24} />
            </div>
            <div>
              <p className="text-white font-bold tracking-wide">History</p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Audit Trail</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Recent Activity</p>
          <Link to="/transactions" className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:underline">View All Ledger</Link>
        </div>
        
        <div className="card-premium border-white/5 p-0 overflow-hidden">
          {(!data?.recent_transactions?.length) ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <History className="text-white/20" size={24} />
              </div>
              <p className="text-white/40 text-sm font-medium">Your transaction ledger is currently empty.</p>
              <Link to="/buy" className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mt-2 inline-block">Initiate first purchase</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.recent_transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      t.type === 'buy' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                      t.type === 'sell' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                      'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {t.type === 'buy' ? <ArrowUpRight size={20} /> : t.type === 'sell' ? <ArrowDownRight size={20} /> : <Truck size={20} />}
                    </div>
                    <div>
                      <p className="text-white font-bold capitalize tracking-wide">{t.type} Gold</p>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {format(new Date(t.created_at), 'dd MMM yyyy • hh:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-white font-black">{t.gold_grams ? formatGrams(t.gold_grams) : '-'}</p>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {t.amount_inr ? formatINR(t.amount_inr) : '-'}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] ${statusColors[t.status]}`}>
                      {t.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Buy Metal Selection Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white text-center">Select Metal to Buy</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/buy" className="p-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-center hover:bg-[#D4AF37]/20 transition-all">
                <p className="text-2xl mb-2">🥇</p>
                <p className="text-white font-bold">Gold</p>
                <p className="text-white/40 text-[10px]">24K / 999</p>
              </Link>
              <Link to="/silver" className="p-4 rounded-xl border border-blue-400/30 bg-blue-400/10 text-center hover:bg-blue-400/20 transition-all">
                <p className="text-2xl mb-2">🥈</p>
                <p className="text-white font-bold">Silver</p>
                <p className="text-white/40 text-[10px]">99.9% Pure</p>
              </Link>
            </div>
            <button onClick={() => setShowBuyModal(false)} className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* Sell Metal Selection Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white text-center">Select Metal to Sell</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/sell" className="p-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-center hover:bg-[#D4AF37]/20 transition-all">
                <p className="text-2xl mb-2">🥇</p>
                <p className="text-white font-bold">Gold</p>
              </Link>
              <Link to="/silver" className="p-4 rounded-xl border border-blue-400/30 bg-blue-400/10 text-center hover:bg-blue-400/20 transition-all">
                <p className="text-2xl mb-2">🥈</p>
                <p className="text-white font-bold">Silver</p>
                <p className="text-white/40 text-[10px]">Asset</p>
              </Link>
            </div>
            <button onClick={() => setShowSellModal(false)} className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

