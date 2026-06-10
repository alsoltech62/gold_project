import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  Lock, 
  Zap, 
  Coins,
  ChevronRight,
  UserPlus,
  LogIn,
  CheckCircle,
  Gem,
  BarChart3,
  Globe,
  Sparkles
} from 'lucide-react';
import logoW from '../../assets/logo-w.png';

export default function SplashScreen({ onComplete }) {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parallax Effect Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    mouseX.set(x * 50);
    mouseY.set(y * 50);
    setMousePos({ x: clientX, y: clientY });
  };

  const features = [
    { icon: <TrendingUp size={28} />, title: "Growth", desc: "99.9% Pure 24K Gold" },
    { icon: <Lock size={28} />, title: "Secure", desc: "Bank-Grade Vaults" },
    { icon: <Zap size={28} />, title: "Liquid", desc: "Instant Cash Out" },
    { icon: <Coins size={28} />, title: "Micro", desc: "Start with ₹1" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[100] bg-[#020202] text-white overflow-y-auto overflow-x-hidden selection:bg-[#D4AF37] selection:text-black"
    >
      {/* --- ELITE BACKGROUND SYSTEM --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-[#BF953F]/20 to-transparent rounded-full blur-[160px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-tl from-[#AA771C]/15 to-transparent rounded-full blur-[160px]"
        />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        
        {/* Mouse Glow Follower */}
        <motion.div 
          animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
          transition={{ type: "spring", damping: 50, stiffness: 200 }}
          className="absolute w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px] opacity-50"
        />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-50" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center pt-20 pb-32 px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            style={{ x: springX, y: springY }}
            className="space-y-14"
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <img src={logoW} alt="" className="h-16 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
              </motion.div>

              <h1 className="text-7xl md:text-[9rem] font-black leading-[0.8] tracking-[-0.05em] hidden">
                FUTURE <br />
                <span className="gold-text italic">IN GOLD.</span>
              </h1>

              <p className="text-2xl md:text-3xl text-white/50 max-w-2xl font-medium leading-relaxed">
                The world's most <span className="text-white font-bold">sophisticated</span> digital gold platform. Insured, BIS Hallmarked, and Liquid.
              </p>
            </div>

            {/* Premium Mini Features - Increased Sizes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-500"
                >
                  <div className="text-[#D4AF37] mb-4 group-hover:scale-125 transition-transform">{f.icon}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-white">{f.title}</div>
                  <div className="text-[10px] text-white/40 font-bold mt-2 leading-tight">{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* --- INTERACTIVE CARD WITH IMAGE --- */}
          <div className="relative group perspective-1000">
            <div className="absolute -inset-4 bg-[#D4AF37] rounded-[60px] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
            
            <motion.div
              initial={{ rotateY: 20, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative glass rounded-[60px] p-12 md:p-16 border-white/20 shadow-2xl backdrop-blur-[50px] bg-white/[0.02]"
            >
              <div className="flex flex-col items-center text-center space-y-12">
                
                {/* Gold Bar Image - Fixed Path */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
                >
                  <img 
                    src="/gold_investment_hero.png" 
                    alt="Gold Investment" 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop'; }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter text-white">Start Your Legacy</h2>
                  <p className="text-xl text-white/40 font-medium max-w-xs mx-auto leading-relaxed">Secure your future with BIS Hallmarked 24K Gold.</p>
                </div>

                <div className="w-full space-y-5">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { onComplete(); navigate('/signup'); }}
                    className="btn-gold w-full py-6 rounded-[24px] flex items-center justify-center gap-4 text-2xl font-black group shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
                  >
                    <UserPlus size={28} />
                    <span>Sign Up</span>
                    <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { onComplete(); navigate('/login'); }}
                    className="w-full py-6 rounded-[24px] flex items-center justify-center gap-4 text-2xl font-bold border border-white/10 bg-white/[0.05]"
                  >
                    <LogIn size={28} />
                    <span>Sign In</span>
                  </motion.button>
                </div>

                {/* Partner Logos - Improved Stability */}
                <div className="pt-8 w-full space-y-6">
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Verified Partners</div>
                  <div className="flex justify-around items-center opacity-80 gap-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-6 object-contain invert brightness-200" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 object-contain invert brightness-200" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 object-contain" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- SCROLL REVEAL SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-60 w-full max-w-7xl"
        >
           <div className="grid md:grid-cols-3 gap-10">
             {[
               { 
                 title: "99.9% Purity", 
                 desc: "BIS Hallmarked gold from international refineries. Certified purity in every micro-gram.",
                 icon: <Gem size={48} className="text-[#D4AF37]" />,
                 img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=500&auto=format&fit=crop"
               },
               { 
                 title: "Zero Fees", 
                 desc: "No making charges, no storage fees, no hidden costs. You get exactly what you pay for.",
                 icon: <Sparkles size={48} className="text-[#D4AF37]" />,
                 img: "https://images.unsplash.com/photo-1554133687-68a1990a4242?q=80&w=500&auto=format&fit=crop"
               },
               { 
                 title: "Doorstep Delivery", 
                 desc: "Redeem your digital balance for physical 24K coins and bars, delivered securely to your home.",
                 icon: <Globe size={48} className="text-[#D4AF37]" />,
                 img: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad55?q=80&w=500&auto=format&fit=crop"
               }
             ].map((item, idx) => (
               <motion.div 
                key={idx}
                whileHover={{ y: -20 }}
                className="glass p-12 rounded-[50px] border-white/10 space-y-8 group overflow-hidden relative"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/[0.05] flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                   {item.icon}
                 </div>
                 <h4 className="relative z-10 text-3xl font-black text-white">{item.title}</h4>
                 <p className="relative z-10 text-lg text-white/40 leading-relaxed font-medium">{item.desc}</p>
                 
                 <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity mix-blend-screen pointer-events-none">
                    <img src={item.img} alt="decor" className="w-full h-full object-cover rounded-full" />
                 </div>
               </motion.div>
             ))}
           </div>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-60 flex flex-wrap justify-center gap-24">
           {[
             { label: "Total Savings", val: "₹500Cr+" },
             { label: "Active Users", val: "1.2M+" },
             { label: "Safety Rating", val: "AAA+" }
           ].map((s, i) => (
             <motion.div 
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center"
             >
               <div className="text-xs text-white/30 uppercase tracking-[0.5em] font-black mb-4">{s.label}</div>
               <div className="text-6xl md:text-7xl font-black gold-text">{s.val}</div>
             </motion.div>
           ))}
        </div>

        {/* Footer Links */}
        <div className="mt-40 pt-8 border-t border-white/5 w-full text-center relative z-10">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-white/40">
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors" onClick={() => onComplete()}>About Us</Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors" onClick={() => onComplete()}>Contact Us</Link>
            <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors" onClick={() => onComplete()}>Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D4AF37] transition-colors" onClick={() => onComplete()}>Terms of Service</Link>
            <Link to="/returns" className="hover:text-[#D4AF37] transition-colors" onClick={() => onComplete()}>Returns & Refunds</Link>
          </div>
          <p className="text-[10px] text-white/20 mt-8 uppercase tracking-[0.3em]">© 2026 GoldVault Platform. All Rights Reserved.</p>
        </div>
      </div>
    </motion.div>
  );
}
