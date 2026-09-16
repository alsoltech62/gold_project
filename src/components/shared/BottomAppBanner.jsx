import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Star, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import logo from '../../assets/GoldBarPay.png';
import { PLAY_STORE_URL } from './AppDownloadPopup';

export default function BottomAppBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('gold_bottom_banner_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setVisible(false);
    sessionStorage.setItem('gold_bottom_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40"
        >
          <div className="relative rounded-2xl bg-gradient-to-r from-[#12100A] via-[#1A1810] to-[#0E0E12] border border-[#D4AF37]/40 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-xl">
            {/* Close / Dismiss */}
            <button
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title="Close banner"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3.5 pr-6">
              {/* Logo Icon */}
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA771C] p-0.5 flex-shrink-0 shadow-lg">
                <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center p-1.5">
                  <img src={logo} alt="GoldBarPay" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-white font-black text-sm tracking-tight truncate">GoldBarPe App</h4>
                  <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">Live</span>
                </div>
                <p className="text-white/60 text-xs truncate mt-0.5">Save in 24K Gold from ₹10 on Android</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-white/50">
                  <span className="flex items-center gap-0.5 text-yellow-400 font-bold">
                    <Star size={10} className="fill-yellow-400" /> 4.8
                  </span>
                  <span>•</span>
                  <span>Google Play</span>
                </div>
              </div>

              {/* Install Button */}
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Download size={14} className="stroke-[2.5]" />
                <span>Install</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
