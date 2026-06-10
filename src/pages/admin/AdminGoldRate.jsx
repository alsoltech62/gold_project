import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TrendingUp, History, Save, Calendar, Info, Clock } from 'lucide-react';
import api, { formatINR } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminGoldRate() {
  const [rate, setRate] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    api.get('/admin/gold_rate_history.php')
      .then(r => setHistory(r.data.data || []))
      .catch(() => setHistory([]));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!rate || parseFloat(rate) <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/admin/update_rate.php', { rate_per_gram: parseFloat(rate) });
      if (res.data.success) {
        toast.success('Gold rate updated successfully!');
        setRate('');
        fetchHistory();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update gold rate. Check server connection.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Market Calibration</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Update global gold spot prices for all participants</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Update Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-premium border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <form onSubmit={handleUpdate} className="relative z-10 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">New Rate (per gram)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37] font-black text-lg group-focus-within:scale-110 transition-transform">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !rate}
                className="btn-gold w-full flex items-center justify-center gap-2 py-4 shadow-[0_10px_20px_rgba(212,175,55,0.1)]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    Commit Update
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="card-premium border-white/5 p-6 bg-white/[0.02]">
            <div className="flex items-start gap-3">
              <Info className="text-[#D4AF37] shrink-0" size={16} />
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                Updating the rate will immediately affect all buy/sell calculations across the platform. Use with caution.
              </p>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <History className="text-white/20" size={18} />
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Rate Evolution</h3>
          </div>

          <div className="card-premium border-white/5 p-0 overflow-hidden">
            {!history || history.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No history recorded</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Execution Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Spot Price</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((h) => (
                      <tr key={h.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Calendar size={14} className="text-white/20" />
                            <div>
                              <p className="text-white font-bold text-xs">{format(new Date(h.rate_date), 'dd MMM yyyy')}</p>
                              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                <Clock size={10} /> {format(new Date(h.created_at), 'hh:mm a')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#D4AF37] font-black text-sm">{formatINR(h.rate_per_gram)}</p>
                          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-0.5">Per Gram</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[8px] font-black uppercase tracking-widest border border-green-500/20">
                            Active
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
      </div>
    </div>
  );
}
