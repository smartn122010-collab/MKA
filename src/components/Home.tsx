import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Copy, 
  Check, 
  MessageCircle, 
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

const SLIDESHOW_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
    title: "MKA PREMIUM TWO WHEELER SPARES",
    subtitle: "Ultimate Reliability for Every Rider & Wholesaler"
  },
  {
    url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=1200",
    title: "GENUINE HIGH-PERFORMANCE ENGINE PARTS",
    subtitle: "Optimized Air-Fuel Carburetors, Gaskets & Piston Components"
  },
  {
    url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200",
    title: "PREMIUM BRAKING & SUSPENSION SYSTEMS",
    subtitle: "Durable Gas Shock Absorbers & Low-Noise Brake Shoes"
  }
];

export const Home: React.FC = () => {
  const { products, offers, setActiveTab, setSelectedProduct } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Slideshow timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDESHOW_IMAGES.length) % SLIDESHOW_IMAGES.length);
  };

  // Copy code utility
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Pivot to search page
      setActiveTab('search');
    }
  };

  // Get available featured products (max 4)
  const featuredProducts = products.filter(p => p.stock).slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Header Hero Banner Slideshow */}
      <div className="relative h-[280px] sm:h-[380px] w-full rounded-3xl overflow-hidden shadow-2xl border border-red-500/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Slide Image */}
            <img 
              src={SLIDESHOW_IMAGES[currentSlide].url} 
              alt="Bike Slideshow"
              className="w-full h-full object-cover filter brightness-[0.4]"
            />

            {/* Slide Details Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] text-red-400 font-mono tracking-widest uppercase mb-3">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>Exclusive Wholesale Dealer</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
                  {SLIDESHOW_IMAGES[currentSlide].title}
                </h2>
                <p className="text-neutral-300 text-xs sm:text-sm mt-2 font-light">
                  {SLIDESHOW_IMAGES[currentSlide].subtitle}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button 
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-red-600/80 hover:text-white text-neutral-300 transition-all flex items-center justify-center backdrop-blur-md border border-neutral-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-red-600/80 hover:text-white text-neutral-300 transition-all flex items-center justify-center backdrop-blur-md border border-neutral-800"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDESHOW_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-red-600' : 'w-2 bg-neutral-600'}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Search Box with red glowing container */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600 to-red-950 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
          <div className="relative flex items-center bg-neutral-950 border border-red-500/20 rounded-2xl p-2.5 shadow-2xl">
            <Search className="w-5 h-5 text-neutral-500 ml-3" />
            <input 
              type="text" 
              placeholder="Search for spare parts, category, e.g. 'brake', 'chain', 'carburetor'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-200 outline-none px-4 placeholder:text-neutral-600"
            />
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* 3. Today's Offers Coupon Sliders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600/15 rounded-lg border border-red-500/20">
              <Zap className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Today's Store Offers
            </h3>
          </div>
          <button 
            onClick={() => setActiveTab('offers')}
            className="text-xs text-red-500 hover:text-red-400 font-medium flex items-center gap-1 group"
          >
            <span>View All Codes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Horizontal Slider Area */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
          {offers.map((offer) => (
            <div 
              key={offer.id || offer.code}
              className="snap-start shrink-0 w-80 glass-panel rounded-2xl p-5 border border-red-500/10 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card glowing red light effect on hover */}
              <div className="absolute -right-12 -top-12 w-24 h-24 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/15 transition-all duration-300" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold bg-red-600/15 border border-red-500/20 px-2.5 py-1 rounded-full text-red-400 uppercase tracking-widest">
                    {offer.discount}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500">
                    Exp: {offer.expiry}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-neutral-100 group-hover:text-red-400 transition-colors">
                  Code: {offer.code}
                </h4>
                <p className="text-xs text-neutral-400 mt-2 font-light line-clamp-2">
                  {offer.description}
                </p>
              </div>

              {/* Copy Coupon Code button */}
              <button
                onClick={() => handleCopyCode(offer.code)}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-500/30 text-xs font-medium rounded-xl text-neutral-300 hover:text-red-400 transition-all"
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Store Code</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Featured Spares Slider/Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600/15 rounded-lg border border-red-500/20">
              <Star className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Featured Parts Menu
            </h3>
          </div>
          <button 
            onClick={() => setActiveTab('products')}
            className="text-xs text-red-500 hover:text-red-400 font-medium flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Featured Items list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-neutral-900/20 border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center space-y-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Catalog is Empty</span>
              <p className="text-xs text-neutral-500 max-w-sm">No featured spare parts have been added to the catalog yet. Sign in as Admin to manually add products.</p>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <div 
                key={product.id || product.name}
                onClick={() => {
                  setSelectedProduct(product);
                  setActiveTab('products');
                }}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer"
              >
                {/* Product Image */}
                <div className="h-44 overflow-hidden relative bg-neutral-900 border-b border-neutral-900">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Available Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] text-emerald-400 font-mono tracking-wider">
                    IN STOCK
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                      {product.category}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-200 line-clamp-1 group-hover:text-red-400 transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-xs font-mono text-neutral-300">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-900">
                    <span className="font-mono text-md font-bold text-red-500">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-red-500 transition-colors flex items-center gap-0.5">
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. Contact Us Section */}
      <div id="contact-us" className="glass-panel rounded-3xl p-8 border border-red-500/10 relative overflow-hidden">
        
        {/* Subtle red outline glow */}
        <div className="absolute inset-0 bg-radial-glow opacity-5 hover:opacity-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
              <span>Customer Care Support</span>
            </div>
            
            <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight leading-none">
              M K A MOTORS
            </h3>
            <p className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
              Two Wheeler Spares Wholesale Dealers
            </p>
            <p className="text-sm text-neutral-400 max-w-lg font-light leading-relaxed">
              For immediate product availability inquiries, bulk wholesale orders, or customized spare part sourcing, contact us anytime. We service nationwide clients.
            </p>
          </div>

          {/* Contact Details Cards */}
          <div className="w-full md:w-auto shrink-0 space-y-3.5">
            <a 
              href="tel:7305068207"
              className="flex items-center gap-3.5 p-3.5 bg-neutral-900/50 hover:bg-neutral-900 rounded-xl border border-neutral-900 hover:border-red-500/20 transition-all group"
            >
              <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded-lg">
                <Phone className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">Mobile Hotline</span>
                <span className="text-sm font-bold text-neutral-200 group-hover:text-red-400">7305068207</span>
              </div>
            </a>

            <a 
              href="mailto:mkamotors16@outlook.com"
              className="flex items-center gap-3.5 p-3.5 bg-neutral-900/50 hover:bg-neutral-900 rounded-xl border border-neutral-900 hover:border-red-500/20 transition-all group"
            >
              <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded-lg">
                <Mail className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">Email Address</span>
                <span className="text-sm font-bold text-neutral-200 group-hover:text-red-400">mkamotors16@outlook.com</span>
              </div>
            </a>

            <a 
              href="https://whatsapp.com/channel/0029VbDLD8lDDmFa22OmnV2g"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3.5 bg-emerald-600/10 hover:bg-emerald-600/15 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all group"
            >
              <div className="p-2.5 bg-emerald-600/15 border border-emerald-500/25 rounded-lg animate-pulse">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-500 block">Join WhatsApp Channel</span>
                <span className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300">Click to Subscribe</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
