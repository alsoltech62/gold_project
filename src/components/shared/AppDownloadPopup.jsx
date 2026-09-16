import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Star, ShieldCheck, Download, Sparkles } from 'lucide-react';
import logo from '../../assets/GoldBarPay.png';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.japsan.goldbarpay';

export function GooglePlayButton({ className = '', style = {} }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-black border border-white/20 hover:border-[#D4AF37] hover:bg-white/5 transition-all duration-300 shadow-xl group text-left ${className}`}
      style={style}
    >
      <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 512 512">
        <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
        <path fill="#34A853" d="M47 38.6c-4.4 9.1-7 19.5-7 30.7v373.4c0 11.2 2.6 21.6 7 30.7l217.1-217.4L47 38.6z" />
        <path fill="#FBBC04" d="M385.4 337.8L104.6 499l220.7-221.3 60.1 60.1z" />
        <path fill="#EA4335" d="M488.5 241.7L385.4 182.2l-60.1 52.1 60.1 52.1 103.1-59.5c9.2-5.3 14.9-15.1 14.9-25.6s-5.7-20.3-14.9-25.6z" />
      </svg>
      <div>
        <span className="block text-[9px] uppercase tracking-widest text-white/50 font-bold leading-none">GET IT ON</span>
        <span className="block text-sm font-bold text-white tracking-wide leading-tight group-hover:text-[#D4AF37] transition-colors">Google Play</span>
      </div>
    </a>
  );
}

export default function AppDownloadPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('gold_app_popup_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('gold_app_popup_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#0D0D11] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden text-center z-10"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* App Icon / Logo */}
            <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#AA771C] rounded-2xl blur-lg opacity-40 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-b from-[#1E1E26] to-[#0A0A0F] border border-[#D4AF37]/40 rounded-2xl flex items-center justify-center p-3 shadow-xl">
                <img src={logo} alt="GoldBarPay App" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black flex items-center gap-0.5">
                <Sparkles size={8} /> LIVE
              </div>
            </div>

            {/* Heading & Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Smartphone size={13} /> Official Android App
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mt-1 mb-2">
              Experience <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3A8] to-[#AA771C] bg-clip-text text-transparent">GoldBarPay</span> on Mobile
            </h3>

            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
              Instant 24K Gold & Silver savings starting from ₹10. Get live price alerts, zero storage fee, and Doorstep Delivery anytime!
            </p>

            {/* Rating and Trust stats */}
            <div className="flex items-center justify-center gap-6 py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-6 text-xs text-white/70">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                <span className="font-bold text-white">4.8</span>
                <span className="text-white/40">(1k+ Reviews)</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck size={15} /> 100% Secure
              </div>
            </div>

            {/* Google Play CTA */}
            <div className="flex flex-col gap-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#f7df84] to-[#AA771C] text-black font-black text-sm tracking-wide hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(212,175,55,0.3)]"
              >
                <Download size={18} className="stroke-[2.5]" />
                Download App on Google Play
              </a>

              <button
                onClick={handleClose}
                className="text-white/40 hover:text-white/70 text-xs font-semibold py-1.5 transition-colors"
              >
                Continue on Web
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
