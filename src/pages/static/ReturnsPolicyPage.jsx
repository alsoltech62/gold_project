import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <RefreshCcw className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Returns Policy</h1>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Physical Delivery Returns</h2>
            <p>Due to the nature of precious metals, physical delivery of gold and silver coins/bars cannot be returned once dispatched, unless the product is damaged or tampered with during transit.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Digital Assets</h2>
            <p>Digital gold and silver can be sold back to the platform at any time at the prevailing sell rate. We do not charge any hidden cancellation fees.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Claim Process</h2>
            <p>For any disputes regarding physical delivery, please raise a support ticket within 24 hours of delivery along with an unboxing video.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
