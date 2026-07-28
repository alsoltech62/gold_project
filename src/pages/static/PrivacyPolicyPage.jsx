import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>Effective Date: [Add Date]</p>
          <p>At GOLDBAR PE, protecting your privacy is important to us.</p>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
              <li>Device Information</li>
              <li>Transaction Information</li>
              <li>Login Activity</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create and manage your account</li>
              <li>Process transactions</li>
              <li>Verify your identity</li>
              <li>Improve app performance</li>
              <li>Provide customer support</li>
              <li>Send important notifications</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
            <p>We use industry-standard security practices to protect your personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p>The app may use trusted third-party services such as payment gateways, analytics providers, and cloud infrastructure.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">User Rights</h2>
            <p>Users may request correction or deletion of their personal information, subject to legal obligations.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>Email: support@goldbarpe.com</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
