import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Info, ShieldCheck, Zap, ArrowRight, Wallet } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LockInModal from '../components/shared/LockInModal';

export default function BuyGoldPage() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showLockIn, setShowLockIn] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/gold/rate.php').then(r => setRate(r.data.data));
  }, []);

  const grams = rate && amount ? (parseFloat(amount) / rate.rate_per_gram) : 0;

  const initPayment = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum investment is ₹100');
      return;
    }

    setLoading(true);

    if (paymentMethod !== 'UPI') {
      try {
        const res = await api.post('/gold/buy.php', {
          amount_inr: parseFloat(amount),
          payment_method: paymentMethod,
          payment_id: 'WALLET_TXN'
        });
        if (res.data.success) {
          toast.success(`Successfully acquired ${formatGrams(res.data.data.gold_grams)}!`, { icon: '✨' });
          setAmount('');
          setShowLockIn(true);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error('Transaction failed.');
      }
      setLoading(false);
      return;
    }

    const options = {
      key: 'rzp_test_YOUR_KEY_HERE',
      amount: parseFloat(amount) * 100,
      currency: 'INR',
      name: 'GoldVault',
      description: `Purchase of ${grams.toFixed(4)}g 24K Gold`,
      image: 'https://cdn-icons-png.flaticon.com/512/2489/2489753.png',
      handler: async function (response) {
        setLoading(true);
        try {
          const res = await api.post('/gold/buy.php', {
            amount_inr: parseFloat(amount),
            payment_method: 'UPI',
            payment_id: response.razorpay_payment_id
          });
          if (res.data.success) {
            toast.success(`Successfully acquired ${formatGrams(res.data.data.gold_grams)}!`, { icon: '✨' });
            setAmount('');
            setShowLockIn(true);
          } else {
            toast.error(res.data.message);
          }
        } catch (err) {
          toast.error('Transaction failed.');
        }
        setLoading(false);
      },
      prefill: { name: user?.name, contact: user?.mobile },
      theme: { color: '#D4AF37' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Acquire Assets</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Invest in 99.9% Pure 24K Digital Gold</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Purchase Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium border-white/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <form onSubmit={e => { e.preventDefault(); initPayment(); }} className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Investment Amount</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#D4AF37] font-black text-2xl group-focus-within:scale-110 transition-transform">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-6 text-4xl font-black text-white focus:outline-none focus:border-[#D4AF37] focus:bg-white/[0.08] transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(String(amt))}
                      className="py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 font-bold text-xs hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
                    >
                      +₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                
                <div className="pt-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Payment Method</label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="UPI">Direct / Razorpay (UPI)</option>
                    <option value="inr_wallet">INR Wallet Balance</option>
                    <option value="japsan_wallet">Japsan Wallet Balance</option>
                    <option value="silver_wallet">Silver Wallet (Sell Silver to Buy Gold)</option>
                  </select>
                </div>
              </div>

              {grams > 0 && (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Estimated Gold</p>
                      <p className="text-[#D4AF37] text-2xl font-black">{grams.toFixed(4)}g</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-1">Purity</p>
                    <p className="text-white font-bold">24K / 999</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !rate || !amount}
                className="btn-gold w-full flex items-center justify-center gap-3 py-5 text-lg shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Wallet size={20} />
                    Complete Purchase
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-premium border-white/5 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Insured Vaults</p>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">100% Secured Storage</p>
              </div>
            </div>
            <div className="card-premium border-white/5 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Instant Delivery</p>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Real-time Allocation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card-premium border-[#D4AF37]/20 bg-gradient-to-br from-[#BF953F]/10 to-transparent p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#D4AF37] rounded-lg text-black">
                <Info size={18} />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Market Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Spot Price (24K)</p>
                <p className="text-3xl font-black text-white">{rate ? formatINR(rate.rate_per_gram) : '---'}</p>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-wider mt-1">Per Gram • Live</p>
              </div>
              
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Buy Spread</span>
                  <span className="text-green-400 text-xs font-bold">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Tax (GST)</span>
                  <span className="text-white text-xs font-bold">Inclusive</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Storage Fee</span>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase">Zero</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium border-white/5 p-6 bg-[#0F0F0F]">
            <p className="text-white font-bold mb-4">Payment Methods</p>
            <div className="flex flex-wrap gap-3 opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/640px-UPI-Logo.png" alt="UPI" className="h-4 grayscale" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Visa_logo_2014.svg/640px-Visa_logo_2014.svg.png" alt="Visa" className="h-3 grayscale" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 grayscale" />
            </div>
          </div>
        </div>
      </div>
      <LockInModal 
        isOpen={showLockIn}
        onClose={() => setShowLockIn(false)}
        title="Increase Your Returns with Lock-In Investment"
        message="If you want, you can get additional returns by locking your gold for a specific period."
        primaryActionText="Lock Now"
        secondaryActionText="Skip & Continue"
        onSecondaryAction={() => navigate('/wallet')}
      />
    </div>
  );
}

