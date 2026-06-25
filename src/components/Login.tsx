import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Key, Sparkles, AlertCircle, HelpCircle, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const { signIn, enterDemoMode, authLoading, authError, setAuthError } = useApp();

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
                  
                  {/* Troubleshooting steps for Popups in IFrame */}
                  <div className="pt-2 border-t border-red-500/10 text-[11px] text-neutral-400 space-y-1.5 font-light">
                    <p className="font-semibold text-neutral-200 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Troubleshooting IFrame popup blocks:</span>
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Click the <strong className="text-white">"Open in New Tab"</strong> button in the top right of this preview frame to run outside the sandbox.</li>
                      <li>Allow popups in your browser's address bar when prompted.</li>
                      <li>Or bypass the login entirely by using the <strong>Demo Sandbox Mode</strong> buttons below.</li>
                    </ul>
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

            {/* Google Login Button */}
            <button
              onClick={signIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-neutral-950 font-semibold py-3.5 px-6 rounded-xl hover:bg-neutral-100 transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-white/5 font-display text-sm relative overflow-hidden group disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>{authLoading ? 'Verifying Credentials...' : 'Login with Google'}</span>
              
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>

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
                className="py-3 px-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1.5 shadow-sm group"
              >
                <UserCheck className="w-4 h-4 text-neutral-500 group-hover:text-amber-500 transition-colors" />
                <span>Guest Customer</span>
              </button>

              {/* Enter as Demo Admin */}
              <button
                type="button"
                onClick={() => enterDemoMode('admin')}
                className="py-3 px-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/20 rounded-xl text-neutral-300 hover:text-white transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1.5 shadow-sm group"
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
