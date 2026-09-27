import React, { useState, useMemo } from 'react';
import { AggregatedMasterItem, CATEGORIES, ItemCategory } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { Search, Tag, Check, RefreshCw, X, Sparkles, Trash2, ArrowUpDown } from 'lucide-react';

interface RateListViewProps {
  aggregatedItems: AggregatedMasterItem[];
  onUpdatePrice: (canonicalKey: string, newPrice: number) => void;
  onFetchOnlinePrices: () => Promise<void>;
  isFetchingOnline: boolean;
  onClearAllPrices: () => void;
}

export const RateListView: React.FC<RateListViewProps> = ({
  aggregatedItems,
  onUpdatePrice,
  onFetchOnlinePrices,
  isFetchingOnline,
  onClearAllPrices,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
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

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') {
        comp = a.displayName.localeCompare(b.displayName);
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

  const startEdit = (item: AggregatedMasterItem) => {
    setEditingKey(item.canonicalKey);
    setTempPrice(item.unitPrice === 0 ? '' : item.unitPrice.toString());
  };

  const saveEdit = (canonicalKey: string) => {
    const val = parseFloat(tempPrice);
    onUpdatePrice(canonicalKey, isNaN(val) ? 0 : Math.max(0, val));
    setEditingKey(null);
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
            <span>বাজার দর ও মূল্য প্রাক্কলন</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
            উপাদানভিত্তিক একক মূল্য তালিকা (Rate Chart)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            ক্যাটাগরি সিলেক্ট করে প্রতিটি উপাদানের বর্তমান দর দেখুন বা সরাসরি নতুন দর বসিয়ে দিন। এখানে সেট করা দর স্বয়ংক্রিয়ভাবে ৬ বেলার প্রতিটি হিসাবে কার্যকর হবে।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={onFetchOnlinePrices}
            disabled={isFetchingOnline}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
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
            title="সব উপাদানের দর ০ করুন"
            className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700/60 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সকল দর মুছুন</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="উপাদানের নাম দিয়ে খুঁজুন..."
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

          <div className="text-2xs sm:text-xs text-slate-500 flex items-center gap-2 self-start sm:self-auto">
            <span>ক্যাটাগরির উপাদান: <strong className="text-slate-900 font-mono">{sortedItems.length}</strong> / {aggregatedItems.length}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-emerald-700 font-medium">ইনপুট বক্সে সরাসরি দর লিখে এন্টার চাপুন</span>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            সব ক্যাটাগরি ({aggregatedItems.length})
          </button>

          {(Object.keys(CATEGORIES) as ItemCategory[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const count = aggregatedItems.filter((i) => i.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
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

      {/* Rates Table */}
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
                <th className="py-3 px-4 text-center w-28">একক</th>
                <th className="py-3 px-4 hidden md:table-cell">ব্যবহারকারী মেনু</th>
                <th 
                  onClick={() => toggleSort('rate')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none w-48"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>নির্ধারিত একক দর (৳)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('cost')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none w-40"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>প্রাক্কলিত মোট ব্যয় (৳)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="text-base font-medium">কোনো উপাদান পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-1">অন্য ক্যাটাগরি বা সার্চ কি-ওয়ার্ড নির্বাচন করুন</p>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item, idx) => {
                  const cat = CATEGORIES[item.category] || {
                    nameBn: 'অন্যান্য',
                  };

                  const isEditing = editingKey === item.canonicalKey;

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
                            placeholder="দর লিখুন"
                            onChange={(e) => handlePriceChange(item.canonicalKey, e.target.value)}
                            className="w-28 text-right px-2.5 py-1 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 shadow-2xs"
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
    </div>
  );
};
