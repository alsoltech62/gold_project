import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Smartphone, Key, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const sendOTP = async e => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/send_otp.php', { mobile });
      if (res.data.success) {
        toast.success('OTP sent successfully!');
        if (res.data.dev_otp) {
          toast(`Developer Mode: Use OTP ${res.data.dev_otp}`, {
            icon: '🔑',
            duration: 6000,
            style: { border: '1px solid #D4AF37', background: '#1A1A1A', color: '#FFF' }
          });
        }
        setStep('otp');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Connection failed. Please ensure backend is running.');
    }
    setLoading(false);
  };

  const verifyOTP = async e => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify_otp.php', { mobile, otp });
      if (res.data.success) {
        login(res.data.user, res.data.token);
        toast.success('Authentication successful!');
        navigate(res.data.user.is_admin ? '/admin/dashboard' : '/dashboard');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Verification failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs for Premium Feel */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[120px]"
      />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#BF953F] to-[#AA771C] shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-6 transform rotate-12 transition-transform duration-500"
          >
            <Shield size={40} className="text-black" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="gold-text">GoldVault</span>
          </h1>
          <p className="text-white/60 font-medium">The Gold Standard of Digital Savings</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="card-premium border-white/5"
        >
          <AnimatePresence mode="wait">
            {step === 'mobile' ? (
              <motion.form
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={sendOTP}
                className="space-y-6"
              >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-white/40 text-sm">Enter your mobile number to receive an OTP</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone size={18} className="text-white/40" />
                  </div>
                  <div className="flex">
                    <span className="bg-white/5 border border-white/10 border-r-0 pl-10 pr-3 flex items-center text-white/60 rounded-l-xl text-sm font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Mobile Number"
                      className="input-premium rounded-l-none pl-2"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={verifyOTP}
                className="space-y-6"
              >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
                <p className="text-white/40 text-sm">
                  We've sent a code to <span className="text-[#D4AF37] font-semibold">+91 {mobile}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key size={18} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="input-premium pl-12 text-center text-xl tracking-[0.5em] font-bold"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Login'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('mobile')}
                  className="w-full text-white/40 text-sm font-medium hover:text-[#D4AF37] transition-colors"
                >
                  Change Mobile Number
                </button>
              </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-white/40 text-sm"
        >
          Don't have an account? <button onClick={() => navigate('/signup')} className="text-[#D4AF37] font-bold hover:underline">Sign Up</button>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center text-white/30 text-xs mt-8 font-medium uppercase tracking-widest"
        >
          Secure Multi-Factor Authentication
        </motion.p>
      </div>
    </div>
  );
}

