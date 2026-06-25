import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { ProductList } from './components/ProductList';
import { RegisterCustomer } from './components/RegisterCustomer';
import { Offers } from './components/Offers';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { ShieldAlert, Cog } from 'lucide-react';

function AppContent() {
  const { user, loading, activeTab, profile } = useApp();

  // 1. Premium Loading Page Shield
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center text-neutral-200">
        <div className="relative flex flex-col items-center gap-4">
          <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
          
          {/* Pulsing gears mechanical loading badge */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <Cog className="w-12 h-12 text-red-600 animate-spin" style={{ animationDuration: '3s' }} />
            <Cog className="w-6 h-6 text-amber-500 absolute top-4 right-4 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          </div>

          <h3 className="font-display font-black text-lg tracking-wider text-white uppercase animate-pulse">
            MKA MOTOR SPARES
          </h3>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            Synchronizing Inventory database...
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Gate has been removed to open directly to the Home screen.
  // We guarantee an active user profile at the context layer.

  // 3. Render Active Page depending on Sidebar routing state
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'products':
        return <ProductList />;
      case 'register':
        return <RegisterCustomer />;
      case 'offers':
        return <Offers />;
      case 'profile':
        return <Profile />;
      case 'admin':
        if (profile?.role === 'admin') {
          return <AdminPanel />;
        }
        return <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* Absolute Decorative Glow Elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-radial-glow pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none z-0" />

      {/* Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 pt-20 md:pt-8 md:pl-72 z-10 relative">
        
        {/* Active Screen Frame */}
        <div className="w-full max-w-6xl mx-auto">
          {renderActiveScreen()}
        </div>

        {/* Humbler Brand Copyright Footer */}
        <footer className="w-full border-t border-neutral-900/50 pt-6 mt-12 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-[11px] font-mono text-neutral-600">
          <div>
            <span>© 2026 M K A MOTORS. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600/40" />
            <span className="uppercase tracking-widest">Two Wheeler Spares Wholesale Dealers</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
