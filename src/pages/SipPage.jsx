import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, ChevronRight, ShieldCheck, Zap, XCircle, ExternalLink, RefreshCw,
  Clock, Sparkles, ArrowRight, Shield, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function SipPage({ metalType = 'gold' }) {
  const navigate = useNavigate();
  const isSilver = metalType === 'silver';

  // =========================================================================
  // SIP COMING SOON UI (ACTIVE)
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#181818] via-[#121212] to-[#0d0d0d] p-6 sm:p-12 shadow-2xl text-center">
        {/* Ambient Glow */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-40"
          style={{ background: isSilver ? '#C0C0C0' : '#D4AF37' }}
        />

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
          <Clock className={isSilver ? "text-slate-300 animate-spin-slow" : "text-[#D4AF37]"} size={15} />
          <span className={`text-xs font-bold uppercase tracking-widest ${isSilver ? "text-slate-300" : "text-[#D4AF37]"}`}>
            Coming Soon
          </span>
        </div>

        {/* Feature Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-3xl opacity-20 blur-lg animate-pulse"
            style={{ background: isSilver ? 'linear-gradient(135deg, #94a3b8, #e2e8f0)' : 'linear-gradient(135deg, #B08D57, #F59E0B)' }}
          />
          <div 
            className="relative w-full h-full rounded-3xl flex items-center justify-center border shadow-xl"
            style={{
              background: 'linear-gradient(145deg, #1f1f1f, #141414)',
              borderColor: isSilver ? 'rgba(203, 213, 225, 0.3)' : 'rgba(212, 175, 55, 0.4)'
            }}
          >
            <Sparkles className={isSilver ? "text-slate-200" : "text-[#D4AF37]"} size={44} />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {isSilver ? 'Silver' : 'Gold'} SIP is <span className={isSilver ? "text-slate-300" : "text-[#D4AF37]"}>Coming Soon</span>
        </h1>
        <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          We are upgrading our Systematic Investment Plan (SIP) engine to deliver seamless automated micro-savings, instant bank mandates, and zero-fee recurring bullion accumulation.
        </p>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              <Calendar className={isSilver ? "text-slate-300" : "text-[#D4AF37]"} size={18} />
            </div>
            <h3 className="text-white text-sm font-bold mb-1">Flexible Frequency</h3>
            <p className="text-white/40 text-xs">Set daily, weekly, or monthly auto-investments that match your budget.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              <ShieldCheck className="text-emerald-400" size={18} />
            </div>
            <h3 className="text-white text-sm font-bold mb-1">100% Insured 24K</h3>
            <p className="text-white/40 text-xs">Every rupee accumulated is backed by physical certified bullion in vaults.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              <Zap className="text-yellow-400" size={18} />
            </div>
            <h3 className="text-white text-sm font-bold mb-1">Auto-Debit Mandate</h3>
            <p className="text-white/40 text-xs">Seamless Cashfree UPI & bank e-mandate for automated deductions.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all hover:bg-white/10"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(isSilver ? '/silver' : '/buy/one-time')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: isSilver ? '#C0C0C0' : '#D4AF37',
              color: '#000'
            }}
          >
            <span>Buy {isSilver ? 'Silver' : 'Gold'} Instantly</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  /*
  ==============================================================================
  ORIGINAL SIP PAGE IMPLEMENTATION (COMMENTED OUT TEMPORARILY - NOT REMOVED)
  ==============================================================================
  const [amount, setAmount] = useState('1000');
  const [frequency, setFrequency] = useState('monthly');
  const [date, setDate] = useState('1');
  const [time, setTime] = useState('10:00');
  const [day, setDay] = useState('Monday');
  const [monthDate, setMonthDate] = useState('January 1');

  const [loading, setLoading] = useState(false);
  const [sipHistory, setSipHistory] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchSipData = () => {
    api.get(`/user/sip_history.php?metal_type=${metalType}`)
      .then(r => {
        if (r.data.success) {
          setSipHistory(r.data.data);
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    api.get('/user/sip_plans.php')
      .then(r => {
        if (r.data.success) {
          setPlans(r.data.data);
          if (r.data.data.length > 0) {
            setSelectedPlan(r.data.data[0]);
            setAmount(r.data.data[0].min_amount.toString());
            setFrequency(r.data.data[0].frequency);
          }
        }
      })
      .catch(() => { });

    fetchSipData();
  }, [metalType]);

  const handleSetupSip = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error('Please select a SIP plan');
      return;
    }
    const minAmt = parseFloat(selectedPlan.min_amount);
    if (!amount || parseFloat(amount) < minAmt) {
      toast.error(`Minimum SIP amount for this plan is ₹${minAmt}`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/sip/setup.php', { 
        amount: parseFloat(amount), 
        frequency, 
        metal_type: metalType,
        date,
        day,
        time
      });

      if (res.data.success) {
        toast.success(res.data.message || 'SIP Setup successfully!');
        const authLink = res.data.data?.auth_link;
        
        if (authLink) {
          toast.loading('Redirecting to Cashfree Auto-Debit authorization...', { duration: 2500 });
          setTimeout(() => {
            window.location.href = authLink;
          }, 1000);
        } else {
          fetchSipData();
        }
      } else {
        toast.error(res.data.message || 'Failed to setup SIP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to setup SIP');
    }
    setLoading(false);
  };

  const handleCancelSip = async (sipId) => {
    if (!window.confirm('Are you sure you want to cancel this SIP and its Auto-Debit mandate?')) {
      return;
    }
    setCancellingId(sipId);
    try {
      const res = await api.post('/user/cancel_sip.php', { sip_id: sipId });
      if (res.data.success) {
        toast.success('SIP and mandate cancelled successfully');
        fetchSipData();
      } else {
        toast.error(res.data.message || 'Failed to cancel SIP');
      }
    } catch (err) {
      toast.error('Failed to cancel SIP');
    }
    setCancellingId(null);
  };

  const activeSips = (sipHistory?.active_sips || []).filter(
    (sip) => sip.status === 'active' || ['ACTIVE', 'SUCCESS', 'ON_DEMAND'].includes(String(sip.mandate_status).toUpperCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Setup {metalType === 'silver' ? 'Silver' : 'Gold'} SIP
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1">
            Automated Cashfree e-Mandate / Recurring SIP accumulation
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[11px] font-bold text-green-400 uppercase tracking-wider">Cashfree Auto-Debit Live</span>
        </div>
      </header>

      {/* Active & Recent Mandates Overview * /}
      {activeSips.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Zap className="text-green-400" size={16} /> Auto-Debit Mandates ({activeSips.length})
            </h2>
            <a 
              href="https://goldbarpe.com/backend/api/debug/logs.php?channel=sip_cashfree" 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              View Mandate Logs <ExternalLink size={12} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSips.map((sip) => {
              const isMandateActive = ['ACTIVE', 'SUCCESS', 'ON_DEMAND'].includes(String(sip.mandate_status).toUpperCase());
              const isRejected = ['REJECTED', 'FAILED', 'CANCELLED', 'DECLINED'].includes(String(sip.mandate_status).toUpperCase()) || Boolean(sip.failure_reason);

              return (
                <div 
                  key={sip.id}
                  className={`bg-[#111] border rounded-2xl p-5 relative overflow-hidden shadow-lg ${
                    isMandateActive ? 'border-green-500/30' : isRejected ? 'border-red-500/30 bg-red-950/10' : 'border-yellow-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isMandateActive ? 'bg-green-500/20 text-green-400' : isRejected ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {sip.frequency}
                      </span>
                      <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase tracking-wider">
                        {sip.metal_type || metalType}
                      </span>
                    </div>
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isMandateActive ? 'text-green-400' : isRejected ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {isMandateActive ? <CheckCircle2 size={13} /> : isRejected ? <XCircle size={13} /> : <Zap size={13} />}
                      {isMandateActive ? 'Mandate Active' : isRejected ? `Declined (${sip.mandate_status || 'Failed'})` : (sip.mandate_status || 'Pending')}
                    </span>
                  </div>

                  {/* Failure / Rejection Reason Callout * /}
                  {(sip.failure_reason || sip.last_error) && (
                    <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
                      <p className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                        ⚠️ Rejection Reason:
                      </p>
                      <p className="text-xs text-red-200 mt-0.5 font-mono">
                        {sip.failure_reason || sip.last_error}
                      </p>
                      {String(sip.failure_reason || sip.last_error).toUpperCase().includes('RISK') && (
                        <p className="text-[10px] text-white/50 mt-1">
                          Merchant / Bank limit exceeded. Please check with your bank.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/40 text-xs">Recurring Amount</p>
                      <p className="text-2xl font-black text-white">₹{sip.amount}</p>
                      {sip.cf_subscription_id && (
                        <p className="text-[10px] text-white/30 font-mono mt-1">ID: {sip.cf_subscription_id}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {sip.auth_link && (sip.mandate_status === 'pending' || isRejected) && (
                        <a
                          href={sip.auth_link}
                          className="text-xs bg-green-500 text-black font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-400"
                        >
                          {isRejected ? 'Retry Mandate' : 'Authorize'} <ExternalLink size={12} />
                        </a>
                      )}
                      {sip.status === 'active' && (
                        <button
                          onClick={() => handleCancelSip(sip.id)}
                          disabled={cancellingId === sip.id}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {cancellingId === sip.id ? 'Cancelling...' : 'Cancel SIP'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium border-white/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <form onSubmit={handleSetupSip} className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">SIP Installment Amount</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-green-400 font-black text-2xl group-focus-within:scale-110 transition-transform">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-6 text-4xl font-black text-white focus:outline-none focus:border-green-500 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setAmount(plan.min_amount.toString());
                        setFrequency(plan.frequency);
                      }}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedPlan?.id === plan.id
                          ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-md shadow-green-500/10'
                          : 'bg-white/5 border-white/5 text-white/60 hover:border-green-500/30'
                        }`}
                    >
                      <p className="font-bold text-sm text-white">{plan.plan_name}</p>
                      <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Min: ₹{plan.min_amount}</p>
                      <p className="text-[10px] uppercase tracking-widest text-green-400 font-bold mt-0.5">{plan.frequency}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Selected Frequency</label>
                    <div className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white capitalize flex items-center justify-between">
                      <span>{frequency}</span>
                      <span className="text-xs text-green-400 font-normal">Cashfree Recurring</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {frequency === 'daily' && (
                      <>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Deduction Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={e => setTime(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-green-500"
                        />
                      </>
                    )}
                    {frequency === 'weekly' && (
                      <>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Deduction Day</label>
                        <select
                          value={day}
                          onChange={e => setDay(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-green-500"
                        >
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </>
                    )}
                    {frequency === 'monthly' && (
                      <>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Deduction Date</label>
                        <select
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-green-500"
                        >
                          <option value="1">1st of the month</option>
                          <option value="5">5th of the month</option>
                          <option value="10">10th of the month</option>
                          <option value="15">15th of the month</option>
                          <option value="20">20th of the month</option>
                          <option value="25">25th of the month</option>
                        </select>
                      </>
                    )}
                    {frequency === 'yearly' && (
                      <>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Month & Date</label>
                        <input
                          type="text"
                          placeholder="e.g., January 1"
                          value={monthDate}
                          onChange={e => setMonthDate(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-green-500"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-start gap-4">
                <div className="mt-1">
                  <ShieldCheck className="text-green-400" size={24} />
                </div>
                <div>
                  <h4 className="text-green-400 font-bold mb-1">Cashfree Auto-Debit Mandate Authorization</h4>
                  <p className="text-green-400/60 text-xs leading-relaxed">
                    By proceeding, you authorize Cashfree to set up an e-Mandate/UPI Autopay for ₹{amount || 0} {frequency === 'daily' ? `daily at ${time}` : frequency === 'weekly' ? `every ${day}` : frequency === 'monthly' ? `on the ${date}th of every month` : `yearly on ${monthDate}`}. Amount will automatically buy and credit pure {metalType} to your digital vault. You can cancel anytime.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black flex items-center justify-center gap-3 py-5 rounded-2xl text-lg shadow-[0_20px_40px_rgba(34,197,94,0.2)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Setting up Auto-Pay...' : 'Authorize Auto-Debit & Start SIP'}
                {!loading && <ChevronRight size={20} />}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Why SIP in {metalType === 'silver' ? 'Silver' : 'Gold'}?</h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-white text-sm font-bold">Rupee Cost Averaging</p>
                  <p className="text-white/40 text-[10px] mt-1">Average out market volatility by investing regularly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-white text-sm font-bold">Hands-Free Discipline</p>
                  <p className="text-white/40 text-[10px] mt-1">Automated e-Mandate cuts balance dynamically</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-white text-sm font-bold">Complete Flexibility</p>
                  <p className="text-white/40 text-[10px] mt-1">Pause or cancel your mandate anytime with zero penalty</p>
                </div>
              </li>
            </ul>
          </div>

          {sipHistory && (
            <div className="card-premium border-white/5 p-6 bg-[#0F0F0F]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm">SIP Installment Monitoring</h3>
                <button 
                  onClick={fetchSipData}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Invested</p>
                  <p className="text-xl font-black text-white">₹{sipHistory.total_invested}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{metalType === 'silver' ? 'Silver' : 'Gold'} Accumulated</p>
                  <p className="text-xl font-black text-green-400">{sipHistory.total_gold}g</p>
                </div>
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Recent Auto-Debited Installments</p>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {!sipHistory.history || sipHistory.history.length === 0 ? (
                  <p className="text-white/30 text-xs italic py-2">No SIP installments deducted yet.</p>
                ) : sipHistory.history.map((txn, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white text-sm font-bold">₹{txn.amount_inr}</p>
                      <p className="text-white/40 text-[10px]">{new Date(txn.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-bold">+{txn.gold_grams}g</p>
                      <p className="text-green-500/80 text-[10px] uppercase font-bold tracking-wider">{txn.status}</p>
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
  */
}
