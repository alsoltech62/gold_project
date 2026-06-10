import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BuyFlowPage from './pages/BuyFlowPage';
import BuyGoldPage from './pages/BuyGoldPage';
import SipPage from './pages/SipPage';
import SellFlowPage from './pages/SellFlowPage';
import SellGoldPage from './pages/SellGoldPage';
import LockInPage from './pages/LockInPage';
import DeliveryPage from './pages/DeliveryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminLockIn from './pages/admin/AdminLockIn';
import AdminSipHistory from './pages/admin/AdminSipHistory';
import AdminGoldRate from './pages/admin/AdminGoldRate';
import AdminDeliveries from './pages/admin/AdminDeliveries';
import AdminSupportTickets from './pages/admin/AdminSupportTickets';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminSettings from './pages/admin/AdminSettings';
import SupportPage from './pages/SupportPage';
import NotificationsPage from './pages/NotificationsPage';
import SilverPage from './pages/SilverPage';
import WalletPage from './pages/WalletPage';
import AboutUsPage from './pages/static/AboutUsPage';
import PrivacyPolicyPage from './pages/static/PrivacyPolicyPage';
import TermsPage from './pages/static/TermsPage';
import ReturnsPolicyPage from './pages/static/ReturnsPolicyPage';
import ContactUsPage from './pages/static/ContactUsPage';
import Layout from './components/shared/Layout';
import PublicLayout from './components/shared/PublicLayout';
import SplashScreen from './components/shared/SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/welcome" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_admin) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppContent() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Skip splash if user is already logged in
  useEffect(() => {
    if (user) {
      setShowSplash(false);
    }
  }, [user]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a1a', color: '#f5f5f5', border: '1px solid #d97706' }
      }} />
      
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="buy" element={<BuyFlowPage />} />
          <Route path="buy/one-time" element={<BuyGoldPage />} />
          <Route path="buy/sip" element={<SipPage />} />
          <Route path="sell" element={<SellFlowPage />} />
          <Route path="sell/now" element={<SellGoldPage />} />
          <Route path="lock-in" element={<LockInPage />} />
          <Route path="silver" element={<SilverPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/returns" element={<ReturnsPolicyPage />} />
        </Route>
        
        <Route path="/admin" element={<AdminRoute><Layout isAdmin /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="lock-in" element={<AdminLockIn />} />
          <Route path="sip-history" element={<AdminSipHistory />} />
          <Route path="gold-rate" element={<AdminGoldRate />} />
          <Route path="deliveries" element={<AdminDeliveries />} />
          <Route path="support-tickets" element={<AdminSupportTickets />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
