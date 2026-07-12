import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, TrendingUp, TrendingDown, Wallet, ShoppingCart, ArrowDownToLine, Truck, Activity, ArrowUpRight, Sparkles, Zap } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { format } from 'date-fns';

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const target = parseFloat(value) || 0;
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!ref.current) { ref.current = timestamp; }
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (target - start) * ease);
      if (progress < 1) requestAnimationFrame(step);
    };
    ref.current = null;
    requestAnimationFrame(step);
  }, [target]);

  return <span>{prefix}{typeof display === 'number' ? display.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : display}{suffix}</span>;
}

const particlesData = [
  { size: 3, left: '10%', color: '#D4AF37', duration: '9s', delay: '0s' },
  { size: 2, left: '25%', color: '#F5C518', duration: '12s', delay: '2s' },
  { size: 4, left: '50%', color: '#BF953F', duration: '7s', delay: '1s' },
  { size: 2, left: '70%', color: '#D4AF37', duration: '11s', delay: '3s' },
  { size: 3, left: '85%', color: '#F5C518', duration: '8s', delay: '0.5s' },
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = () => {
    setRefreshing(true);
    api.get('/user/dashboard.php')
      .then(r => { setData(r.data.data); setLoading(false); setRefreshing(false); })
      .catch(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    if (data?.banners?.length > 1) {
      const iv = setInterval(() => setActiveBanner(p => (p + 1) % data.banners.length), 4000);
      return () => clearInterval(iv);
    }
  }, [data?.banners]);

  const pl = data?.profit_loss_inr ?? 0;
  const plPct = data?.total_invested_inr > 0 ? ((pl / data.total_invested_inr) * 100).toFixed(2) : '0.00';
  const goldRate = data?.gold_rate ?? 0;
  const silverRate = data?.silver_rate ?? 0;
  const getBannerUrl = url => url?.startsWith('http') ? url : `https://goldpay.odofast.in/${url}`;

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  if (loading) return (
    <div className="space-y-5 animate-pulse max-w-2xl mx-auto">
      <div className="h-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="h-52 rounded-[28px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="h-44 rounded-[28px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="flex gap-4">
        <div className="h-36 flex-1 rounded-[24px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-36 flex-1 rounded-[24px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5 pb-16">

      {/* ── TICKER BAR ── */}
      <motion.div variants={itemVariants}
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'rgba(12,12,18,0.9)', border: '1px solid rgba(212,175,55,0.12)' }}>
        <div className="flex items-center">
          <div className="flex-shrink-0 px-4 py-3 flex items-center gap-2 border-r" style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.06)' }}>
            <div className="live-dot" style={{ width: 7, height: 7 }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Live</span>
          </div>
          <div className="ticker-wrap flex-1">
            <div className="ticker-track py-3">
              {[1, 2].map(n => (
                <div key={n} className="flex items-center gap-8 flex-shrink-0">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
                    <span style={{ color: '#D4AF37' }}>GOLD</span>
                    <span className="text-white font-bold">₹{formatINR(goldRate)}<span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/gm</span></span>
                    <span className="text-green-400 text-[10px]">▲ 0.12%</span>
                  </div>
                  <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full" style={{ background: '#94a3b8' }} />
                    <span style={{ color: '#94a3b8' }}>SILVER</span>
                    <span className="text-white font-bold">₹{formatINR(silverRate)}<span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/gm</span></span>
                    <span className="text-red-400 text-[10px]">▼ 0.05%</span>
                  </div>
                  <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={fetchDashboard} className="flex-shrink-0 px-4 transition-all"
            style={{ color: 'rgba(212,175,55,0.6)' }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {/* MAIN GRID: left content + right portfolio */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* LEFT COLUMN (3/5 on xl) */}
        <div className="xl:col-span-3 space-y-5">

      {/* ── BANNER CAROUSEL ── */}
      {data?.banners?.length > 0 && (
        <motion.div variants={itemVariants}
          className="relative w-full overflow-hidden rounded-[24px] shadow-2xl"
          style={{ aspectRatio: '16/7', border: '1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeBanner}
              src={getBannerUrl(data.banners[activeBanner].image_url)}
              alt="Promo"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,2,4,0.6) 0%, transparent 60%)' }} />
          {data.banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {data.banners.map((_, i) => (
                <button key={i} onClick={() => setActiveBanner(i)}
                  className="rounded-full transition-all duration-400"
                  style={{ width: activeBanner === i ? 20 : 6, height: 6, background: activeBanner === i ? '#D4AF37' : 'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3">
        {[
          { to: '/buy', icon: ShoppingCart, label: 'Buy', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
          { to: '/sell?metal=gold', icon: TrendingDown, label: 'Sell', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
          { to: '/wallet', icon: Wallet, label: 'SIP', color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)' },
          { to: '/delivery', icon: Truck, label: 'Deliver', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
        ].map((item) => (
          <motion.div key={item.label} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.95 }}>
            <Link to={item.to} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all block"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}20` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ── ACTIVE SIP INFO ── */}
      {data?.sip_active && (
        <motion.div variants={itemVariants} className="flex items-center justify-between p-4 rounded-[20px]"
          style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20 text-green-400">
              <RefreshCw size={20} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-green-400 text-[10px] font-bold uppercase tracking-wider">Active SIP</p>
              <p className="text-white font-bold text-sm">₹{formatINR(data.sip_amount)} / {String(data.sip_frequency || 'MONTHLY').toUpperCase()}</p>
            </div>
          </div>
          <Link to="/wallet" className="text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10">Manage</Link>
        </motion.div>
      )}

      {/* ── RECENT TRANSACTIONS ── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Recent Activity</p>
          <Link to="/transactions" className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors"
            style={{ color: '#D4AF37' }}>
            See All <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="rounded-[22px] overflow-hidden"
          style={{ background: 'rgba(12,12,18,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {data?.recent_transactions?.length > 0 ? data.recent_transactions.map((t, i) => {
            const isBuy = t.type === 'buy';
            const isSell = t.type === 'sell';
            const color = isBuy ? '#4ade80' : isSell ? '#f87171' : '#D4AF37';
            const Icon = isBuy ? ShoppingCart : isSell ? ArrowDownToLine : Truck;
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: i < data.recent_transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm capitalize leading-none">
                      {t.type === 'delivery' ? 'Delivery' : `${t.metal_type || 'Gold'} ${t.type}`}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {format(new Date(t.created_at), 'MMM dd • hh:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">₹{formatINR(t.amount_inr)}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${t.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {t.status}
                  </span>
                </div>
              </motion.div>
            );
          }) : (
            <div className="py-14 text-center">
              <div className="text-4xl mb-3 opacity-30">📊</div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>No recent activity</p>
            </div>
          )}
        </div>
      </motion.div>

        </div>{/* end left col */}

        {/* RIGHT COLUMN (2/5 on xl) */}
        <div className="xl:col-span-2 space-y-5">

      {/* ── PORTFOLIO CARD ── */}
      <motion.div variants={itemVariants} className="relative rounded-[28px] overflow-hidden p-7"
        style={{ background: 'linear-gradient(135deg, #12100A 0%, #0C0A06 50%, #080806 100%)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.1)' }}>

        {/* Floating particles */}
        {particlesData.map((p, i) => (
          <div key={i} className="particle absolute" style={{
            width: p.size, height: p.size, left: p.left, bottom: '20%',
            background: p.color, '--duration': p.duration, '--delay': p.delay,
            boxShadow: `0 0 6px ${p.color}`,
          }} />
        ))}

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full opacity-10"
            style={{ background: '#D4AF37', filter: 'blur(40px)', animation: 'glowBreath 4s ease-in-out infinite' }} />
        </div>

        {/* SVG Chart */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-30">
          <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                <stop offset="50%" stopColor="#F5C518" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,70 Q60,50 100,60 T200,40 T300,55 T400,30" stroke="url(#cg)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M0,70 Q60,50 100,60 T200,40 T300,55 T400,30 L400,100 L0,100 Z" fill="url(#ag)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.25)', backdropFilter: 'blur(10px)' }}>
            <Wallet size={11} style={{ color: '#D4AF37' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#D4AF37' }}>Total Portfolio</span>
          </div>

          <h2 className="font-black text-white mb-3" style={{ fontSize: '2.6rem', lineHeight: 1, letterSpacing: '-0.02em', textShadow: '0 0 40px rgba(212,175,55,0.2)' }}>
            ₹<AnimatedNumber value={data?.current_value_inr ?? 0} />
          </h2>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${pl >= 0 ? '' : ''}`}
            style={{
              background: pl >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
              border: `1px solid ${pl >= 0 ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
              color: pl >= 0 ? '#4ade80' : '#f87171'
            }}>
            {pl >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{pl >= 0 ? '+' : '-'}₹{formatINR(Math.abs(pl))} ({plPct}%)</span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Invested</p>
              <p className="text-white font-bold text-sm">₹{formatINR(data?.total_invested_inr)}</p>
            </div>
            <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Gold</p>
              <p className="font-bold text-sm" style={{ color: '#D4AF37' }}>{formatGrams(data?.total_gold_grams)}g</p>
            </div>
            <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Silver</p>
              <p className="font-bold text-sm" style={{ color: '#94a3b8' }}>{formatGrams(data?.total_silver_grams)}g</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── VAULT CARDS ── */}
      <motion.div variants={itemVariants}>
        <p className="section-label mb-3">Your Vault</p>


        {/* Gold Card */}
        <motion.div whileHover={{ y: -3 }} className="relative rounded-[22px] p-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(22,18,10,0.95), rgba(12,10,6,0.98))', border: '1px solid rgba(212,175,55,0.18)' }}>
          <div className="absolute -right-4 -top-4 text-7xl opacity-[0.07]">🥇</div>
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(212,175,55,0.5), transparent 60%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>🥇</div>
              <div>
                <p className="text-white font-bold text-sm">24K Gold</p>
                <p className="text-xs font-semibold" style={{ color: '#D4AF37' }}>{formatGrams(data?.total_gold_grams)} gm</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2 mt-2">
              <p className="text-xs text-white/50">Locked</p>
              <p className="text-xs font-semibold text-white/80">{formatGrams(data?.locked_gold || 0)}</p>
            </div>
            <div className="divider-gold mb-3 mt-1" />
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Current Value</p>
            <p className="text-white font-bold text-xl mb-4">₹{formatINR(data?.gold_current_value)}</p>
            <div className="flex gap-2">
              <Link to="/buy" className="flex-1 py-2 rounded-xl text-xs font-bold text-center"
                style={{ background: 'rgba(212,175,55,0.9)', color: '#000' }}>Buy Gold</Link>
              <Link to="/sell?metal=gold" className="flex-1 py-2 rounded-xl text-xs font-bold text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>Sell</Link>
            </div>
          </div>
        </motion.div>

        {/* Silver Card */}
        <motion.div whileHover={{ y: -3 }} className="relative rounded-[22px] p-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(16,18,22,0.95), rgba(10,12,16,0.98))', border: '1px solid rgba(148,163,184,0.18)' }}>
          <div className="absolute -right-4 -top-4 text-7xl opacity-[0.07]">🥈</div>
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(148,163,184,0.4), transparent 60%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.25)' }}>🥈</div>
              <div>
                <p className="text-white font-bold text-sm">999 Silver</p>
                <p className="text-xs font-semibold" style={{ color: '#94a3b8' }}>{formatGrams(data?.total_silver_grams)} gm</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2 mt-2">
              <p className="text-xs text-white/50">Locked</p>
              <p className="text-xs font-semibold text-white/80">{formatGrams(data?.locked_silver || 0)}</p>
            </div>
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.3), transparent)', marginBottom: 12, marginTop: 4 }} />
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Current Value</p>
            <p className="text-white font-bold text-xl mb-4">₹{formatINR(data?.silver_current_value)}</p>
            <div className="flex gap-2">
              <Link to="/silver" className="flex-1 py-2 rounded-xl text-xs font-bold text-center"
                style={{ background: 'rgba(203,213,225,0.85)', color: '#000' }}>Buy Silver</Link>
              <Link to="/sell?metal=silver" className="flex-1 py-2 rounded-xl text-xs font-bold text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>Sell</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

        </div>{/* end right col */}
      </div>{/* end main grid */}

    </motion.div>
  );
}
