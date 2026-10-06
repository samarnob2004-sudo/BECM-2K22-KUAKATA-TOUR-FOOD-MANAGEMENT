import React, { useState, useMemo } from 'react';
import { AggregatedMasterItem, CATEGORIES, ItemCategory, ORDERED_CATEGORY_KEYS } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { Search, Tag, RefreshCw, X, Sparkles, Trash2, ArrowUpDown, Layers, LayoutGrid, List, Scale } from 'lucide-react';

interface RateListViewProps {
  aggregatedItems: AggregatedMasterItem[];
  onUpdatePrice: (canonicalKey: string, newPrice: number) => void;
  onFetchOnlinePrices: () => Promise<void>;
  isFetchingOnline: boolean;
  onClearAllPrices: () => void;
  onNavigateToComparison?: () => void;
}

export const RateListView: React.FC<RateListViewProps> = ({
  aggregatedItems,
  onUpdatePrice,
  onFetchOnlinePrices,
  isFetchingOnline,
  onClearAllPrices,
  onNavigateToComparison,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');
  const [sortField, setSortField] = useState<'name' | 'rate' | 'cost'>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter items
  const filteredItems = useMemo(() => {
    return aggregatedItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [aggregatedItems, selectedCategory, searchQuery]);

  // Sort items for flat table view
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') {
        comp = a.displayName.localeCompare(b.displayName, 'bn');
      } else if (sortField === 'rate') {
        comp = a.unitPrice - b.unitPrice;
      } else if (sortField === 'cost') {
        comp = a.totalCost - b.totalCost;
      }
      return sortAsc ? comp : -comp;
    });
  }, [filteredItems, sortField, sortAsc]);

  const handlePriceChange = (canonicalKey: string, valStr: string) => {
    const val = parseFloat(valStr);
    onUpdatePrice(canonicalKey, isNaN(val) ? 0 : Math.max(0, val));
  };

  const toggleSort = (field: 'name' | 'rate' | 'cost') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-2xs text-emerald-400 font-semibold tracking-wider uppercase">
            <Tag className="w-3.5 h-3.5" />
            <span>বাজার দর তালিকা ও একক মূল্য প্রাক্কলন</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
            মূল্য তালিকা (খাদ্য উপাদান ও বাজার দর)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            ৮টি মূল ক্যাটাগরিতে বিভক্ত সকল পণ্যের হালনাগাদ দর তালিকা। যেকোনো ক্যাটাগরি বেছে নিয়ে পণ্যগুলোর একক দর দেখুন, পরিবর্তন করুন অথবা অনলাইন থেকে স্বয়ংক্রিয়ভাবে বর্তমান দর আপডেট করে নিন।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {onNavigateToComparison && (
            <button
              onClick={onNavigateToComparison}
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="নতুন বাজার কোটেশন ও দর তুলনা সিস্টেমে যান"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>বাজার দর তুলনা (৫০ আইটেম)</span>
            </button>
          )}

          <button
            onClick={onFetchOnlinePrices}
            disabled={isFetchingOnline}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isFetchingOnline ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>অনলাইন থেকে খোঁজা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>অনলাইন থেকে দর আপডেট</span>
              </>
            )}
          </button>

          <button
            onClick={onClearAllPrices}
            title="সব উপাদানের দর মুছে ০ টাকা করুন"
            className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700/60 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সকল দর মুছুন</span>
          </button>
        </div>
      </div>

      {/* Category Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="উপাদানের নাম দিয়ে খুঁজুন (যেমন: রুই মাছ, চাল, তেল)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'grouped'
                    ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>ক্যাটাগরি গ্রুপ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3 h-3" />
                <span>একক তালিকা</span>
              </button>
            </div>

            <div className="text-2xs text-slate-500 hidden sm:block">
              <span>উপাদান: <strong className="text-slate-900 font-mono">{filteredItems.length}</strong> / {aggregatedItems.length}</span>
            </div>
          </div>
        </div>

        {/* 8 Official Categories Buttons in Exact Requested Order */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            সব ক্যাটাগরি ({aggregatedItems.length})
          </button>

          {ORDERED_CATEGORY_KEYS.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const count = aggregatedItems.filter((i) => i.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.nameBn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Rendering: Grouped by Category OR Flat Table */}
      {viewMode === 'grouped' && selectedCategory === 'all' ? (
        <div className="space-y-5">
          {ORDERED_CATEGORY_KEYS.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const catItems = filteredItems.filter((i) => i.category === catKey);
            if (catItems.length === 0) return null;

            const categoryCost = catItems.reduce((sum, i) => sum + i.totalCost, 0);

            return (
              <div 
                key={catKey} 
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden"
              >
                {/* Category Header Strip */}
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <h2 className="text-sm font-bold text-slate-900">
                      {cat.nameBn}
                    </h2>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {catItems.length} টি উপাদান
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span>প্রাক্কলিত মোট খরচ: </span>
                    <strong className="font-mono text-emerald-800 font-bold">
                      ৳ {formatCurrency(categoryCost)}
                    </strong>
                  </div>
                </div>

                {/* Table for this Category */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-white text-slate-500 text-2xs uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="py-2 px-3 w-10 text-center">ক্র.</th>
                        <th className="py-2 px-4">উপাদানের নাম</th>
                        <th className="py-2 px-4 text-center w-24">একক</th>
                        <th className="py-2 px-4 text-right w-28">মোট পরিমাণ</th>
                        <th className="py-2 px-4 hidden md:table-cell">ব্যবহারকারী মেনু</th>
                        <th className="py-2 px-4 text-right w-44">নির্ধারিত দর (৳)</th>
                        <th className="py-2 px-4 text-right w-36">মোট ব্যয় (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {catItems.map((item, idx) => (
                        <tr key={item.canonicalKey} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-center text-xs font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">
                            {item.displayName}
                          </td>
                          <td className="py-2.5 px-4 text-center font-medium text-xs text-slate-600">
                            {item.unit === 'গ্রাম' ? 'কেজি' : item.unit}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-xs font-semibold text-slate-700">
                            {formatNumberBn(item.totalQuantity)} {item.unit}
                          </td>
                          <td className="py-2.5 px-4 hidden md:table-cell text-xs text-slate-500">
                            <div className="flex flex-wrap gap-1">
                              {item.occurrences.map((o, oIdx) => (
                                <span key={oIdx} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 text-3xs text-slate-600">
                                  {o.mealTitle}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs text-slate-400">৳</span>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.unitPrice === 0 ? '' : item.unitPrice}
                                placeholder="০"
                                onChange={(e) => handlePriceChange(item.canonicalKey, e.target.value)}
                                className="w-24 text-right px-2 py-1 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 shadow-2xs"
                              />
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                              ৳ {formatCurrency(item.totalCost)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single/Filtered Table View */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                  <th className="py-3 px-3.5 w-12 text-center">ক্রমিক</th>
                  <th 
                    onClick={() => toggleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>উপাদানের নাম</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4 text-center w-24">একক</th>
                  <th className="py-3 px-4 text-right w-28">মোট পরিমাণ</th>
                  <th className="py-3 px-4 hidden md:table-cell">ব্যবহারকারী মেনু</th>
                  <th 
                    onClick={() => toggleSort('rate')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none w-44"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>নির্ধারিত একক দর (৳)</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort('cost')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none w-36"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>প্রাক্কলিত ব্যয় (৳)</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <p className="text-base font-medium">কোনো উপাদান পাওয়া যায়নি</p>
                      <p className="text-xs text-slate-400 mt-1">অন্য ক্যাটাগরি বা সার্চ কি-ওয়ার্ড নির্বাচন করুন</p>
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((item, idx) => {
                    const cat = CATEGORIES[item.category] || {
                      nameBn: 'অন্যান্য',
                    };

                    return (
                      <tr key={item.canonicalKey} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 text-center text-xs font-mono text-slate-400">
                          {idx + 1}
                        </td>

                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {item.displayName}
                        </td>

                        <td className="py-2.5 px-4 text-xs text-slate-600">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-2xs">
                            {cat.nameBn}
                          </span>
                        </td>

                        <td className="py-2.5 px-4 text-center font-medium text-xs text-slate-700">
                          {item.unit === 'গ্রাম' ? 'কেজি' : item.unit}
                        </td>

                        <td className="py-2.5 px-4 text-right font-mono text-xs font-semibold text-slate-700">
                          {formatNumberBn(item.totalQuantity)} {item.unit}
                        </td>

                        <td className="py-2.5 px-4 hidden md:table-cell text-xs text-slate-500">
                          <div className="flex flex-wrap gap-1">
                            {item.occurrences.map((o, oIdx) => (
                              <span key={oIdx} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 text-3xs text-slate-600">
                                {o.mealTitle}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs text-slate-400">৳</span>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.unitPrice === 0 ? '' : item.unitPrice}
                              placeholder="০"
                              onChange={(e) => handlePriceChange(item.canonicalKey, e.target.value)}
                              className="w-24 text-right px-2 py-1 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 shadow-2xs"
                            />
                          </div>
                        </td>

                        <td className="py-2.5 px-4 text-right">
                          <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                            ৳ {formatCurrency(item.totalCost)}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
