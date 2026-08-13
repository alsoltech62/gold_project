import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TrendingUp, History, Save, Calendar, Info, Clock, Settings } from 'lucide-react';
import api, { formatINR } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminGoldRate() {
  // Settings state
  const [goldMarkupType, setGoldMarkupType] = useState('fixed');
  const [goldMarkupValue, setGoldMarkupValue] = useState('');
  const [silverMarkupType, setSilverMarkupType] = useState('fixed');
  const [silverMarkupValue, setSilverMarkupValue] = useState('');

  // Manual rate state
  const [goldRate, setGoldRate] = useState('');
  const [silverRate, setSilverRate] = useState('');

  const [history, setHistory] = useState([]);
  const [loadingGold, setLoadingGold] = useState(false);
  const [loadingSilver, setLoadingSilver] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const histRes = await api.get('/admin/gold_rate_history.php');
      setHistory(histRes.data.data || []);
    } catch (e) {
      setHistory([]);
    }

    try {
      const setRes = await api.get('/admin/settings.php');
      if (setRes.data.success) {
        const s = setRes.data.data;
        if (s.gold_markup_type) setGoldMarkupType(s.gold_markup_type);
        if (s.gold_markup_value) setGoldMarkupValue(s.gold_markup_value);
        if (s.silver_markup_type) setSilverMarkupType(s.silver_markup_type);
        if (s.silver_markup_value) setSilverMarkupValue(s.silver_markup_value);
      }
    } catch (e) {
      console.error('Failed to fetch settings');
    }
  };

  const handleGoldUpdate = async (e) => {
    e.preventDefault();
    setLoadingGold(true);
    try {
      if (goldRate && parseFloat(goldRate) > 0) {
        await api.post('/admin/update_rate.php', { rate_per_gram: parseFloat(goldRate), metal_type: 'gold' });
      }
      await api.post('/admin/settings.php', { gold_markup_type: goldMarkupType, gold_markup_value: goldMarkupValue });
      toast.success('Gold manual rate and markup updated successfully!');
      setGoldRate('');
      fetchData();
    } catch (err) {
      toast.error('Failed to update gold settings. Check server connection.');
    }
    setLoadingGold(false);
  };

  const handleSilverUpdate = async (e) => {
    e.preventDefault();
    setLoadingSilver(true);
    try {
      if (silverRate && parseFloat(silverRate) > 0) {
        await api.post('/admin/update_rate.php', { rate_per_gram: parseFloat(silverRate), metal_type: 'silver' });
      }
      await api.post('/admin/settings.php', { silver_markup_type: silverMarkupType, silver_markup_value: silverMarkupValue });
      toast.success('Silver manual rate and markup updated successfully!');
      setSilverRate('');
      fetchData();
    } catch (err) {
      toast.error('Failed to update silver settings. Check server connection.');
    }
    setLoadingSilver(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Market Calibration</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Update manual spot prices and markup for all participants</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gold Update Form */}
        <div className="space-y-6">
          <div className="card-premium border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <h2 className="text-xl font-bold text-[#D4AF37] mb-6 flex items-center gap-2">
              <Settings size={20} />
              Gold Settings
            </h2>

            <form onSubmit={handleGoldUpdate} className="relative z-10 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Manual Gold Rate (per gram)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37] font-black text-lg group-focus-within:scale-110 transition-transform">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={goldRate}
                    onChange={e => setGoldRate(e.target.value)}
                    placeholder="Leave empty for live rate"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Gold Live Rate Markup</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={goldMarkupValue}
                    onChange={e => setGoldMarkupValue(e.target.value)}
                    placeholder="Markup Value"
                    step="0.01"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                  <select
                    value={goldMarkupType}
                    onChange={e => setGoldMarkupType(e.target.value)}
                    className="w-32 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="fixed">Fixed (₹)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingGold}
                className="btn-gold w-full flex items-center justify-center gap-2 py-4 shadow-[0_10px_20px_rgba(212,175,55,0.1)]"
              >
                {loadingGold ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    Update Gold Settings
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Silver Update Form */}
        <div className="space-y-6">
          <div className="card-premium border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-400/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <h2 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
              <Settings size={20} />
              Silver Settings
            </h2>

            <form onSubmit={handleSilverUpdate} className="relative z-10 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Manual Silver Rate (per gram)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 font-black text-lg group-focus-within:scale-110 transition-transform">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={silverRate}
                    onChange={e => setSilverRate(e.target.value)}
                    placeholder="Leave empty for live rate"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-gray-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Silver Live Rate Markup</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={silverMarkupValue}
                    onChange={e => setSilverMarkupValue(e.target.value)}
                    placeholder="Markup Value"
                    step="0.01"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-gray-400 transition-all"
                  />
                  <select
                    value={silverMarkupType}
                    onChange={e => setSilverMarkupType(e.target.value)}
                    className="w-32 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-400"
                  >
                    <option value="fixed">Fixed (₹)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingSilver}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gray-200 text-black font-bold rounded-xl hover:bg-white transition-all shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
              >
                {loadingSilver ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    Update Silver Settings
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4 mt-8">
          <div className="flex items-center gap-3">
            <History className="text-white/20" size={18} />
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Gold Rate History (Manual Overrides)</h3>
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
