import React, { useState, useMemo } from 'react';
import { AggregatedMasterItem, CATEGORIES, ItemCategory, UnitType } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { Search, ArrowUpDown, Plus, Edit2, Check, X, Layers, Users } from 'lucide-react';

interface MasterSummaryProps {
  aggregatedItems: AggregatedMasterItem[];
  onUpdatePrice: (canonicalKey: string, newPrice: number) => void;
  onUpdateQuantity: (canonicalKey: string, newQuantity: number) => void;
  onAddNewMasterItem: (item: {
    name: string;
    category: ItemCategory;
    amount: number;
    unit: UnitType;
    unitPrice: number;
    mealId?: string;
  }) => void;
  grandTotal: number;
  studentCount: number;
  setStudentCount?: (count: number) => void;
}

export const MasterSummary: React.FC<MasterSummaryProps> = ({
  aggregatedItems,
  onUpdatePrice,
  onUpdateQuantity,
  onAddNewMasterItem,
  grandTotal,
  studentCount,
  setStudentCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'amount' | 'cost' | 'category'>('cost');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Quick edit mode state for quantity
  const [editingAmountKey, setEditingAmountKey] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState<string>('');

  // Add new item modal/drawer in master summary
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ItemCategory>('vegetables');
  const [newAmount, setNewAmount] = useState<number>(1);
  const [newUnit, setNewUnit] = useState<UnitType>('কেজি');
  const [newUnitPrice, setNewUnitPrice] = useState<number>(100);
  const [selectedMealDestination, setSelectedMealDestination] = useState<string>('day2-dinner');

  // Filter items
  const filteredItems = useMemo(() => {
    return aggregatedItems.filter((item) => {
      const matchesSearch = item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.occurrences.some(o => o.mealTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [aggregatedItems, searchQuery, selectedCategory]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.displayName.localeCompare(b.displayName);
      } else if (sortField === 'amount') {
        comparison = a.totalQuantity - b.totalQuantity;
      } else if (sortField === 'cost') {
        comparison = a.totalCost - b.totalCost;
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [filteredItems, sortField, sortAsc]);

  const toggleSort = (field: 'name' | 'amount' | 'cost' | 'category') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handlePriceChange = (canonicalKey: string, valueStr: string) => {
    const val = parseFloat(valueStr);
    onUpdatePrice(canonicalKey, isNaN(val) ? 0 : Math.max(0, val));
  };

  const startEditAmount = (item: AggregatedMasterItem) => {
    setEditingAmountKey(item.canonicalKey);
    setTempAmount(item.totalQuantity.toString());
  };

  const saveEditAmount = (canonicalKey: string) => {
    const parsed = parseFloat(tempAmount);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateQuantity(canonicalKey, parsed);
    }
    setEditingAmountKey(null);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddNewMasterItem({
      name: newName.trim(),
      category: newCategory,
      amount: newAmount,
      unit: newUnit,
      unitPrice: newUnitPrice,
      mealId: selectedMealDestination,
    });

    // Reset form
    setNewName('');
    setNewAmount(1);
    setNewUnitPrice(100);
    setIsAddingNewItem(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner and Summary Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-2xs text-emerald-400 font-semibold tracking-wider uppercase">
              <span>কুয়াকাটা টুর ২০২৬</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>বিইসিএম ২২ ব্যাচ (কুয়েট)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ৬ বেলার খাবারের একীভূত বাজার তালিকা ও প্রাক্কলন
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              সদস্য সংখ্যা অনুযায়ী সমস্ত খাদ্যোপাদান ও কাঁচাবাজারের পরিমাণ (চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মশলাপাতি) মূল অনুপাতের ভিত্তিতে স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়।
            </p>

            {setStudentCount && (
              <div className="pt-1 flex items-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300 font-medium">সদস্য সংখ্যা:</span>
                  <button
                    type="button"
                    onClick={() => setStudentCount(Math.max(1, studentCount - 5))}
                    title="৫ জন কমান"
                    className="w-5 h-5 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white px-1">{studentCount} জন</span>
                  <button
                    type="button"
                    onClick={() => setStudentCount(Math.min(500, studentCount + 5))}
                    title="৫ জন বাড়ান"
                    className="w-5 h-5 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
                  >
                    +
                  </button>
                  <span className="text-emerald-400 text-2xs ml-1 border-l border-slate-700 pl-2 font-mono">
                    {(studentCount / 120).toFixed(2)}x স্কেল
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t border-slate-800 lg:border-t-0">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-left lg:text-right min-w-[180px]">
              <div className="text-2xs text-slate-400 font-medium">সর্বমোট বাজার বাজেট</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                ৳ {formatCurrency(grandTotal)}
              </div>
              <div className="text-2xs text-slate-300 mt-1">
                জনপ্রতি খরচ: <strong className="text-white font-mono">৳ {formatCurrency(studentCount > 0 ? Math.round(grandTotal / studentCount) : 0)}</strong>
              </div>
            </div>

            <button
              onClick={() => setIsAddingNewItem(!isAddingNewItem)}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন উপাদান যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Panel */}
      {isAddingNewItem && (
        <form onSubmit={handleCreateNewItem} className="bg-white p-5 rounded-2xl border border-emerald-500 shadow-sm transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>বাজার তালিকায় নতুন উপাদান যুক্ত করুন</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingNewItem(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="lg:col-span-2">
              <label className="block text-2xs font-semibold text-slate-700 mb-1">উপাদানের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: পোলাও চাল, খাসির মাংস, কাঁচা মরিচ..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">ক্যাটাগরি</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ItemCategory)}
                className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-800"
              >
                {(Object.keys(CATEGORIES) as ItemCategory[]).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORIES[catKey].nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">সর্বমোট পরিমাণ ও একক</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                  className="w-20 text-xs px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900 font-mono font-bold text-right"
                />
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as UnitType)}
                  className="flex-1 text-xs px-1.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800"
                >
                  <option value="কেজি">কেজি</option>
                  <option value="গ্রাম">গ্রাম</option>
                  <option value="লিটার">লিটার</option>
                  <option value="পিস">পিস</option>
                  <option value="প্যাকেট">প্যাকেট</option>
                  <option value="তোলা">তোলা</option>
                  <option value="টাকা">টাকা</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">একক দর (৳)</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium">৳</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="রেট লিখুন"
                  value={newUnitPrice}
                  onChange={(e) => setNewUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900 font-mono font-medium text-right"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>কোন বেলার মেনুর সাথে যুক্ত হবে:</span>
              <select
                value={selectedMealDestination}
                onChange={(e) => setSelectedMealDestination(e.target.value)}
                className="text-xs bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium"
              >
                <option value="day1-breakfast">১ম দিন সকাল</option>
                <option value="day1-lunch">১ম দিন দুপুর ও পায়েস</option>
                <option value="day1-dinner">১ম দিন রাত</option>
                <option value="day2-breakfast">২য় দিন সকাল</option>
                <option value="day2-lunch">২য় দিন দুপুর</option>
                <option value="day2-dinner">২য় দিন রাত (গ্র্যান্ড ফিস্ট)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsAddingNewItem(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs transition-colors"
              >
                তালিকাভুক্ত করুন
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="উপাদানের নাম দিয়ে খুঁজুন (যেমন: তেল, চাল, মাংস)..."
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

          {/* Quick Counter Info */}
          <div className="text-2xs sm:text-xs text-slate-500 flex items-center gap-2 self-start sm:self-auto">
            <span>প্রদর্শিত উপাদান: <strong className="text-slate-900 font-mono">{sortedItems.length}</strong> / {aggregatedItems.length}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-emerald-700 font-medium">পরিমাণ বা দরে ক্লিক করে সরাসরি এডিট করা যায়</span>
          </div>
        </div>

        {/* Category Pills (Segmented Button Group) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            সব উপাদান ({aggregatedItems.length})
          </button>

          {(Object.keys(CATEGORIES) as ItemCategory[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const count = aggregatedItems.filter(i => i.category === catKey).length;
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

      {/* Main Aggregated Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 text-xs font-semibold border-b border-slate-200">
                <th className="py-3 px-3.5 w-12 text-center">ক্রমিক</th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>উপাদানের নাম ও ক্যাটাগরি</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 hidden md:table-cell">
                  <span>কোন কোন বেলার হিসাবে রয়েছে</span>
                </th>
                <th 
                  onClick={() => toggleSort('amount')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none w-48"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>সর্বমোট পরিমাণ (এডিটেবল)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right w-40">
                  <span>একক দর (৳)</span>
                </th>
                <th 
                  onClick={() => toggleSort('cost')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors select-none w-36"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>মোট টাকা (৳)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="text-base font-medium">কোনো উপাদান পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-1">অনুসন্ধানের কি-ওয়ার্ড বা ক্যাটাগরি পরিবর্তন করে দেখুন</p>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item, idx) => {
                  const cat = CATEGORIES[item.category] || {
                    nameBn: 'অন্যান্য',
                    colorClass: 'bg-slate-50 text-slate-800 border-slate-200',
                  };

                  const isEditingAmount = editingAmountKey === item.canonicalKey;

                  return (
                    <tr 
                      key={item.canonicalKey}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3 px-3.5 text-center text-xs font-mono text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Name & Category */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {item.displayName}
                        </div>
                        <div className="text-2xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-slate-600">{cat.nameBn}</span>
                          {item.secondaryAmountText && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-700 font-medium">{item.secondaryAmountText}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Meals breakdown list */}
                      <td className="py-3 px-4 hidden md:table-cell text-xs text-slate-600">
                        <div className="flex flex-wrap gap-1 items-center">
                          {item.occurrences.map((occ, oIdx) => (
                            <span 
                              key={oIdx}
                              className="inline-flex items-center text-2xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60"
                              title={occ.note ? `${occ.mealTitle}: ${occ.note}` : occ.mealTitle}
                            >
                              <span className="font-medium">{occ.mealTitle}:</span>
                              <span className="ml-1 font-mono">{occ.amount} {occ.unit}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total Amount (Editable upon click) */}
                      <td className="py-3 px-4 text-right">
                        {isEditingAmount ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="any"
                              min="0"
                              value={tempAmount}
                              autoFocus
                              onChange={(e) => setTempAmount(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditAmount(item.canonicalKey);
                                if (e.key === 'Escape') setEditingAmountKey(null);
                              }}
                              className="w-24 text-right px-2 py-1 text-sm font-mono font-bold bg-white border-2 border-emerald-600 rounded-md focus:outline-none text-slate-900 shadow-2xs"
                            />
                            <button
                              onClick={() => saveEditAmount(item.canonicalKey)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                              title="সংরক্ষণ করুন"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingAmountKey(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200 transition-colors"
                              title="বাতিল"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditAmount(item)}
                            className="group/amt inline-flex items-center justify-end gap-1.5 cursor-pointer px-2 py-1 rounded hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200"
                            title="সর্বমোট পরিমাণ এডিট করতে ক্লিক করুন"
                          >
                            <span className="font-mono tabular-nums font-bold text-slate-900 text-base">
                              {formatNumberBn(item.totalQuantity)} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                            </span>
                            <Edit2 className="w-3.5 h-3.5 text-slate-300 group-hover/amt:text-emerald-700 transition-colors" />
                          </div>
                        )}
                      </td>

                      {/* Rate / Unit Price (Editable Input) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs text-slate-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice === 0 ? '' : item.unitPrice}
                            placeholder="দর লিখুন"
                            onChange={(e) => handlePriceChange(item.canonicalKey, e.target.value)}
                            className="w-24 text-right px-2 py-1 text-sm font-mono font-medium bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
                          />
                        </div>
                        <div className="text-3xs text-slate-400 text-right mt-0.5">
                          {item.unit === 'গ্রাম' ? 'প্রতি কেজি দর' : `প্রতি ${item.unit}`}
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono tabular-nums font-bold text-slate-900 text-base">
                          ৳ {formatCurrency(item.totalCost)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Footer: Grand Total Sum */}
            <tfoot>
              <tr className="bg-slate-50 text-slate-900 font-semibold border-t-2 border-slate-200">
                <td colSpan={2} className="py-4 px-4 text-sm font-bold">
                  সর্বমোট হিসাব ({sortedItems.length} টি উপাদান)
                </td>
                <td className="py-4 px-4 hidden md:table-cell text-xs text-slate-500">
                  কুয়াকাটা টুর ৬ বেলার মোট কাঁচাবাজার
                </td>
                <td className="py-4 px-4 text-right text-xs text-slate-600 font-mono">
                  মোট আইটেম: {sortedItems.length}
                </td>
                <td className="py-4 px-4 text-right text-sm text-slate-700 font-semibold">
                  সর্বমোট মূল্য:
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-mono tabular-nums font-black text-emerald-800 text-lg sm:text-xl">
                    ৳ {formatCurrency(grandTotal)}
                  </div>
                  <div className="text-2xs text-slate-500 mt-0.5 font-normal">
                    (জনপ্রতি ৳ {formatCurrency(studentCount > 0 ? Math.round(grandTotal / studentCount) : 0)})
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
