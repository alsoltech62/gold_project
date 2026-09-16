import React, { useState, useEffect } from 'react';
import { Settings, Save, Zap, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    delivery_charge: '',
    package_charge: '',
    forwarding_charge: '',
    sip_penalty_charge: '',
    gold_markup_type: 'fixed',
    gold_markup_value: '',
    gold_markdown_type: 'percent',
    gold_markdown_value: '',
    silver_markup_type: 'fixed',
    silver_markup_value: '',
    silver_markdown_type: 'percent',
    silver_markdown_value: '',
    // WhatsApp Settings
    whatsapp_enabled: '0',
    whatsapp_provider: 'generic',
    whatsapp_api_url: '',
    whatsapp_api_key: '',
    whatsapp_instance_id: '',
    whatsapp_auto_rate_notify: '1'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Test WhatsApp State
  const [testMobile, setTestMobile] = useState('');
  const [testingWa, setTestingWa] = useState(false);

  useEffect(() => {
    api.get('/admin/settings.php').then(r => {
      if (r.data.success) {
        setSettings(prev => ({...prev, ...r.data.data}));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? '1' : '0') : e.target.value;
    setSettings({...settings, [e.target.name]: value});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/admin/settings.php', settings);
      if (res.data.success) {
        toast.success('System & WhatsApp Settings saved successfully!');
      } else {
        toast.error(res.data.message || 'Failed to update settings');
      }
    } catch (err) {
      toast.error('Failed to update settings');
    }
    setSaving(false);
  };

  const handleTestWhatsApp = async () => {
    if (!testMobile) {
      toast.error('Please enter a mobile number to test');
      return;
    }
    setTestingWa(true);
    try {
      const res = await api.post('/admin/test_whatsapp.php', {
        mobile: testMobile,
        message: '🚀 Test alert from GoldBarPe Admin Console: WhatsApp API connection is successful and active!'
      });
      if (res.data.success) {
        toast.success('Test WhatsApp message sent successfully!');
      } else {
        toast.error(res.data.message || 'WhatsApp sending failed. Check credentials.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while contacting WhatsApp API');
    }
    setTestingWa(false);
  };

  if (loading) return <div className="p-8 text-white">Loading system configurations...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Settings className="text-[#D4AF37]" size={32} />
          System Settings & Integrations
        </h1>
        <p className="text-white/40 text-sm font-medium mt-1">Configure global charges, rate markups, and WhatsApp API gateways</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Charges Section */}
        <div className="card-premium border-white/5 p-8 relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-[#D4AF37]" size={20} />
            Platform Charges & Penalties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Delivery Charge (₹)</label>
              <input
                type="number"
                name="delivery_charge"
                value={settings.delivery_charge || ''}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Package Charge (₹)</label>
              <input
                type="number"
                name="package_charge"
                value={settings.package_charge || ''}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Forwarding Charge (₹)</label>
              <input
                type="number"
                name="forwarding_charge"
                value={settings.forwarding_charge || ''}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">SIP Missed Penalty Charge (₹)</label>
              <input
                type="number"
                name="sip_penalty_charge"
                value={settings.sip_penalty_charge || ''}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Markups & Markdowns Section */}
        <div className="card-premium border-white/5 p-8 relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            🏆 Rate Markups & Markdowns
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Gold Live Rate Markup (Buy)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  name="gold_markup_value"
                  value={settings.gold_markup_value || ''}
                  onChange={handleChange}
                  placeholder="Value"
                  className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <select
                  name="gold_markup_type"
                  value={settings.gold_markup_type || 'fixed'}
                  onChange={handleChange}
                  className="w-36 bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="fixed">Fixed (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Gold Markdown (Sell)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  name="gold_markdown_value"
                  value={settings.gold_markdown_value || ''}
                  onChange={handleChange}
                  placeholder="Value"
                  className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <select
                  name="gold_markdown_type"
                  value={settings.gold_markdown_type || 'percent'}
                  onChange={handleChange}
                  className="w-36 bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="fixed">Fixed (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Silver Live Rate Markup (Buy)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  name="silver_markup_value"
                  value={settings.silver_markup_value || ''}
                  onChange={handleChange}
                  placeholder="Value"
                  className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <select
                  name="silver_markup_type"
                  value={settings.silver_markup_type || 'fixed'}
                  onChange={handleChange}
                  className="w-36 bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="fixed">Fixed (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Silver Markdown (Sell)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  name="silver_markdown_value"
                  value={settings.silver_markdown_value || ''}
                  onChange={handleChange}
                  placeholder="Value"
                  className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <select
                  name="silver_markdown_type"
                  value={settings.silver_markdown_type || 'percent'}
                  onChange={handleChange}
                  className="w-36 bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="fixed">Fixed (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp API Integration Section */}
        <div className="card-premium border-emerald-500/20 bg-emerald-950/10 p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageCircle size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">WhatsApp API Integration</h2>
                <p className="text-white/40 text-xs mt-0.5">Automated rate broadcasts, customer alerts & transaction receipts</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="whatsapp_enabled"
                checked={settings.whatsapp_enabled === '1'}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-xs font-bold text-white/80">
                {settings.whatsapp_enabled === '1' ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">WhatsApp Provider</label>
              <select
                name="whatsapp_provider"
                value={settings.whatsapp_provider || 'generic'}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="generic">Generic REST API (Custom HTTP)</option>
                <option value="aisensy">AiSensy (India)</option>
                <option value="wati">WATI (WhatsApp Business)</option>
                <option value="ultramsg">UltraMsg API</option>
                <option value="custom">Custom Webhook</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Auto-Broadcast Rate Updates</label>
              <select
                name="whatsapp_auto_rate_notify"
                value={settings.whatsapp_auto_rate_notify || '1'}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="1">Yes, send WhatsApp alert when Rate is updated</option>
                <option value="0">No, manual only</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">API Endpoint URL</label>
              <input
                type="text"
                name="whatsapp_api_url"
                value={settings.whatsapp_api_url || ''}
                onChange={handleChange}
                placeholder="https://api.provider.com/v1/send or webhook URL"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">API Key / Bearer Token</label>
              <input
                type="password"
                name="whatsapp_api_key"
                value={settings.whatsapp_api_key || ''}
                onChange={handleChange}
                placeholder="Enter API token or Secret Key"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Instance ID / Phone ID (Optional)</label>
              <input
                type="text"
                name="whatsapp_instance_id"
                value={settings.whatsapp_instance_id || ''}
                onChange={handleChange}
                placeholder="e.g. instance10294 or Phone Number ID"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Test WhatsApp Connection */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Test Connection</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                value={testMobile}
                onChange={e => setTestMobile(e.target.value)}
                className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
              <button
                type="button"
                onClick={handleTestWhatsApp}
                disabled={testingWa}
                className="px-6 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {testingWa ? (
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={15} />
                    Send Test WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full btn-gold py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={18} />
              Save All Settings & Configurations
            </>
          )}
        </button>
      </form>
    </div>
  );
}
