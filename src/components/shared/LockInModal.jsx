import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LockInModal({ isOpen, onClose, title, message, primaryActionText, secondaryActionText, onSecondaryAction }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0A0A0A] border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-8 text-center relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center text-[#D4AF37] mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <Lock size={32} />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">{message}</p>

            <div className="card-premium border-white/5 p-4 mb-8 bg-white/[0.02] text-left">
              <div className="flex items-center gap-3">
                <Shield className="text-[#D4AF37] shrink-0" size={16} />
                <p className="text-white/80 text-xs font-medium">Earn up to 12% guaranteed extra return by locking your gold securely with us.</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/lock-in')}
                className="w-full btn-gold py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                {primaryActionText}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onSecondaryAction) onSecondaryAction();
                }}
                className="w-full py-4 text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
              >
                {secondaryActionText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
