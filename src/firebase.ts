import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import defaultFirebaseConfig from '../firebase-applet-config.json';

export interface CustomFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseURL?: string;
  firestoreDatabaseId?: string;
}

// Get the active configuration: check localStorage, then env variables, then default
export function getFirebaseConfig(): CustomFirebaseConfig {
  const saved = localStorage.getItem('mka_custom_firebase_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse custom firebase config:', e);
    }
  }

  // Check Vite environment variables
  const metaEnv = (import.meta as any).env || {};
  const envConfig: CustomFirebaseConfig = {
    apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
    authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
    databaseURL: metaEnv.VITE_FIREBASE_DATABASE_URL || '',
    projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: metaEnv.VITE_FIREBASE_APP_ID || '',
    firestoreDatabaseId: metaEnv.VITE_FIREBASE_FIRESTORE_DB_ID || undefined
  };

  if (envConfig.apiKey) {
    return envConfig;
  }

  // Ensure default structure matches
  return {
    ...defaultFirebaseConfig,
    databaseURL: (defaultFirebaseConfig as any).databaseURL || `https://${defaultFirebaseConfig.projectId}.firebaseio.com`
  };
}

const firebaseConfig = getFirebaseConfig();

// Initialize or reuse app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Prevent default prompts
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

