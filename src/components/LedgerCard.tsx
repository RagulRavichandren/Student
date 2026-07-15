import React from 'react';
import { motion } from 'motion/react';

interface LedgerCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  children: React.ReactNode;
}

export default function LedgerCard({
  title,
  subtitle,
  badge,
  className = '',
  children,
}: LedgerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative bg-ledger-paper text-ledger-ink rounded-lg shadow-2xl p-6 md:p-8 border border-black/10 overflow-hidden ${className}`}
      style={{
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 37px, rgba(217, 203, 163, 0.5) 37px, rgba(217, 203, 163, 0.5) 38px)',
        backgroundAttachment: 'local',
      }}
    >
      {/* Red Ledger Margin Line */}
      <div className="absolute left-8 md:left-10 top-0 bottom-0 w-[1.5px] bg-ledger-absent/30 pointer-events-none" />

      {/* Content wrapper with margin offset to not overlap the red line */}
      <div className="relative pl-6 md:pl-8 z-10">
        {badge && (
          <span className="inline-block font-mono text-[10px] tracking-widest uppercase text-ledger-ink-soft bg-black/5 px-2.5 py-1 rounded-full mb-3 border border-ledger-line/30">
            {badge}
          </span>
        )}
        
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ledger-ink">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-sans text-xs md:text-sm text-ledger-ink-soft mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </motion.div>
  );
}
