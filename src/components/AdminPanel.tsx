import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Pencil, 
  Database, 
  DollarSign, 
  Wrench, 
  Percent, 
  ShoppingBag,
  Star,
  CheckCircle,
  HelpCircle,
  X,
  FileSpreadsheet,
  Layers,
  Sparkles,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Offer, SalesStats } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    offers, 
    stats, 
    addNewProduct, 
    removeProduct, 
    updateExistingProduct,
    addNewOffer, 
    removeOffer, 
    updateSalesMetrics,
    isDemoMode
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'products' | 'offers' | 'security'>('dashboard');

  // PIN Security Gate States
  const [dbPin, setDbPin] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // First Setup PIN States
  const [setupPin, setSetupPin] = useState<string>('');
  const [confirmSetupPin, setConfirmSetupPin] = useState<string>('');

  // PIN Unlock Entry States
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Security Update inside Dashboard states
  const [newPinVal, setNewPinVal] = useState<string>('');
  const [confirmNewPinVal, setConfirmNewPinVal] = useState<string>('');

  // Load Pin from Database or LocalStorage on mount
  useEffect(() => {
    const fetchAdminPin = async () => {
      setPinLoading(true);
      setPinError(null);
      try {
        const localPin = localStorage.getItem('mka_admin_pin');
        setDbPin(localPin || null);
      } catch (err) {
        console.error("Error reading admin security PIN:", err);
      } finally {
        setPinLoading(false);
      }
    };
    fetchAdminPin();
  }, []);

  // Product addition state
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    image: '',
    price: 0,
    category: 'Engine',
    rating: 5,
    description: '',
    stock: true
  });

  // Editing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Offer addition state
  const [newOffer, setNewOffer] = useState<Omit<Offer, 'id'>>({
    code: '',
    description: '',
    discount: '',
    expiry: ''
  });

  // Modal edit statistics state
  const [editingStat, setEditingStat] = useState<{ key: keyof SalesStats; label: string; value: number } | null>(null);
  const [statEditValue, setStatEditValue] = useState<string>('');

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmingResetPin, setConfirmingResetPin] = useState(false);

  const showFeedback = (msg: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message: msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Security PIN core handlers
  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (setupPin.length < 4) {
      setPinError("PIN must be at least 4 digits long.");
      return;
    }
    if (setupPin !== confirmSetupPin) {
      setPinError("The confirmed PIN does not match. Please try again.");
      return;
    }
    try {
      localStorage.setItem('mka_admin_pin', setupPin);
      setDbPin(setupPin);
      setIsUnlocked(true);
      showFeedback("Admin security PIN established successfully!");
      setSetupPin('');
      setConfirmSetupPin('');
    } catch (err) {
      console.error("Error setting PIN:", err);
      setPinError("Could not save PIN to local storage.");
    }
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPinError(null);
    if (enteredPin === dbPin) {
      setIsUnlocked(true);
      setEnteredPin('');
      showFeedback("Admin Panel Unlocked!");
    } else {
      setPinError("Invalid security PIN. Access Denied.");
      setEnteredPin('');
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinVal.length < 4) {
      showFeedback("New PIN must be at least 4 characters.", "error");
      return;
    }
    if (newPinVal !== confirmNewPinVal) {
      showFeedback("The confirm PIN does not match the new PIN.", "error");
      return;
    }
    try {
      localStorage.setItem('mka_admin_pin', newPinVal);
      setDbPin(newPinVal);
      showFeedback("Admin PIN changed successfully!");
      setNewPinVal('');
      setConfirmNewPinVal('');
    } catch (err) {
      console.error("Error updating PIN:", err);
      showFeedback("Failed to update PIN.", "error");
    }
  };

  const handleResetPin = async () => {
    if (!confirmingResetPin) {
      setConfirmingResetPin(true);
      showFeedback("Click Reset PIN again to confirm. This will wipe the PIN and lock the panel.", "error");
      setTimeout(() => setConfirmingResetPin(false), 5000);
      return;
    }
    try {
      localStorage.removeItem('mka_admin_pin');
      setDbPin(null);
      setIsUnlocked(false);
      showFeedback("Security PIN cleared successfully. Reset to setup mode.");
      setConfirmingResetPin(false);
    } catch (err) {
      console.error("Error resetting PIN:", err);
      showFeedback("Failed to reset PIN.", "error");
    }
  };

  // Handle Product Save / Update
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.image || newProduct.price <= 0 || !newProduct.description) {
      showFeedback("Please fill out all product details correctly.", "error");
      return;
    }
    
    if (editingProduct && editingProduct.id) {
      await updateExistingProduct(editingProduct.id, {
        ...newProduct,
        price: Number(newProduct.price),
        rating: Number(newProduct.rating)
      });
      showFeedback(`Updated "${newProduct.name}" successfully!`);
      setEditingProduct(null);
    } else {
      await addNewProduct({
        ...newProduct,
        price: Number(newProduct.price),
        rating: Number(newProduct.rating)
      });
      showFeedback("New spare part added to Catalog successfully!");
    }

    setNewProduct({
      name: '',
      image: '',
      price: 0,
      category: 'Engine',
      rating: 5,
      description: '',
      stock: true
    });
  };

  // Handle Offer Save
  const handleAddOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.code || !newOffer.description || !newOffer.discount || !newOffer.expiry) {
      showFeedback("Please fill out all offer details correctly.", "error");
      return;
    }
    await addNewOffer(newOffer);
    showFeedback("Promo Coupon added successfully!");
    setNewOffer({
      code: '',
      description: '',
      discount: '',
      expiry: ''
    });
  };

  // Handle Stat Edit Save
  const handleStatSave = async () => {
    if (!editingStat) return;
    const numValue = Number(statEditValue);
    if (isNaN(numValue) || numValue < 0) {
      showFeedback("Please enter a valid positive number.", "error");
      return;
    }

    await updateSalesMetrics({
      [editingStat.key]: numValue
    });

    showFeedback(`${editingStat.label} updated successfully!`);
    setEditingStat(null);
  };

  // Calculate high-level stats metrics
  const totalProductsCount = products.length;
  const inStockProductsCount = products.filter(p => p.stock).length;

  const currentStats: SalesStats = stats || {
    totalStock: 0,
    totalServices: 0,
    todaySales: 0,
    monthSales: 0,
    yearSales: 0
  };

  if (pinLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-neutral-950/40 backdrop-blur-md rounded-3xl border border-red-500/10 max-w-md mx-auto my-12">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin mb-4" />
        <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
          Loading Admin Security Settings...
        </p>
      </div>
    );
  }

  if (!isUnlocked && dbPin === null) {
    return (
      <div className="max-w-md mx-auto my-12 bg-neutral-950/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-xl font-black text-white uppercase tracking-tight">
              Establish Security PIN
            </h2>
            <p className="text-xs text-neutral-400 mt-1.5 max-w-xs leading-relaxed">
              To secure the Admin Panel, set up a multi-digit passcode. This prevents unauthorized inventory changes.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreatePin} className="space-y-5 text-xs">
          {pinError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-semibold text-center">
              {pinError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-400 uppercase block">
              Enter First PIN
            </label>
            <input 
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={8}
              placeholder="••••"
              value={setupPin}
              onChange={(e) => setSetupPin(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-[0.5em] font-black text-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all placeholder:tracking-normal placeholder:font-normal"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-400 uppercase block">
              Confirm Security PIN
            </label>
            <input 
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={8}
              placeholder="••••"
              value={confirmSetupPin}
              onChange={(e) => setConfirmSetupPin(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-[0.5em] font-black text-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all placeholder:tracking-normal placeholder:font-normal"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-red-600/10 uppercase tracking-wider text-xs"
          >
            Create Security PIN & Enter
          </button>
        </form>
      </div>
    );
  }

  if (!isUnlocked) {
    const handleKeypadPress = (val: string) => {
      setPinError(null);
      if (enteredPin.length < 8) {
        setEnteredPin(prev => prev + val);
      }
    };

    const handleKeypadBackspace = () => {
      setEnteredPin(prev => prev.slice(0, -1));
    };

    const handleKeypadClear = () => {
      setEnteredPin('');
    };

    return (
      <div className="max-w-md mx-auto my-6 bg-neutral-950/80 backdrop-blur-xl border border-red-500/15 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <div className="p-3.5 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display text-xl font-black text-white uppercase tracking-tight">
              Unlock Command Center
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Please enter the active administrator security PIN.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleUnlock(); }} className="space-y-6">
          {pinError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-semibold text-center text-xs">
              {pinError}
            </div>
          )}

          {/* Secure indicator dots */}
          <div className="flex justify-center gap-3.5 py-2">
            {Array.from({ length: Math.max(4, dbPin?.length || 4) }).map((_, idx) => {
              const isFilled = idx < enteredPin.length;
              return (
                <motion.div
                  key={idx}
                  animate={{ scale: isFilled ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.15 }}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isFilled 
                      ? 'bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
                      : 'border-neutral-700 bg-neutral-900'
                  }`}
                />
              );
            })}
          </div>

          <div className="relative">
            <input 
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              placeholder="••••"
              value={enteredPin}
              onChange={(e) => {
                setPinError(null);
                setEnteredPin(e.target.value.replace(/\D/g, ''));
              }}
              className="w-full text-center tracking-[0.6em] font-black text-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all placeholder:tracking-normal placeholder:font-normal text-xs"
            />
          </div>

          {/* Numeric Touch Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="py-3 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800/40 rounded-xl text-neutral-200 font-bold text-sm transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              key="clear"
              type="button"
              onClick={handleKeypadClear}
              className="py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-xl text-neutral-500 font-bold text-[10px] transition-all active:scale-95 uppercase tracking-wider"
            >
              Clear
            </button>
            <button
              key="0"
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-3 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800/40 rounded-xl text-neutral-200 font-bold text-sm transition-all active:scale-95"
            >
              0
            </button>
            <button
              key="backspace"
              type="button"
              onClick={handleKeypadBackspace}
              className="py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-xl text-neutral-500 font-bold text-xs transition-all active:scale-95"
            >
              ⌫
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-red-600/10 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 relative font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-5">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-red-500" />
            <span>MKA Spare Parts Command Center</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Exclusively for Admin. Manage product inventories, update promo discount codes, and log manual sales statistics in real-time.
          </p>
        </div>

        {/* Command Center Tab Navigation */}
        <div className="flex bg-neutral-950 p-1 rounded-2xl border border-neutral-900">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'dashboard'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Dashboard Stats
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'products'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveSubTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'offers'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Manage Offers
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'security'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Security PIN
          </button>
        </div>
      </div>

      {/* Action feedbacks alert banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 border rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-lg ${
              feedback.type === 'error'
                ? 'bg-red-500/10 border-red-500/25 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
            }`}
          >
            {feedback.type === 'error' ? (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab 1: Live Interactive Dashboard Stats */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Grid of 5 Animated Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Total Stock */}
            <div 
              onClick={() => {
                setEditingStat({ key: 'totalStock', label: 'Total Stock Available', value: currentStats.totalStock });
                setStatEditValue(currentStats.totalStock.toString());
              }}
              className="glass-panel rounded-2xl p-5 border border-red-500/10 cursor-pointer group hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500">
                  <Database className="w-4 h-4" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-red-500 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Total Stock Units</span>
                <span className="text-2xl font-black font-display text-white mt-1 block">
                  {currentStats.totalStock.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Total Services */}
            <div 
              onClick={() => {
                setEditingStat({ key: 'totalServices', label: 'Total Services Completed', value: currentStats.totalServices });
                setStatEditValue(currentStats.totalServices.toString());
              }}
              className="glass-panel rounded-2xl p-5 border border-amber-500/10 cursor-pointer group hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-amber-600/10 border border-amber-500/20 rounded-xl text-amber-500">
                  <Wrench className="w-4 h-4" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-amber-500 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Services Finished</span>
                <span className="text-2xl font-black font-display text-white mt-1 block">
                  {currentStats.totalServices.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Today's Sales */}
            <div 
              onClick={() => {
                setEditingStat({ key: 'todaySales', label: "Today's Sales Value", value: currentStats.todaySales });
                setStatEditValue(currentStats.todaySales.toString());
              }}
              className="glass-panel rounded-2xl p-5 border border-emerald-500/10 cursor-pointer group hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-emerald-500 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Today's Sales (₹)</span>
                <span className="text-2xl font-black font-display text-white mt-1 block">
                  ₹{currentStats.todaySales.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Month Sales */}
            <div 
              onClick={() => {
                setEditingStat({ key: 'monthSales', label: "This Month's Sales Value", value: currentStats.monthSales });
                setStatEditValue(currentStats.monthSales.toString());
              }}
              className="glass-panel rounded-2xl p-5 border border-blue-500/10 cursor-pointer group hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-500">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-blue-500 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Month Sales (₹)</span>
                <span className="text-2xl font-black font-display text-white mt-1 block">
                  ₹{currentStats.monthSales.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Year Sales */}
            <div 
              onClick={() => {
                setEditingStat({ key: 'yearSales', label: "This Year's Sales Value", value: currentStats.yearSales });
                setStatEditValue(currentStats.yearSales.toString());
              }}
              className="glass-panel rounded-2xl p-5 border border-purple-500/10 cursor-pointer group hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-500">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-purple-500 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Year Sales (₹)</span>
                <span className="text-2xl font-black font-display text-white mt-1 block">
                  ₹{currentStats.yearSales.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>

          {/* Quick summary metrics description row */}
          <div className="glass-panel rounded-3xl p-6 border border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Parts Catalog Density</span>
              <p className="text-lg font-bold text-white">
                {totalProductsCount} Total Products 
                <span className="text-xs text-emerald-400 font-mono ml-2 font-normal">({inStockProductsCount} In Stock)</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Daily Sales Contribution</span>
              <p className="text-lg font-bold text-white">
                {currentStats.todaySales > 0 ? `${((currentStats.todaySales / currentStats.monthSales) * 100).toFixed(1)}%` : "0%"}
                <span className="text-xs text-neutral-400 font-light ml-2">of current monthly total</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Month vs Annual Strength</span>
              <p className="text-lg font-bold text-white">
                {currentStats.monthSales > 0 ? `${((currentStats.monthSales / currentStats.yearSales) * 100).toFixed(1)}%` : "0%"}
                <span className="text-xs text-neutral-400 font-light ml-2">of target annual turnover</span>
              </p>
            </div>
          </div>

          {/* Prompt description of how to edit stats */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="p-2 bg-neutral-900 rounded-lg text-red-500">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-widest">How to modify these stats</h4>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                To update any statistic manually, click directly on its respective dashboard card above. A secure popup editor will load, allowing you to rewrite and instantly save the value in the Cloud Firestore database for immediate synchronization.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Spare Parts Products CRUD */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Product Form Column */}
          <div id="products-form-container" className="glass-panel rounded-3xl p-6 border border-neutral-900 h-fit space-y-6">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              {editingProduct ? (
                <>
                  <Pencil className="w-4 h-4 text-amber-500" />
                  <span>Edit Spare Part</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-red-500" />
                  <span>Add New Spare Part</span>
                </>
              )}
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Part Name</label>
                <input 
                  type="text" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Premium Drive Chain"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Image Unsplash/Web URL</label>
                <input 
                  type="url" 
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all"
                />
              </div>

              {/* Price & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="₹ 850"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">Rating (1-5)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="5"
                    step="0.1"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: Number(e.target.value) })}
                    placeholder="4.8"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Part Category</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all capitalize"
                >
                  <option value="Brakes">Brakes</option>
                  <option value="Transmission">Transmission</option>
                  <option value="Engine">Engine</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Filters">Filters</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Part Description & Fitment</label>
                <textarea 
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Compatible motorbikes, dimensions, material alloy specs..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all resize-none"
                />
              </div>

              {/* Stock Available Toggle */}
              <div className="flex items-center justify-between py-2 px-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-300 uppercase">In Stock Available</span>
                <button
                  type="button"
                  onClick={() => setNewProduct({ ...newProduct, stock: !newProduct.stock })}
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {newProduct.stock ? (
                    <ToggleRight className="w-8 h-8 text-red-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-600" />
                  )}
                </button>
              </div>

              <div className="flex gap-2.5">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setNewProduct({
                        name: '',
                        image: '',
                        price: 0,
                        category: 'Engine',
                        rating: 5,
                        description: '',
                        stock: true
                      });
                      showFeedback("Cancelled edit mode.");
                    }}
                    className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 font-bold rounded-xl transition-all uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-md uppercase tracking-widest text-xs ${
                    editingProduct 
                      ? 'bg-amber-600 hover:bg-amber-700 hover:shadow-amber-600/10' 
                      : 'bg-red-600 hover:bg-red-700 hover:shadow-red-600/10'
                  }`}
                >
                  {editingProduct ? 'Save Changes' : 'Add Spare Part'}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Products List Column */}
          <div className="glass-panel rounded-3xl p-6 border border-neutral-900 lg:col-span-2 h-[550px] overflow-y-auto space-y-4">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>Catalog List ({products.length})</span>
            </h3>

            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-neutral-900/10 border border-neutral-900 rounded-3xl space-y-3">
                  <Layers className="w-8 h-8 text-neutral-700 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">No Products in Catalog</h4>
                    <p className="text-[10px] text-neutral-500 mt-1 max-w-xs leading-relaxed">
                      All parts have been deleted. Use the form on the left to manually add new premium spare parts.
                    </p>
                  </div>
                </div>
              ) : (
                products.map((product) => (
                  <div 
                    key={product.id || product.name}
                    className="flex items-center justify-between p-3 bg-neutral-900/50 border border-neutral-900 hover:border-red-500/10 rounded-xl transition-all gap-4"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-neutral-200 truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">{product.category}</span>
                          <span className="text-[9px] text-red-500 font-bold font-mono">₹{product.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Stock toggle */}
                      <button
                        onClick={() => {
                          if (product.id) {
                            updateExistingProduct(product.id, { stock: !product.stock });
                            showFeedback(`Stock availability updated for ${product.name}`);
                          }
                        }}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        {product.stock ? (
                          <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full uppercase">In Stock</span>
                        ) : (
                          <span className="text-[9px] font-mono bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full uppercase">Out</span>
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setNewProduct({
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            category: product.category,
                            rating: product.rating,
                            description: product.description,
                            stock: product.stock
                          });
                          showFeedback(`Loaded "${product.name}" for editing!`);
                          // Scroll form smoothly into view on smaller devices
                          document.getElementById('products-form-container')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-2 text-neutral-500 hover:text-amber-500 hover:bg-amber-950/15 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (product.id) {
                            removeProduct(product.id);
                            showFeedback(`"${product.name}" deleted from Catalog successfully.`);
                          }
                        }}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-950/15 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Store Offers Management CRUD */}
      {activeSubTab === 'offers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Promo coupon form */}
          <div className="glass-panel rounded-3xl p-6 border border-neutral-900 h-fit space-y-6">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-red-500" />
              <span>Add New Promo Code</span>
            </h3>

            <form onSubmit={handleAddOfferSubmit} className="space-y-4 text-xs">
              {/* Promo Code */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DISCO500"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all uppercase font-bold"
                />
              </div>

              {/* Discount Tag */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Discount Description (e.g. '15% Off', '₹200 Off')</label>
                <input 
                  type="text" 
                  required
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                  placeholder="e.g. 15% Off"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Expiry Date</label>
                <input 
                  type="text" 
                  required
                  value={newOffer.expiry}
                  onChange={(e) => setNewOffer({ ...newOffer, expiry: e.target.value })}
                  placeholder="e.g. 2026-12-31"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all"
                />
              </div>

              {/* Description terms */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Offer Terms & Detail</label>
                <textarea 
                  required
                  rows={3}
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Get ₹200 off on purchasing driving chains in-store..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-200 outline-none focus:border-red-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-red-600/10 uppercase tracking-widest text-xs"
              >
                Add Store Offer
              </button>
            </form>
          </div>

          {/* Active store offers list column */}
          <div className="glass-panel rounded-3xl p-6 border border-neutral-900 lg:col-span-2 h-[450px] overflow-y-auto space-y-4">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>Active Coupons ({offers.length})</span>
            </h3>

            <div className="space-y-3">
              {offers.map((offer) => (
                <div 
                  key={offer.id || offer.code}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-900 rounded-xl gap-4"
                >
                  <div>
                    <h4 className="text-xs font-black text-neutral-200 uppercase font-mono tracking-wider">
                      Code: {offer.code} ({offer.discount})
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-light mt-1 max-w-md line-clamp-1">
                      {offer.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (offer.id) {
                        removeOffer(offer.id);
                        showFeedback(`Promo Code "${offer.code}" deleted successfully.`);
                      }
                    }}
                    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-950/15 rounded-lg transition-all"
                    title="Delete Promo Code"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Security PIN Management */}
      {activeSubTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          
          {/* Change PIN Form */}
          <div className="glass-panel rounded-3xl p-6 border border-neutral-900 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
              <div className="p-2 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Update Security PIN
                </h3>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Change established passcode</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-400 uppercase block">New PIN Code</label>
                <input 
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={8}
                  placeholder="••••"
                  value={newPinVal}
                  onChange={(e) => setNewPinVal(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-black text-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all placeholder:tracking-normal placeholder:font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-400 uppercase block">Confirm New PIN</label>
                <input 
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={8}
                  placeholder="••••"
                  value={confirmNewPinVal}
                  onChange={(e) => setConfirmNewPinVal(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-black text-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all placeholder:tracking-normal placeholder:font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-red-600/10 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save New PIN</span>
              </button>
            </form>
          </div>

          {/* Reset PIN Option */}
          <div className="glass-panel rounded-3xl p-6 border border-neutral-900 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
                <div className="p-2 bg-amber-600/10 border border-amber-500/20 rounded-xl text-amber-500">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    Reset Security Config
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Danger zone operations</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                    Resetting the passcode removes the active security constraint completely.
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                    The next time any administrator clicks the Admin Panel tab in the sidebar, they will be prompted to set up a brand-new PIN from scratch. Use this only if you must completely wipe the current configuration.
                  </p>
                </div>

                <div className="flex items-center gap-3.5 p-4 bg-neutral-900/40 border border-neutral-900 rounded-2xl text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div className="text-neutral-400">
                    <span className="font-bold text-neutral-300 block">Security Status: ACTIVE</span>
                    Only authenticated device sessions with the matching passcode can gain entry to catalogs.
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetPin}
              className={`w-full py-3 border font-bold rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                confirmingResetPin 
                  ? 'border-red-500 bg-red-950/20 text-red-400 animate-pulse' 
                  : 'border-red-500/20 hover:bg-red-950/10 text-red-500'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${confirmingResetPin ? 'animate-spin' : ''}`} />
              <span>{confirmingResetPin ? 'Click Again to Confirm Reset' : 'Reset PIN Option'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Edit Stat Modal */}
      <AnimatePresence>
        {editingStat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStat(null)}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm glass-panel border border-red-500/30 p-6 rounded-3xl shadow-2xl z-55 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <span className="text-xs font-mono text-red-500 uppercase font-bold">
                  Edit Metric Value
                </span>
                <button 
                  onClick={() => setEditingStat(null)}
                  className="text-neutral-500 hover:text-red-500 p-1 rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-neutral-400 uppercase block">
                  {editingStat.label}
                </label>
                <input 
                  type="number"
                  min="0"
                  value={statEditValue}
                  onChange={(e) => setStatEditValue(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-200 outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setEditingStat(null)}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatSave}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
