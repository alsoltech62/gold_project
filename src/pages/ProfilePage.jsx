import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import api from '../utils/api';

export default function ProfilePage() {
  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', state:'', pincode:'', aadhar_number:'', pan_number:'' });
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
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-2xl">
            {form.name?.[0]?.toUpperCase() || <User size={28} />}
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
            <p className="text-gray-500 text-xs mb-4">KYC Information</p>
            <div className="space-y-4">
              <Field label="Aadhar Number" name="aadhar_number" placeholder="12-digit Aadhar" />
              <Field label="PAN Number" name="pan_number" placeholder="ABCDE1234F" />
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
