import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { Product, Offer, SalesStats, UserProfile } from '../types';
import { seedDatabaseIfNeeded, INITIAL_PRODUCTS, INITIAL_OFFERS, INITIAL_STATS, seedAllProductsManually } from '../utils/seeder';
import { handleFirestoreError, OperationType } from '../utils/firebaseHelpers';

interface AppContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  offers: Offer[];
  stats: SalesStats | null;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateExistingProduct: (id: string, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  seedDefaultProducts: () => Promise<void>;
  addNewOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  removeOffer: (id: string) => Promise<void>;
  updateSalesMetrics: (metrics: Partial<SalesStats>) => Promise<void>;
  isDemoMode: boolean;
  authLoading: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  enterDemoMode: (role: 'admin' | 'customer') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);

  // Demo Sandbox States
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('mka_is_demo_mode') === 'true';
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign In with Google
  const signIn = async () => {
    if (authLoading) return;
    setAuthError(null);
    setAuthLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Create or update user profile
        const userRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userRef);
        
        // Bootstrapped Admin check
        const isDefaultAdmin = result.user.email === 'smartnp09812@gmail.com' || result.user.email === 'smartn122010@gmail.com';
        const role = isDefaultAdmin ? 'admin' : 'customer';

        const userProfileData: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'MKA Customer',
          photoURL: result.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: role as 'admin' | 'customer'
        };

        await setDoc(userRef, userProfileData);
        setProfile(userProfileData);
        setIsDemoMode(false);
        localStorage.removeItem('mka_is_demo_mode');
      }
    } catch (err: any) {
      console.error("Sign-in failure details:", err);
      let errMsg = "Google Sign-In failed. Please try again.";
      if (err?.code === "auth/cancelled-popup-request" || err?.message?.includes("cancelled-popup-request")) {
        errMsg = "Popup Request Cancelled: A browser popup is already opening, or popups are blocked in this iframe. Try opening the app in a new tab first!";
      } else if (err?.code === "auth/popup-blocked" || err?.message?.includes("popup-blocked")) {
        errMsg = "Popup Blocked: Your browser blocked the authentication window. Please enable popups, or open this application in a new tab.";
      } else if (err?.code === "auth/popup-closed-by-user") {
        errMsg = "Login Cancelled: The Google authentication window was closed before signing in.";
      }
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Enter Guest/Admin Demo Sandbox Mode (when popups are blocked or for easy evaluation)
  const enterDemoMode = (role: 'admin' | 'customer') => {
    setAuthError(null);
    setIsDemoMode(true);
    localStorage.setItem('mka_is_demo_mode', 'true');
    
    // Setup dummy storage if not present
    if (!localStorage.getItem('mka_local_products')) {
      localStorage.setItem('mka_local_products', JSON.stringify([]));
    }
    if (!localStorage.getItem('mka_local_offers')) {
      localStorage.setItem('mka_local_offers', JSON.stringify(INITIAL_OFFERS));
    }
    if (!localStorage.getItem('mka_local_stats')) {
      localStorage.setItem('mka_local_stats', JSON.stringify(INITIAL_STATS));
    }

    const mockEmail = role === 'admin' ? 'smartnp09812@gmail.com' : 'customer@mkamotors.com';
    const mockUser = {
      uid: 'demo-user-123',
      email: mockEmail,
      displayName: role === 'admin' ? 'MKA Demo Admin' : 'Demo Customer Account',
      photoURL: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
        : 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=150',
    } as FirebaseUser;

    const mockProfile: UserProfile = {
      uid: 'demo-user-123',
      email: mockUser.email || '',
      displayName: mockUser.displayName || 'Demo User',
      photoURL: mockUser.photoURL || '',
      role: role
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
    
    // Load local data into state immediately
    setProducts(JSON.parse(localStorage.getItem('mka_local_products') || '[]'));
    setOffers(JSON.parse(localStorage.getItem('mka_local_offers') || '[]'));
    setStats(JSON.parse(localStorage.getItem('mka_local_stats') || 'null'));
  };

  // Log Out
  const logOut = async () => {
    try {
      if (isDemoMode) {
        setIsDemoMode(false);
        localStorage.removeItem('mka_is_demo_mode');
      } else {
        await signOut(auth);
      }
      setUser(null);
      setProfile(null);
      setSelectedProduct(null);
      setActiveTab('home');
      setAuthError(null);
    } catch (err) {
      console.error("Logout failure:", err);
    }
  };

  // Monitor Auth State
  useEffect(() => {
    if (isDemoMode) {
      // Re-trigger demo load on reload
      const savedProducts = localStorage.getItem('mka_local_products');
      const savedOffers = localStorage.getItem('mka_local_offers');
      const savedStats = localStorage.getItem('mka_local_stats');
      
      setProducts(savedProducts ? JSON.parse(savedProducts) : []);
      setOffers(savedOffers ? JSON.parse(savedOffers) : INITIAL_OFFERS);
      setStats(savedStats ? JSON.parse(savedStats) : INITIAL_STATS);
      
      // Keep admin/customer roles based on current profile or default to admin
      const currentRole = profile?.role || 'admin';
      const mockEmail = currentRole === 'admin' ? 'smartnp09812@gmail.com' : 'customer@mkamotors.com';

      const mockUser = {
        uid: 'demo-user-123',
        email: mockEmail,
        displayName: currentRole === 'admin' ? 'MKA Demo Admin' : 'Demo Customer Account',
        photoURL: currentRole === 'admin' 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
          : 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=150',
      } as FirebaseUser;
      
      const mockProfile: UserProfile = {
        uid: 'demo-user-123',
        email: mockUser.email || '',
        displayName: mockUser.displayName || 'MKA Demo Admin',
        photoURL: mockUser.photoURL || '',
        role: currentRole
      };

      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Try getting user profile
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            const isDefaultAdmin = firebaseUser.email === 'smartnp09812@gmail.com' || firebaseUser.email === 'smartn122010@gmail.com';
            if (isDefaultAdmin && data.role !== 'admin') {
              data.role = 'admin';
              await updateDoc(userRef, { role: 'admin' });
            }
            setProfile(data);
          } else {
            // Safe fallback if user login popup didn't finish profiles setDoc
            const isDefaultAdmin = firebaseUser.email === 'smartnp09812@gmail.com' || firebaseUser.email === 'smartn122010@gmail.com';
            const role = isDefaultAdmin ? 'admin' : 'customer';
            
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'MKA Customer',
              photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              role: role as 'admin' | 'customer'
            };
            await setDoc(userRef, fallbackProfile);
            setProfile(fallbackProfile);
          }
        } catch (err) {
          console.warn("Could not retrieve user profile from Firestore:", err);
        }
        
        // Seed standard products and statistics once authenticated so DB is ready
        await seedDatabaseIfNeeded();
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // Sync Products, Offers, and Stats in real-time when authenticated
  useEffect(() => {
    if (isDemoMode) return; // Do not connect to firestore in offline demo mode

    if (!user) {
      setProducts([]);
      setOffers([]);
      setStats(null);
      return;
    }

    // 1. Sync Products
    const productsRef = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    // 2. Sync Offers
    const offersRef = collection(db, 'offers');
    const unsubscribeOffers = onSnapshot(offersRef, (snapshot) => {
      const items: Offer[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Offer);
      });
      setOffers(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'offers');
    });

    // 3. Sync Sales Stats
    const statsDocRef = doc(db, 'stats', 'global');
    const unsubscribeStats = onSnapshot(statsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.data() as SalesStats);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/global');
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOffers();
      unsubscribeStats();
    };
  }, [user, isDemoMode]);

  // Admin Actions - Add/Edit/Delete Products
  const addNewProduct = async (product: Omit<Product, 'id'>) => {
    if (isDemoMode) {
      const newId = 'local_prod_' + Math.random().toString(36).substring(2, 9);
      const productWithId: Product = { id: newId, ...product };
      const updatedProducts = [...products, productWithId];
      setProducts(updatedProducts);
      localStorage.setItem('mka_local_products', JSON.stringify(updatedProducts));
      return;
    }

    try {
      await addDoc(collection(db, 'products'), product);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  const updateExistingProduct = async (id: string, product: Partial<Product>) => {
    if (isDemoMode) {
      const updatedProducts = products.map(p => p.id === id ? { ...p, ...product } : p);
      setProducts(updatedProducts);
      localStorage.setItem('mka_local_products', JSON.stringify(updatedProducts));
      return;
    }

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, product);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    }
  };

  const removeProduct = async (id: string) => {
    if (isDemoMode) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('mka_local_products', JSON.stringify(updatedProducts));
      return;
    }

    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    }
  };

  const clearAllProducts = async () => {
    if (isDemoMode) {
      setProducts([]);
      localStorage.setItem('mka_local_products', JSON.stringify([]));
      return;
    }

    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products/clear');
    }
  };

  const seedDefaultProducts = async () => {
    try {
      await seedAllProductsManually(isDemoMode);
      if (isDemoMode) {
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (err) {
      console.error("Error manual seeding products:", err);
    }
  };

  // Admin Actions - Add/Delete Offers
  const addNewOffer = async (offer: Omit<Offer, 'id'>) => {
    if (isDemoMode) {
      const newId = 'local_offer_' + Math.random().toString(36).substring(2, 9);
      const offerWithId: Offer = { id: newId, ...offer };
      const updatedOffers = [...offers, offerWithId];
      setOffers(updatedOffers);
      localStorage.setItem('mka_local_offers', JSON.stringify(updatedOffers));
      return;
    }

    try {
      await addDoc(collection(db, 'offers'), offer);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'offers');
    }
  };

  const removeOffer = async (id: string) => {
    if (isDemoMode) {
      const updatedOffers = offers.filter(o => o.id !== id);
      setOffers(updatedOffers);
      localStorage.setItem('mka_local_offers', JSON.stringify(updatedOffers));
      return;
    }

    try {
      const docRef = doc(db, 'offers', id);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `offers/${id}`);
    }
  };

  // Admin Actions - Update Sales Metrics
  const updateSalesMetrics = async (metrics: Partial<SalesStats>) => {
    if (isDemoMode) {
      const currentStats = stats || INITIAL_STATS;
      const updatedStats = { ...currentStats, ...metrics };
      setStats(updatedStats);
      localStorage.setItem('mka_local_stats', JSON.stringify(updatedStats));
      return;
    }

    try {
      const docRef = doc(db, 'stats', 'global');
      await updateDoc(docRef, {
        ...metrics,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'stats/global');
    }
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
      clearAllProducts,
      seedDefaultProducts,
      addNewOffer,
      removeOffer,
      updateSalesMetrics,
      isDemoMode,
      authLoading,
      authError,
      setAuthError,
      enterDemoMode
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
