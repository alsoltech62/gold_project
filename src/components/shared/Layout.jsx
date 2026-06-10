import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingCart, TrendingDown, TrendingUp, History, Truck, User, Settings, LogOut, Menu, X, Bell, Shield, ChevronRight, Wallet, Ticket, Star, FileText, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoW from '../../assets/logo-w.png';

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/wallet', icon: Wallet, label: 'Wallet & SIP' },
  { isAction: true, action: 'buy', icon: ShoppingCart, label: 'Buy' },
  { isAction: true, action: 'sell', icon: TrendingDown, label: 'Sell' },
  { to: '/transactions', icon: History, label: 'Transactions' },
  { to: '/lock-in', icon: Lock, label: 'Lock & Earn' },
  { to: '/delivery', icon: Truck, label: 'Delivery' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/support', icon: Ticket, label: 'Support' },
];

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/customers', icon: User, label: 'Customers' },
  { to: '/admin/transactions', icon: History, label: 'Transactions' },
  { to: '/admin/lock-in', icon: Lock, label: 'Lock-In Mgmt' },
  { to: '/admin/sip-history', icon: TrendingUp, label: 'SIP Management' },
  { to: '/admin/gold-rate', icon: Settings, label: 'Gold Rate' },
  { to: '/admin/deliveries', icon: Truck, label: 'Deliveries' },
  { to: '/admin/support-tickets', icon: Ticket, label: 'Support Tickets' },
  { to: '/admin/notifications', icon: Bell, label: 'Send Notification' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
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

  const NavItem = ({ to, icon: Icon, label, isAction, action }) => {
    const isActive = location.pathname === to;
    
    if (isAction) {
      return (
        <button
          onClick={() => {
            setOpen(false);
            if (action === 'buy') setShowBuyModal(true);
            if (action === 'sell') setShowSellModal(true);
          }}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group text-white/50 hover:text-white hover:bg-white/5`}
        >
          <div className="flex items-center gap-3">
            <Icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="font-medium tracking-wide">{label}</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      );
    }

    return (
      <NavLink
        to={to}
        onClick={() => setOpen(false)}
        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
            isActive
              ? 'bg-gradient-to-r from-[#BF953F]/20 to-transparent border border-[#BF953F]/30 text-[#D4AF37]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="transition-transform group-hover:scale-110" />
          <span className="font-medium tracking-wide">{label}</span>
        </div>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F0F0F] border-r border-white/5 flex flex-col transform transition-all duration-500 lg:relative lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.8)]' : '-translate-x-full'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <img src={logoW} alt="Logo" className="h-10 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="mx-6 mb-6 flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-[#D4AF37]/20">
            <Shield size={12} />
            <span>Administrator Portal</span>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Navigation</p>
          {nav.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          
          <p className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-8 mb-4">Quick Links</p>
          <div className="px-4 grid grid-cols-2 gap-2 text-xs">
            <NavLink to="/about" className="text-white/40 hover:text-white transition-colors">About Us</NavLink>
            <NavLink to="/privacy" className="text-white/40 hover:text-white transition-colors">Privacy</NavLink>
            <NavLink to="/terms" className="text-white/40 hover:text-white transition-colors">Terms</NavLink>
            <NavLink to="/returns" className="text-white/40 hover:text-white transition-colors">Returns</NavLink>
          </div>
        </nav>

        <div className="p-6 mt-auto">
          <div className="card-premium border-white/5 p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] font-bold border border-white/10">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{user?.name || 'User'}</p>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-wider">{user?.mobile}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setOpen(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-30">
          <button className="lg:hidden p-2 text-white/50 hover:text-[#D4AF37] transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden lg:flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
            <span>Market Live</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(isAdmin ? '/admin/notifications' : '/notifications')}
              className="text-white/40 hover:text-[#D4AF37] relative transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full border-2 border-[#0A0A0A]"></span>
            </button>

            <div className="h-8 w-[1px] bg-white/5"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white text-xs font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mt-1">Verified</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BF953F] to-[#AA771C] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0A0A0A] relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Buy Metal Selection Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white text-center">Select Metal to Buy</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link onClick={() => setShowBuyModal(false)} to="/buy" className="p-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-center hover:bg-[#D4AF37]/20 transition-all">
                <p className="text-2xl mb-2">🥇</p>
                <p className="text-white font-bold">Gold</p>
                <p className="text-white/40 text-[10px]">24K / 999</p>
              </Link>
              <Link onClick={() => setShowBuyModal(false)} to="/silver" className="p-4 rounded-xl border border-blue-400/30 bg-blue-400/10 text-center hover:bg-blue-400/20 transition-all">
                <p className="text-2xl mb-2">🥈</p>
                <p className="text-white font-bold">Silver</p>
                <p className="text-white/40 text-[10px]">99.9% Pure</p>
              </Link>
            </div>
            <button onClick={() => setShowBuyModal(false)} className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* Sell Metal Selection Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white text-center">Select Metal to Sell</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link onClick={() => setShowSellModal(false)} to="/sell" className="p-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-center hover:bg-[#D4AF37]/20 transition-all">
                <p className="text-2xl mb-2">🥇</p>
                <p className="text-white font-bold">Gold</p>
              </Link>
              <Link onClick={() => setShowSellModal(false)} to="/silver" className="p-4 rounded-xl border border-blue-400/30 bg-blue-400/10 text-center hover:bg-blue-400/20 transition-all">
                <p className="text-2xl mb-2">🥈</p>
                <p className="text-white font-bold">Silver</p>
                <p className="text-white/40 text-[10px]">Asset</p>
              </Link>
            </div>
            <button onClick={() => setShowSellModal(false)} className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

