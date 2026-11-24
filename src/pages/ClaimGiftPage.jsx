import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Gift, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Download, ShieldCheck, Heart } from 'lucide-react';
import api, { formatINR, formatGrams } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ClaimGiftPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimedSuccess, setClaimedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) {
      setError('Missing gift claim code in URL.');
      setLoading(false);
      return;
    }

    api.get(`/gold/gift.php?action=get_details&code=${encodeURIComponent(code)}`)
      .then(res => {
        if (res.data.success) {
          setGift(res.data.data);
          if (res.data.data.status === 'claimed') {
            setClaimedSuccess(true);
          }
        } else {
          setError(res.data.message || 'Gift not found or invalid link.');
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load gift details.');
      })
      .finally(() => setLoading(false));
  }, [code]);

  const handleClaim = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/claim-gift?code=${code}`)}`);
      return;
    }

    setClaiming(true);
    try {
      const res = await api.post('/gold/gift.php', {
        action: 'claim',
        gift_code: code
      });

      if (res.data.success) {
        setClaimedSuccess(true);
        toast.success(res.data.message || '24K Gold claimed to your vault! ✨', { icon: '🎉', duration: 5000 });
      } else {
        toast.error(res.data.message || 'Failed to claim gift');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error claiming gold gift');
    } finally {
      setClaiming(false);
    }
  };

  const userMobileClean = (user?.mobile || '').replace(/[^0-9]/g, '').slice(-10);
  const giftMobileClean = (gift?.recipient_mobile || '').replace(/[^0-9]/g, '').slice(-10);
  const isCorrectUser = user && userMobileClean === giftMobileClean;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full card-premium p-8 text-center space-y-6 border-[#D4AF37] relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none bg-[#D4AF37]/15"></div>

        {loading ? (
          <div className="py-16 space-y-4">
            <div className="w-12 h-12 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/40 text-sm">Verifying your 24K Gold gift...</p>
          </div>
        ) : error ? (
          <div className="py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">Gift Link Error</h2>
            <p className="text-white/60 text-sm leading-relaxed">{error}</p>
            <Link to="/" className="inline-block mt-4 text-[#D4AF37] text-sm font-bold hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Header Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                {claimedSuccess ? <CheckCircle2 size={36} className="text-green-400" /> : <Gift size={36} />}
              </div>
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] mb-2 border border-[#D4AF37]/30">
                24K 99.9% Pure Digital Gold
              </div>
              <h1 className="text-2xl font-black text-white">
                {claimedSuccess ? 'Gift Claimed! ✨' : "You've Received a Gold Gift! 🎁"}
              </h1>
              <p className="text-white/50 text-xs mt-1">
                From <span className="text-white font-bold">{gift?.sender_name || 'A Loved One'}</span>
              </p>
            </div>

            {/* Gift Details Box */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-3 text-left">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-white/50 text-xs uppercase font-bold">Gold Weight:</span>
                <span className="text-[#D4AF37] font-black text-lg">{formatGrams(gift?.gold_grams)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-white/50 text-xs uppercase font-bold">Value:</span>
                <span className="text-white font-bold">{formatINR(gift?.amount_inr)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-white/50 text-xs uppercase font-bold">Recipient Mobile:</span>
                <span className="text-white font-mono">{gift?.recipient_mobile_masked || gift?.recipient_mobile}</span>
              </div>

              {gift?.message && (
                <div className="pt-2">
                  <p className="text-[11px] text-white/40 uppercase font-bold mb-1">Personal Greeting:</p>
                  <p className="text-xs text-white/80 italic bg-white/5 p-3 rounded-xl border border-white/5">
                    "{gift.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {claimedSuccess ? (
              <div className="space-y-3 pt-2">
                <p className="text-green-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> This gold is safely in your 24K vault!
                </p>
                <Link
                  to="/dashboard"
                  className="w-full bg-[#D4AF37] hover:bg-[#c49f30] text-black font-black py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                  View My Vault Dashboard <ArrowRight size={18} />
                </Link>
              </div>
            ) : user ? (
              isCorrectUser ? (
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:brightness-110 text-black font-black py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/25 transition-all cursor-pointer"
                >
                  {claiming ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Claim Gold to My Vault Now</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                  <p>
                    You are logged in as <strong>{user.mobile}</strong>, but this gift was sent to <strong>{gift?.recipient_mobile_masked}</strong>.
                  </p>
                  <p>Please log out and log in with the gifted mobile number to claim.</p>
                </div>
              )
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-white/60">
                  Please log in or register with mobile <strong>{gift?.recipient_mobile_masked}</strong> to claim this 24K pure gold gift.
                </p>
                <Link
                  to={`/login?redirect=${encodeURIComponent(`/claim-gift?code=${code}`)}`}
                  className="w-full bg-[#D4AF37] hover:bg-[#c49f30] text-black font-black py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                  Login / Register to Claim Gold <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
