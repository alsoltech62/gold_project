import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ChevronRight,
  UserPlus,
  LogIn,
  Gem,
  Sparkles,
  Globe
} from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#BF953F]/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl mx-auto">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">The Future of Gold</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
            Digital <span className="gold-text italic">Legacy.</span>
          </h1>
          
          <p className="text-xl text-white/40 max-w-xl mx-auto font-medium">
            Join the most sophisticated gold savings platform. Secure, BIS Hallmarked, and Liquid.
          </p>
        </motion.div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group max-w-md mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#BF953F] to-[#AA771C] rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass p-10 md:p-14 rounded-[40px] flex flex-col items-center space-y-10 border-white/10 shadow-2xl">
            
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#AA771C] shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center">
              <Shield size={48} className="text-black" />
            </div>

            <div className="w-full space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                className="btn-gold w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-xl font-black group shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
              >
                <UserPlus size={24} />
                <span>Create Account</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-xl font-bold border border-white/10 bg-white/5"
              >
                <LogIn size={24} />
                <span>Sign In</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Standards Row */}
        <div className="flex flex-wrap justify-center gap-12 pt-10">
           <div className="flex items-center gap-3">
             <Gem size={20} className="text-[#D4AF37]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/30">24K 99.9% Pure</span>
           </div>
           <div className="flex items-center gap-3">
             <Shield size={20} className="text-[#D4AF37]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/30">BIS Hallmarked</span>
           </div>
           <div className="flex items-center gap-3">
             <Globe size={20} className="text-[#D4AF37]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Home Delivery</span>
           </div>
        </div>

        {/* Footer Links */}
        <div className="pt-16 pb-8 border-t border-white/5 mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-white/40">
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link>
            <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            <Link to="/returns" className="hover:text-[#D4AF37] transition-colors">Returns & Refunds</Link>
          </div>
          <p className="text-[10px] text-white/20 mt-8 uppercase tracking-[0.3em]">© 2026 GoldVault Platform. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
