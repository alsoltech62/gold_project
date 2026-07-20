import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import api from '../utils/api';

export default function ProfilePage() {
  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', state:'', pincode:'', aadhar_number:'', pan_number:'', dob:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/user/profile.php').then(r => setForm(r.data.data || {})); }, []);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/profile.php', form);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profile_photo', file);
    
    const loadingToast = toast.loading('Uploading photo...');
    try {
      const res = await api.post('/user/upload_profile_photo.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setForm({ ...form, profile_photo: res.data.profile_photo });
        toast.success('Photo uploaded!', { id: loadingToast });
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
        toast.success('Document uploaded!', { id: loadingToast });
        api.get('/user/profile.php').then(r => setForm(r.data.data || {}));
      } else {
        toast.error(res.data.message || 'Upload failed', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Upload failed', { id: loadingToast });
    }
  };

  const Field = ({ label, name, placeholder, type='text' }) => (
    <div>
      <label className="block text-gray-400 text-sm mb-2">{label}</label>
      <input type={type} value={form[name] || ''} onChange={e => setForm({...form, [name]: e.target.value})} placeholder={placeholder}
        className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-600 transition-colors" />
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      <div className="card-dark p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-2xl overflow-hidden">
              {form.profile_photo ? (
                <img src={`https://goldpay.odofast.in${form.profile_photo}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                form.name?.[0]?.toUpperCase() || <User size={28} />
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
              <span className="text-white text-xs">Upload</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">{form.name || 'User'}</h2>
            <p className="text-gray-400 text-sm">+91 {form.mobile}</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Full Name" name="name" placeholder="Your full name" />
          <Field label="Email" name="email" placeholder="your@email.com" type="email" />
          <Field label="Address" name="address" placeholder="Your address" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" name="city" placeholder="City" />
            <Field label="State" name="state" placeholder="State" />
          </div>
          <Field label="Pincode" name="pincode" placeholder="Pincode" />
          <div className="pt-2 border-t border-[#2a2a2a]">
            <p className="text-gray-500 text-xs mb-4">Bank Account Details</p>
            <div className="space-y-4">
              <Field label="Bank Name" name="bank_name" placeholder="e.g., State Bank of India" />
              <Field label="Account Holder Name" name="account_holder_name" placeholder="Name as per bank" />
              <Field label="Account Number" name="account_number" placeholder="Enter account number" />
              <Field label="IFSC Code" name="ifsc_code" placeholder="Enter IFSC code" />
            </div>
          </div>

          <div className="pt-2 border-t border-[#2a2a2a]">
            <p className="text-gray-500 text-xs mb-4">KYC Information</p>
            <div className="space-y-4">
              <Field label="Date of Birth" name="dob" placeholder="YYYY-MM-DD" type="date" />
              <Field label="Aadhar Number" name="aadhar_number" placeholder="12-digit Aadhar" />
              <div>
                <label className="block text-gray-400 text-sm mb-2">Aadhar Front Image</label>
                <div className="flex items-center gap-4">
                  {form.aadhar_front && <span className="text-green-500 text-xs">✓ Uploaded</span>}
                  <input type="file" accept="image/*" onChange={(e) => handleKycUpload(e, 'aadhar_front')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a2a2a] file:text-white hover:file:bg-[#333]" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Aadhar Back Image</label>
                <div className="flex items-center gap-4">
                  {form.aadhar_back && <span className="text-green-500 text-xs">✓ Uploaded</span>}
                  <input type="file" accept="image/*" onChange={(e) => handleKycUpload(e, 'aadhar_back')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a2a2a] file:text-white hover:file:bg-[#333]" />
                </div>
              </div>
              <Field label="PAN Number" name="pan_number" placeholder="ABCDE1234F" />
              <div>
                <label className="block text-gray-400 text-sm mb-2">PAN Card Image</label>
                <div className="flex items-center gap-4">
                  {form.pan_image && <span className="text-green-500 text-xs">✓ Uploaded</span>}
                  <input type="file" accept="image/*" onChange={(e) => handleKycUpload(e, 'pan_image')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2a2a2a] file:text-white hover:file:bg-[#333]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-[#2a2a2a]">
            <p className="text-gray-500 text-xs mb-4">Refer & Earn</p>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
              <p className="text-sm text-gray-400 mb-1">Your Referral Code</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white tracking-widest">{form.mobile || '---'}</span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(form.mobile);
                      toast.success('Referral code copied!');
                    }}
                    className="px-4 py-2 bg-yellow-600/10 text-yellow-500 rounded-lg text-sm font-bold hover:bg-yellow-600/20 transition-colors"
                  >
                    Copy Code
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join GoldBarPay',
                          text: `Use my referral code ${form.mobile} to sign up and earn rewards!`,
                          url: `https://goldpay.odofast.in/signup?ref=${form.mobile}`
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(`https://goldpay.odofast.in/signup?ref=${form.mobile}`);
                        toast.success('Referral link copied!');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600/10 text-blue-500 rounded-lg text-sm font-bold hover:bg-blue-600/20 transition-colors"
                  >
                    Share Link
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Share this code with your friends and earn rewards when they sign up.</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
