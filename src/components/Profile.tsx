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
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
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
    </div>
  );
};
