import React, { useState } from 'react';
import { Calendar, CheckCircle2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function SipPage() {
  const [amount, setAmount] = useState('1000');
  const [frequency, setFrequency] = useState('monthly');
  const [date, setDate] = useState('1');

  const [loading, setLoading] = useState(false);
  const [sipHistory, setSipHistory] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  React.useEffect(() => {
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
      .catch(() => {});

    api.get('/user/sip_history.php')
      .then(r => {
        if (r.data.success) {
          setSipHistory(r.data.data);
        }
      })
      .catch(() => {});
  }, []);

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
      const res = await api.post('/sip/setup.php', { amount, frequency });
      if (res.data.success) {
        toast.success('SIP Setup successfully!');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to setup SIP');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Setup Systematic Investment Plan</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Automate your gold accumulation journey</p>
      </header>

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
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setAmount(plan.min_amount.toString());
                        setFrequency(plan.frequency);
                      }}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        selectedPlan?.id === plan.id 
                          ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                          : 'bg-white/5 border-white/5 text-white/60 hover:border-green-500/30'
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{plan.plan_name}</p>
                      <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Min: ₹{plan.min_amount}</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">{plan.frequency}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Selected Frequency</label>
                    <div className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white capitalize">
                      {frequency}
                    </div>
                  </div>
                <div className="space-y-2">
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
                  </select>
                </div>
              </div>
            </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-start gap-4">
                <div className="mt-1">
                  <ShieldCheck className="text-green-400" size={24} />
                </div>
                <div>
                  <h4 className="text-green-400 font-bold mb-1">Auto-Debit Authorization</h4>
                  <p className="text-green-400/60 text-xs leading-relaxed">
                    By proceeding, you authorize us to deduct ₹{amount || 0} from your linked payment method {frequency === 'monthly' ? `on the ${date}th of every month` : 'every week'}. You can pause or cancel your SIP at any time without penalty.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black flex items-center justify-center gap-3 py-5 rounded-2xl text-lg shadow-[0_20px_40px_rgba(34,197,94,0.2)] transition-all disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Setup Auto-Pay & Start SIP'}
                {!loading && <ChevronRight size={20} />}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Why SIP in Gold?</h3>
            
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
                  <p className="text-white text-sm font-bold">Discipline</p>
                  <p className="text-white/40 text-[10px] mt-1">Build long term wealth effortlessly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-white text-sm font-bold">Flexibility</p>
                  <p className="text-white/40 text-[10px] mt-1">Pause, modify or stop anytime</p>
                </div>
              </li>
            </ul>
          </div>
          
          {sipHistory && (
            <div className="card-premium border-white/5 p-6 bg-[#0F0F0F]">
              <h3 className="text-white font-bold mb-4">SIP Installment Monitoring</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Invested</p>
                  <p className="text-xl font-black text-white">₹{sipHistory.total_invested}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Gold Accumulated</p>
                  <p className="text-xl font-black text-green-400">{sipHistory.total_gold}g</p>
                </div>
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Recent Installments</p>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {sipHistory.history.length === 0 ? (
                  <p className="text-white/30 text-xs italic">No SIP installments yet.</p>
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
}
