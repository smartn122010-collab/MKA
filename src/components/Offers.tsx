import React, { useState } from 'react';
import { Tag, Copy, Check, Info, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Offers: React.FC = () => {
  const { offers } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
          Offers & Promo Codes
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Save more on your spare parts bulk purchases. Copy the promo codes below and present them at the MKA Motor physical branch.
        </p>
      </div>

      {/* Grid of Offers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id || offer.code}
            className="glass-panel rounded-3xl p-6 border border-red-500/10 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top red glow decoration */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-all" />

            <div>
              {/* Promo Badge & Expiry */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{offer.discount}</span>
                </span>
                
                <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Expires: {offer.expiry}</span>
                </span>
              </div>

              {/* Promo Code & Title */}
              <h3 className="text-lg font-black font-display text-white group-hover:text-red-400 transition-colors uppercase tracking-wide">
                Code: {offer.code}
              </h3>

              {/* Terms description */}
              <p className="text-xs text-neutral-400 leading-relaxed font-light mt-3">
                {offer.description}
              </p>
            </div>

            {/* Action code copy */}
            <div className="mt-6 pt-4 border-t border-neutral-900/50 flex gap-2 relative z-10">
              <button
                onClick={() => handleCopyCode(offer.code)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-500/30 text-xs font-semibold rounded-xl text-neutral-300 hover:text-red-400 transition-all shadow-inner"
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Promo Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-500" />
                    <span>Copy Store Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructional Banner how to redeem */}
      <div className="glass-panel rounded-3xl p-6 border border-neutral-900 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-2xl shrink-0 text-red-500">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            How to Redeem Your Savings
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            When checking out at the physical MKA Motor shop, show this promo code screen directly to your manager or parts cashier. The discount associated with the active promo code will be calculated and subtracted from your total bill invoice immediately.
          </p>
        </div>
      </div>

    </div>
  );
};
