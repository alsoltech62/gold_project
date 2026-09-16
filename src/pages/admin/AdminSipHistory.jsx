import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Activity, Users, Pause, Play, XCircle, MessageCircle, RefreshCw } from 'lucide-react';
import api, { formatINR, formatGrams } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSipHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'deductions'

  const [plans, setPlans] = useState([]);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({ plan_name: '', min_amount: '', max_amount: '', frequency: 'monthly' });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    try {
      const [historyRes, plansRes] = await Promise.all([
        api.get('/admin/sip_history.php'),
        api.get('/admin/sip_plans.php')
      ]);
      setData(historyRes.data.data);
      setPlans(plansRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load SIP data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePlan = async () => {
    if (!newPlan.plan_name || !newPlan.min_amount) {
      toast.error('Please enter plan name and minimum amount');
      return;
    }
    try {
      const res = await api.post('/admin/sip_plans.php', newPlan);
      if (res.data.success) {
        toast.success('SIP Plan created successfully');
        setIsCreatingPlan(false);
        setNewPlan({ plan_name: '', min_amount: '', max_amount: '', frequency: 'monthly' });
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to create SIP plan');
    }
  };

  const handleUpdateStatus = async (sip, newStatus) => {
    setUpdatingId(sip.id || sip.user_id);
    try {
      const res = await api.post('/admin/sip_history.php', {
        sip_id: sip.id,
        user_id: sip.user_id,
        status: newStatus
      });
      if (res.data.success) {
        toast.success(`SIP status changed to ${newStatus}`);
        fetchData();
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update SIP status');
    }
    setUpdatingId(null);
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-8"></div>
      <div className="grid grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-white/5 rounded-2xl mt-8"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">SIP Management</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Platform-wide SIP investment, user subscriptions & plan tracking</p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 rounded-xl text-white/60 hover:text-white transition-all flex items-center gap-2 text-sm font-bold w-fit"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden">
          <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-500/20" />
          <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Active Subscriptions</p>
          <p className="text-4xl font-black text-emerald-400 relative z-10">{data?.total_active_sips || data?.active_sips?.filter(s => s.status === 'active').length || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'subscriptions' 
              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' 
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users size={16} />
          Active SIP Subscriptions ({data?.active_sips?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('deductions')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'deductions' 
              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' 
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Calendar size={16} />
          Deduction History ({data?.history?.length || 0})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'subscriptions' ? (
            <div className="card-premium border-white/5 p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="text-[#D4AF37]" size={20} />
                  <h2 className="text-white font-bold text-lg">Enrolled Custodians & SIPs</h2>
                </div>
                <span className="text-xs text-white/40 font-medium">Total: {data?.active_sips?.length || 0}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Custodian</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">SIP Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Frequency</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {!data?.active_sips || data?.active_sips.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-white/30 font-bold uppercase tracking-widest text-xs">
                          No active SIP subscriptions found
                        </td>
                      </tr>
                    ) : data?.active_sips.map((sip, idx) => (
                      <tr key={sip.id || idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-bold text-sm">{sip.user_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-white/30 text-xs">{sip.mobile}</span>
                            {sip.mobile && (
                              <a
                                href={`https://wa.me/91${sip.mobile}?text=${encodeURIComponent(`Hello ${sip.user_name}, regards from GoldBarPe regarding your Gold SIP.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#D4AF37] font-bold text-sm">₹{formatINR(sip.amount)}</p>
                          <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-black uppercase tracking-wider ${
                            sip.metal_type === 'silver' ? 'bg-slate-400/10 text-slate-300 border border-slate-400/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                          }`}>
                            {sip.metal_type || 'Gold'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/80 font-medium capitalize text-sm">
                          {sip.frequency || 'Monthly'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                            sip.status === 'active' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : sip.status === 'paused'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {sip.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {sip.status === 'active' ? (
                              <button
                                onClick={() => handleUpdateStatus(sip, 'paused')}
                                disabled={updatingId === (sip.id || sip.user_id)}
                                title="Pause SIP"
                                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all text-xs flex items-center gap-1 font-bold"
                              >
                                <Pause size={13} />
                                Pause
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(sip, 'active')}
                                disabled={updatingId === (sip.id || sip.user_id)}
                                title="Activate SIP"
                                className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-all text-xs flex items-center gap-1 font-bold"
                              >
                                <Play size={13} />
                                Resume
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(sip, 'cancelled')}
                              disabled={updatingId === (sip.id || sip.user_id) || sip.status === 'cancelled'}
                              title="Cancel SIP"
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs flex items-center gap-1 font-bold disabled:opacity-40"
                            >
                              <XCircle size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card-premium border-white/5 p-0 overflow-hidden">
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
          )}
        </div>

        {/* SIP Plans Side Panel */}
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
                    placeholder="Plan Name (e.g. Daily Gold SIP)"
                    value={newPlan.plan_name}
                    onChange={e => setNewPlan({...newPlan, plan_name: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min Amount (₹)"
                      value={newPlan.min_amount}
                      onChange={e => setNewPlan({...newPlan, min_amount: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                    <select
                      value={newPlan.frequency}
                      onChange={e => setNewPlan({...newPlan, frequency: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleCreatePlan} className="flex-1 bg-[#D4AF37] text-black font-bold py-2 rounded-xl text-sm">Save Plan</button>
                    <button onClick={() => setIsCreatingPlan(false)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreatingPlan(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all text-sm font-bold mt-4"
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
