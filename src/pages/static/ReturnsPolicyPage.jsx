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
            <h2 className="text-xl font-semibold text-white mb-3">Digital Gold Purchases</h2>
            <p>Completed gold purchase transactions are generally non-refundable once successfully processed.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Physical Gold Delivery</h2>
            <p>Delivery requests are processed according to applicable terms and may include handling, making, shipping, insurance, or other applicable charges.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Failed Transactions</h2>
            <p>If payment is deducted but the transaction is unsuccessful, the amount will be refunded according to the payment partner's processing timelines.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cancellation</h2>
            <p>Requests may be cancelled only if processing has not started and subject to company approval.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
