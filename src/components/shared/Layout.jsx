import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, ShoppingCart, TrendingDown, TrendingUp, History,
  Truck, User, Settings, LogOut, Menu, X, Bell, Shield, ChevronRight,
  Wallet, Ticket, Star, Lock, ArrowLeft, Zap, Globe, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoW from '../../assets/GoldBarPay.png';

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#D4AF37' },
  { to: '/wallet', icon: Wallet, label: 'Wallet & SIP', color: '#818cf8' },
  { isAction: true, action: 'buy', icon: ShoppingCart, label: 'Buy', color: '#4ade80' },
  { isAction: true, action: 'sell', icon: TrendingDown, label: 'Sell', color: '#f87171' },
  { to: '/transactions', icon: History, label: 'Transactions', color: '#60a5fa' },
  { to: '/lock-in', icon: Lock, label: 'Lock & Earn', color: '#a78bfa' },
  { to: '/network', icon: Star, label: 'Refer & Earn', color: '#fb923c' },
  { to: '/delivery', icon: Truck, label: 'Delivery', color: '#34d399' },
  { to: '/profile', icon: User, label: 'Profile', color: '#f472b6' },
  { to: '/support', icon: Ticket, label: 'Support', color: '#94a3b8' },
];

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#D4AF37' },
  { to: '/admin/customers', icon: User, label: 'Customers', color: '#60a5fa' },
  { to: '/admin/transactions', icon: History, label: 'Transactions', color: '#4ade80' },
  { to: '/admin/lock-in', icon: Lock, label: 'Lock-In Mgmt', color: '#a78bfa' },
  { to: '/admin/sip-history', icon: TrendingUp, label: 'SIP Management', color: '#fb923c' },
  { to: '/admin/gold-rate', icon: Settings, label: 'Gold Rate', color: '#D4AF37' },
  { to: '/admin/deliveries', icon: Truck, label: 'Deliveries', color: '#34d399' },
  { to: '/admin/withdrawals', icon: Wallet, label: 'Withdrawals', color: '#818cf8' },
  { to: '/admin/support-tickets', icon: Ticket, label: 'Support Tickets', color: '#f87171' },
  { to: '/admin/notifications', icon: Bell, label: 'Send Notification', color: '#facc15' },
  { to: '/admin/banners', icon: Globe, label: 'Banners', color: '#60a5fa' },
  { to: '/admin/settings', icon: Settings, label: 'Settings', color: '#94a3b8' },
];

export default function Layout({ isAdmin }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [open, setOpen] = useState(false);
  const nav = isAdmin ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close mobile sidebar on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const NavItem = ({ to, icon: Icon, label, isAction, action, color }) => {
    const isActive = location.pathname === to;

    if (isAction) {
      return (
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setOpen(false);
            if (action === 'buy') setShowBuyModal(true);
            if (action === 'sell') setShowSellModal(true);
          }}
          className="nav-item w-full group"
          style={{ border: '1px solid transparent' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <span style={{ fontSize: '13.5px' }}>{label}</span>
          </div>
          <ChevronRight size={13} className="opacity-0 group-hover:opacity-50 transition-opacity" />
        </motion.button>
      );
    }

    return (
      <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
        <NavLink
          to={to}
          className={`nav-item group ${isActive ? 'active' : ''}`}
          style={isActive ? { border: `1px solid ${color}20` } : { border: '1px solid transparent' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: isActive ? `${color}20` : `${color}10`,
                border: `1px solid ${isActive ? `${color}35` : `${color}15`}`,
              }}
            >
              <Icon size={15} style={{ color: isActive ? color : `${color}99` }} />
            </div>
            <span style={{ fontSize: '13.5px', color: isActive ? '#fff' : undefined }}>{label}</span>
          </div>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
            />
          )}
        </NavLink>
      </motion.div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-lg opacity-60" style={{ background: 'rgba(212,175,55,0.4)' }} />
            <img src={logoW} alt="GoldBar" className="h-14 relative z-10 object-contain" />
          </div>
        </motion.div>
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="mx-4 mb-4 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <Shield size={12} className="text-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest">Administrator</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar space-y-1">
        <p className="section-label px-3 mb-3 mt-1">Navigation</p>
        {nav.map((item, i) => (
          <motion.div
            key={item.to || item.action}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <NavItem {...item} />
          </motion.div>
        ))}

        {!isAdmin && (
          <>
            <div className="divider-gold my-4" />
            <p className="section-label px-3 mb-3">Quick Links</p>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/privacy', label: 'Privacy' },
                { to: '/terms', label: 'Terms' },
                { to: '/returns', label: 'Returns' },
              ].map(link => (
                <NavLink key={link.to} to={link.to}
                  className="text-center py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200"
                  style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User Card */}
      <div className="p-4 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #AA771C)', color: '#000' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2"
                style={{ borderColor: '#0A0A16' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate leading-none">{user?.name || 'User'}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {user?.mobile}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
            style={{ color: '#f87171', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.12)' }}
          >
            <LogOut size={13} />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-void)' }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 sidebar-glass" style={{ height: '100vh' }}>
        {sidebarContent}
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden sidebar-glass"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="header-glass flex items-center justify-between px-5 lg:px-8 h-[68px] flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            {/* Back button */}
            {location.pathname !== '/dashboard' && location.pathname !== '/admin/dashboard' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
              >
                <ArrowLeft size={18} />
              </motion.button>
            )}
            {/* Mobile menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
              onClick={() => setOpen(!open)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {open ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Center - Live Market */}
          <div className="hidden lg:flex items-center gap-3 px-5 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="live-dot" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Market Live</span>
            <Zap size={11} className="text-yellow-400" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAdmin ? '/admin/notifications' : '/notifications')}
              className="relative p-2.5 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 border-2"
                style={{ borderColor: 'var(--bg-void)' }} />
            </motion.button>

            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.06)' }} />

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-white font-bold text-sm leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#D4AF37' }}>Verified</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #AA771C)', color: '#000', boxShadow: '0 0 15px rgba(212,175,55,0.25)' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto custom-scrollbar" style={{ background: 'var(--bg-void)' }}>
          <div className="relative">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04]"
              style={{ background: 'radial-gradient(ellipse, #D4AF37 0%, transparent 70%)', animation: 'glowBreath 6s ease-in-out infinite' }} />

            <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-12 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {outlet}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* ── Buy Modal ── */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowBuyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="w-full max-w-sm rounded-[28px] p-6 space-y-5"
              style={{ background: 'rgba(18,18,26,0.98)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>Investment</p>
                <h3 className="text-xl font-bold text-white">Choose Metal</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link onClick={() => setShowBuyModal(false)} to="/buy"
                  className="p-5 rounded-2xl text-center transition-all group"
                  style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p className="text-3xl mb-2">🥇</p>
                  <p className="text-white font-bold text-sm">Gold</p>
                  <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(212,175,55,0.6)' }}>24K · 999 Pure</p>
                </Link>
                <Link onClick={() => setShowBuyModal(false)} to="/silver"
                  className="p-5 rounded-2xl text-center transition-all group"
                  style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p className="text-3xl mb-2">🥈</p>
                  <p className="text-white font-bold text-sm">Silver</p>
                  <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(148,163,184,0.6)' }}>99.9% Pure</p>
                </Link>
              </div>
              <button onClick={() => setShowBuyModal(false)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sell Modal ── */}
      <AnimatePresence>
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowSellModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="w-full max-w-sm rounded-[28px] p-6 space-y-5"
              style={{ background: 'rgba(18,18,26,0.98)', border: '1px solid rgba(248,113,113,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(248,113,113,0.6)' }}>Liquidate</p>
                <h3 className="text-xl font-bold text-white">Sell Metal</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link onClick={() => setShowSellModal(false)} to="/sell?metal=gold"
                  className="p-5 rounded-2xl text-center transition-all"
                  style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p className="text-3xl mb-2">🥇</p>
                  <p className="text-white font-bold text-sm">Gold</p>
                </Link>
                <Link onClick={() => setShowSellModal(false)} to="/sell?metal=silver"
                  className="p-5 rounded-2xl text-center transition-all"
                  style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p className="text-3xl mb-2">🥈</p>
                  <p className="text-white font-bold text-sm">Silver</p>
                </Link>
              </div>
              <button onClick={() => setShowSellModal(false)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
