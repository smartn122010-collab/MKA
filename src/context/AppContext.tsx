import React, { createContext, useContext, useState } from 'react';
import { Product, Offer, SalesStats, UserProfile } from '../types';
import { INITIAL_PRODUCTS, INITIAL_OFFERS, INITIAL_STATS } from '../utils/seeder';

interface AppContextType {
  user: { uid: string; email: string; displayName: string; photoURL: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  offers: Offer[];
  stats: SalesStats | null;
  signIn: (email?: string, password?: string, isRegistering?: boolean, displayName?: string) => Promise<void>;
  logOut: () => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateExistingProduct: (id: string, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  addNewOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  removeOffer: (id: string) => Promise<void>;
  updateSalesMetrics: (metrics: Partial<SalesStats>) => Promise<void>;
  isDemoMode: boolean;
  authLoading: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  enterDemoMode: (role: 'admin' | 'customer') => void;
  updateProfilePhoto: (avatarUrl: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  uid: 'mka-local-user',
  email: 'smartnp09812@gmail.com',
  displayName: 'MKA Admin',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  role: 'admin'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mka_local_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local profile:', e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const [user, setUser] = useState<{ uid: string; email: string; displayName: string; photoURL: string } | null>(() => {
    return {
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL
    };
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mka_local_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed initial products
    localStorage.setItem('mka_local_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('mka_local_offers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed initial offers
    localStorage.setItem('mka_local_offers', JSON.stringify(INITIAL_OFFERS));
    return INITIAL_OFFERS;
  });

  const [stats, setStats] = useState<SalesStats | null>(() => {
    const saved = localStorage.getItem('mka_local_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed initial stats
    localStorage.setItem('mka_local_stats', JSON.stringify(INITIAL_STATS));
    return INITIAL_STATS;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Keep local profile updated when saving
  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setUser({
      uid: newProfile.uid,
      email: newProfile.email,
      displayName: newProfile.displayName,
      photoURL: newProfile.photoURL
    });
    localStorage.setItem('mka_local_profile', JSON.stringify(newProfile));
  };

  const updateProfilePhoto = async (avatarUrl: string) => {
    const updated = { ...profile, photoURL: avatarUrl };
    saveProfile(updated);
  };

  // Sign In function (local simulation)
  const signIn = async (email?: string, password?: string, isRegistering?: boolean, displayName?: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const isDefaultAdmin = email === 'smartnp09812@gmail.com' || email === 'smartn122010@gmail.com';
      const role = isDefaultAdmin ? 'admin' : 'customer';
      const newProfile: UserProfile = {
        uid: email ? `user_${email.replace(/[^a-zA-Z0-9]/g, '')}` : 'mka-local-user',
        email: email || 'smartnp09812@gmail.com',
        displayName: displayName || (isDefaultAdmin ? 'MKA Admin' : 'MKA Customer'),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: role as 'admin' | 'customer'
      };
      saveProfile(newProfile);
    } catch (err: any) {
      setAuthError(err?.message || "Sign-In failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const enterDemoMode = (role: 'admin' | 'customer') => {
    const mockEmail = role === 'admin' ? 'smartnp09812@gmail.com' : 'customer@mkamotors.com';
    const newProfile: UserProfile = {
      uid: 'demo-user-123',
      email: mockEmail,
      displayName: role === 'admin' ? 'MKA Demo Admin' : 'Demo Customer Account',
      photoURL: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
        : 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=150',
      role: role
    };
    saveProfile(newProfile);
  };

  const logOut = async () => {
    const defaultCustomer: UserProfile = {
      uid: 'guest-customer',
      email: 'guest@mkamotors.com',
      displayName: 'Guest Customer',
      photoURL: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=150',
      role: 'customer'
    };
    saveProfile(defaultCustomer);
    setSelectedProduct(null);
    setActiveTab('home');
    setAuthError(null);
  };

  const addNewProduct = async (product: Omit<Product, 'id'>) => {
    const newId = 'local_prod_' + Math.random().toString(36).substring(2, 9);
    const productWithId: Product = { id: newId, ...product };
    const updatedProducts = [...products, productWithId];
    setProducts(updatedProducts);
    localStorage.setItem('mka_local_products', JSON.stringify(updatedProducts));
  };

  const updateExistingProduct = async (id: string, product: Partial<Product>) => {
    const updatedProducts = products.map(p => p.id === id ? { ...p, ...product } : p);
    setProducts(updatedProducts);
    localStorage.setItem('mka_local_products', JSON.stringify(updatedProducts));
  };

  const removeProduct = async (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('mka_local_products', JSON.stringify(updatedProducts));
  };

  const addNewOffer = async (offer: Omit<Offer, 'id'>) => {
    const newId = 'local_offer_' + Math.random().toString(36).substring(2, 9);
    const offerWithId: Offer = { id: newId, ...offer };
    const updatedOffers = [...offers, offerWithId];
    setOffers(updatedOffers);
    localStorage.setItem('mka_local_offers', JSON.stringify(updatedOffers));
  };

  const removeOffer = async (id: string) => {
    const updatedOffers = offers.filter(o => o.id !== id);
    setOffers(updatedOffers);
    localStorage.setItem('mka_local_offers', JSON.stringify(updatedOffers));
  };

  const updateSalesMetrics = async (metrics: Partial<SalesStats>) => {
    const currentStats = stats || INITIAL_STATS;
    const updatedStats = { ...currentStats, ...metrics };
    setStats(updatedStats);
    localStorage.setItem('mka_local_stats', JSON.stringify(updatedStats));
  };

  return (
    <AppContext.Provider value={{
      user,
      profile,
      loading,
      activeTab,
      setActiveTab,
      selectedProduct,
      setSelectedProduct,
      products,
      offers,
      stats,
      signIn,
      logOut,
      addNewProduct,
      updateExistingProduct,
      removeProduct,
      addNewOffer,
      removeOffer,
      updateSalesMetrics,
      isDemoMode,
      authLoading,
      authError,
      setAuthError,
      enterDemoMode,
      updateProfilePhoto
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
