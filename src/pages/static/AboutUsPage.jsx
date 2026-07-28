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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">GOLDBAR PE</h2>
            <p className="text-amber-500 font-medium mb-4">Buy Gold. Track Gold. Request Physical Delivery.</p>
            <p className="mb-4">
              GOLDBAR PE is designed to help users purchase, track, and manage their gold through a simple and secure mobile experience. Whether you're starting with a small amount or building your gold holdings over time, GOLDBAR PE provides a transparent platform to monitor your gold balance and transactions.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Buy gold using secure digital payments</li>
              <li>Live gold rate updates</li>
              <li>Track your gold balance in grams</li>
              <li>Complete transaction history</li>
              <li>Request physical gold delivery (subject to eligibility and applicable terms)</li>
              <li>Secure account management</li>
              <li>Easy-to-use dashboard</li>
              <li>Notifications for transactions and updates</li>
              <li>Customer support through email</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Why Choose GOLDBAR PE?</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Transparent system</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> User-friendly interface</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Secure transaction records</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Physical delivery request facility</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Dedicated customer support</li>
            </ul>
            <p className="mt-4 text-amber-500 font-medium">Download GOLDBAR PE and manage your gold with confidence.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">About Us</h2>
            <p className="mb-4">
              GOLDBAR PE is a digital platform developed to simplify the process of buying, tracking, and managing gold.
            </p>
            <p className="mb-4">
              Our objective is to make gold ownership more convenient through technology while maintaining transparency, security, and customer-first service.
            </p>
            <p>
              We focus on providing a simple user experience, clear transaction records, and responsive customer support.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
