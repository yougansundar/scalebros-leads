import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessCategory } from '../types';
import { BusinessCard } from './BusinessCard';
import { AddBusinessModal } from './AddBusinessModal';
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  CheckSquare,
  Square,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORIES: BusinessCategory[] = [
  'All',
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

const POPULAR_TOWNS = [
  'Bodinayakanur',
  'Theni',
  'Madurai',
  'Coimbatore',
  'Chennai',
  'Tirunelveli',
  'Salem',
];

export const DiscoverTab: React.FC = () => {
  const {
    businesses,
    currentCity,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    activeSource,
    searchBusinesses,
    selectAllInCategory,
    clearAllSelection,
    selectedCount,
    triggerHaptic,
  } = useApp();

  const [inputCity, setInputCity] = useState(currentCity);
  const [filterQuery, setFilterQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Compute category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: businesses.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = businesses.filter((b) => b.category === cat).length;
      }
    });
    return counts;
  }, [businesses]);

  // Filter businesses by selectedCategory and filterQuery
  const filteredBusinesses = React.useMemo(() => {
    return businesses.filter((b) => {
      const matchesCategory =
        selectedCategory === 'All' || b.category === selectedCategory;
      const q = filterQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.gap.toLowerCase().includes(q) ||
        b.phone.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [businesses, selectedCategory, filterQuery]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCity.trim()) return;
    triggerHaptic();
    searchBusinesses(inputCity.trim());
  };

  const handleQuickCity = (city: string) => {
    triggerHaptic();
    setInputCity(city);
    searchBusinesses(city);
  };

  return (
    <div className="pb-32 space-y-4">
      {/* 1. City Input & Business Discovery Header */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleCitySubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 font-display flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target City / Town Discovery</span>
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Source:</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {activeSource === 'osm'
                  ? 'OpenStreetMap'
                  : activeSource === 'hybrid'
                  ? 'OSM + Local AI'
                  : 'Smart Places Heuristics'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="Enter city or town (e.g., Bodinayakanur, Theni)..."
                className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Scanning...' : 'Find Businesses'}</span>
            </button>
          </div>

          {/* Quick-pick City Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-500 text-[11px] whitespace-nowrap shrink-0">
              Popular:
            </span>
            {POPULAR_TOWNS.map((town) => (
              <button
                key={town}
                type="button"
                onClick={() => handleQuickCity(town)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 ${
                  currentCity.toLowerCase() === town.toLowerCase()
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
                }`}
              >
                {town}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 2. Auto-Categorization Horizontal Scrollable Chips */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-400">
            Categories in {currentCity}
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {filteredBusinesses.length} of {businesses.length} shown
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;
            return (
              <button
                key={category}
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory(category);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 select-none ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                    : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                    isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Selection System & In-city Search Filter Bar */}
      <section className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by business name, street, or detected gap..."
              className="w-full bg-[#0B0F19] border border-slate-700/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => {
              triggerHaptic();
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Custom</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Selection Action Buttons */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllInCategory}
              className="text-slate-300 hover:text-white flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select All ({selectedCategory})</span>
            </button>

            <button
              onClick={clearAllSelection}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <Square className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-800/40">
            {selectedCount} Selected
          </div>
        </div>
      </section>

      {/* 4. Discovered Businesses List */}
      <section className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-[#131B2E] border border-slate-800 rounded-2xl space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <div className="text-sm font-semibold text-white">Scanning businesses in {currentCity}...</div>
            <p className="text-xs text-slate-400">
              Querying OpenStreetMap and analyzing local digital marketing gaps.
            </p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-10 text-center bg-[#131B2E] border border-slate-800 rounded-2xl space-y-3">
            <Search className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-semibold text-white">No businesses match your filter</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching a different keyword, reset the category to &quot;All&quot;, or add a custom business to your queue.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setFilterQuery('');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {showAddModal && <AddBusinessModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
