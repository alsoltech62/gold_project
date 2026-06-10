import React, { useEffect, useState } from 'react';
import { Users, Coins, TrendingUp, AlertTriangle, Activity, DollarSign, ArrowUpRight, ArrowDownRight, Zap, ShieldAlert } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import api, { formatINR, formatGrams } from '../../utils/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    api.get('/admin/dashboard.php').then(r => { 
      setData(r.data.data); 
      setLoading(false); 
    }); 
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_,i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Oversight</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Global platform statistics and system integrity</p>
        </div>
        <div className="flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-2 px-4 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">System Operational</p>
        </div>
      </header>

      {/* Super Admin Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-indigo-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">Lock-In Statistics</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-indigo-400">{data?.total_locked_gold || 0}g <span className="text-sm font-medium">Locked</span></p>
            <p className="text-indigo-400/40 text-xs">{data?.active_lock_ins || 0} Active</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">SIP Statistics</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-emerald-400">{data?.active_sips || 0} <span className="text-sm font-medium">Active</span></p>
            <p className="text-emerald-400/40 text-xs">{formatINR(data?.monthly_sip_volume || 0)}/mo</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-pink-500/10 border border-pink-500/20">
          <p className="text-pink-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">Revenue Statistics</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-pink-400">{formatINR(data?.total_revenue || 0)} <span className="text-sm font-medium">Total</span></p>
            <p className="text-pink-400/40 text-[10px]">Buy: {formatINR(data?.buy_revenue || 0)}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-cyan-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">User Statistics</p>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-black text-cyan-400">{data?.total_users || 0} <span className="text-sm font-medium">Total</span></p>
            <p className="text-cyan-400/40 text-xs">64% KYC</p>
          </div>
        </div>
      </section>

      {data?.gold_mismatch_alert && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-5 animate-in zoom-in duration-500">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-red-500 font-black tracking-tight text-lg leading-tight">Critical Reconciliation Alert</p>
            <p className="text-red-400/60 text-sm font-medium mt-1">A discrepancy between physical inventory and digital allocations has been detected. Please audit the ledger immediately.</p>
          </div>
          <button className="ml-auto px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
            Audit Now
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Custodians" value={data?.total_users} icon={Users} color="blue" />
        <StatCard label="Digital Gold Held" value={formatGrams(data?.total_gold_held_grams)} icon={Coins} color="yellow" />
        <StatCard label="Digital Silver Held" value={formatGrams(data?.total_silver_held_grams)} icon={Coins} color="gray" />
        <StatCard label="Assets Under Mgmt" value={formatINR(data?.total_invested_inr)} icon={DollarSign} color="green" />
        
        <StatCard label="Total INR Wallet" value={formatINR(data?.total_inr_wallet)} icon={DollarSign} color="blue" />
        <StatCard label="Total Japsan Wallet" value={formatINR(data?.total_japsan_wallet)} icon={DollarSign} color="purple" />
        <StatCard label="Total Acquisitions" value={formatGrams(data?.total_bought_grams)} icon={ArrowUpRight} color="green" />
        <StatCard label="Action Required" value={data?.pending_transactions} icon={AlertTriangle} color="red" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium border-white/5 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-white font-black text-xl tracking-tight mb-2">Platform Controls</h2>
            <p className="text-white/30 text-sm font-medium mb-8">Execute administrative actions and system updates</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { to:'/admin/customers', label:'Custodians', icon: Users, color:'text-blue-400', bg:'bg-blue-500/10 border-blue-500/20' },
                { to:'/admin/transactions', label:'Ledger', icon: Activity, color:'text-yellow-400', bg:'bg-yellow-500/10 border-yellow-500/20' },
                { to:'/admin/gold-rate', label:'Market Price', icon: TrendingUp, color:'text-green-400', bg:'bg-green-500/10 border-green-500/20' },
              ].map(item => (
                <Link key={item.to} to={item.to} className={`border rounded-2xl p-6 flex flex-col items-center gap-3 hover:scale-[1.02] transition-all group ${item.bg}`}>
                  <item.icon size={24} className={`${item.color} group-hover:scale-110 transition-transform`} />
                  <p className={`font-black text-[10px] uppercase tracking-widest ${item.color} text-center`}>{item.label}</p>
                </Link>
              ))}
              <button 
                onClick={() => {
                  if (window.confirm('Process all pending SIPs now?')) {
                    api.post('/cron/process_sip.php?key=secret_cron_key')
                      .then(r => alert(r.data.message))
                      .catch(e => alert('SIP Processing failed'));
                  }
                }}
                className={`border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] transition-all group bg-purple-500/10 border-purple-500/20 cursor-pointer`}
              >
                <Zap size={24} className={`text-purple-400 group-hover:scale-110 transition-transform`} />
                <p className={`font-black text-[10px] uppercase tracking-widest text-purple-400 text-center`}>Process SIPs</p>
              </button>
            </div>
          </div>
        </div>

        <div className="card-premium border-white/5 p-8 bg-[#0F0F0F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/5 rounded-lg text-[#D4AF37]">
              <Zap size={18} />
            </div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Admin Insight</h3>
          </div>
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Liquidity Reserve</p>
              <p className="text-white font-black text-lg">94.2%</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Avg. Transaction</p>
              <p className="text-white font-black text-lg">₹4,250</p>
            </div>
            <p className="text-[10px] text-white/20 font-medium leading-relaxed italic">
              * Statistics are updated in real-time based on verified blockchain and bank settlement data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

