import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TrendingDown, Info, Wallet, ArrowRight, ArrowDownRight, Zap } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';

export default function SellSilverPage() {
  const [grams, setGrams] = useState('');
  const [rate, setRate] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/silver/rate.php').then(r => setRate(r.data.data.current_rate));
    api.get('/user/dashboard.php').then(r => setBalance(r.data.data.total_silver_grams));
  }, []);

  const estimated = rate && grams ? (parseFloat(grams) * rate.rate_per_gram) : 0;

  const handleSell = async e => {
    e.preventDefault();
    if (!grams || parseFloat(grams) <= 0) { toast.error('Please enter a valid amount'); return; }
    if (parseFloat(grams) > balance) { toast.error('Insufficient silver balance in your vault'); return; }
    
    setLoading(true);
    try {
      const res = await api.post('/silver/sell.php', { grams: parseFloat(grams) });
      if (res.data.success) {
        toast.success('Sell request submitted! Funds will be credited after audit.', {
          icon: '💰',
          duration: 5000
        });
        setGrams('');
        api.get('/user/dashboard.php').then(r => setBalance(r.data.data.total_silver_grams));
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Failed to submit sell request. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Liquidate Silver Assets</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Convert your digital silver into instant liquidity</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium border-white/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-400/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <form onSubmit={handleSell} className="relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Silver to Liquidate (g)</label>
                  <button 
                    type="button" 
                    onClick={() => setGrams(String(balance))}
                    className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:underline"
                  >
                    Use Max Portfolio
                  </button>
                </div>
                
                <div className="relative group">
                  <input
                    type="number"
                    value={grams}
                    onChange={e => setGrams(e.target.value)}
                    placeholder="0.0000"
                    step="0.0001"
                    min="0.0001"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-4xl font-black text-white focus:outline-none focus:border-gray-400 focus:bg-white/[0.08] transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-white/20 font-black text-2xl group-focus-within:text-gray-400 transition-colors">
                    g
                  </div>
                </div>
              </div>

              {estimated > 0 && (
                <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center text-gray-400">
                      <TrendingDown size={24} />
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Estimated Credit</p>
                      <p className="text-gray-300 text-2xl font-black">{formatINR(estimated)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-1">Audit Status</p>
                    <p className="text-white font-bold">Pending Approval</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !rate || !grams}
                className="w-full flex items-center justify-center gap-3 py-5 text-lg rounded-2xl bg-gray-300 text-black font-black hover:bg-white transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ArrowDownRight size={20} />
                    Request Liquidation
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="card-premium border-white/5 p-6 bg-white/[0.02]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-500/10 rounded-xl text-gray-400">
                <Info size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Liquidation Policy</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    Funds will be credited to your linked UPI/Bank account.
                  </li>
                  <li className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    Audit process typically takes 2-4 business hours.
                  </li>
                  <li className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    Live market rates at the time of request are applied.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium border-white/5 p-6 bg-[#0F0F0F]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/5 rounded-lg text-white/40">
                <Wallet size={18} />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Vault Status</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Available Balance</p>
                <p className="text-3xl font-black text-gray-300">{formatGrams(balance)}</p>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-wider mt-1">99.9% Digital Silver</p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Current Market Rate</p>
                <p className="text-xl font-black text-white">{rate ? formatINR(rate.rate_per_gram) : '---'}/g</p>
              </div>
            </div>
          </div>

          <div className="card-premium border-gray-400/20 bg-gray-400/[0.02] p-6 text-center">
            <Zap className="text-gray-400 mx-auto mb-3" size={24} />
            <p className="text-white font-bold text-xs uppercase tracking-widest">Instant Approval</p>
            <p className="text-white/30 text-[10px] font-medium mt-1">For requests under 50.0000g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
