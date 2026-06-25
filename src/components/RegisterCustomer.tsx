import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Phone, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  CheckCircle,
  HelpCircle,
  Hash,
  ShoppingBag,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderRegistration } from '../types';

export const RegisterCustomer: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useApp();

  const [formData, setFormData] = useState<OrderRegistration>({
    name: '',
    contact: '',
    address: '',
    age: 0,
    productDetails: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-populate product details from context
  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productDetails: `${selectedProduct.name} (Category: ${selectedProduct.category}, Price: ₹${selectedProduct.price})`
      }));
    }
  }, [selectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const handleConfirmedSendOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, contact, address, age, productDetails } = formData;

    if (!name || !contact || !address || !productDetails) {
      setError("Please fill out all required fields before confirming your order.");
      return;
    }

    // Format WhatsApp message
    const adminPhone = '7305068207';
    const message = `Hello MKA Motors! I'd like to place an order for a motorcycle spare part. Here are my registration and order details:

--- CUSTOMER PROFILE ---
• Name: ${name}
• Contact No: ${contact}
• Address/Location: ${address}
• Age: ${age > 0 ? age : 'N/A'}

--- ORDER DETAIL ---
• Part Requested: ${productDetails}

Please confirm the order dispatch and wholesale invoice. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    // Open WhatsApp URL in a new tab
    window.open(whatsappUrl, '_blank');

    // Trigger Success feedback
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // Clean up selected product
      setSelectedProduct(null);
      setFormData({
        name: '',
        contact: '',
        address: '',
        age: 0,
        productDetails: ''
      });
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
          Customer Registration & Order Form
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Register your delivery details. Your final order voucher will be automatically formatted and transmitted to our warehouse manager over WhatsApp.
        </p>
      </div>

      {isSubmitted ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel border-emerald-500/20 rounded-3xl p-8 text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
          </div>
          <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider">
            Order Sent to WhatsApp!
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Your wholesale parts request has been compiled successfully. The WhatsApp chat window has been initialized. If it didn't open automatically, please click below.
          </p>
          <div className="pt-2">
            <button
              onClick={handleConfirmedSendOrder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all"
            >
              Re-open WhatsApp Chat
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleConfirmedSendOrder} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3 focus-within:border-red-500 transition-all">
                <UserCheck className="w-4 h-4 text-neutral-500 mr-2.5" />
                <input 
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="bg-transparent text-sm text-neutral-200 outline-none w-full placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3 focus-within:border-red-500 transition-all">
                <Phone className="w-4 h-4 text-neutral-500 mr-2.5" />
                <input 
                  type="tel"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Mobile / Whatsapp number"
                  className="bg-transparent text-sm text-neutral-200 outline-none w-full placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Address / Location */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Delivery Address & Location <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3 focus-within:border-red-500 transition-all">
                <MapPin className="w-4 h-4 text-neutral-500 mr-2.5 mt-0.5" />
                <textarea 
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your detailed shop or residential delivery address"
                  className="bg-transparent text-sm text-neutral-200 outline-none w-full placeholder:text-neutral-600 resize-none"
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Age
              </label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3 focus-within:border-red-500 transition-all">
                <Hash className="w-4 h-4 text-neutral-500 mr-2.5" />
                <input 
                  type="number"
                  name="age"
                  min="1"
                  value={formData.age || ''}
                  onChange={handleChange}
                  placeholder="Your age"
                  className="bg-transparent text-sm text-neutral-200 outline-none w-full placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Prefilled Product Details Info */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Active Product Selected
              </label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3">
                <ShoppingBag className="w-4 h-4 text-red-500 mr-2.5" />
                <span className="text-xs text-neutral-300 font-semibold truncate">
                  {selectedProduct ? selectedProduct.name : "None selected - browse Catalog"}
                </span>
              </div>
            </div>

            {/* Edit Product Details */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                Detailed Spare Parts Order Requirements <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-3 focus-within:border-red-500 transition-all">
                <MessageSquare className="w-4 h-4 text-neutral-500 mr-2.5 mt-0.5" />
                <textarea 
                  name="productDetails"
                  required
                  rows={3}
                  value={formData.productDetails}
                  onChange={handleChange}
                  placeholder="Describe your spare parts, quantity, model year, e.g. 'MKA Brake Shoes - Quantity 5 sets'"
                  className="bg-transparent text-sm text-neutral-200 outline-none w-full placeholder:text-neutral-600 resize-none"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-neutral-900">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirmed Send Order</span>
            </button>
          </div>
        </form>
      )}

      {/* Helpful Wholesale Order Instructions */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex items-start gap-3.5">
        <div className="p-2 bg-neutral-900 rounded-lg shrink-0">
          <HelpCircle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">How Wholesale Booking Works</h4>
          <p className="text-xs text-neutral-400 leading-relaxed mt-1">
            After clicking <strong>Confirmed Send Order</strong>, the website compiles your details and securely opens WhatsApp. Sending the pre-filled message instantly lists your request with our dispatcher. We will reply shortly with the stock confirmation, total weight, shipping carrier details, and secure digital payment links.
          </p>
        </div>
      </div>

    </div>
  );
};
