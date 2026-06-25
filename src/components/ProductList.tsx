import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Check, 
  X, 
  MessageSquare, 
  AlertTriangle, 
  PackageCheck, 
  UserCheck, 
  ShoppingCart,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductList: React.FC = () => {
  const { 
    products, 
    selectedProduct, 
    setSelectedProduct, 
    setActiveTab
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter list
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleOrderRedirect = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('register');
  };

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
            Our Spares Catalog
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Currently displaying {filteredProducts.length} high-quality spare parts in stock.
          </p>
        </div>

        {products.length > 0 && (
          /* Category Tabs */
          <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-1.5 border border-neutral-900 rounded-2xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-red-500/20 max-w-xl mx-auto my-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />
          <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">
            No Products in Catalog
          </h3>
          <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
            There are currently zero spare parts in the catalog. All products must be manually added by an administrator.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-red-600/10"
            >
              <UserCheck className="w-4 h-4" />
              <span>Go to Admin Panel to Add Products</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Catalog Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
          <div
            key={product.id || product.name}
            onClick={() => setSelectedProduct(product)}
            className={`glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer border ${
              selectedProduct?.name === product.name 
                ? 'border-red-500 glow-red' 
                : 'border-red-500/10'
            }`}
          >
            {/* Image Container */}
            <div className="h-44 overflow-hidden relative bg-neutral-900">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              
              {/* Stock Status Badge */}
              <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider ${
                product.stock 
                  ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400' 
                  : 'bg-red-500/15 border border-red-500/25 text-red-400'
              }`}>
                {product.stock ? 'IN STOCK' : 'OUT OF STOCK'}
              </div>
            </div>

            {/* Info Container */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                  {product.category}
                </span>
                <h3 className="text-sm font-bold text-neutral-200 line-clamp-1 group-hover:text-red-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 text-red-500 fill-red-500" />
                  <span className="text-xs font-mono text-neutral-300">{product.rating}</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-900">
                <span className="font-mono text-md font-extrabold text-red-500">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-neutral-400 group-hover:text-white flex items-center gap-0.5">
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Split Drawer Slide-In Panel for Product Detail */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            />

            {/* Detail Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-full sm:w-[480px] bg-neutral-950 border-l border-red-500/20 shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header Actions */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-6">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
                    Spare Part Details
                  </span>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500/20 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Product Image inside drawer */}
                <div className="h-56 w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-900 shadow-xl mb-6">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Specifications details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
                      {selectedProduct.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white mt-3 leading-tight">
                      {selectedProduct.name}
                    </h3>
                  </div>

                  {/* Rating Stars and Price */}
                  <div className="flex items-center justify-between py-3 px-4 bg-neutral-900/50 rounded-xl border border-neutral-900">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">Product Rating</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${
                                star <= Math.floor(selectedProduct.rating) 
                                  ? 'text-red-500 fill-red-500' 
                                  : 'text-neutral-700'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono text-neutral-300 ml-1">({selectedProduct.rating})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">Wholesale Price</span>
                      <span className="font-mono text-xl font-black text-red-500">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Stock Availability status check */}
                  <div className="flex items-center gap-3 py-3 px-4 rounded-xl border border-neutral-900 bg-neutral-900/30">
                    {selectedProduct.stock ? (
                      <>
                        <div className="p-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <PackageCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-200">Stock Available</span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Ready for immediate local pickup or courier shipping.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-200">Out of Stock</span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Backorder available. Expect 4-6 business days arrival.</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Description / Uses details */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Product Description & Fitment</span>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed bg-neutral-900/20 p-3.5 border border-neutral-900 rounded-xl">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Send buttons */}
              <div className="pt-6 border-t border-neutral-900">
                <button
                  onClick={() => handleOrderRedirect(selectedProduct)}
                  disabled={!selectedProduct.stock}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg text-sm ${
                    selectedProduct.stock 
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                      : 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{selectedProduct.stock ? 'Order Now via WhatsApp' : 'Unavailable in Stock'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
