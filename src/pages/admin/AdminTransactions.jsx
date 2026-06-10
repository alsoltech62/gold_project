import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Check, History, Filter, ArrowUpRight, ArrowDownRight, Truck, User, Zap, Info } from 'lucide-react';
import api, { formatINR, formatGrams } from '../../utils/api';
import { format } from 'date-fns';

const statusColors = { 
  completed: 'bg-green-500/10 text-green-400 border-green-500/20', 
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', 
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20', 
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
};

export default function AdminTransactions() {
  const [txns, setTxns] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status:'', type:'' });
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ user_id:'', type:'buy', amount_inr:'', gold_grams:'', notes:'', status:'completed' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTxns = () => {
    setLoading(true);
    api.get(`/admin/transactions.php?page=${page}&status=${filters.status}&type=${filters.type}`).then(r => {
      setTxns(r.data.data || []); 
      setPagination(r.data.pagination || {}); 
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchTxns(); }, [page, filters]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/transactions.php?id=${id}`, { status, notes: '' });
      toast.success(`Transaction successfully ${status}!`, { icon: status === 'completed' ? '✅' : '❌' }); 
      fetchTxns();
    } catch { 
      toast.error('Failed to update transaction status.'); 
    }
  };

  const addTransaction = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/transactions.php', addForm);
      toast.success('Transaction manual entry successful!'); 
      setAddModal(false); 
      fetchTxns();
    } catch { 
      toast.error('Failed to create manual transaction.'); 
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">The Ledger</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Global audit of all platform movements</p>
        </div>
        <button 
          onClick={() => setAddModal(true)} 
          className="btn-gold flex items-center gap-2 px-6 py-3"
        >
          <Plus size={18} /> 
          Manual Entry
        </button>
      </header>

      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <select 
            value={filters.status} 
            onChange={e => { setFilters({...filters, status: e.target.value}); setPage(1); }}
            className="bg-white/5 border border-white/10 text-white pl-10 pr-8 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Audit</option>
            <option value="completed">Settled</option>
            <option value="rejected">Reversed</option>
            <option value="processing">In-Transit</option>
          </select>
        </div>
        
        <div className="relative">
          <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <select 
            value={filters.type} 
            onChange={e => { setFilters({...filters, type: e.target.value}); setPage(1); }}
            className="bg-white/5 border border-white/10 text-white pl-10 pr-8 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
          >
            <option value="">All Asset Flows</option>
            <option value="buy">Acquisition</option>
            <option value="sell">Liquidation</option>
            <option value="delivery">Physical Claim</option>
          </select>
        </div>
      </div>

      <div className="card-premium border-white/5 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Custodian / ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Movement Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Asset Weight</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Valuation</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? [...Array(5)].map((_,i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((_,j) => (
                    <td key={j} className="px-6 py-6"><div className="h-4 bg-white/5 rounded w-full" /></td>
                  ))}
                </tr>
              )) : txns.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{t.user_name}</p>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">UID: {t.user_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        t.type === 'buy' ? 'bg-green-400' : t.type === 'sell' ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      <p className="text-white font-black text-xs uppercase tracking-widest">{t.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-white font-bold text-sm">
                    {t.gold_grams ? formatGrams(t.gold_grams) : '---'}
                  </td>
                  <td className="px-6 py-6 text-white font-bold text-sm">
                    {t.amount_inr ? formatINR(t.amount_inr) : '---'}
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                      {format(new Date(t.created_at), 'dd MMM yyyy')}
                    </p>
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                      {format(new Date(t.created_at), 'hh:mm a')}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    {t.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => updateStatus(t.id, 'completed')} 
                          className="w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => updateStatus(t.id, 'rejected')} 
                          className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && txns.length === 0 && (
            <div className="py-20 text-center">
              <History className="mx-auto text-white/10 mb-4" size={48} />
              <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Ledger is empty</p>
            </div>
          )}
        </div>
      </div>

      {addModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="card-premium bg-[#0F0F0F] border-white/10 p-0 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-white font-black uppercase tracking-widest text-xs">Manual Entry Override</h2>
              <button onClick={() => setAddModal(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addTransaction} className="p-8 space-y-5">
              {[
                {f:'user_id', l:'Custodian identifier', i:User, t:'number'},
                {f:'amount_inr', l:'Settlement amount (₹)', i:formatINR(0).charAt(0), t:'number'},
                {f:'gold_grams', l:'Asset weight (g)', i:formatGrams(0).slice(-1), t:'number'},
                {f:'notes', l:'Audit notes', i:Info, t:'text'}
              ].map(field => (
                <div key={field.f} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{field.l}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
                      {typeof field.i === 'string' ? <span className="font-black text-xs">{field.i}</span> : <field.i size={14} />}
                    </div>
                    <input 
                      type={field.t}
                      value={addForm[field.f]} 
                      onChange={e => setAddForm({...addForm, [field.f]: e.target.value})} 
                      placeholder={`Enter ${field.f.replace('_', ' ')}...`}
                      className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all" 
                    />
                  </div>
                </div>
              ))}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Flow Direction</label>
                <select 
                  value={addForm.type} 
                  onChange={e => setAddForm({...addForm, type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
                >
                  <option value="buy">Acquisition (Buy)</option>
                  <option value="sell">Liquidation (Sell)</option>
                  <option value="delivery">Physical Claim (Delivery)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-gold w-full py-4 text-sm mt-4 shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Commit Manual Entry'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

