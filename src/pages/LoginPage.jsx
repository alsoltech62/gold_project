import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Smartphone, Key, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/GoldBarPay.png';

export default function LoginPage() {
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    let timer;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer <= 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

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
        setResendTimer(30);
        setCanResend(false);
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
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--bg-void)' }}>

      {/* ── Ambient glows ── */}
      <motion.div animate={{ scale: [1,1.15,1], opacity:[0.06,0.14,0.06] }} transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
        style={{ background: '#D4AF37', filter: 'blur(120px)' }} />
      <motion.div animate={{ scale: [1,1.2,1], opacity:[0.03,0.08,0.03] }} transition={{ duration: 9, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: '#D4AF37', filter: 'blur(160px)' }} />

      {/* ── LEFT BRANDING PANEL (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative"
        style={{ background: 'linear-gradient(160deg, rgba(22,18,8,0.95) 0%, rgba(8,6,2,0.98) 100%)', borderRight: '1px solid rgba(212,175,55,0.1)' }}>

        {/* Top logo */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: 'rgba(212,175,55,0.5)', transform: 'scale(1.4)' }} />
            <img src={logo} alt="GoldBar" className="h-14 relative z-10 object-contain" />
          </div>
        </motion.div>

        {/* Center content */}
        <div>
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.2 }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(212,175,55,0.5)' }}>Premium Investment</p>
            <h1 className="text-5xl font-black leading-tight mb-6 text-white">
              Invest in<br />
              <span style={{ background: 'linear-gradient(135deg,#F5C518,#D4AF37,#BF953F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Pure Gold
              </span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Buy, sell, and grow your precious metal portfolio with real-time prices and secure digital vaults.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.6 }}
            className="grid grid-cols-3 gap-4 mt-10">
            {[
              { val: '24K', label: 'Pure Gold' },
              { val: '99.9%', label: 'Purity' },
              { val: 'Live', label: 'Prices' },
            ].map(s => (
              <div key={s.label} className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <p className="font-black text-lg" style={{ color: '#D4AF37' }}>{s.val}</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom trust badge */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl w-fit"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Shield size={16} style={{ color: '#4ade80' }} />
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Bank-Grade Security · RBI Compliant</span>
        </motion.div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            className="flex justify-center mb-10 lg:hidden">
            <div className="relative">
              <div className="absolute inset-0 blur-xl opacity-50 rounded-full" style={{ background: 'rgba(212,175,55,0.5)', transform: 'scale(1.5)' }} />
              <img src={logo} alt="GoldBar" className="h-16 relative z-10 object-contain" />
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.15, ease:'easeOut' }}
            className="rounded-[28px] p-8"
            style={{ background: 'rgba(14,12,8,0.95)', border: '1px solid rgba(212,175,55,0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.08)' }}>

            <AnimatePresence mode="wait">
              {step === 'mobile' ? (
                <motion.form key="mobile"
                  initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
                  transition={{ duration:0.25 }} onSubmit={sendOTP} className="space-y-6">

                  <div>
                    <div className="badge-gold mb-5">🔐 Secure Login</div>
                    <h2 className="text-2xl font-black text-white mb-1">Welcome Back</h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Enter your mobile to receive an OTP</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Mobile Number
                    </label>
                    <div className="flex">
                      <div className="flex items-center gap-2 px-4 rounded-l-[14px] flex-shrink-0"
                        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRight: 'none' }}>
                        <Smartphone size={15} style={{ color: 'rgba(212,175,55,0.6)' }} />
                        <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>+91</span>
                      </div>
                      <input type="tel" value={mobile}
                        onChange={e => setMobile(e.target.value.replace(/\D/g,'').slice(0,10))}
                        placeholder="10-digit number"
                        className="input-premium flex-1"
                        style={{ borderRadius: '0 14px 14px 0' }}
                        required />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm">
                    {loading
                      ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto" />
                      : <><span>Send OTP</span><ArrowRight size={16} /></>}
                  </button>
                </motion.form>
              ) : (
                <motion.form key="otp"
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:0.25 }} onSubmit={verifyOTP} className="space-y-6">

                  <div>
                    <div className="badge-gold mb-5">✉️ OTP Sent</div>
                    <h2 className="text-2xl font-black text-white mb-1">Verify OTP</h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Code sent to <span style={{ color: '#D4AF37', fontWeight: 700 }}>+91 {mobile}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      6-Digit OTP
                    </label>
                    <div className="relative">
                      <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(212,175,55,0.5)' }} />
                      <input type="text" value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                        placeholder="• • • • • •"
                        className="input-premium pl-11 text-center text-2xl tracking-[0.6em] font-black"
                        maxLength={6} required />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm">
                    {loading
                      ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto" />
                      : 'Verify & Login'}
                  </button>

                  <div className="flex justify-center mt-2">
                    {isResending ? (
                      <div className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                    ) : (
                      <button 
                        type="button" 
                        onClick={async () => {
                          if (!canResend) return;
                          setIsResending(true);
                          try {
                            const res = await api.post('/auth/send_otp.php', { mobile });
                            if (res.data.success) {
                              toast.success('OTP resent successfully!');
                              if (res.data.dev_otp) {
                                toast(`Developer Mode: Use OTP ${res.data.dev_otp}`, {
                                  icon: '🔑',
                                  duration: 6000,
                                  style: { border: '1px solid #D4AF37', background: '#1A1A1A', color: '#FFF' }
                                });
                              }
                              setResendTimer(30);
                              setCanResend(false);
                            } else {
                              toast.error(res.data.message);
                            }
                          } catch (err) {
                            toast.error('Failed to resend OTP.');
                          }
                          setIsResending(false);
                        }}
                        disabled={!canResend}
                        className="text-xs font-bold transition-colors"
                        style={{ color: canResend ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}
                      >
                        {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
                      </button>
                    )}
                  </div>

                  <button type="button" onClick={() => setStep('mobile')}
                    className="w-full text-sm font-semibold transition-colors py-1"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                    onMouseEnter={e => e.currentTarget.style.color='#D4AF37'}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
                    ← Change mobile number
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Signup link */}
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="text-center mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')}
              className="font-bold transition-colors" style={{ color: '#D4AF37' }}>
              Sign Up
            </button>
          </motion.p>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            className="flex items-center justify-center gap-2 mt-8">
            <Shield size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Secure Multi-Factor Auth
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

