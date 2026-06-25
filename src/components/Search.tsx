import React, { useState } from 'react';
import { Search as SearchIcon, Star, Filter, LayoutGrid, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Search: React.FC = () => {
  const { products, setSelectedProduct, setActiveTab, seedDefaultProducts } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Derive unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products based on search inputs
  const filteredProducts = products.filter((product) => {
    const matchesQuery = 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

    return matchesQuery && matchesCategory;
  });

  const handleManualSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDefaultProducts();
      alert("Spares Catalog manually seeded with standard and Zero electric parts!");
    } catch (err) {
      alert("Failed to seed database. Verify Firestore configuration or try Guest offline Sandbox mode!");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
          Search Motorcycle Spares
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Type part names, manufacturer compatible categories, or technical codes.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-red-500/20 max-w-xl mx-auto my-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />
          <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">
            No Products in Catalog
          </h3>
          <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
            There are currently zero spare parts in the cloud database because automatic seeding is disabled by default.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleManualSeed}
              disabled={isSeeding}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{isSeeding ? 'Seeding...' : 'Manually Seed Catalog'}</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
            >
              <span>Go to Admin Panel</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Red Glowing Search Area */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-red-950/40 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition duration-300" />
            <div className="relative flex items-center bg-neutral-950 border border-red-500/30 rounded-2xl p-3 shadow-2xl">
              <SearchIcon className="w-5 h-5 text-red-500 mr-3" />
              <input 
                type="text" 
                placeholder="Type parts name (e.g., Brake Shoes, Chain, Gasket)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-neutral-200 outline-none placeholder:text-neutral-600 font-medium"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-500 hover:text-red-500 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                All Parts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 uppercase border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Search Results ({filteredProducts.length})</span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-red-500/10">
                <SearchIcon className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-neutral-300">No matching spare parts found</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your spelling or selecting 'All Parts' to browse our fully stocked catalog.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id || product.name}
                    onClick={() => {
                      setSelectedProduct(product);
                      setActiveTab('products');
                    }}
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="h-40 overflow-hidden relative bg-neutral-900">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider ${
                        product.stock 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}>
                        {product.stock ? 'AVAILABLE' : 'OUT OF STOCK'}
                      </span>
                    </div>

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

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-900">
                        <span className="font-mono text-sm font-bold text-red-500">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-neutral-400 group-hover:text-red-500 font-medium">
                          Select Part →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
