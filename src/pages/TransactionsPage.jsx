import React, { useEffect, useState } from 'react';
import { History, Search, Download, Filter, ArrowUpRight, ArrowDownRight, Truck } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { format } from 'date-fns';

const statusColors = { 
  completed: 'bg-green-500/10 text-green-400 border-green-500/20', 
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', 
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20', 
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
};

export default function TransactionsPage() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/user/transactions.php').then(r => {
      setTxns(r.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredTxns = filter === 'all' ? txns : txns.filter(t => t.type === filter);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Ledger</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Detailed record of all your gold movements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
            <Download size={20} />
          </button>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
            >
              <option value="all">All Records</option>
              <option value="buy">Acquisitions</option>
              <option value="sell">Liquidations</option>
              <option value="delivery">Physical Claims</option>
            </select>
          </div>
        </div>
      </header>

      <div className="card-premium border-white/5 p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <History className="text-white/10" size={32} />
            </div>
            <p className="text-white font-bold text-lg">No records found</p>
            <p className="text-white/30 text-sm mt-2">Adjust your filters or initiate a transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Asset / Reference</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Movement</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Valuation</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Execution Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTxns.map(t => (
                  <tr key={t.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          t.type === 'buy' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                          t.type === 'sell' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                          'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                          {t.type === 'buy' ? <ArrowUpRight size={18} /> : t.type === 'sell' ? <ArrowDownRight size={18} /> : <Truck size={18} />}
                        </div>
                        <div>
                          <p className="text-white font-bold capitalize">{t.type} Gold</p>
                          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-0.5">#{t.id.toString().padStart(6, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-white font-black">{t.gold_grams ? formatGrams(t.gold_grams) : '-'}</p>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">24K Pure Gold</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-white font-bold">{t.amount_inr ? formatINR(t.amount_inr) : '-'}</p>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">@{formatINR(t.gold_rate)}/g</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-white/60 text-xs font-bold">{format(new Date(t.created_at), 'dd MMM yyyy')}</p>
                      <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-0.5">{format(new Date(t.created_at), 'hh:mm a')}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
