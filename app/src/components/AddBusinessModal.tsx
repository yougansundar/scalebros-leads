import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessCategory, MarketingGap } from '../types';
import { X, Plus, Phone, Building, MapPin, Sparkles } from 'lucide-react';
import { normalizePhoneNumber } from '../utils/phoneUtils';

interface AddBusinessModalProps {
  onClose: () => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Restaurants',
  'Textiles',
  'Supermarkets',
  'Healthcare & Clinics',
  'Automobile',
  'Real Estate',
  'Salons & Spas',
  'Jewellery',
  'Organic Stores',
  'Bakeries & Sweets',
];

const GAPS: MarketingGap[] = [
  'Needs AI Video Reels',
  'No Website Found',
  'Low Social Media Presence',
  'Poor Google Reviews / Photos',
  'Outdated Menu / Catalog',
  'No Active Promotions',
];

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({ onClose }) => {
  const { currentCity, addCustomBusiness, triggerHaptic } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Restaurants');
  const [gap, setGap] = useState<MarketingGap>('Needs AI Video Reels');
  const [address, setAddress] = useState('');

  const phonePreview = normalizePhoneNumber(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    triggerHaptic();
    addCustomBusiness({
      name: name.trim(),
      phone: phone.trim(),
      category,
      gap,
      address: address.trim() || `${currentCity} Market Area`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#131B2E] border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Add Custom Business</h3>
              <p className="text-xs text-slate-400">Add a local business or test your own number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Business Name *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sri Krishna Textiles or My Test Store"
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp / Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number or +91..."
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {phone && (
              <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                Normalized for WhatsApp: {phonePreview.formatted} ({phonePreview.normalized})
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detected Gap
              </label>
              <select
                value={gap}
                onChange={(e) => setGap(e.target.value as MarketingGap)}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {GAPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Address / Area (Optional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={`e.g. Main Bazaar, ${currentCity}`}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-colors"
            >
              Add to Targets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
