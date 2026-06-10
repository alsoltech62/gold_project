import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Info, ShieldCheck, Zap, ArrowRight, Wallet, RefreshCcw } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function SilverPage() {
  const [tab, setTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [gramsToSell, setGramsToSell] = useState('');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const { user } = useAuth();
  const [silverBalance, setSilverBalance] = useState(0);

  useEffect(() => {
    api.get('/silver/rate.php').then(r => setRate(r.data.data.current_rate));
    api.get('/user/dashboard.php').then(r => {
      if (r.data.success) {
        setSilverBalance(r.data.data.total_silver_grams);
      }
    });
  }, []);

  const buyGrams = rate && amount ? (parseFloat(amount) / rate.rate_per_gram) : 0;
  const sellValue = rate && gramsToSell ? (parseFloat(gramsToSell) * rate.rate_per_gram) : 0;

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum investment is ₹100');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/silver/buy.php', {
        amount_inr: parseFloat(amount),
        payment_method: paymentMethod
      });
      if (res.data.success) {
        toast.success(`Successfully acquired ${formatGrams(res.data.data.silver_grams)} silver!`);
        setAmount('');
        // update balance
        setSilverBalance(prev => prev + res.data.data.silver_grams);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Transaction failed');
    }
    setLoading(false);
  };

  const handleSell = async () => {
    if (!gramsToSell || parseFloat(gramsToSell) <= 0) {
      toast.error('Enter a valid amount to sell');
      return;
    }
    if (parseFloat(gramsToSell) > silverBalance) {
      toast.error('Insufficient silver balance');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/silver/sell.php', {
        grams: parseFloat(gramsToSell)
      });
      if (res.data.success) {
        toast.success(`Successfully sold silver for ₹${res.data.data.amount_inr}!`);
        setGramsToSell('');
        setSilverBalance(prev => prev - parseFloat(gramsToSell));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Transaction failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Silver Vault</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Invest in 99.9% Pure Digital Silver</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Your Balance</p>
          <p className="text-gray-300 text-2xl font-black">{formatGrams(silverBalance)}g</p>
        </div>
      </header>

      <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        <button 
          onClick={() => setTab('buy')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'buy' ? 'bg-gray-300 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Buy Silver
        </button>
        <button 
          onClick={() => setTab('sell')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'sell' ? 'bg-gray-300 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Sell Silver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-400/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            {tab === 'buy' ? (
              <form onSubmit={e => { e.preventDefault(); handleBuy(); }} className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Investment Amount</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 font-black text-2xl group-focus-within:scale-110 transition-transform">
                      ₹
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-6 text-4xl font-black text-white focus:outline-none focus:border-gray-300 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {[500, 1000, 2000, 5000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(String(amt))}
                        className="py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 font-bold text-xs hover:border-gray-400/50 hover:text-gray-300 hover:bg-gray-400/5 transition-all"
                      >
                        +₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Payment Method</label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-gray-300"
                  >
                    <option value="UPI">Direct (UPI / Bank)</option>
                    <option value="inr_wallet">INR Wallet Balance</option>
                    <option value="japsan_wallet">Japsan Wallet Balance</option>
                    <option value="gold_wallet">Gold Wallet (Sell Gold to Buy Silver)</option>
                  </select>
                </div>

                {buyGrams > 0 && (
                  <div className="bg-gray-400/10 border border-gray-400/20 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-300 flex items-center justify-center text-black">
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Estimated Silver</p>
                        <p className="text-gray-300 text-2xl font-black">{buyGrams.toFixed(4)}g</p>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading || !rate || !amount} className="w-full bg-gray-300 text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-colors">
                  {loading ? <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div> : <><Wallet size={20} /> Purchase Silver <ArrowRight size={20} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleSell(); }} className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Sell Amount (Grams)</label>
                  <div className="relative group">
                    <input
                      type="number"
                      step="0.0001"
                      value={gramsToSell}
                      onChange={e => setGramsToSell(e.target.value)}
                      placeholder="0.0000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-4xl font-black text-white focus:outline-none focus:border-gray-300 transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-white/20 font-black text-2xl">
                      g
                    </div>
                  </div>
                  <button type="button" onClick={() => setGramsToSell(String(silverBalance))} className="text-xs text-amber-500 font-semibold mt-2 block ml-auto">Sell Max ({silverBalance}g)</button>
                </div>

                {sellValue > 0 && (
                  <div className="bg-gray-400/10 border border-gray-400/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Value</p>
                      <p className="text-gray-300 text-2xl font-black">{formatINR(sellValue)}</p>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading || !rate || !gramsToSell} className="w-full bg-gray-300 text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-colors">
                  {loading ? <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div> : <><RefreshCcw size={20} /> Sell Silver <ArrowRight size={20} /></>}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-300 rounded-lg text-black">
                <Info size={18} />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Market Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Spot Price</p>
                <p className="text-3xl font-black text-gray-300">{rate ? formatINR(rate.rate_per_gram) : '---'}</p>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-wider mt-1">Per Gram • Live</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
