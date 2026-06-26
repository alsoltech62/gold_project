import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock, Shield, TrendingUp, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import api, { formatGrams, formatINR } from '../utils/api';
import toast from 'react-hot-toast';

export default function LockInPage() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amountToLock, setAmountToLock] = useState('');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [metalType, setMetalType] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('metal') === 'silver' ? 'silver' : 'gold';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const metal = params.get('metal');
    if (metal === 'silver' || metal === 'gold') {
      setMetalType(metal);
    }
  }, [location.search]);

  useEffect(() => {
    fetchDashboard();
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchPlans();
    setAmountToLock('');
    setSelectedPlan(null);
  }, [metalType]);

  const fetchDashboard = () => {
    api.get('/user/dashboard.php').then(r => setData(r.data.data)).catch(() => {});
    api.get('/gold/rate.php').then(r => setGoldRate(r.data.data)).catch(() => {});
    api.get('/silver/rate.php').then(r => setSilverRate(r.data.data.current_rate)).catch(() => {});
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/lockin/plans.php?metal_type=' + metalType);
      if (res.data.success) {
        setPlans(res.data.data);
      }
    } catch (err) {}
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/lockin/history.php');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {}
  };

  const filteredHistory = history.filter(h => h.metal_type === metalType);

  const totalGrams = metalType === 'gold' ? (data?.total_gold_grams || 0) : (data?.total_silver_grams || 0);
  const rate = metalType === 'gold' ? goldRate : silverRate;
  const themeColor = metalType === 'gold' ? '#D4AF37' : '#9CA3AF';
  const themeColorVar = metalType === 'gold' ? 'text-[#D4AF37]' : 'text-gray-400';
  const themeBorderVar = metalType === 'gold' ? 'border-[#D4AF37]/20' : 'border-gray-400/20';
  const themeBgVar = metalType === 'gold' ? 'bg-[#D4AF37]/20' : 'bg-gray-400/20';
  const themeGradVar = metalType === 'gold' ? 'from-[#D4AF37]/10' : 'from-gray-400/10';
  
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
        months: selectedPlan.months,
        grams: parseFloat(amountToLock),
        metal_type: metalType
      });
      if (res.data.success) {
        toast.success(`${metalType === 'gold' ? 'Gold' : 'Silver'} Locked Successfully!`);
        fetchDashboard();
        fetchHistory();
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
        <p className="text-white/40 text-sm font-medium mt-1">Get up to 12% extra returns by locking your assets</p>
      </header>

      <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        <button 
          onClick={() => setMetalType('gold')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${metalType === 'gold' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-white/40 hover:text-white'}`}
        >
          Lock Gold
        </button>
        <button 
          onClick={() => setMetalType('silver')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${metalType === 'silver' ? 'bg-gray-300 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Lock Silver
        </button>
      </div>

      <div className={`card-premium ${themeBorderVar} bg-gradient-to-r ${themeGradVar} to-transparent p-6 flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${themeBgVar} rounded-2xl flex items-center justify-center ${themeColorVar}`}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p className={`text-[10px] font-bold ${themeColorVar} uppercase tracking-widest`}>Available {metalType === 'gold' ? 'Gold' : 'Silver'} Balance</p>
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
              <Shield className={`${themeColorVar} shrink-0 mt-0.5`} size={16} />
              <p className="text-white/60 text-xs leading-relaxed">Your {metalType === 'gold' ? 'gold' : 'silver'} remains completely safe in our insured vaults during the lock-in period.</p>
            </div>
            <div className="flex items-start gap-3">
              <Info className={`${themeColorVar} shrink-0 mt-0.5`} size={16} />
              <p className="text-white/60 text-xs leading-relaxed">Early withdrawal is possible but subject to penalty charges depending on the duration served.</p>
            </div>
          </div>
        </div>

        <div className="card-premium border-white/10 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Investment Details</h2>
          
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">{metalType === 'gold' ? 'Gold' : 'Silver'} to Lock (Grams)</label>
              <input
                type="number"
                value={amountToLock}
                onChange={e => setAmountToLock(e.target.value)}
                placeholder="0.0000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-black text-white focus:outline-none focus:border-white/30"
              />
              <button 
                onClick={() => setAmountToLock(totalGrams.toString())}
                className={`${themeColorVar} text-[10px] font-bold uppercase tracking-widest mt-2 hover:underline`}
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
                  <span className={`${themeColorVar} font-black text-lg`}>
                    {formatINR((parseFloat(amountToLock) * rate.rate_per_gram) * (selectedPlan.returnRate / 100))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLock}
            disabled={!selectedPlan || !amountToLock || loading}
            className={`w-full ${metalType === 'gold' ? 'btn-gold' : 'bg-gray-300 text-black hover:bg-white'} font-bold rounded-xl py-4 text-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-50 transition-all`}
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

      {/* Lock-In History Section */}
      {filteredHistory.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Lock-In Portfolio</h2>
            <div className={`px-3 py-1 ${themeBgVar} ${themeColorVar} text-xs font-bold rounded-full border ${themeBorderVar} uppercase tracking-widest`}>
              {filteredHistory.length} Active Plans
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHistory.map((h, i) => (
              <div key={i} className="card-premium border-white/5 p-6 relative overflow-hidden group">
                {/* Background glow based on progress */}
                <div 
                  className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"
                  style={{ background: `linear-gradient(90deg, ${h.metal_type === 'gold' ? '#D4AF37' : '#9CA3AF'} ${h.progress_percentage}%, transparent ${h.progress_percentage}%)` }}
                ></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className={`${h.metal_type === 'gold' ? 'text-[#D4AF37]' : 'text-gray-300'} font-black text-xl`}>{formatGrams(h.grams)}</p>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">{h.metal_type} Locked</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                        <TrendingUp size={12} />
                        +{h.return_percentage}%
                      </div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">{h.plan_name}</p>
                    </div>
                  </div>

                  {/* Progress Bar UI */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/40">Maturity Progress</span>
                      <span className={h.metal_type === 'gold' ? 'text-[#D4AF37]' : 'text-gray-300'}>{Math.floor(h.progress_percentage)}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#111] rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 relative ${h.metal_type === 'gold' ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-gradient-to-r from-gray-500 to-gray-300 shadow-[0_0_10px_rgba(156,163,175,0.5)]'}`}
                        style={{ width: `${h.progress_percentage}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px] animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                      <span>{new Date(h.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit'})}</span>
                      <span>{h.days_remaining} Days Left</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Est. Extra {h.metal_type}</p>
                      <p className="text-white font-bold text-sm">+{formatGrams(h.estimated_extra)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Maturity Date</p>
                      <p className={`${h.metal_type === 'gold' ? 'text-[#D4AF37]' : 'text-gray-300'} font-bold text-sm`}>{new Date(h.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
