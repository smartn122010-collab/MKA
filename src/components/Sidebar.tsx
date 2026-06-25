import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Layers, 
  ClipboardCheck, 
  Tag, 
  User, 
  ShieldAlert, 
  Menu, 
  X, 
  LogOut, 
  Wrench 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, logOut } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search Spares', icon: Search },
    { id: 'products', label: 'Product List', icon: Layers },
    { id: 'register', label: 'Register & Order', icon: ClipboardCheck },
    { id: 'offers', label: 'Offers & Codes', icon: Tag },
    { id: 'profile', label: 'My Profile', icon: User },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldAlert }] : [])
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden w-full h-16 bg-neutral-950 border-b border-red-500/10 flex items-center justify-between px-4 z-30 fixed top-0 left-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-black flex items-center justify-center">
            <span className="font-display font-black text-xs text-white">MKA</span>
          </div>
          <span className="font-display font-bold text-sm tracking-wide text-white">MKA MOTORS</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 bottom-0 left-0 w-72 bg-neutral-950 border-r border-red-500/10 p-6 z-50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-900 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-black flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    <span className="font-display font-black text-sm text-white">MKA</span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-white leading-none">MKA MOTORS</h2>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Two Wheeler Spares</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 text-neutral-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-red-950/40 text-red-500 border-l-4 border-red-600 pl-3' 
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-neutral-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile bottom section - logout removed to open directly to home */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-neutral-950/80 backdrop-blur-xl border-r border-red-500/10 p-6 fixed top-0 bottom-0 left-0 z-20">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-900 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 via-red-700 to-neutral-950 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <span className="font-display font-black text-sm text-white tracking-wider">MKA</span>
            </div>
            <div>
              <h1 className="font-display font-black text-md text-white tracking-tight leading-none">M K A MOTORS</h1>
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block mt-1">WHOLESALE SPARES</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden ${
                    isActive 
                      ? 'text-red-500 bg-red-950/20 border-l-4 border-red-600 pl-3' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-red-500' : 'text-neutral-400 group-hover:text-red-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar with Profile info */}
        <div className="pt-6 border-t border-neutral-900 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img 
              src={profile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border border-red-500/20 shadow-md object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-neutral-200 truncate">{profile?.displayName || 'Customer'}</p>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block capitalize">{profile?.role || 'Customer'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
