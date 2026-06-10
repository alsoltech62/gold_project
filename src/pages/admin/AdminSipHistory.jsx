import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Activity } from 'lucide-react';
import api, { formatINR, formatGrams } from '../../utils/api';

export default function AdminSipHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [plans, setPlans] = useState([]);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({ plan_name: '', min_amount: '', max_amount: '', frequency: 'monthly' });

  const fetchData = async () => {
    try {
      const [historyRes, plansRes] = await Promise.all([
        api.get('/admin/sip_history.php'),
        api.get('/admin/sip_plans.php')
      ]);
      setData(historyRes.data.data);
      setPlans(plansRes.data.data || []);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePlan = async () => {
    if (!newPlan.plan_name || !newPlan.min_amount) return;
    try {
      const res = await api.post('/admin/sip_plans.php', newPlan);
      if (res.data.success) {
        setIsCreatingPlan(false);
        setNewPlan({ plan_name: '', min_amount: '', max_amount: '', frequency: 'monthly' });
        fetchData();
      }
    } catch (error) {}
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-8"></div>
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-white/5 rounded-2xl mt-8"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">SIP Management</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Platform-wide SIP investment & Plan tracking</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 relative overflow-hidden">
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/20" />
          <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Total SIP Funds Collected</p>
          <p className="text-4xl font-black text-blue-400 relative z-10">{formatINR(data?.total_invested || 0)}</p>
        </div>
        
        <div className="p-8 rounded-3xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 relative overflow-hidden">
          <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-[#D4AF37]/20" />
          <p className="text-[#D4AF37]/60 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Total Gold Allocated via SIP</p>
          <p className="text-4xl font-black text-[#D4AF37] relative z-10">{data?.total_gold || 0}g</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-premium border-white/5 p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
            <Calendar className="text-[#D4AF37]" size={20} />
            <h2 className="text-white font-bold text-lg">Recent SIP Deductions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Custodian</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Invested</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Gold Allocated</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.history?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-white/30 font-bold uppercase tracking-widest text-xs">No SIP transactions found</td>
                  </tr>
                ) : data?.history?.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {new Date(txn.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold text-sm">{txn.user_name}</p>
                      <p className="text-white/30 text-[10px]">{txn.mobile}</p>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {formatINR(txn.amount_inr)}
                    </td>
                    <td className="px-6 py-4 text-[#D4AF37] font-bold">
                      +{txn.gold_grams}g
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border bg-green-500/10 text-green-400 border-green-500/20">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-[#D4AF37]" size={20} />
              <h2 className="text-white font-bold">SIP Plans</h2>
            </div>
            
            <div className="space-y-4">
              {plans?.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-bold text-sm">{p.plan_name}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 capitalize">{p.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{formatINR(p.min_amount)}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Min. Invest</p>
                  </div>
                </div>
              ))}
              
              {isCreatingPlan ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 mt-4">
                  <input
                    type="text"
                    placeholder="Plan Name (e.g. Basic SIP)"
                    value={newPlan.plan_name}
                    onChange={e => setNewPlan({...newPlan, plan_name: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min Amount"
                      value={newPlan.min_amount}
                      onChange={e => setNewPlan({...newPlan, min_amount: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <select
                      value={newPlan.frequency}
                      onChange={e => setNewPlan({...newPlan, frequency: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleCreatePlan} className="flex-1 bg-[#D4AF37] text-black font-bold py-2 rounded-xl">Save</button>
                    <button onClick={() => setIsCreatingPlan(false)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreatingPlan(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-bold mt-4"
                >
                  + Create New SIP Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
