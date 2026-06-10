import React from 'react';

export default function StatCard({ label, value, sub, icon: Icon, color = 'yellow', trend }) {
  const colors = {
    yellow: 'from-[#BF953F] to-[#AA771C] border-[#BF953F]/20',
    green:  'from-green-500/20 to-green-600/5 border-green-500/20',
    red:    'from-red-500/20 to-red-600/5 border-red-500/20',
    blue:   'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  };

  const textColors = {
    yellow: 'text-[#D4AF37]',
    green:  'text-green-400',
    red:    'text-red-400',
    blue:   'text-blue-400',
  };

  return (
    <div className={`card-premium relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500`}>
      {/* Decorative Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
          {Icon && (
            <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${textColors[color]} group-hover:scale-110 transition-transform duration-500`}>
              <Icon size={18} />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className={`text-2xl font-black tracking-tight ${textColors[color]}`}>{value}</p>
          {sub && <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">{sub}</p>}
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-4 text-[10px] font-bold uppercase tracking-widest ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <span className="p-0.5 rounded bg-current/10">
              {trend >= 0 ? '▲' : '▼'}
            </span>
            <span>{Math.abs(trend)}% from yesterday</span>
          </div>
        )}
      </div>
    </div>
  );
}

