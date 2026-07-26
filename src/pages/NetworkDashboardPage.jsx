import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Trophy, ChevronRight, Award, Target, Coins, Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function NetworkDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [networkData, setNetworkData] = useState({
    personalBusiness: 52000,
    level1Business: 280000,
    level2Business: 640000,
    level3Business: 1210000,
    totalTeamBusiness: 2182000,
    totalReferrals: 156,
    referralIncome: 1250,
    transactionReward: 850,
    holdingReward: 120,
    totalEarnings: 2220,
    rank: 'Silver',
    referralCode: 'GOLD-JAP-2026',
    directReferrals: [
      { id: 1, name: 'Rahul Sharma', level: 1, business: 15000, status: 'Active', joined: '2 days ago' },
      { id: 2, name: 'Priya Desai', level: 1, business: 55000, status: 'Active', joined: '5 days ago' },
      { id: 3, name: 'Vikram Singh', level: 1, business: 0, status: 'Pending', joined: '1 week ago' },
    ]
  });

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const [networkRes, profileRes] = await Promise.all([
          api.get('/user/referral_stats.php').catch(() => null),
          api.get('/user/profile.php').catch(() => null)
        ]);

        if (networkRes?.data?.success && networkRes.data?.data) {
          const apiData = networkRes.data.data;
          setNetworkData(prev => ({ 
            ...prev,
            totalReferrals: apiData.total_referrals,
            referralIncome: apiData.total_silver_bonus,
            directReferrals: apiData.referred_users.map((u, i) => ({
              id: i, name: u.name, level: 1, business: 0, status: 'Active', joined: new Date(u.created_at).toLocaleDateString()
            }))
          }));
        }

        if (profileRes?.data?.success && profileRes.data?.data) {
          setNetworkData(prev => ({
            ...prev,
            referralCode: profileRes.data.data.mobile || prev.referralCode
          }));
        }
      } catch (e) {
        console.log("Using mock data for Network Dashboard presentation");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchNetwork();
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(networkData.referralCode);
    toast.success('Referral Code Copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-8 fade-in relative">
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-700 tracking-tight">
            Network Business
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Build your network, earn lifetime rewards.</p>
        </div>

        {/* Current Rank Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-4 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#D4AF37]/30 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 shimmer-animation"></div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-black shadow-lg">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Current Rank</p>
            <p className="text-xl font-bold text-white tracking-wide">{networkData.rank}</p>
          </div>
        </motion.div>
      </div>

      {/* Share Box */}
      <div className="card-dark p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full transition-opacity opacity-50 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Invite Friends & Earn 500 JC</h3>
            <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
              Share your referral code! When your friend signs up, they get <span className="text-yellow-500 font-bold">50 JC</span>. When they purchase ₹1000 of Gold or Silver, you get <span className="text-yellow-500 font-bold">500 JC</span> coins!
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#111] p-2 pr-2 pl-6 rounded-2xl border border-white/10 w-full md:w-auto">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 tracking-[0.2em]">{networkData.referralCode}</span>
            <div className="flex gap-2">
              <button onClick={copyCode} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all">
                <Copy size={18} />
              </button>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({
                      title: 'Join Goldpe',
                      text: `Join me on Goldpe using my referral code: ${networkData.referralCode}`,
                      url: `https://goldbarpe.com/signup?ref=${networkData.referralCode}`
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(`https://goldbarpe.com/signup?ref=${networkData.referralCode}`);
                  toast.success('Referral link copied!');
                }
              }} className="p-3 bg-[#D4AF37] hover:bg-yellow-500 rounded-xl text-black transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" amount={`JC ${networkData.totalEarnings}`} icon={Coins} color="from-yellow-400 to-yellow-600" />
        <StatCard title="Referral JC Bonus" amount={`JC ${networkData.referralIncome}`} icon={Users} color="from-blue-400 to-blue-600" />
        <StatCard title="Holding Rewards" amount={`JC ${networkData.holdingReward}`} icon={Target} color="from-purple-400 to-purple-600" />
        <StatCard title="Total Team Business" amount={`₹ ${networkData.totalTeamBusiness.toLocaleString()}`} icon={TrendingUp} color="from-green-400 to-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Network Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-dark p-6">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Business Breakdown</h3>
            
            <div className="space-y-5">
              <LevelStat level="Personal" business={networkData.personalBusiness} percent={2} />
              <LevelStat level="Level 1" business={networkData.level1Business} percent={12} />
              <LevelStat level="Level 2" business={networkData.level2Business} percent={28} />
              <LevelStat level="Level 3" business={networkData.level3Business} percent={58} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-gray-400 mb-1">Total Network Size</p>
              <p className="text-3xl font-black text-white">{networkData.totalReferrals} <span className="text-base font-medium text-gray-500">members</span></p>
            </div>
          </div>
        </div>

        {/* Right Col: Direct Referrals Table */}
        <div className="lg:col-span-2">
          <div className="card-dark p-0 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-[#D4AF37]" />
                Recent Direct Referrals
              </h3>
              <button className="text-sm text-[#D4AF37] font-medium hover:text-yellow-400 flex items-center gap-1 transition-colors">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Business (₹)</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {networkData.directReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                            {ref.name[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{ref.name}</p>
                            <p className="text-xs text-gray-500">Level {ref.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {ref.business > 0 ? `₹${ref.business.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                        {ref.joined}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          ref.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {networkData.directReferrals.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No direct referrals yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function StatCard({ title, amount, icon: Icon, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-dark p-6 relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 border border-white/10`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="relative z-10">
        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-2xl font-black text-white">{amount}</p>
      </div>
    </motion.div>
  );
}

function LevelStat({ level, business, percent }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <p className="text-sm font-bold text-white">{level}</p>
        <p className="text-sm font-medium text-gray-400">₹{business.toLocaleString()}</p>
      </div>
      <div className="h-2 w-full bg-[#111] rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-200 relative"
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:1rem_1rem] animate-[shimmer_1s_linear_infinite]"></div>
        </motion.div>
      </div>
    </div>
  );
}
