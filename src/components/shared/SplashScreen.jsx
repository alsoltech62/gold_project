import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logoW from '../../assets/GoldBarPay.png';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0E0B05 0%, #020204 100%)' }}
    >
      {/* Background rings */}
      {[1, 2, 3].map(i => (
        <motion.div key={i}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1 + i * 0.4, opacity: 0 }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{ width: 120, height: 120, border: `1px solid rgba(212,175,55,${0.4 - i * 0.1})` }}
        />
      ))}

      {/* Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: Math.cos(i * 45 * Math.PI / 180) * 80, y: Math.sin(i * 45 * Math.PI / 180) * 80 }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }}
        />
      ))}

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-full blur-2xl opacity-50"
          style={{ background: 'rgba(212,175,55,0.5)', transform: 'scale(1.5)' }} />
        <img src={logoW} alt="GoldBar" className="h-16 relative z-10 object-contain" />
      </motion.div>

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(212,175,55,0.5)' }}>
          Premium Gold Investment
        </p>
      </motion.div>

      {/* Loader bar */}
      <motion.div className="w-40 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <motion.div className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #F5C518, #D4AF37)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, delay: 0.7, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
