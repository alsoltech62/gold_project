import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Gift, Sparkles, Copy, Check, Share2, ArrowRight, ShieldCheck, Phone, User, MessageSquare } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GiftGoldPage() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [recipientMobile, setRecipientMobile] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('Wishing you health, wealth & joy with 24K Pure Digital Gold! 🎁');
  const [paymentMethod, setPaymentMethod] = useState('CASHFREE');
  const [loading, setLoading] = useState(false);
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState('');
  const [activeGiftCode, setActiveGiftCode] = useState('');
  const [activeShareLink, setActiveShareLink] = useState('');
  const [giftSuccessData, setGiftSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const quickAmounts = [100, 500, 1000, 2100, 5000];
  const quickGreetings = [
    'Happy Birthday 🎂',
    'Congratulations 🎉',
    'Best Wishes ✨',
    'With Love ❤️',
    'Happy Anniversary 💍',
    'Prosperity & Joy 🌟'
  ];

  useEffect(() => {
    api.get('/gold/rate.php').then(r => setRate(r.data.data)).catch(() => {});
  }, []);

  const ratePerGram = rate?.rate_per_gram || 0;
  const grams = ratePerGram > 0 && amount ? (parseFloat(amount) / ratePerGram) : 0;

  const handleCreateGift = async () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount < 10) {
      toast.error('Minimum gift amount is ₹10');
      return;
    }

    const cleanMobile = recipientMobile.replace(/[^0-9]/g, '');
    const finalMobile = cleanMobile.length > 10 ? cleanMobile.slice(-10) : cleanMobile;
    if (finalMobile.length !== 10) {
      toast.error('Please enter a valid 10-digit recipient mobile number');
      return;
    }

    const userClean = (user?.mobile || '').replace(/[^0-9]/g, '');
    if (finalMobile === (userClean.length > 10 ? userClean.slice(-10) : userClean)) {
      toast.error('You cannot gift gold to your own mobile number!');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/gold/gift.php', {
        action: 'create',
        amount_inr: parsedAmount,
        recipient_mobile: finalMobile,
        recipient_name: recipientName.trim(),
        message: message.trim(),
        payment_method: paymentMethod
      });

      if (res.data.success) {
        const data = res.data.data;
        if (paymentMethod === 'CASHFREE') {
          setActiveOrderId(data.order_id);
          setActiveGiftCode(data.gift_code);
          setActiveShareLink(data.share_link);
          window.open(data.payment_url, '_blank');
          setShowCashfreeModal(true);
        } else {
          // Wallet success
          setGiftSuccessData(data);
          toast.success('Gold Gift Sent Successfully! 🎁', { icon: '✨' });
        }
      } else {
        toast.error(res.data.message || 'Failed to initiate gold gift');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCashfreePayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/gold/gift.php', {
        action: 'verify_payment',
        order_id: activeOrderId,
        gift_code: activeGiftCode
      });

      if (res.data.success) {
        setShowCashfreeModal(false);
        setGiftSuccessData(res.data.data);
        toast.success('Payment verified! Your Gold Gift is ready to be claimed.', { icon: '🎉' });
      } else {
        toast.error(res.data.message || 'Payment not yet confirmed by gateway');
      }
    } catch (err) {
      toast.error('Error verifying payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = giftSuccessData?.share_link || activeShareLink;
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Gift Claim Link Copied! 📋');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = giftSuccessData
    ? `🎁 Hi! ${user?.name || 'Your Friend'} has gifted you ${formatGrams(giftSuccessData.gold_grams)} of 24K Pure Digital Gold (worth ${formatINR(giftSuccessData.amount_inr)}) on Gold Platform!\n\nMessage: "${giftSuccessData.message || message}"\n\n👉 Click here to claim your Gold:\n${giftSuccessData.share_link}\n\nLogin/Register with mobile ${giftSuccessData.recipient_mobile} to claim directly to your vault!`
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] mb-3 border border-[#D4AF37]/30">
          <Sparkles size={13} /> Exclusive Feature
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Gift Pure 24K Gold 🎁</h1>
        <p className="text-white/40 text-sm font-medium">Send digital 24K pure gold to your family, friends or colleagues with a custom greeting</p>
      </header>

      {/* Main Gift Form Card */}
      <div className="card-premium p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-white/40">24K 99.9% Pure Gold</p>
              <h2 className="text-xl font-black text-white">Live Rate: {ratePerGram > 0 ? `${formatINR(ratePerGram)}/g` : 'Fetching...'}</h2>
            </div>
          </div>
          {grams > 0 && (
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase font-bold">Gold Weight</p>
              <p className="text-xl font-black text-[#D4AF37]">{formatGrams(grams)}</p>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Gift Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#D4AF37]">₹</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="500"
              className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-2xl font-black text-white placeholder-white/20 focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#111] border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all"
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Details */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-white/70">Recipient Details</h3>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Recipient Mobile Number *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={recipientMobile}
                onChange={e => setRecipientMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-14 pr-4 text-sm font-bold text-white placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-white/30 mt-1">Recipient will use this mobile number to claim their pure gold gift.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Recipient Name (Optional)</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Greeting Message */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Greeting Message</label>
          <div className="flex flex-wrap gap-1.5">
            {quickGreetings.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setMessage(`${g}! Wishing you pure prosperity with 24K Gold.`)}
                className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-[#D4AF37]/40 transition-colors"
              >
                {g}
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Payment Method</label>

          <div className="space-y-2">
            <label
              onClick={() => setPaymentMethod('CASHFREE')}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'CASHFREE' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-[#111] hover:border-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className={paymentMethod === 'CASHFREE' ? 'text-[#D4AF37]' : 'text-white/40'} />
                <div>
                  <p className="text-sm font-bold text-white">Online Payment (UPI, Cards, NetBanking)</p>
                  <p className="text-xs text-white/40">Instant & 100% Secure via Cashfree</p>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'CASHFREE'} readOnly className="accent-[#D4AF37]" />
            </label>

            {user?.inr_wallet > 0 && (
              <label
                onClick={() => setPaymentMethod('INR_WALLET')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'INR_WALLET' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-[#111] hover:border-white/20'}`}
              >
                <div>
                  <p className="text-sm font-bold text-white">INR Wallet Balance</p>
                  <p className="text-xs text-[#D4AF37]">Available: {formatINR(user.inr_wallet)}</p>
                </div>
                <input type="radio" checked={paymentMethod === 'INR_WALLET'} readOnly className="accent-[#D4AF37]" />
              </label>
            )}

            {user?.japsan_wallet > 0 && (
              <label
                onClick={() => setPaymentMethod('JAPSAN_WALLET')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'JAPSAN_WALLET' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-[#111] hover:border-white/20'}`}
              >
                <div>
                  <p className="text-sm font-bold text-white">Japsan Coin Ecosystem Wallet</p>
                  <p className="text-xs text-[#D4AF37]">Available: {formatINR(user.japsan_wallet)}</p>
                </div>
                <input type="radio" checked={paymentMethod === 'JAPSAN_WALLET'} readOnly className="accent-[#D4AF37]" />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateGift}
          disabled={loading || !amount || !recipientMobile}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:brightness-110 text-black font-black py-4 rounded-xl text-base shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Gift size={20} />
              <span>Gift Gold Now ({formatINR(amount || 0)})</span>
            </>
          )}
        </button>
      </div>

      {/* Cashfree Verification Modal */}
      {showCashfreeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-premium max-w-md w-full p-8 text-center space-y-6 border-[#D4AF37]/40 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mx-auto">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Complete Your Payment</h3>
              <p className="text-white/60 text-sm">Please finish the payment in the browser window, then click below to activate your gold gift.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleVerifyCashfreePayment}
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#c49f30] text-black font-black py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'I Have Completed Payment'}
              </button>
              <button
                onClick={() => setShowCashfreeModal(false)}
                className="text-xs text-white/40 hover:text-white"
              >
                Cancel / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {giftSuccessData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-premium max-w-lg w-full p-8 space-y-6 border-[#D4AF37] shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mx-auto border border-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                <Gift size={32} />
              </div>
              <h2 className="text-2xl font-black text-white">Gold Gift Activated! 🎉</h2>
              <p className="text-white/60 text-xs">Share the claim link with {giftSuccessData.recipient_mobile} so they can claim their gold.</p>
            </div>

            {/* Certificate Box */}
            <div className="bg-[#111] p-6 rounded-2xl border border-[#D4AF37]/30 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-white/50 border-b border-white/5 pb-2">
                <span>Gift Code:</span>
                <span className="font-mono text-white font-bold">{giftSuccessData.gift_code}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Amount:</span>
                <span className="text-white font-black">{formatINR(giftSuccessData.amount_inr)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Pure 24K Gold:</span>
                <span className="text-[#D4AF37] font-black text-base">{formatGrams(giftSuccessData.gold_grams)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Recipient:</span>
                <span className="text-white font-bold">{giftSuccessData.recipient_name ? `${giftSuccessData.recipient_name} (${giftSuccessData.recipient_mobile})` : giftSuccessData.recipient_mobile}</span>
              </div>
            </div>

            {/* WhatsApp Share Button */}
            <a
              href={`https://wa.me/91${giftSuccessData.recipient_mobile}?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20"
            >
              <Share2 size={18} />
              <span>Share Directly on WhatsApp</span>
            </a>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#D4AF37]/40 text-[#D4AF37] font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              <span>{copied ? 'Link Copied!' : 'Copy Claim Link'}</span>
            </button>

            <button
              onClick={() => {
                setGiftSuccessData(null);
                navigate('/dashboard');
              }}
              className="w-full text-center text-xs text-white/40 hover:text-white pt-2 block"
            >
              Done / Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
