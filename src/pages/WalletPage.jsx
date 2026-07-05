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
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  
  const [sipActive, setSipActive] = useState(false);
  const [sipAmount, setSipAmount] = useState('');
  const [sipFreq, setSipFreq] = useState('monthly');
  const [sipLoading, setSipLoading] = useState(false);
  const [sipHistory, setSipHistory] = useState(null);

  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    fetchDashboard();
    fetchBankDetails();
  }, []);

  const fetchBankDetails = () => {
    api.get('/user/profile.php').then(r => {
      if(r.data.success) {
        setBankDetails({
          bankName: r.data.data.bank_name,
          accountNumber: r.data.data.account_number,
          ifsc: r.data.data.ifsc_code,
          holderName: r.data.data.account_holder_name
        });
      }
    });
  };

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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    setWithdrawLoading(true);
    try {
      const res = await api.post('/user/withdraw.php', { amount: parseFloat(withdrawAmount) });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchDashboard();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Withdrawal request failed');
    }
    setWithdrawLoading(false);
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
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">INR Wallet</p>
              </div>
              <p className="text-4xl font-black text-white">{formatINR(inrBalance)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Japsan Wallet</p>
              <p className="text-4xl font-black text-[#8A2BE2]">JC {japsanBalance}</p>
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
            <div className="flex gap-3 mt-2">
              <button 
                type="submit" 
                disabled={loading || !amount}
                className="flex-1 bg-amber-500 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : <><Wallet size={18} /> Deposit</>}
              </button>
              <button 
                type="button" 
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 bg-white/10 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
              >
                Withdraw
              </button>
            </div>
            
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 mt-4 space-y-3">
              <p className="text-[11px] leading-relaxed text-white/70">
                <span className="font-bold text-amber-500">Deposit:</span> Add funds to your wallet. When your INR balance reaches ₹1,000, it automatically converts into Digital Gold to secure your savings.
              </p>
              <p className="text-[11px] leading-relaxed text-white/70">
                <span className="font-bold text-blue-400">Withdraw:</span> Transfer your available INR balance directly to your registered bank account.
              </p>
            </div>
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

      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white text-center">Withdraw Funds</h3>
            <p className="text-white/50 text-sm text-center -mt-4">Available: {formatINR(inrBalance)}</p>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Amount to Withdraw</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500 font-black">₹</div>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    max={inrBalance}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-xl font-bold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Show Bank Details if they exist */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Withdraw to Bank</p>
                {bankDetails && bankDetails.bankName && bankDetails.accountNumber ? (
                  <div className="text-white space-y-1">
                    <p><span className="text-white/40">Bank:</span> {bankDetails.bankName}</p>
                    <p><span className="text-white/40">A/C:</span> {bankDetails.accountNumber}</p>
                    <p><span className="text-white/40">IFSC:</span> {bankDetails.ifsc}</p>
                    <p><span className="text-white/40">Name:</span> {bankDetails.holderName}</p>
                  </div>
                ) : (
                  <p className="text-red-400">Please update your bank details in the Profile section before withdrawing.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold">Cancel</button>
                <button type="submit" disabled={withdrawLoading || !withdrawAmount || !bankDetails?.accountNumber} className="py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all disabled:opacity-50">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

