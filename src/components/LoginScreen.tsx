import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Key, User, AlertCircle } from 'lucide-react';
import LedgerCard from './LedgerCard';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulate standard academic ink-stamp delay
    setTimeout(() => {
      if (username.trim().toLowerCase() === 'teacher' && password === 'class123') {
        onLoginSuccess('teacher');
      } else {
        setError('Incorrect username or password. Check demo credentials below.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div id="login-screen" className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-radial from-ledger-bg2 to-ledger-bg">
      {/* Background Blackboard Deco */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: -4, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ledger-accent text-ledger-accent-ink font-serif font-bold text-3xl shadow-xl mx-auto mb-4 border-2 border-ledger-chalk"
          >
            R
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl md:text-4xl text-ledger-chalk font-bold tracking-wide"
          >
            Roll Book
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
            className="text-ledger-chalk-dim text-sm mt-1.5 font-mono"
          >
            academic student attendance register
          </motion.p>
        </div>

        <LedgerCard badge="Register No. 1" className="shadow-2xl">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-ledger-absent/10 border border-ledger-absent/30 text-ledger-absent font-medium text-xs md:text-sm p-3 rounded-lg mb-4 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-ledger-ink-soft">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="teacher"
                  className="w-full pl-9 pr-4 py-2 bg-white/50 border border-ledger-line rounded-md text-ledger-ink placeholder-ledger-ink-soft/50 font-sans focus:outline-none focus:border-ledger-present focus:ring-1 focus:ring-ledger-present transition-colors text-sm"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-ledger-ink-soft">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 bg-white/50 border border-ledger-line rounded-md text-ledger-ink placeholder-ledger-ink-soft/50 font-sans focus:outline-none focus:border-ledger-present focus:ring-1 focus:ring-ledger-present transition-colors text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-ledger-ink hover:bg-ledger-ink-soft text-ledger-paper font-semibold py-2.5 px-4 rounded-md shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-ledger-paper border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Open Register</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Teacher Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-dashed border-ledger-line text-xs text-ledger-ink-soft leading-relaxed">
            <span className="font-semibold text-ledger-ink block mb-1">Demo Credentials:</span>
            Use username <code className="bg-black/5 px-1.5 py-0.5 rounded text-ledger-ink font-mono font-bold">teacher</code> and password <code className="bg-black/5 px-1.5 py-0.5 rounded text-ledger-ink font-mono font-bold">class123</code>.
          </div>
        </LedgerCard>
      </div>
    </div>
  );
}
