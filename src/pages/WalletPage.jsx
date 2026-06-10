import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Wallet, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import api, { formatINR } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function WalletPage() {
  const [inrBalance, setInrBalance] = useState(0);
  const [japsanBalance, setJapsanBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [walletType, setWalletType] = useState('inr');
  const [loading, setLoading] = useState(false);
  
  const [sipActive, setSipActive] = useState(false);
  const [sipAmount, setSipAmount] = useState('');
  const [sipFreq, setSipFreq] = useState('monthly');
  const [sipLoading, setSipLoading] = useState(false);
  const [sipHistory, setSipHistory] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    api.get('/user/dashboard.php').then(r => {
      if(r.data.success) {
        setInrBalance(r.data.data.inr_wallet);
        setJapsanBalance(r.data.data.japsan_wallet);
        setSipActive(r.data.data.sip_active);
        setSipAmount(r.data.data.sip_amount || '');
        setSipFreq(r.data.data.sip_frequency || 'monthly');
      }
    });
    api.get('/user/sip_history.php').then(r => {
      if(r.data.success) setSipHistory(r.data.data);
    });
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const res = await api.post('/user/deposit.php', { amount: parseFloat(amount), wallet_type: walletType });
      if (res.data.success) {
        toast.success('Deposit successful!');
        setAmount('');
        fetchDashboard();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Deposit failed');
    }
    setLoading(false);
  };

  const handleSipSave = async (e) => {
    e.preventDefault();
    setSipLoading(true);
    try {
      const res = await api.post('/user/sip.php', {
        active: sipActive ? 1 : 0,
        amount: parseFloat(sipAmount),
        frequency: sipFreq
      });
      if (res.data.success) {
        toast.success('SIP settings updated');
        fetchDashboard();
      } else {
        toast.error(res.data.message);
      }
    } catch(err) {
      toast.error('Failed to update SIP');
    }
    setSipLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Wallet & SIP</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Manage your funds and automate your savings</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Card */}
        <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="mb-8 relative z-10 flex gap-8">
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">INR Wallet</p>
              <p className="text-4xl font-black text-white">{formatINR(inrBalance)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Japsan Wallet</p>
              <p className="text-4xl font-black text-[#8A2BE2]">{formatINR(japsanBalance)}</p>
            </div>
          </div>

          <form onSubmit={handleDeposit} className="space-y-4 relative z-10">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Wallet Type</label>
                <select value={walletType} onChange={e => setWalletType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:border-amber-500 focus:outline-none">
                  <option value="inr">INR Wallet</option>
                  <option value="japsan">Japsan Wallet</option>
                </select>
              </div>
              <div className="flex-[2]">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500 font-black">₹</div>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-xl font-bold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading || !amount}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
            >
              {loading ? 'Processing...' : <><Wallet size={20} /> Deposit Funds</>}
            </button>
            <p className="text-[10px] text-white/30 text-center mt-2">Note: When wallet reaches ₹1,000, it auto-converts to Gold.</p>
          </form>
        </div>

        {/* SIP Card */}
        <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="text-blue-500" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Auto SIP Settings</h2>
          </div>

          <form onSubmit={handleSipSave} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-bold">Enable SIP</p>
                <p className="text-white/40 text-xs">Automate your investments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={sipActive} onChange={e => setSipActive(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="space-y-4 opacity-100 transition-opacity">
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">SIP Amount</label>
                <input 
                  type="number" 
                  value={sipAmount}
                  onChange={e => setSipAmount(e.target.value)}
                  placeholder="Min ₹10/day or ₹100/month"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Frequency</label>
                <select 
                  value={sipFreq}
                  onChange={e => setSipFreq(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="daily">Daily (Min ₹10)</option>
                  <option value="monthly">Monthly (Min ₹100)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={sipLoading}
              className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              {sipLoading ? 'Saving...' : 'Save SIP Settings'}
            </button>
          </form>
          
          {sipHistory && (
            <div className="mt-8 pt-8 border-t border-white/5">
              <h3 className="text-white font-bold mb-4">SIP Investment Summary</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Invested</p>
                  <p className="text-xl font-black text-white">{formatINR(sipHistory.total_invested)}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Gold Acquired</p>
                  <p className="text-xl font-black text-[#D4AF37]">{sipHistory.total_gold}g</p>
                </div>
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Recent SIP Deductions</p>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {sipHistory.history.length === 0 ? (
                  <p className="text-white/30 text-xs italic">No SIP history yet.</p>
                ) : sipHistory.history.map((txn, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                    <div>
                      <p className="text-white text-xs font-bold">{formatINR(txn.amount_inr)}</p>
                      <p className="text-white/30 text-[10px]">{new Date(txn.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D4AF37] text-xs font-bold">+{txn.gold_grams}g</p>
                      <p className="text-green-400 text-[10px] uppercase">Success</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

