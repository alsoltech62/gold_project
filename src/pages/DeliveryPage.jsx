import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Truck, MapPin, Package, ShieldCheck, ArrowRight, Info, History } from 'lucide-react';
import api, { formatGrams } from '../utils/api';
import LockInModal from '../components/shared/LockInModal';

export default function DeliveryPage() {
  const [balance, setBalance] = useState(0);
  const [grams, setGrams] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showLockIn, setShowLockIn] = useState(false);
  const [charges, setCharges] = useState({
    delivery_charge: 150,
    package_charge: 50,
    forwarding_charge: 100
  });

  useEffect(() => {
    api.get('/user/dashboard.php')
      .then(r => setBalance(r.data.data.total_gold_grams || 0))
      .catch(() => setBalance(0));
      
    api.get('/user/deliveries.php')
      .then(r => setHistory(r.data.data || []))
      .catch(() => setHistory([]));

    api.get('/user/settings.php')
      .then(r => {
        if (r.data.success) {
          setCharges(r.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleRequest = async e => {
    e.preventDefault();
    if (!grams || parseFloat(grams) < 1) { 
      toast.error('Minimum 1 gram required for physical delivery'); 
      return; 
    }
    if (parseFloat(grams) > balance) { 
      toast.error('Insufficient gold balance in your vault'); 
      return; 
    }
    if (!address.street || !address.city || !address.pincode) { 
      toast.error('Please complete the full shipping address'); 
      return; 
    }

    setShowLockIn(true);
  };

  const submitDelivery = async () => {
    setLoading(true);
    try {
      const res = await api.post('/delivery/request.php', {
        gold_grams: parseFloat(grams),
        delivery_address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      });
      
      if (res.data.success) {
        toast.success('Physical gold delivery request submitted!', { icon: '📦' });
        setGrams('');
        // Refresh data
        api.get('/user/dashboard.php').then(r => setBalance(r.data.data.total_gold_grams || 0));
        api.get('/user/deliveries.php').then(r => setHistory(r.data.data || []));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to submit delivery request. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Physical Claim</h1>
        <p className="text-white/40 text-sm font-medium mt-1">Request secure delivery of your 24K gold assets</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium border-white/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <form onSubmit={handleRequest} className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Gold Quantity (min 1g)</label>
                <div className="relative group">
                  <input
                    type="number"
                    value={grams}
                    onChange={e => setGrams(e.target.value)}
                    placeholder="1.0000"
                    step="0.0001"
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-4xl font-black text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-white/20 font-black text-2xl group-focus-within:text-blue-500 transition-colors">
                    g
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Shipping Destination</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address / House No."
                      value={address.street}
                      onChange={e => setAddress({...address, street: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={e => setAddress({...address, city: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={e => setAddress({...address, state: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={e => setAddress({...address, pincode: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || balance < 1}
                className="w-full flex items-center justify-center gap-3 py-5 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Package size={20} />
                    Confirm Delivery Request
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Delivery History */}
          <div className="card-premium border-white/5 p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="text-white/20" size={18} />
                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Past Shipments</h3>
              </div>
            </div>
            
            {!history || history.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No physical claims recorded</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {history.map(item => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{formatGrams(item.gold_grams)} Shipment</p>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                          Requested {item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy') : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium border-white/5 p-6 bg-[#0F0F0F]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <MapPin size={18} />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Delivery Info</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Redeemable Balance</p>
                <p className="text-3xl font-black text-white">{formatGrams(balance)}</p>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-wider mt-1">Pure Gold Available</p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-white/40">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Insured Logistics</span>
                </div>
                <div className="flex items-center gap-3 text-white/40">
                  <Info size={16} className="text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">1g Min. Requirement</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Charges Breakdown</p>
                <div className="flex justify-between items-center text-xs text-white/60 font-medium">
                  <span>Delivery Charge</span>
                  <span>₹{charges.delivery_charge}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/60 font-medium">
                  <span>Package Charge</span>
                  <span>₹{charges.package_charge}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/60 font-medium">
                  <span>Forwarding Charge</span>
                  <span>₹{charges.forwarding_charge}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-white font-bold">Total Estimated Cost</span>
                  <span className="text-[#D4AF37] font-black">₹{charges.delivery_charge + charges.package_charge + charges.forwarding_charge}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">
            <p className="text-white font-black text-sm mb-2">Pure Craftsmanship</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
              Every delivery includes a Certificate of Authenticity and BIS Hallmarked 24K Gold coins or bars.
            </p>
          </div>
        </div>
      </div>
      <LockInModal 
        isOpen={showLockIn}
        onClose={() => setShowLockIn(false)}
        title="Earn More Before Delivery"
        message="If you want, you can get additional returns by locking your gold for a specific period before taking delivery."
        primaryActionText="Lock & Earn More"
        secondaryActionText="Continue Delivery"
        onSecondaryAction={() => {
          setShowLockIn(false);
          submitDelivery();
        }}
      />
    </div>
  );
}
