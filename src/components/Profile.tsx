import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  LogOut, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Camera, 
  CheckCircle,
  Link2,
  ShieldAlert,
  Database,
  KeyRound,
  RefreshCw,
  Sliders,
  Eye,
  EyeOff,
  Globe,
  Settings2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { db, getFirebaseConfig, CustomFirebaseConfig } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const PRESET_AVATARS = [
  {
    name: "Carbon Speed",
    url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Rider Helmet",
    url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Steering Wrench",
    url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Golden Pistons",
    url: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Classic Engine",
    url: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Superbike Throttle",
    url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=150"
  }
];

export const Profile: React.FC = () => {
  const { profile, logOut, user } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.photoURL || '');
  const [customUrl, setCustomUrl] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Firebase Config States
  const currentFbConfig = getFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentFbConfig.apiKey || '');
  const [projectId, setProjectId] = useState(currentFbConfig.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentFbConfig.authDomain || '');
  const [databaseURL, setDatabaseURL] = useState(currentFbConfig.databaseURL || '');
  const [storageBucket, setStorageBucket] = useState(currentFbConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentFbConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(currentFbConfig.appId || '');
  const [firestoreDatabaseId, setFirestoreDatabaseId] = useState(currentFbConfig.firestoreDatabaseId || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDbSaved, setIsDbSaved] = useState(false);

  const handleAutoInfer = () => {
    if (!databaseURL) return;
    try {
      const urlObj = new URL(databaseURL.trim());
      const hostname = urlObj.hostname;
      const parts = hostname.split('.');
      if (parts.length > 0) {
        const sub = parts[0];
        // remove "-rtdb" and region suffixes if present
        const inferredProjId = sub.replace('-rtdb', '').split('-')[0] || sub.replace('-rtdb', '');
        setProjectId(inferredProjId);
        setAuthDomain(`${inferredProjId}.firebaseapp.com`);
        setStorageBucket(`${inferredProjId}.firebasestorage.app`);
      }
    } catch (e) {
      // Direct string fallback if they entered just the project name
      const cleanUrl = databaseURL.trim().replace(/^https?:\/\//, '');
      const parts = cleanUrl.split('.');
      if (parts.length > 0) {
        const inferredProjId = parts[0].replace('-rtdb', '').split('-')[0];
        setProjectId(inferredProjId);
        setAuthDomain(`${inferredProjId}.firebaseapp.com`);
        setStorageBucket(`${inferredProjId}.firebasestorage.app`);
      }
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      setError("API Key and Project ID are required to establish a connection.");
      return;
    }
    const config: CustomFirebaseConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim(),
      databaseURL: databaseURL.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      firestoreDatabaseId: firestoreDatabaseId.trim() || undefined
    };
    localStorage.setItem('mka_custom_firebase_config', JSON.stringify(config));
    setIsDbSaved(true);
    setTimeout(() => {
      setIsDbSaved(false);
      window.location.reload();
    }, 1500);
  };

  const handleResetConfig = () => {
    localStorage.removeItem('mka_custom_firebase_config');
    setIsDbSaved(true);
    setTimeout(() => {
      setIsDbSaved(false);
      window.location.reload();
    }, 1500);
  };

  if (!profile) return null;

  const handleUpdateAvatar = async (avatarUrl: string) => {
    try {
      setError(null);
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { photoURL: avatarUrl });
      setSelectedAvatar(avatarUrl);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError("Could not save profile picture. Check your connection.");
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      handleUpdateAvatar(customUrl.trim());
      setCustomUrl('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
          Customer Profile Portal
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your account profile picture, customize your dashboard credentials, and log out securely.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 text-xs font-semibold flex items-center gap-2.5 shadow-lg"
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Profile Card Info */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/10 space-y-8 relative overflow-hidden">
        
        {/* Glow red highlight block */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Area with Hover Overlay */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full blur opacity-35 group-hover:opacity-75 transition duration-300" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-red-600/30 bg-neutral-900 shadow-xl">
              <img 
                src={selectedAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setShowSelector(!showSelector)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
              >
                <Camera className="w-5 h-5 text-red-500 mb-1" />
                <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Change</span>
              </button>
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600/10 border border-red-500/20 rounded-full text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Registered Customer</span>
            </div>
            
            <h3 className="font-display text-xl font-bold text-white leading-tight">
              {profile.displayName}
            </h3>

            {/* Display Gmail ID */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-400 font-mono">
              <Mail className="w-4 h-4 text-neutral-600" />
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        {/* Change Avatar Gallery Section */}
        {showSelector && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="pt-6 border-t border-neutral-900 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Avatar Custom Gallery
              </span>
              {savedSuccess && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </span>
              )}
            </div>

            {/* Grid of Preset Avatars */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.url;
                return (
                  <button
                    key={avatar.name}
                    onClick={() => handleUpdateAvatar(avatar.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 bg-neutral-900 ${
                      isSelected ? 'border-red-500 glow-red' : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img 
                      src={avatar.url} 
                      alt={avatar.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input Form */}
            <form onSubmit={handleCustomUrlSubmit} className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                Or Input Custom Image URL
              </label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus-within:border-red-500 transition-all">
                <Link2 className="w-4 h-4 text-neutral-500 mr-2.5" />
                <input 
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="bg-transparent text-xs text-neutral-200 outline-none w-full placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-red-600 text-white hover:shadow-[0_0_10px_rgba(220,38,38,0.3)] text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all border border-neutral-700 hover:border-red-500"
                >
                  Apply
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Profile Action Log Out Button */}
        <div className="pt-6 border-t border-neutral-900 flex justify-end">
          <button
            onClick={logOut}
            className="flex items-center gap-2 py-3 px-6 bg-red-950/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-xs font-bold text-red-400 hover:text-white rounded-xl transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Securely Sign Out Account</span>
          </button>
        </div>
      </div>

      {/* Firebase Custom Connection Settings Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-900/50 space-y-6 relative overflow-hidden">
        {/* Glow highlight */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Firebase Database Connection Settings
            </h3>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              Connect your customized store deployment to another account or database
            </p>
          </div>
        </div>

        {isDbSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2.5 shadow-lg"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Connection config updated! Reloading application...</span>
          </motion.div>
        )}

        <p className="text-xs text-neutral-400 leading-relaxed">
          If you are deploying this app on your own <strong>Netlify</strong> hosting service, you can dynamically override the default store database. Paste your target Firebase account credentials below. Supports both Firestore and Realtime Database (RTDB).
        </p>

        <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Realtime Database URL */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  Firebase Realtime Database URL (RTDB)
                </label>
                <button
                  type="button"
                  onClick={handleAutoInfer}
                  className="text-[9px] font-mono text-amber-500 hover:text-amber-400 uppercase font-bold transition-colors cursor-pointer"
                >
                  Infer Endpoints from URL
                </button>
              </div>
              <input
                type="url"
                placeholder="https://ds-document-store-default-rtdb.asia-southeast1.firebasedatabase.app/"
                value={databaseURL}
                onChange={(e) => setDatabaseURL(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
              <p className="text-[9px] text-neutral-500 font-mono">
                Provide a Realtime Database endpoint. Click "Infer Endpoints" to extract standard project details automatically!
              </p>
            </div>

            {/* API Key */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
                Firebase API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  required
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-3.5 pr-10 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Project ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Project ID</label>
              <input
                type="text"
                required
                placeholder="ds-document-store-default"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
            </div>

            {/* Auth Domain */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Auth Domain</label>
              <input
                type="text"
                required
                placeholder="ds-document-store-default.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
            </div>

            {/* Storage Bucket */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Storage Bucket</label>
              <input
                type="text"
                placeholder="ds-document-store-default.appspot.com"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
            </div>

            {/* Messaging Sender ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Messaging Sender ID</label>
              <input
                type="text"
                placeholder="1234567890"
                value={messagingSenderId}
                onChange={(e) => setMessagingSenderId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
            </div>

            {/* App ID */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">App ID</label>
              <input
                type="text"
                placeholder="1:1234567890:web:abcdef123456"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
            </div>

            {/* Firestore Database ID */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                Firestore Database ID (Optional)
              </label>
              <input
                type="text"
                placeholder="(default)"
                value={firestoreDatabaseId}
                onChange={(e) => setFirestoreDatabaseId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 transition-all font-mono text-xs"
              />
              <p className="text-[9px] text-neutral-500 font-mono">
                Use '(default)' or leave blank unless using a custom multi-database Firestore configuration.
              </p>
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetConfig}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition-all shadow-sm font-mono text-[11px] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 bg-amber-500 hover:bg-amber-600 border border-amber-400/20 text-xs font-bold text-neutral-950 rounded-xl transition-all shadow-md font-sans uppercase tracking-widest cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              <span>Apply & Connect Database</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
