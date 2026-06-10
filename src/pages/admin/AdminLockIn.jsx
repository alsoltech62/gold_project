import React, { useState, useEffect } from 'react';
import { Lock, TrendingUp, AlertTriangle, Shield, Settings } from 'lucide-react';
import api, { formatGrams } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminLockIn() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState({ plan_name: '', months: '', return_percentage: '', min_investment: '', max_investment: '', penalty_percentage: '' });

  const fetchStats = () => {
    api.get('/admin/lockin_stats.php').then(r => {
      setData(r.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreatePlan = async () => {
    if (!newPlan.plan_name || !newPlan.months || !newPlan.return_percentage) return;
    try {
      const res = await api.post('/admin/lockin_plans.php', newPlan);
      if (res.data.success) {
        setIsCreating(false);
        setNewPlan({ plan_name: '', months: '', return_percentage: '', min_investment: '', max_investment: '', penalty_percentage: '' });
        fetchStats();
      } else {
        alert(res.data.message);
      }
    } catch (e) {
      alert('Failed to create plan');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Lock-In Management</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Manage gold lock-in plans and monitor locked assets</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
          <p className="text-[#D4AF37]/60 text-[10px] font-bold uppercase tracking-widest mb-2">Total Locked Gold</p>
          <p className="text-3xl font-black text-[#D4AF37]">{data?.total_locked_gold || 0}g</p>
        </div>
        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">Active Plans</p>
          <p className="text-3xl font-black text-blue-400">{data?.active_plans || 0}</p>
        </div>
        <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-purple-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">Pending Returns</p>
          <p className="text-3xl font-black text-purple-400">{data?.pending_returns || 0}g</p>
        </div>
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">Early Unlocks</p>
          <p className="text-3xl font-black text-red-400">{data?.early_unlocks || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-premium border-white/5 p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Lock className="text-white/60" size={20} />
            <h2 className="text-white font-bold text-lg">Active Lock-In Investments</h2>
          </div>
          {(!data?.active_locks || data.active_locks.length === 0) ? (
            <div className="p-8 text-center text-white/40 font-bold uppercase tracking-widest text-xs">
              No active lock-in records found.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.active_locks.map(lock => (
                <div key={lock.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02]">
                  <div>
                    <p className="text-white font-bold">{lock.user_name}</p>
                    <p className="text-white/40 text-[10px]">{lock.mobile}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] font-bold">{lock.gold_grams}g</p>
                    <p className="text-white/40 text-[10px]">Locked till {format(new Date(lock.end_date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card-premium border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-[#D4AF37]" size={20} />
              <h2 className="text-white font-bold">Lock-In Plans</h2>
            </div>
            
            <div className="space-y-4">
              {data?.plans?.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-bold text-sm">{p.months} Months ({p.plan_name || 'Basic'})</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Min: ₹{p.min_investment} - Penalty: {p.penalty_percentage}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">+{p.return_percentage}%</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Extra Return</p>
                  </div>
                </div>
              ))}
              
              {isCreating ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 mt-4">
                  <input
                    type="text"
                    placeholder="Plan Name (e.g. Silver Lock)"
                    value={newPlan.plan_name}
                    onChange={e => setNewPlan({...newPlan, plan_name: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Duration (Months)"
                      value={newPlan.months}
                      onChange={e => setNewPlan({...newPlan, months: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="number"
                      placeholder="Extra Return (%)"
                      value={newPlan.return_percentage}
                      onChange={e => setNewPlan({...newPlan, return_percentage: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Min Invest"
                      value={newPlan.min_investment}
                      onChange={e => setNewPlan({...newPlan, min_investment: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="number"
                      placeholder="Max Invest"
                      value={newPlan.max_investment}
                      onChange={e => setNewPlan({...newPlan, max_investment: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="number"
                      placeholder="Penalty %"
                      value={newPlan.penalty_percentage}
                      onChange={e => setNewPlan({...newPlan, penalty_percentage: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCreatePlan} className="flex-1 bg-[#D4AF37] text-black font-bold py-2 rounded-xl">Save</button>
                    <button onClick={() => setIsCreating(false)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-bold mt-4"
                >
                  + Create New Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
