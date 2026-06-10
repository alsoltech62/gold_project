import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Terms & Conditions</h1>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Digital Gold and Silver</h2>
            <p>The digital gold and silver purchased on our platform represent physical bullion stored securely. The live rates fluctuate based on market conditions.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Wallet and SIP</h2>
            <p>Funds added to the INR Wallet can be used to purchase gold or silver. The SIP feature automates purchases based on your settings. All investments carry market risk.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
