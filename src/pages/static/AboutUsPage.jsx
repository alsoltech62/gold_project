import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Building2 className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">About Us</h1>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed relative z-10">
          <p>
            Welcome to our premium Gold and Silver savings platform. We are dedicated to making precious metal investments accessible, secure, and transparent for everyone.
          </p>
          <p>
            With years of experience in the bullion market, we provide our users with the best live rates, ensuring that every rupee you invest gets its maximum value in 24K pure gold and 99.9% pure silver.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h3 className="text-amber-500 font-semibold mb-2">Purity Assured</h3>
              <p className="text-sm">100% certified 24K Gold and 99.9% pure Silver.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h3 className="text-amber-500 font-semibold mb-2">Secure Storage</h3>
              <p className="text-sm">Bank-grade security for your digital assets.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h3 className="text-amber-500 font-semibold mb-2">Easy Delivery</h3>
              <p className="text-sm">Physical delivery to your doorstep across India.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
