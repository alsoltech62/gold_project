import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, X, Users, MapPin, Mail, Phone, Wallet, TrendingUp, Filter } from 'lucide-react';
import api, { formatGrams, formatINR } from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:'', mobile:'', email:'', city:'', state:'' });
  const [saving, setSaving] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    api.get(`/admin/customers.php?page=${page}&search=${search}`).then(r => {
      setCustomers(r.data.data || []); 
      setPagination(r.data.pagination || {}); 
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, [page, search]);

  const handleSave = async e => {
    e.preventDefault(); 
    setSaving(true);
    try {
      if (modal === 'add') { 
        await api.post('/admin/customers.php', form); 
        toast.success('New custodian added successfully!'); 
      } else { 
        await api.put(`/admin/customers.php?id=${modal.id}`, form); 
        toast.success('Custodian profile updated!'); 
      }
      setModal(null); 
      fetchCustomers();
    } catch { 
      toast.error('Operation failed. Please verify the input.'); 
    }
    setSaving(false);
  };

  const Field = ({ label, name, icon: Icon }) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
          <Icon size={14} />
        </div>
        <input 
          value={form[name] || ''} 
          onChange={e => setForm({...form, [name]: e.target.value})} 
          placeholder={`Enter ${label.toLowerCase()}...`}
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all" 
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Custodians</h1>
          <p className="text-white/40 text-sm font-medium mt-1">Manage and audit user portfolios</p>
        </div>
        <button 
          onClick={() => { setForm({name:'',mobile:'',email:'',city:'',state:''}); setModal('add'); }}
          className="btn-gold flex items-center gap-2 px-6 py-3"
        >
          <Plus size={18} /> 
          Register Custodian
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
          <input 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }} 
            placeholder="Search by name, mobile, or identifier..."
            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-[#D4AF37] font-medium transition-all" 
          />
        </div>
        <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all flex items-center gap-2 font-bold text-sm">
          <Filter size={16} />
          Advanced Filters
        </button>
      </div>

      <div className="card-premium border-white/5 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Custodian</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Contact Information</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Holdings</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Wallets</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">SIP</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Valuation</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? [...Array(5)].map((_,i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(8)].map((_,j) => (
                    <td key={j} className="px-6 py-6"><div className="h-4 bg-white/5 rounded w-full" /></td>
                  ))}
                </tr>
              )) : customers.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 font-black">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{c.name}</p>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-0.5">#{c.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 space-y-1">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Phone size={12} className="text-[#D4AF37]/50" /> {c.mobile}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Mail size={12} className="text-[#D4AF37]/50" /> {c.email}
                    </div>
                  </td>
                  <td className="px-6 py-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <Wallet size={12} className="text-[#D4AF37]" />
                      <p className="text-white font-bold text-xs">G: {formatGrams(c.total_gold_grams || 0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet size={12} className="text-gray-400" />
                      <p className="text-white font-bold text-xs">S: {formatGrams(c.total_silver_grams || 0)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-blue-400 font-bold text-xs">₹ {formatINR(c.inr_wallet || 0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-purple-400 font-bold text-xs">J: {formatINR(c.japsan_wallet || 0)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {c.sip_active == 1 ? (
                      <div className="space-y-1">
                        <p className="text-green-400 font-bold text-xs">₹{c.sip_amount}/{c.sip_frequency === 'daily' ? 'd' : 'mo'}</p>
                      </div>
                    ) : (
                      <span className="text-white/20 text-xs font-bold">None</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-green-400" />
                      <p className="text-white font-bold text-sm">{formatINR(c.total_invested_inr || 0)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      c.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {c.is_active ? 'Verified' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => { setForm({...c}); setModal(c); }}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && customers.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto text-white/10 mb-4" size={48} />
              <p className="text-white/30 font-bold uppercase tracking-widest text-xs">No custodians found</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="card-premium bg-[#0F0F0F] border-white/10 p-0 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-white font-black uppercase tracking-widest text-xs">
                {modal === 'add' ? 'Register New Custodian' : 'Modify Profile'}
              </h2>
              <button onClick={() => setModal(null)} className="text-white/20 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <Field label="Full Legal Name" name="name" icon={Users} />
              <Field label="Mobile Number" name="mobile" icon={Phone} />
              <Field label="Email Address" name="email" icon={Mail} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" name="city" icon={MapPin} />
                <Field label="State" name="state" icon={MapPin} />
              </div>
              <button 
                type="submit" 
                disabled={saving} 
                className="btn-gold w-full py-4 text-sm mt-4 shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto"></div>
                ) : (
                  modal === 'add' ? 'Confirm Registration' : 'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

