import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ChevronRight,
  ChevronLeft,
  UserPlus,
  LogIn,
  Gem,
  Sparkles,
  Globe,
  Wallet,
  Lock,
  Truck,
  ThumbsUp,
  Headphones,
  FileText,
  BarChart3,
  Star,
  CheckCircle2,
  Phone
} from 'lucide-react';
import logo from '../assets/GoldBarPay.png';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070707] text-[#e0e0e0] font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* ---------------- NAVBAR ---------------- */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Goldbar India" className="h-10" />
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link to="/" className="text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1">Home</Link>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#plans" className="hover:text-white transition-colors">Plans</a>
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <a href="#why-gold" className="hover:text-white transition-colors">Why Gold</a>
          <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-white hover:text-[#D4AF37] font-bold text-sm px-4 py-2 flex items-center gap-2 transition-colors"
          >
            <LogIn size={16} /> Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black px-6 py-2.5 rounded text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Start Gold Saving <ChevronRight size={16} />
          </button>
        </div>
      </nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 size={14} /> INDIA'S TRUSTED GOLD SAVING PLATFORM
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif leading-tight">
            START <span className="text-[#D4AF37] italic">GOLD</span><br/>
            FROM <span className="font-sans font-medium tracking-tight">₹1000</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-md">
            Convert your savings into real gold and secure your future.
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-300 pt-2">
             <div className="flex flex-col items-center gap-2 text-center w-24">
               <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center"><CheckCircle2 size={18} className="text-[#D4AF37]" /></div>
               <span className="text-[10px] uppercase">100% Real Gold</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center w-24">
               <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center"><Lock size={18} className="text-[#D4AF37]" /></div>
               <span className="text-[10px] uppercase">Secure & Safe Storage</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center w-24">
               <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center"><Truck size={18} className="text-[#D4AF37]" /></div>
               <span className="text-[10px] uppercase">Easy Delivery at Your Doorstep</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center w-24">
               <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center"><Shield size={18} className="text-[#D4AF37]" /></div>
               <span className="text-[10px] uppercase">100% Transparent & Trusted</span>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black px-8 py-4 rounded font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              START GOLD SAVING NOW <ChevronRight size={20} />
            </button>
            <a href="#" className="flex items-center gap-2 text-[#4ade80] hover:text-[#22c55e] transition-colors">
              <Phone size={20} /> Or connect on WhatsApp
            </a>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[100px] rounded-full"></div>
          <img src="/gold_bars_hero.png" alt="Gold Bars" className="relative z-10 w-full max-w-xl mx-auto drop-shadow-2xl" />
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="bg-[#0c0c0c] py-24 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16 space-y-2">
            <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">Simple Process</p>
            <h2 className="text-4xl font-serif">HOW IT <span className="text-[#D4AF37]">WORKS</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-[1px] border-t border-dashed border-gray-700 -z-0"></div>
            
            {/* Step 1 */}
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 relative z-10 text-center space-y-6 hover:border-[#D4AF37]/30 transition-colors">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold">01</div>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl flex items-center justify-center">
                <Wallet size={40} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold tracking-wider">PAY</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Choose your plan and make payment easily via UPI, Net Banking or Card.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 relative z-10 text-center space-y-6 hover:border-[#D4AF37]/30 transition-colors">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold">02</div>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl flex items-center justify-center">
                <Gem size={40} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold tracking-wider">CONVERT</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Your money is converted into real gold as per live market rate.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 relative z-10 text-center space-y-6 hover:border-[#D4AF37]/30 transition-colors">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold">03</div>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl flex items-center justify-center">
                <Shield size={40} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold tracking-wider">STORE & GROW</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We store your gold securely and you can track your gold anytime.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-[#D4AF37] text-black px-8 py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors">
              View All Plans &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section id="why-gold" className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-3 py-1 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase rounded">
            Why Choose Us
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif leading-tight">
            Why Thousands<br/>Trust <span className="text-[#D4AF37] italic">Goldbar India?</span>
          </h2>
          <p className="text-gray-400 text-lg">
            We make gold saving easy, secure and transparent for everyone.
          </p>
          <button className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:opacity-90 transition-opacity">
            Know More About Us &rarr;
          </button>
          
          <div className="mt-8 relative h-64 w-full">
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[80px] rounded-full"></div>
            <img src="/gold_bangle_feature.png" alt="Gold Jewelry" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4 hover:border-[#D4AF37]/50 transition-colors">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10"><Shield className="text-[#D4AF37]" /></div>
            <h4 className="font-bold">100% Real Gold</h4>
            <p className="text-xs text-gray-500">We deal in only 100% hallmarked real gold.</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4 hover:border-[#D4AF37]/50 transition-colors">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10"><Lock className="text-[#D4AF37]" /></div>
            <h4 className="font-bold">Secure Storage</h4>
            <p className="text-xs text-gray-500">Your gold is stored in highly secure vaults.</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4 hover:border-[#D4AF37]/50 transition-colors">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10"><Truck className="text-[#D4AF37]" /></div>
            <h4 className="font-bold">Easy Delivery</h4>
            <p className="text-xs text-gray-500">Get physical gold delivered at your doorstep.</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4 hover:border-[#D4AF37]/50 transition-colors">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10"><ThumbsUp className="text-[#D4AF37]" /></div>
            <h4 className="font-bold">Best Value</h4>
            <p className="text-xs text-gray-500">Buy gold at the most competitive rates.</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4 hover:border-[#D4AF37]/50 transition-colors">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10"><Headphones className="text-[#D4AF37]" /></div>
            <h4 className="font-bold">24/7 Support</h4>
            <p className="text-xs text-gray-500">We are always here to assist you.</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4 hover:border-[#D4AF37]/50 transition-colors">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10"><FileText className="text-[#D4AF37]" /></div>
            <h4 className="font-bold">Transparent System</h4>
            <p className="text-xs text-gray-500">No hidden charges. 100% transparent process.</p>
          </div>
        </div>
      </section>

      {/* ---------------- LIVE GOLD RATE ---------------- */}
      <section className="max-w-5xl mx-auto px-8 mb-24">
        <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <BarChart3 className="text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-sm text-gray-400 uppercase tracking-widest">Live Gold Rate</h4>
              <p className="text-xs text-gray-500">Rates updated in real-time</p>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400 mb-1">24K Gold (999)</p>
            <div className="flex items-end gap-3 justify-center md:justify-start">
              <span className="text-3xl font-bold">₹7,215</span>
              <span className="text-sm text-gray-400 mb-1">/gm</span>
              <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 mb-1.5">+1.25%</span>
            </div>
          </div>
          
          <div className="w-32 h-12 opacity-50 flex items-end">
             {/* Mock chart line */}
             <svg viewBox="0 0 100 30" className="w-full h-full stroke-[#D4AF37] fill-none" strokeWidth="2">
               <path d="M0,30 L10,25 L20,28 L30,15 L40,20 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0" />
             </svg>
          </div>
          
          <button className="border border-white/20 px-6 py-2 rounded text-sm hover:bg-white/5 transition-colors">
            VIEW CHART &rarr;
          </button>
        </div>
      </section>

      {/* ---------------- PLANS ---------------- */}
      <section id="plans" className="max-w-7xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="text-center mb-16 space-y-2">
          <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">Flexible Savings</p>
          <h2 className="text-4xl font-serif">Our <span className="text-[#D4AF37]">Plans</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Daily Savings</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">Start saving as little as ₹100 daily and build your gold wealth over time.</p>
            <button onClick={() => navigate('/signup')} className="w-full bg-[#1a1a1a] text-[#D4AF37] py-3 rounded font-bold border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-colors">Choose Plan</button>
          </div>
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-[#D4AF37] p-8 rounded-2xl relative transform scale-105 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-xs font-bold uppercase">Most Popular</div>
            <h3 className="text-2xl font-bold mb-2 text-[#D4AF37]">Monthly SIP</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">Automate your savings with fixed monthly gold investments without any hassle.</p>
            <button onClick={() => navigate('/signup')} className="w-full bg-[#D4AF37] text-black py-3 rounded font-bold hover:bg-white transition-colors">Choose Plan</button>
          </div>
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors flex flex-col">
            <h3 className="text-2xl font-bold mb-2">One-Time Buy</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">Buy gold in bulk at real-time market rates instantly with one single payment.</p>
            <button onClick={() => navigate('/signup')} className="w-full bg-[#1a1a1a] text-[#D4AF37] py-3 rounded font-bold border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-colors">Choose Plan</button>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section id="reviews" className="bg-[#0a0a0a] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 space-y-2">
            <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">What Our Customers Say</p>
            <h2 className="text-4xl font-serif">Trusted by <span className="text-[#D4AF37]">1000+</span> Happy Customers</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5"><ChevronLeft className="text-[#D4AF37]" /></button>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Rajesh Patel', city: 'Ahmedabad', text: 'Goldbar India ke through gold save karna bahut easy hai. Transparent process aur best customer support.' },
                { name: 'Neha Shah', city: 'Surat', text: 'Maine monthly plan liya hai, ab mujhe future ke liye tension nahi hoti. Real gold, real security!' },
                { name: 'Vivek Mehta', city: 'Vadodara', text: 'Best platform to save gold. Delivery bhi bahut fast aayi packaging premium thi.' }
              ].map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-4xl text-white/5 font-serif">"</div>
                  <div className="flex gap-1 text-[#D4AF37] mb-4">
                    <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                  </div>
                  <p className="text-gray-300 text-sm italic mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10"></div>
                    <div>
                      <h5 className="font-bold text-sm">{t.name}</h5>
                      <p className="text-xs text-gray-500">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5"><ChevronRight className="text-[#D4AF37]" /></button>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="bg-[#111] py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16 space-y-2">
            <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">Got Questions?</p>
            <h2 className="text-4xl font-serif">Frequently Asked <span className="text-[#D4AF37]">Questions</span></h2>
          </div>
          <div className="space-y-4">
            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/5">
              <h4 className="font-bold mb-2">Is the gold physically stored?</h4>
              <p className="text-sm text-gray-400">Yes, your gold is physically backed and stored in highly secure, insured third-party vaults. You are purchasing 100% real, physical gold.</p>
            </div>
            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/5">
              <h4 className="font-bold mb-2">Can I request physical delivery?</h4>
              <p className="text-sm text-gray-400">Absolutely! You can request physical delivery of your accumulated gold at any time right to your doorstep via our secure delivery partners.</p>
            </div>
            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/5">
              <h4 className="font-bold mb-2">What is the minimum amount to start?</h4>
              <p className="text-sm text-gray-400">You can start your gold saving journey with as little as ₹1,000. It is designed to be affordable and accessible for everyone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- BOTTOM CTA ---------------- */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="bg-gradient-to-r from-[#15120a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#15120a] z-10"></div>
            <img src="/gold_coins_footer.png" alt="Gold Coins" className="absolute right-0 top-1/2 -translate-y-1/2 h-[150%] object-contain opacity-50 z-0" />
          </div>
          
          <div className="relative z-20 max-w-lg space-y-6">
            <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">Secure Today, Shine Tomorrow</p>
            <h2 className="text-3xl md:text-4xl font-serif">Start Your Gold Saving Journey Today!</h2>
            <p className="text-gray-400 text-sm">Join thousands of smart savers and build your gold wealth with Goldbar India.</p>
          </div>
          
          <div className="relative z-20 flex flex-col gap-4 mt-8 md:mt-0">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black px-8 py-4 rounded font-bold uppercase tracking-wider hover:opacity-90 w-full md:w-auto text-center"
            >
              START NOW &rarr;
            </button>
            <a href="#" className="flex items-center justify-center gap-2 text-[#4ade80] hover:text-[#22c55e] text-sm">
              <Phone size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-24 pb-12 border-b border-white/5 text-sm text-gray-400">
            <div className="flex items-center gap-2"><Shield className="text-[#D4AF37]" size={20} /> 100% Secure Transactions</div>
            <div className="flex items-center gap-2"><Lock className="text-[#D4AF37]" size={20} /> ISO Certified Storage Partners</div>
            <div className="flex items-center gap-2"><UserPlus className="text-[#D4AF37]" size={20} /> Trusted by 1000+ Customers</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 py-16">
            <div className="md:col-span-2 space-y-6">
              <img src={logo} alt="Goldbar India" className="h-12" />
              <p className="text-xs text-gray-500 uppercase tracking-widest">TRUSTED GOLD. SECURE FUTURE.</p>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-sm">COMPANY</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-[#D4AF37]">About Us</Link></li>
                <li><a href="#how-it-works" className="hover:text-[#D4AF37]">How It Works</a></li>
                <li><a href="#plans" className="hover:text-[#D4AF37]">Plans</a></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37]">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-sm">INFORMATION</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#why-gold" className="hover:text-[#D4AF37]">Why Gold</a></li>
                <li><a href="#faq" className="hover:text-[#D4AF37]">FAQ</a></li>
                <li><Link to="/terms" className="hover:text-[#D4AF37]">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-[#D4AF37]">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-sm">SUPPORT</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/support" className="hover:text-[#D4AF37]">Help Center</Link></li>
                <li><a href="#" className="hover:text-[#D4AF37]">Track Delivery</a></li>
                <li><a href="#" className="hover:text-[#D4AF37]">Payment Help</a></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37]">Reach Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs text-gray-600">
            <p>© 2026 Goldbar India. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="hover:text-[#D4AF37]">Facebook</span>
              <span className="hover:text-[#D4AF37]">Instagram</span>
              <span className="hover:text-[#D4AF37]">Twitter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
