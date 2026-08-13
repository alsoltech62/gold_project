import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Info, ShieldCheck, Zap, ArrowRight, Wallet, RefreshCcw, Lock } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LockInModal from '../components/shared/LockInModal';

export default function SilverPage() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASHFREE');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [silverBalance, setSilverBalance] = useState(0);
  const [showLockIn, setShowLockIn] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [utr, setUtr] = useState('');

  useEffect(() => {
    api.get('/silver/rate.php').then(r => setRate(r.data.data.current_rate));
    api.get('/user/dashboard.php').then(r => {
      if (r.data.success) {
        setSilverBalance(r.data.data.total_silver_grams);
      }
    });
  }, []);

  const buyGrams = rate && amount ? (parseFloat(amount) / rate.rate_per_gram) : 0;

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum investment is ₹100');
      return;
    }
    setLoading(true);

    if (paymentMethod === 'CASHFREE') {
      try {
        const res = await api.post('/payment/create_order.php', { amount_inr: parseFloat(amount) });
        if (res.data.success) {
          const { payment_session_id, order_id } = res.data.data;
          
          const cashfree = window.Cashfree({ mode: "production" });
          let checkoutOptions = {
              paymentSessionId: payment_session_id,
              redirectTarget: "_modal",
          };
          
          cashfree.checkout(checkoutOptions).then(async (result) => {
              if (result.error) {
                  toast.error("Payment failed or cancelled.");
                  setLoading(false);
              }
              if (result.paymentDetails) {
                  try {
                    const verifyRes = await api.post('/silver/buy.php', {
                      amount_inr: parseFloat(amount),
                      payment_method: 'CASHFREE',
                      cashfree_order_id: order_id
                    });
                    if (verifyRes.data.success) {
                      toast.success(`Successfully acquired ${formatGrams(verifyRes.data.data.silver_grams)} silver!`);
                      setAmount('');
                      setSilverBalance(prev => prev + verifyRes.data.data.silver_grams);
                      setShowLockIn(true);
                    } else {
                      toast.error(verifyRes.data.message);
                    }
                  } catch (err) {
                    toast.error('Verification failed.');
                  }
                  setLoading(false);
              }
          });
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      } catch (err) {
        toast.error("Could not initiate payment.");
        setLoading(false);
      }
      return;
    }

    if (paymentMethod !== 'UPI' && paymentMethod !== 'CASHFREE') {
      try {
        const res = await api.post('/silver/buy.php', {
          amount_inr: parseFloat(amount),
          payment_method: paymentMethod
        });
        if (res.data.success) {
          toast.success(`Successfully acquired ${formatGrams(res.data.data.silver_grams)} silver!`);
          setAmount('');
          setSilverBalance(prev => prev + res.data.data.silver_grams);
          setShowLockIn(true);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error('Transaction failed');
      }
      setLoading(false);
      return;
    }

    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);
      setLoading(false);
      return;
    }
  };

  const submitManualUpi = async () => {
    if (!utr || utr.length < 6) {
      toast.error('Please enter a valid UTR / Reference ID');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/silver/buy.php', {
        amount_inr: parseFloat(amount),
        payment_method: 'UPI',
        payment_id: utr
      });
      if (res.data.success) {
        toast.success(`Successfully acquired ${formatGrams(res.data.data.silver_grams)} silver!`);
        setAmount('');
        setSilverBalance(prev => prev + res.data.data.silver_grams);
        setShowUpiModal(false);
        setUtr('');
        setShowLockIn(true);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-400/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
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
                    <option value="CASHFREE">Direct / UPI / Cards (Cashfree)</option>
                    <option value="UPI">Manual UPI Transfer</option>
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

      {showUpiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-gray-300/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Complete UPI Payment</h2>
            <p className="text-white/60 text-sm mb-6">Please transfer exactly <span className="text-gray-300 font-bold">₹{amount}</span> to the UPI ID below and enter the UTR/Reference ID to verify your transaction.</p>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center mb-6">
              <span className="text-white/40 text-xs uppercase tracking-wider mb-2">Scan or Copy UPI ID</span>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=goldbindia@oksbi&pn=Silver%20Platform&am=${amount}&cu=INR`} alt="UPI QR" className="rounded-lg mb-4 bg-white p-2" />
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg w-full justify-between">
                <span className="text-gray-300 font-bold font-mono text-lg tracking-wider">goldbindia@oksbi</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('goldbindia@oksbi');
                    toast.success('UPI ID copied!');
                  }}
                  className="text-white/60 hover:text-white text-xs underline"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-white/40 text-xs font-bold uppercase tracking-wider">UTR / Reference ID</label>
              <input 
                type="text" 
                value={utr}
                onChange={e => setUtr(e.target.value)}
                placeholder="Enter 12-digit UTR number" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-300"
              />
            </div>

            <button
              onClick={submitManualUpi}
              disabled={loading || !utr}
              className="w-full bg-gray-300 text-black font-bold py-4 rounded-xl flex items-center justify-center transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </button>
          </div>
        </div>
      )}
      <LockInModal 
        isOpen={showLockIn}
        onClose={() => setShowLockIn(false)}
        title="Increase Your Returns with Lock-In Investment"
        message="If you want, you can get additional returns by locking your silver for a specific period."
        primaryActionText="Lock Now"
        secondaryActionText="Skip & Continue"
        onSecondaryAction={() => navigate('/wallet')}
      />
    </div>
  );
}
