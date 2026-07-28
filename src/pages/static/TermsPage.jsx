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
          <p>By using GOLDBAR PE, you agree to the following:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must provide accurate information.</li>
            <li>Gold rates may change based on market conditions.</li>
            <li>Gold purchases are processed according to applicable rates at the time of confirmation.</li>
            <li>Physical delivery requests are subject to availability, verification, applicable charges, and company policies.</li>
            <li>Users are responsible for maintaining account security.</li>
            <li>Misuse of the application may result in suspension or termination.</li>
            <li>GOLDBAR PE reserves the right to modify features, charges, or policies without prior notice where legally permitted.</li>
            <li>These Terms shall be governed by the laws of India.</li>
          </ul>
          <section className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>Support Email: support@goldbarpe.com</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
