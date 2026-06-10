import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactUsPage() {
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
            <Phone className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Contact Us</h1>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed relative z-10">
          <p>
            We are here to assist you with your Gold and Silver investments. Reach out to our support team for any queries regarding transactions, SIPs, or deliveries.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
              <Phone className="text-amber-500 shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">Phone Support</h3>
                <p className="text-sm text-white/50">+91 98765 43210</p>
                <p className="text-xs text-white/30 mt-1">Mon-Sat, 9 AM to 6 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
              <Mail className="text-amber-500 shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">Email Us</h3>
                <p className="text-sm text-white/50">support@goldvault.com</p>
                <p className="text-xs text-white/30 mt-1">We aim to reply within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
              <MapPin className="text-amber-500 shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">Head Office</h3>
                <p className="text-sm text-white/50">GoldVault Towers, Sector V, Salt Lake</p>
                <p className="text-sm text-white/50">Kolkata, West Bengal 700091</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
