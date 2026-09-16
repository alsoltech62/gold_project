import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, X, Users, MapPin, Mail, Phone, Wallet, TrendingUp, Filter, MessageCircle, SlidersHorizontal, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import api, { formatGrams, formatINR } from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [modal, setModal] = useState(null); // 'add' | customer object
  const [form, setForm] = useState({ name:'', mobile:'', email:'', city:'', state:'', dob:'' });
  const [saving, setSaving] = useState(false);

  // Adjust Modal state
  const [adjustCustomer, setAdjustCustomer] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    metal_type: 'gold',
    adjustment_type: 'credit',
    grams: '',
    reason: ''
  });
  const [adjusting, setAdjusting] = useState(false);

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

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustCustomer) return;
    if (!adjustForm.grams || parseFloat(adjustForm.grams) <= 0) {
      toast.error('Please enter valid grams amount');
      return;
    }

    setAdjusting(true);
    try {
      const res = await api.post('/admin/adjust_balance.php', {
        user_id: adjustCustomer.id,
        metal_type: adjustForm.metal_type,
        adjustment_type: adjustForm.adjustment_type,
        grams: parseFloat(adjustForm.grams),
        reason: adjustForm.reason || `Admin ${adjustForm.adjustment_type} adjustment`
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Balance adjusted successfully!');
        setAdjustCustomer(null);
        setAdjustForm({ metal_type: 'gold', adjustment_type: 'credit', grams: '', reason: '' });
        fetchCustomers();
      } else {
        toast.error(res.data.message || 'Failed to adjust balance');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while adjusting balance');
    }
    setAdjusting(false);
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
          <p className="text-white/40 text-sm font-medium mt-1">Manage, audit portfolios, WhatsApp connect & adjust holdings</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchCustomers} 
            className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 rounded-xl text-white/60 hover:text-white transition-all flex items-center gap-2 text-sm font-bold"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={() => { setForm({name:'',mobile:'',email:'',city:'',state:''}); setModal('add'); }}
            className="btn-gold flex items-center gap-2 px-6 py-3"
          >
            <Plus size={18} /> 
            Register Custodian
          </button>
        </div>
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
                        {c.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-bold">{c.name}</p>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-0.5">#{c.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 space-y-1">
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Phone size={12} className="text-[#D4AF37]/70" /> {c.mobile}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Mail size={12} className="text-[#D4AF37]/50" /> {c.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <Wallet size={12} className="text-[#D4AF37]" />
                      <p className="text-white font-bold text-xs">Gold: {formatGrams(c.total_gold_grams || 0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet size={12} className="text-slate-400" />
                      <p className="text-white font-bold text-xs">Silver: {formatGrams(c.total_silver_grams || 0)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-blue-400 font-bold text-xs">INR: ₹{formatINR(c.inr_wallet || 0)}</p>
                    </div>
                    {c.japsan_wallet > 0 && (
                      <div className="flex items-center gap-2">
                        <p className="text-purple-400 font-bold text-xs">Japsan: ₹{formatINR(c.japsan_wallet || 0)}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    {c.sip_active == 1 ? (
                      <div className="space-y-1">
                        <p className="text-green-400 font-bold text-xs">₹{formatINR(c.sip_amount)}/{c.sip_frequency === 'daily' ? 'd' : 'mo'}</p>
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
                      {c.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* WhatsApp Button */}
                      {c.mobile && (
                        <a
                          href={`https://wa.me/91${c.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${c.name}, greetings from GoldBarPe.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open WhatsApp Chat"
                          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center group"
                        >
                          <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                        </a>
                      )}

                      {/* Adjust Balance Button */}
                      <button
                        onClick={() => {
                          setAdjustCustomer(c);
                          setAdjustForm({
                            metal_type: 'gold',
                            adjustment_type: 'credit',
                            grams: '',
                            reason: ''
                          });
                        }}
                        title="Adjust Gold / Silver Balance"
                        className="px-3 py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 transition-all flex items-center gap-1.5 text-xs font-bold"
                      >
                        <SlidersHorizontal size={14} />
                        Adjust
                      </button>

                      {/* Edit Profile Button */}
                      <button 
                        onClick={() => { setForm({...c}); setModal(c); }}
                        title="Edit Custodian Profile"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
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

      {/* Adjust Balance Modal */}
      {adjustCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="card-premium bg-[#0F0F0F] border-white/10 p-0 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl rounded-3xl">
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
              <div>
                <h2 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <SlidersHorizontal className="text-[#D4AF37]" size={16} />
                  Adjust Holdings — {adjustCustomer.name}
                </h2>
                <p className="text-white/40 text-xs mt-1">Directly credit or debit Gold / Silver grams for custodian</p>
              </div>
              <button onClick={() => setAdjustCustomer(null)} className="text-white/20 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-8 space-y-5 custom-scrollbar">
                {/* Current Balances Header */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Current Gold</p>
                    <p className="text-lg font-black text-[#D4AF37] mt-0.5">{formatGrams(adjustCustomer.total_gold_grams || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Current Silver</p>
                    <p className="text-lg font-black text-slate-300 mt-0.5">{formatGrams(adjustCustomer.total_silver_grams || 0)}</p>
                  </div>
                </div>

                {/* Metal Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Select Metal</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAdjustForm({...adjustForm, metal_type: 'gold'})}
                      className={`p-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        adjustForm.metal_type === 'gold' 
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      🏆 Gold
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustForm({...adjustForm, metal_type: 'silver'})}
                      className={`p-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        adjustForm.metal_type === 'silver' 
                          ? 'bg-slate-300/20 border-slate-300 text-slate-200' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      🥈 Silver
                    </button>
                  </div>
                </div>

                {/* Adjustment Type (Credit / Debit) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Adjustment Action</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAdjustForm({...adjustForm, adjustment_type: 'credit'})}
                      className={`p-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        adjustForm.adjustment_type === 'credit' 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <ArrowUpRight size={16} />
                      Credit (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustForm({...adjustForm, adjustment_type: 'debit'})}
                      className={`p-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        adjustForm.adjustment_type === 'debit' 
                          ? 'bg-red-500/20 border-red-500 text-red-400' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <ArrowDownRight size={16} />
                      Debit (-)
                    </button>
                  </div>
                </div>

                {/* Grams Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Quantity (Grams)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      placeholder="e.g. 1.5000"
                      value={adjustForm.grams}
                      onChange={e => setAdjustForm({...adjustForm, grams: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#D4AF37] text-lg font-bold"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">Grams</span>
                  </div>
                </div>

                {/* Reason Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Adjustment Reason / Note</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Manual correction, bonus credit, counter purchase, etc."
                    value={adjustForm.reason}
                    onChange={e => setAdjustForm({...adjustForm, reason: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
                  />
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="shrink-0 p-4 md:p-6 border-t border-white/5 bg-[#0C0C10] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustCustomer(null)}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    adjustForm.adjustment_type === 'credit'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20'
                  }`}
                >
                  {adjusting ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    `Confirm ${adjustForm.adjustment_type === 'credit' ? 'Credit' : 'Debit'}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Profile Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="card-premium bg-[#0F0F0F] border-white/10 p-0 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl rounded-3xl">
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
              <div>
                <h2 className="text-white font-black uppercase tracking-widest text-xs">
                  {modal === 'add' ? 'Register New Custodian' : 'Modify Profile'}
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  {modal === 'add' ? 'Add a new custodian record to system' : `Update details for ${modal.name || 'custodian'}`}
                </p>
              </div>
              <button onClick={() => setModal(null)} className="text-white/20 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-8 space-y-4 custom-scrollbar">
                <Field label="Full Legal Name" name="name" icon={Users} />
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="relative group flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
                        <Phone size={14} />
                      </div>
                      <input 
                        value={form.mobile || ''} 
                        onChange={e => setForm({...form, mobile: e.target.value})} 
                        placeholder="Enter mobile..."
                        className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all" 
                      />
                    </div>
                    {form.mobile && (
                      <a
                        href={`https://wa.me/91${form.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${form.name || ''}, regards from GoldBarPe.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open WhatsApp Chat"
                        className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center transition-all"
                      >
                        <MessageCircle size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <Field label="Email Address" name="email" icon={Mail} />
                <Field label="Date of Birth" name="dob" icon={Users} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="City" name="city" icon={MapPin} />
                  <Field label="State" name="state" icon={MapPin} />
                  <Field label="Pincode" name="pincode" icon={MapPin} />
                  <Field label="Address" name="address" icon={MapPin} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Aadhar Number" name="aadhar_number" icon={Users} />
                  <Field label="PAN Number" name="pan_number" icon={Users} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Bank Name" name="bank_name" icon={Wallet} />
                  <Field label="Account Holder" name="account_holder_name" icon={Users} />
                  <Field label="Account Number" name="account_number" icon={Wallet} />
                  <Field label="IFSC Code" name="ifsc_code" icon={Wallet} />
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="shrink-0 p-4 md:p-6 border-t border-white/5 bg-[#0C0C10] flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModal(null)}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="btn-gold px-7 py-3 text-sm shadow-[0_10px_25px_rgba(212,175,55,0.2)] flex items-center justify-center"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    modal === 'add' ? 'Confirm Registration' : 'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
