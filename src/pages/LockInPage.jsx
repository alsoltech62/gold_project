import React, { useState, useEffect } from 'react';
import { Lock, Shield, TrendingUp, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import api, { formatGrams, formatINR } from '../utils/api';
import toast from 'react-hot-toast';

export default function LockInPage() {
  const [data, setData] = useState(null);
  const [rate, setRate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amountToLock, setAmountToLock] = useState('');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchPlans();
  }, []);

  const fetchDashboard = () => {
    api.get('/user/dashboard.php').then(r => setData(r.data.data)).catch(() => {});
    api.get('/gold/rate.php').then(r => setRate(r.data.data)).catch(() => {});
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/lockin/plans.php');
      if (res.data.success) {
        setPlans(res.data.data);
      }
    } catch (err) {}
  };

  const totalGrams = data?.total_gold_grams || 0;
  
  const handleLock = async () => {
    if (!amountToLock || parseFloat(amountToLock) <= 0 || parseFloat(amountToLock) > totalGrams) {
      toast.error('Invalid amount to lock');
      return;
    }
    if (!selectedPlan) {
      toast.error('Please select a lock-in plan');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/lockin/create.php', {
        plan_id: selectedPlan.id,
        gold_grams: parseFloat(amountToLock)
      });
      if (res.data.success) {
        toast.success('Gold Locked Successfully!');
        fetchDashboard();
        setAmountToLock('');
        setSelectedPlan(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error('Failed to lock gold');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Lock & Earn</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Get up to 12% extra returns by locking your gold</p>
      </header>

      <div className="card-premium border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center text-[#D4AF37]">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Available Gold Balance</p>
            <p className="text-2xl font-black text-white">{formatGrams(totalGrams)}</p>
            {rate && <p className="text-white/40 text-xs">≈ {formatINR(totalGrams * rate.rate_per_gram)}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Select Lock-in Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPlan(plan)}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${
                  selectedPlan?.id === plan.id
                    ? `bg-[${plan.color_hex}]/10 border-[${plan.color_hex}]`
                    : 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
                }`}
                style={{
                  backgroundColor: selectedPlan?.id === plan.id ? `${plan.color_hex}1A` : '#1a1a1a',
                  borderColor: selectedPlan?.id === plan.id ? plan.color_hex : 'rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-center space-y-2">
                  <p className="text-white font-bold text-lg">{plan.months} Months</p>
                  <p className="text-4xl font-black" style={{ color: plan.color_hex }}>+{plan.returnRate}%</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Extra Return</p>
                  {plan.plan_name && <p className="text-white/20 text-[9px] uppercase mt-2">{plan.plan_name}</p>}
                </div>
                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 size={20} color={plan.color_hex} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card-premium border-white/5 p-6 space-y-4 bg-[#0F0F0F]">
            <div className="flex items-start gap-3">
              <Shield className="text-[#D4AF37] shrink-0 mt-0.5" size={16} />
              <p className="text-white/60 text-xs leading-relaxed">Your gold remains completely safe in our insured vaults during the lock-in period.</p>
            </div>
            <div className="flex items-start gap-3">
              <Info className="text-[#D4AF37] shrink-0 mt-0.5" size={16} />
              <p className="text-white/60 text-xs leading-relaxed">Early withdrawal is possible but subject to penalty charges depending on the duration served.</p>
            </div>
          </div>
        </div>

        <div className="card-premium border-white/10 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Investment Details</h2>
          
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Gold to Lock (Grams)</label>
              <input
                type="number"
                value={amountToLock}
                onChange={e => setAmountToLock(e.target.value)}
                placeholder="0.0000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-black text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button 
                onClick={() => setAmountToLock(totalGrams.toString())}
                className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mt-2 hover:underline"
              >
                Max: {formatGrams(totalGrams)}
              </button>
            </div>

            {selectedPlan && amountToLock && parseFloat(amountToLock) > 0 && rate && (
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Current Value:</span>
                  <span className="text-white font-bold">{formatINR(parseFloat(amountToLock) * rate.rate_per_gram)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Guaranteed Return:</span>
                  <span className="text-green-400 font-bold">+{selectedPlan.returnRate}%</span>
                </div>
                <div className="h-px w-full bg-white/10 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-bold">Estimated Extra Profit:</span>
                  <span className="text-[#D4AF37] font-black text-lg">
                    {formatINR((parseFloat(amountToLock) * rate.rate_per_gram) * (selectedPlan.returnRate / 100))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLock}
            disabled={!selectedPlan || !amountToLock || loading}
            className="w-full btn-gold py-4 text-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock size={18} />
                Confirm Lock-In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
