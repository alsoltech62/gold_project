import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Smartphone, Key, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw, UserPlus, Gift } from 'lucide-react';
import logo from '../assets/GoldBarPay.png';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
  const [mobile, setMobile] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  useEffect(() => {
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

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/send_otp.php', {
        mobile,
        type: 'signup',
        referral_code: referralCode
      });

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
        if (res.data.already_registered) {
          toast.error(res.data.message || 'Already registered. Please login.');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          toast.error(res.data.message || 'Failed to send OTP');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    try {
      const res = await api.post('/auth/send_otp.php', {
        mobile,
        type: 'signup',
        referral_code: referralCode
      });
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
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup.php', {
        mobile,
        otp,
        referral_code: referralCode
      });

      if (res.data.success && res.data.token) {
        login(res.data.user, res.data.token);
        toast.success('🎉 Account created! Welcome to Gold Platform.');
        navigate('/dashboard');
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--bg-void, #070709)' }}>
      {/* ── Ambient background glows ── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
        style={{ background: '#D4AF37', filter: 'blur(130px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: '#D4AF37', filter: 'blur(160px)' }}
      />

      {/* ── LEFT BRANDING PANEL (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative"
        style={{
          background: 'linear-gradient(160deg, rgba(22,18,8,0.96) 0%, rgba(8,6,2,0.99) 100%)',
          borderRight: '1px solid rgba(212,175,55,0.12)'
        }}
      >
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative inline-block">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-50"
              style={{ background: 'rgba(212,175,55,0.5)', transform: 'scale(1.4)' }}
            />
            <img src={logo} alt="GoldBar" className="h-14 relative z-10 object-contain" />
          </div>
        </motion.div>

        <div>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <Gift size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37]">Instant 50 JC Welcome Bonus</span>
            </div>
            <h1 className="text-5xl font-black leading-tight mb-6 text-white">
              Instant Signup.<br />
              <span style={{ background: 'linear-gradient(135deg,#F5C518,#D4AF37,#BF953F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Save in 24K Gold.
              </span>
            </h1>
            <p className="text-base leading-relaxed text-white/40">
              No long forms required. Sign up in seconds with just your mobile number and OTP. Complete your profile anytime directly from your dashboard!
            </p>
          </motion.div>

          {/* Value props */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mt-10">
            {[
              { val: '⚡ 10s', label: 'Fast Signup' },
              { val: '₹10', label: 'Start From' },
              { val: '100%', label: 'Secure Vaults' }
            ].map(s => (
              <div key={s.label} className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <p className="font-black text-lg text-[#D4AF37]">{s.val}</p>
                <p className="text-[11px] mt-1 font-medium text-white/30">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl w-fit"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <ShieldCheck size={16} className="text-[#4ade80]" />
          <span className="text-xs font-semibold text-white/40">Bank-Grade 256-bit Encryption · RBI Compliant</span>
        </motion.div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8 lg:hidden">
            <div className="relative">
              <div className="absolute inset-0 blur-xl opacity-50 rounded-full" style={{ background: 'rgba(212,175,55,0.5)', transform: 'scale(1.5)' }} />
              <img src={logo} alt="GoldBar" className="h-14 relative z-10 object-contain" />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 'mobile' ? (
              <motion.div
                key="step-mobile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      Step 1 of 2
                    </span>
                    <span className="text-xs text-white/40">Quick Registration</span>
                  </div>
                  <h2 className="text-3xl font-black text-white">Create Account</h2>
                  <p className="text-sm mt-1 text-white/40">
                    Enter your mobile number to receive a one-time password
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Mobile input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-white/60">
                      Mobile Number
                    </label>
                    <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/10 focus-within:border-[#D4AF37] bg-white/[0.03] transition-colors">
                      <span className="px-4 py-3.5 text-sm font-bold text-white/50 border-r border-white/10 bg-white/[0.02]">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit number"
                        autoFocus
                        required
                        className="w-full bg-transparent px-4 py-3.5 text-white text-sm font-semibold tracking-wide placeholder-white/20 focus:outline-none"
                      />
                      <Smartphone size={18} className="mr-4 text-white/20 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Referral Code (Optional) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-white/40 flex items-center justify-between">
                      <span>Referral Code</span>
                      <span className="text-[10px] font-normal text-[#D4AF37]">Optional</span>
                    </label>
                    <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/10 focus-within:border-[#D4AF37] bg-white/[0.03] transition-colors">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={e => setReferralCode(e.target.value.trim())}
                        placeholder="Referrer's mobile number"
                        className="w-full bg-transparent px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none"
                      />
                      <Gift size={18} className="mr-4 text-white/20 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="w-full py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #F5C518 0%, #D4AF37 50%, #BF953F 100%)',
                      color: '#070709',
                      boxShadow: mobile.length === 10 ? '0 8px 25px rgba(212,175,55,0.3)' : 'none'
                    }}
                  >
                    {loading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>Get OTP</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      Step 2 of 2
                    </span>
                    <span className="text-xs text-white/40">Verify OTP</span>
                  </div>
                  <h2 className="text-3xl font-black text-white">Enter OTP</h2>
                  <p className="text-sm mt-1 text-white/40">
                    6-digit code sent to <span className="font-bold text-white">+91 {mobile}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyAndSignup} className="space-y-4">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-white/60">
                      One Time Password
                    </label>
                    <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/10 focus-within:border-[#D4AF37] bg-white/[0.03] transition-colors">
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        autoFocus
                        required
                        className="w-full bg-transparent px-4 py-3.5 text-center text-2xl font-black tracking-[0.4em] text-[#D4AF37] placeholder-white/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Resend & Change number row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => { setStep('mobile'); setOtp(''); }}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      Change Number
                    </button>

                    <button
                      type="button"
                      disabled={!canResend || isResending}
                      onClick={handleResendOtp}
                      className="text-[#D4AF37] font-semibold hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                      {canResend ? (isResending ? 'Resending...' : 'Resend OTP') : `Resend in ${resendTimer}s`}
                    </button>
                  </div>

                  {/* Verify & Sign Up button */}
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #F5C518 0%, #D4AF37 50%, #BF953F 100%)',
                      color: '#070709',
                      boxShadow: otp.length === 6 ? '0 8px 25px rgba(212,175,55,0.3)' : 'none'
                    }}
                  >
                    {loading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Sign Up</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Already have an account link */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#D4AF37] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
