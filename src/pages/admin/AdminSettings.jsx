import React, { useState, useEffect } from 'react';
import { Settings, Save, Zap } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    delivery_charge: '',
    package_charge: '',
    forwarding_charge: '',
    sip_penalty_charge: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings.php').then(r => {
      if (r.data.success) {
        setSettings(prev => ({...prev, ...r.data.data}));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSettings({...settings, [e.target.name]: e.target.value});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/admin/settings.php', settings);
      if (res.data.success) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update settings');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Settings className="text-[#D4AF37]" size={32} />
          System Settings
        </h1>
        <p className="text-white/40 text-sm font-medium mt-1">Configure global charges and parameters</p>
      </header>

      <div className="card-premium border-white/5 p-8 max-w-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <form onSubmit={handleSave} className="relative z-10 space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Delivery Charge (₹)</label>
            <input
              type="number"
              name="delivery_charge"
              value={settings.delivery_charge}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Package Charge (₹)</label>
            <input
              type="number"
              name="package_charge"
              value={settings.package_charge}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Forwarding Charge (₹)</label>
            <input
              type="number"
              name="forwarding_charge"
              value={settings.forwarding_charge}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">SIP Missed Penalty Charge (₹)</label>
            <input
              type="number"
              name="sip_penalty_charge"
              value={settings.sip_penalty_charge}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-gold py-4 text-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
