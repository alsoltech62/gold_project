import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { 
  User, 
  Smartphone, 
  Mail, 
  MapPin, 
  Building, 
  Flag, 
  Hash, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhar_number: '',
    pan_number: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.name || !formData.mobile || !formData.email) {
        toast.error('Please fill all personal details');
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        toast.error('Please enter a valid 10-digit mobile number');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/signup.php', formData);
      if (res.data.success) {
        toast.success(res.data.message, { duration: 5000 });
        setStep(2); // Success step
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
    }
    setLoading(false);
  };

  const steps = [
    { title: 'Personal', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#BF953F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black gold-text mb-2">Create Account</h1>
          <p className="text-white/40">Join Gold Platform and start saving in 24K Gold</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12 px-8">
          <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-[#D4AF37] -translate-y-1/2 z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor: step > i + 1 ? '#D4AF37' : step === i + 1 ? '#1A1A1A' : '#0A0A0A',
                    borderColor: step >= i + 1 ? '#D4AF37' : '#FFFFFF1A',
                    scale: step === i + 1 ? 1.1 : 1
                  }}
                  className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-white"
                >
                  {step > i + 1 ? <CheckCircle2 size={20} className="text-black" /> : <s.icon size={18} className={step === i + 1 ? 'text-[#D4AF37]' : 'text-white/20'} />}
                </motion.div>
                <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${step >= i + 1 ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium border-white/5 backdrop-blur-xl bg-white/[0.02]">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="input-premium pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 ml-1">Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="input-premium pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="input-premium pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 ml-1">Referral Code (Optional)</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="text"
                          name="referral_code"
                          value={formData.referral_code || ''}
                          onChange={handleChange}
                          placeholder="Referrer's mobile number"
                          className="input-premium pl-12"
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <>Complete Signup <ArrowRight size={18} /></>
                    )}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-24 h-24 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto border-4 border-[#D4AF37]">
                    <CheckCircle2 size={48} className="text-[#D4AF37]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Registration Successful!</h2>
                    <p className="text-white/40 max-w-xs mx-auto">Your account has been created. You can now login using your mobile number and OTP.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="btn-gold w-full flex items-center justify-center gap-2"
                  >
                    Go to Login <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {step < 2 && (
          <p className="text-center mt-8 text-white/40 text-sm">
            Already have an account? <Link to="/login" className="text-[#D4AF37] font-bold hover:underline">Sign In</Link>
          </p>
        )}
      </div>
    </div>
  );
}
