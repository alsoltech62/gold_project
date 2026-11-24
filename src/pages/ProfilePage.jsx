import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Smartphone, 
  Mail, 
  MapPin, 
  Building, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Calendar, 
  Share2, 
  Copy,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import api from '../utils/api';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dob: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    aadhar_number: '',
    pan_number: '',
    aadhar_front: '',
    aadhar_back: '',
    pan_image: '',
    profile_photo: ''
  });
  const [completion, setCompletion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'bank' | 'kyc' | 'referral'

  const calculateLocalCompletion = (data) => {
    let score = 0;
    const missing = [];

    // Mobile
    if (data.mobile) score += 10;
    else missing.push('Mobile Number');

    // Name
    const name = (data.name || '').trim();
    if (name && name.toLowerCase() !== 'user' && name.length >= 2) score += 15;
    else missing.push('Full Name');

    // Email
    if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) score += 10;
    else missing.push('Email Address');

    // DOB
    if (data.dob) score += 10;
    else missing.push('Date of Birth');

    // Address
    if (data.address) score += 5;
    else missing.push('Address');

    // Location
    if (data.city && data.state && data.pincode) score += 10;
    else missing.push('City, State & Pincode');

    // Bank
    if (data.bank_name && data.account_number && data.ifsc_code) score += 20;
    else missing.push('Bank Account Details');

    // KYC
    if (data.pan_number || data.pan_image) score += 10;
    else missing.push('PAN Card');

    if (data.aadhar_number || data.aadhar_front) score += 10;
    else missing.push('Aadhaar Card');

    return {
      percentage: Math.min(100, score),
      is_complete: score >= 100,
      missing_fields: missing
    };
  };

  const fetchProfile = () => {
    api.get('/user/profile.php').then(r => {
      const d = r.data.data || {};
      setForm(prev => ({ ...prev, ...d }));
      if (d.profile_completion) {
        setCompletion(d.profile_completion);
      } else {
        setCompletion(calculateLocalCompletion(d));
      }
    }).catch(() => {});
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/user/profile.php', form);
      if (res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully!');
        if (res.data.data) {
          setForm(prev => ({ ...prev, ...res.data.data }));
          if (res.data.profile_completion) {
            setCompletion(res.data.profile_completion);
          } else {
            setCompletion(calculateLocalCompletion(res.data.data));
          }
        } else {
          fetchProfile();
        }
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch {
      toast.error('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_photo', file);

    const loadingToast = toast.loading('Uploading profile photo...');
    try {
      const res = await api.post('/user/upload_profile_photo.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setForm(prev => ({ ...prev, profile_photo: res.data.profile_photo }));
        toast.success('Photo uploaded!', { id: loadingToast });
        fetchProfile();
      } else {
        toast.error(res.data.message || 'Upload failed', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Upload failed', { id: loadingToast });
    }
  };

  const handleKycUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(fieldName, file);

    const loadingToast = toast.loading(`Uploading ${fieldName.replace('_', ' ')}...`);
    try {
      const res = await api.post('/user/profile.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Document uploaded successfully!', { id: loadingToast });
        if (res.data.data) {
          setForm(prev => ({ ...prev, ...res.data.data }));
          if (res.data.profile_completion) {
            setCompletion(res.data.profile_completion);
          } else {
            setCompletion(calculateLocalCompletion(res.data.data));
          }
        } else {
          fetchProfile();
        }
      } else {
        toast.error(res.data.message || 'Upload failed', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Upload failed', { id: loadingToast });
    }
  };

  const activeCompletion = completion || calculateLocalCompletion(form);
  const percentage = activeCompletion.percentage ?? 0;
  const isComplete = percentage >= 100;
  const missing = activeCompletion.missing_fields || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">My Profile</h1>
          <p className="text-sm text-white/40">Manage your personal information, bank account, and KYC verification</p>
        </div>
      </div>

      {/* ── DYNAMIC PROFILE COMPLETION CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden border"
        style={{
          background: isComplete 
            ? 'linear-gradient(135deg, rgba(20,40,25,0.9) 0%, rgba(10,20,12,0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(32,24,10,0.9) 0%, rgba(18,12,4,0.95) 100%)',
          borderColor: isComplete ? 'rgba(74,222,128,0.3)' : 'rgba(212,175,55,0.25)',
          boxShadow: isComplete ? '0 10px 30px rgba(74,222,128,0.08)' : '0 10px 30px rgba(212,175,55,0.08)'
        }}
      >
        {/* Glow */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: isComplete ? '#4ade80' : '#D4AF37', opacity: 0.15 }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm"
                style={{
                  background: isComplete ? 'rgba(74,222,128,0.15)' : 'rgba(212,175,55,0.15)',
                  color: isComplete ? '#4ade80' : '#D4AF37'
                }}
              >
                {isComplete ? <CheckCircle2 size={20} /> : <Sparkles size={20} />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">Profile Status</p>
                <h3 className="text-lg font-black text-white">
                  {isComplete ? 'Profile 100% Completed' : `Profile ${percentage}% Completed`}
                </h3>
              </div>
            </div>

            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
              style={{
                background: isComplete ? 'rgba(74,222,128,0.2)' : 'rgba(212,175,55,0.15)',
                color: isComplete ? '#4ade80' : '#D4AF37',
                border: `1px solid ${isComplete ? 'rgba(74,222,128,0.4)' : 'rgba(212,175,55,0.3)'}`
              }}
            >
              {isComplete ? 'Fully Verified' : `${percentage}% Done`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: isComplete
                    ? 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)'
                    : 'linear-gradient(90deg, #F5C518 0%, #D4AF37 50%, #BF953F 100%)',
                  boxShadow: isComplete ? '0 0 12px rgba(74,222,128,0.5)' : '0 0 12px rgba(212,175,55,0.5)'
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/40 font-medium">
              <span>0% (Signup)</span>
              <span>50% (Details)</span>
              <span>100% (Complete)</span>
            </div>
          </div>

          {/* Alert / Prompt message */}
          {!isComplete ? (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90">
              <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">Please complete your full profile</p>
                <p className="text-white/60 mt-0.5">
                  Complete remaining fields to enable instant bank withdrawals, secure investments, and fast deliveries.
                </p>
                {missing.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-white/40">Pending:</span>
                    {missing.slice(0, 4).map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] font-semibold">
                        {item}
                      </span>
                    ))}
                    {missing.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px]">
                        +{missing.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span>All details verified! Your profile is 100% completed.</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── USER AVATAR & BASIC BADGE ── */}
      <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-black font-black text-2xl overflow-hidden shadow-lg">
              {form.profile_photo ? (
                <img
                  src={form.profile_photo.startsWith('http') ? form.profile_photo : `https://goldbarpe.com/${form.profile_photo.replace(/^\//, '')}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                (form.name && form.name !== 'User' ? form.name[0]?.toUpperCase() : null) || <User size={28} />
              )}
            </div>
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
              <Upload size={14} className="text-white" />
              <span className="text-[9px] text-white font-bold uppercase mt-0.5">Upload</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-white font-black text-xl flex items-center gap-2">
              {form.name && form.name !== 'User' ? form.name : 'Gold Investor'}
              {isComplete && <ShieldCheck size={18} className="text-[#4ade80]" />}
            </h2>
            <p className="text-white/40 text-sm flex items-center gap-1.5 mt-0.5">
              <Smartphone size={13} /> +91 {form.mobile}
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-white/5 border border-white/10 text-[#D4AF37]">
          {isComplete ? '⭐ Verified Account' : 'Standard Member'}
        </span>
      </div>

      {/* ── SECTION TABS ── */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 overflow-x-auto">
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'bank', label: 'Bank Details', icon: Building },
          { id: 'kyc', label: 'KYC & Docs', icon: ShieldCheck },
          { id: 'referral', label: 'Refer & Earn', icon: Share2 }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── FORM CONTENT ── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-black text-white">Personal Information</h3>
                <p className="text-xs text-white/40">Your basic identity and delivery address</p>
              </div>
              <span className="text-xs text-[#D4AF37] font-semibold">+50% Completion</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name === 'User' ? '' : form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full legal name"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Email Address</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your.name@example.com"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob || ''}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Delivery Address</label>
                <textarea
                  rows={2}
                  value={form.address || ''}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="House/Flat No., Street, Landmark"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">City</label>
                  <input
                    type="text"
                    value={form.city || ''}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">State</label>
                  <input
                    type="text"
                    value={form.state || ''}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={form.pincode || ''}
                  onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="6-digit pincode"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: BANK DETAILS */}
        {activeTab === 'bank' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-black text-white">Bank Account Details</h3>
                <p className="text-xs text-white/40">Required for instant INR bank withdrawals when selling metals</p>
              </div>
              <span className="text-xs text-[#D4AF37] font-semibold">+20% Completion</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={form.account_holder_name || ''}
                  onChange={e => setForm({ ...form, account_holder_name: e.target.value })}
                  placeholder="Name as printed in bank passbook"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={form.bank_name || ''}
                  onChange={e => setForm({ ...form, bank_name: e.target.value })}
                  placeholder="e.g. State Bank of India, HDFC Bank"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Account Number</label>
                <input
                  type="password"
                  value={form.account_number || ''}
                  onChange={e => setForm({ ...form, account_number: e.target.value })}
                  placeholder="Enter full bank account number"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">IFSC Code</label>
                <input
                  type="text"
                  value={form.ifsc_code || ''}
                  onChange={e => setForm({ ...form, ifsc_code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SBIN0001234"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-3 rounded-2xl text-sm uppercase focus:outline-none transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: KYC & VERIFICATION */}
        {activeTab === 'kyc' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-black text-white">KYC & Document Verification</h3>
                <p className="text-xs text-white/40">Verify your government-issued identity cards</p>
              </div>
              <span className="text-xs text-[#D4AF37] font-semibold">+20% Completion</span>
            </div>

            <div className="space-y-4">
              {/* PAN Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">PAN Card</span>
                  {form.pan_image && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Document Uploaded
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={form.pan_number || ''}
                    onChange={e => setForm({ ...form, pan_number: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-2.5 rounded-xl text-sm uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Upload PAN Card Image</label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-[#D4AF37] bg-white/[0.01] cursor-pointer text-xs text-white/60 hover:text-white transition-colors">
                    <Upload size={15} />
                    <span>{form.pan_image ? 'Replace PAN Image' : 'Choose PAN Image'}</span>
                    <input type="file" accept="image/*,.pdf" onChange={e => handleKycUpload(e, 'pan_image')} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Aadhaar Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Aadhaar Card</span>
                  {form.aadhar_front && form.aadhar_back && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Both Sides Uploaded
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Aadhaar 12-Digit Number</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={form.aadhar_number || ''}
                    onChange={e => setForm({ ...form, aadhar_number: e.target.value.replace(/\D/g, '') })}
                    placeholder="12-digit Aadhaar number"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#D4AF37] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Aadhaar Front</label>
                    <label className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-dashed border-white/20 hover:border-[#D4AF37] bg-white/[0.01] cursor-pointer text-xs text-white/60 hover:text-white transition-colors text-center">
                      <Upload size={14} />
                      <span className="truncate">{form.aadhar_front ? '✓ Front Added' : 'Front Side'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={e => handleKycUpload(e, 'aadhar_front')} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Aadhaar Back</label>
                    <label className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-dashed border-white/20 hover:border-[#D4AF37] bg-white/[0.01] cursor-pointer text-xs text-white/60 hover:text-white transition-colors text-center">
                      <Upload size={14} />
                      <span className="truncate">{form.aadhar_back ? '✓ Back Added' : 'Back Side'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={e => handleKycUpload(e, 'aadhar_back')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: REFERRAL & SHARE */}
        {activeTab === 'referral' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4"
          >
            <div className="pb-3 border-b border-white/5">
              <h3 className="text-base font-black text-white">Refer & Earn Rewards</h3>
              <p className="text-xs text-white/40">Invite your friends to Gold Platform and earn bonus coins</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50">Your Referral Code</p>
                  <p className="text-2xl font-black text-[#D4AF37] tracking-wider">{form.mobile || '---'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(form.mobile);
                      toast.success('Referral code copied!');
                    }}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Copy code"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `https://goldbarpe.com/signup?ref=${form.mobile}`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join Gold Platform',
                          text: `Use my referral code ${form.mobile} to sign up and get 50 JC welcome bonus!`,
                          url: shareUrl
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(shareUrl);
                        toast.success('Referral link copied!');
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#F5C518] transition-colors"
                  >
                    <Share2 size={14} />
                    <span>Share Link</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-white/40">
                Share this referral link with friends. When they sign up using simple mobile & OTP, you both receive reward bonuses!
              </p>
            </div>
          </motion.div>
        )}

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #F5C518 0%, #D4AF37 50%, #BF953F 100%)',
            color: '#070709',
            boxShadow: '0 8px 30px rgba(212,175,55,0.25)'
          }}
        >
          {loading ? 'Saving Changes...' : 'Save Profile Details'}
        </button>
      </form>
    </div>
  );
}
