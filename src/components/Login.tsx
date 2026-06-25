import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Key, Sparkles, AlertCircle, HelpCircle, ExternalLink, ShieldCheck, UserCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const { signIn, enterDemoMode, authLoading, authError, setAuthError } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await signIn(email, password, isRegistering, isRegistering ? displayName : undefined);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center overflow-y-auto py-12 text-neutral-100 font-sans px-4">
      
      {/* Background Animated Radial Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Abstract Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* MKA Circular Logo Jump Animation (Left-to-Right Loop) */}
      <div className="absolute top-12 left-0 right-0 h-24 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ['-10vw', '110vw'],
            y: [0, -30, 0, -30, 0, -30, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] border-2 border-red-500/50"
        >
          <span className="font-display font-extrabold text-lg text-white tracking-wider">MKA</span>
        </motion.div>
      </div>

      {/* Main Luxury Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel rounded-3xl p-8 border border-red-500/20 shadow-[0_0_50px_rgba(220,38,38,0.08)] relative overflow-hidden">
          
          {/* Subtle top light bar */}
          <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
          
          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mx-auto w-24 h-24 rounded-full bg-neutral-900 border border-red-600/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center">
                <span className="font-display font-black text-2xl text-white tracking-tight">MKA</span>
              </div>
            </motion.div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-red-500 bg-clip-text text-transparent">
              M K A MOTORS
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-mono uppercase tracking-widest">
              Two Wheeler Spares Wholesale
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-neutral-200">Welcome Customer</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Access wholesale prices, view available stock, and order spares directly.
              </p>
            </div>

            {/* Error & Troubleshooting Panel */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-neutral-200 font-medium">
                      {authError}
                    </div>
                  </div>

                  <button
                    onClick={() => setAuthError(null)}
                    className="w-full py-1 text-center text-[10px] text-red-400 hover:text-red-300 font-mono"
                  >
                    Dismiss Notice
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom Email and Password Login / Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-red-500 transition-all text-xs"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-red-500 transition-all text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-red-500 transition-all text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-red-600/10 font-sans text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{authLoading ? 'Verifying Credentials...' : (isRegistering ? 'Create Account & Sign In' : 'Sign In')}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setAuthError(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-400 transition-colors font-medium cursor-pointer underline underline-offset-4"
                >
                  {isRegistering ? "Already have an account? Sign In" : "New customer? Create an account"}
                </button>
              </div>
            </form>

            {/* Sandbox Bypass Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-900"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Or Sandbox Evaluation</span>
              <div className="flex-grow border-t border-neutral-900"></div>
            </div>

            {/* Sandbox Evaluation Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Enter as Demo Customer */}
              <button
                type="button"
                onClick={() => enterDemoMode('customer')}
                className="py-3 px-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1.5 shadow-sm group cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-neutral-500 group-hover:text-amber-500 transition-colors" />
                <span>Guest Customer</span>
              </button>

              {/* Enter as Demo Admin */}
              <button
                type="button"
                onClick={() => enterDemoMode('admin')}
                className="py-3 px-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/20 rounded-xl text-neutral-300 hover:text-white transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1.5 shadow-sm group cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-500 group-hover:text-red-500 transition-colors" />
                <span>Demo Admin</span>
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-900 flex items-center justify-center gap-2 text-neutral-500 text-xs">
              <Key className="w-3.5 h-3.5 text-red-500/50" />
              <span>Secure Authentication via Firebase</span>
            </div>
          </div>
        </div>

        {/* Footer info in login screen */}
        <p className="text-center text-xs text-neutral-600 mt-8 font-mono">
          © M K A MOTORS. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
};
