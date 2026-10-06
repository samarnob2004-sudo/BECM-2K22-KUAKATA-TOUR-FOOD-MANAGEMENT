import React, { useState, useMemo } from 'react';
import { ComparisonQuoteItem, QuoteUnitType } from '../types/comparison';
import { AggregatedMasterItem, CATEGORIES, ItemCategory, ORDERED_CATEGORY_KEYS } from '../types/meal';
import { calculateStandardUnitPrice, INITIAL_COMPARISON_ITEMS } from '../data/defaultComparisonData';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { 
  Scale, 
  Search, 
  Plus, 
  RotateCcw, 
  Download, 
  Printer, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

const BASELINE_BUDGET_RATES: Record<string, number> = {
  rice_white: 65,
  polao_rice: 140,
  lentil_chola: 130,
  basmati_rice: 300,
  flour: 60,
  lentil_mosur: 135,
  lentil_mug: 160,
  toast_biscuit: 160,
  ginger: 240,
  dry_chilli_whole: 450,
  dry_chilli_powder: 420,
  turmeric: 320,
  cumin: 900,
  salt: 40,
  white_mustard: 180,
  cardamom: 4200,
  cinnamon: 600,
  clove: 1500,
  bay_leaf: 300,
  coriander: 320,
  black_pepper: 1600,
  mace_jayatri: 3200,
  nutmeg_jaiphal: 1300,
  kabab_chini: 3000,
  star_anise: 1100,
  shahi_chilli: 1500,
  fennel_mouri: 380,
  radhuni_masala: 380,
  tasting_salt: 1400,
  bit_salt: 100,
  fish_masala: 65,
  roast_masala: 60,
  soybean_oil: 185,
  mustard_oil: 280,
  ghee: 1400,
  butter_oil: 600,
  powder_milk: 880,
  sugar: 130,
  peanuts: 200,
  cashew: 1500,
  almond: 1400,
  alu_bokhara: 1100,
  kheer_mix: 70,
  morobba: 350,
  tomato_sauce: 200,
  soy_sauce: 220,
  vinegar: 70,
  orange_essence: 60,
  zafran_scent: 85,
  food_color: 50,
};

interface ComparisonViewProps {
  aggregatedItems: AggregatedMasterItem[];
  studentCount: number;
  priceOverrides?: Record<string, number>;
  onUpdateBudgetPrice?: (canonicalKey: string, newPrice: number) => void;
  onApplyRatesToBudget: (rates: Record<string, number>) => void;
  savedComparisonItems?: ComparisonQuoteItem[];
  onSaveComparisonItems?: (items: ComparisonQuoteItem[]) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  aggregatedItems,
  studentCount,
  priceOverrides = {},
  onUpdateBudgetPrice,
  onApplyRatesToBudget,
  savedComparisonItems,
  onSaveComparisonItems,
}) => {
  // Local state for comparison items
  const [items, setItems] = useState<ComparisonQuoteItem[]>(() => {
    if (savedComparisonItems && savedComparisonItems.length > 0) {
      return savedComparisonItems;
    }
    return INITIAL_COMPARISON_ITEMS;
  });

  // Local fallback state for budget price overrides if needed
  const [localBudgetPrices, setLocalBudgetPrices] = useState<Record<string, number>>({});

  // Helper to get effective budget rate for an item
  const getItemBudgetRate = (quoteItem: ComparisonQuoteItem): number => {
    if (localBudgetPrices[quoteItem.canonicalKey] !== undefined) {
      return localBudgetPrices[quoteItem.canonicalKey];
    }
    if (priceOverrides && priceOverrides[quoteItem.canonicalKey] !== undefined) {
      return priceOverrides[quoteItem.canonicalKey];
    }
    const tourItem = findMatchingTourItem(quoteItem);
    if (tourItem && tourItem.unitPrice > 0) {
      return tourItem.unitPrice;
    }
    return BASELINE_BUDGET_RATES[quoteItem.canonicalKey] || 0;
  };

  // Handler: Update Current Tour Budget Rate for an item
  const handleBudgetPriceChange = (quoteItem: ComparisonQuoteItem, valStr: string) => {
    const val = parseFloat(valStr);
    const validRate = isNaN(val) ? 0 : Math.max(0, val);

    setLocalBudgetPrices((prev) => ({
      ...prev,
      [quoteItem.canonicalKey]: validRate,
    }));

    if (onUpdateBudgetPrice) {
      onUpdateBudgetPrice(quoteItem.canonicalKey, validRate);
    }
  };

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'savings' | 'extra' | 'tour_needed'>('all');

  // Modals & Messages
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('spices');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [newItemUnit, setNewItemUnit] = useState<QuoteUnitType>('কেজি');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Map of tour aggregated items by canonicalKey for fast lookup
  const tourItemsMap = useMemo(() => {
    const map = new Map<string, AggregatedMasterItem>();
    aggregatedItems.forEach((item) => {
      map.set(item.canonicalKey, item);
    });
    return map;
  }, [aggregatedItems]);

  // Helper to find matching tour aggregated item by canonicalKey or name keywords
  const findMatchingTourItem = (quoteItem: ComparisonQuoteItem): AggregatedMasterItem | undefined => {
    if (tourItemsMap.has(quoteItem.canonicalKey)) {
      return tourItemsMap.get(quoteItem.canonicalKey);
    }
    const qName = quoteItem.name.trim().toLowerCase();
    return aggregatedItems.find((agg) => {
      const aName = agg.displayName.trim().toLowerCase();
      return aName === qName || aName.includes(qName) || qName.includes(aName);
    });
  };

  // Sync to parent/storage if prop provided
  const updateItemsAndPersist = (newItems: ComparisonQuoteItem[]) => {
    setItems(newItems);
    if (onSaveComparisonItems) {
      onSaveComparisonItems(newItems);
    }
  };

  // Handler: Change quoted price or unit inline
  const handleInlinePriceChange = (id: string, priceVal: number, unitVal?: QuoteUnitType) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const targetUnit = unitVal || item.quotedUnit;
        const validPrice = isNaN(priceVal) ? 0 : Math.max(0, priceVal);
        const { standardUnit, standardUnitPrice } = calculateStandardUnitPrice(validPrice, targetUnit);
        return {
          ...item,
          quotedPrice: validPrice,
          quotedUnit: targetUnit,
          standardUnit,
          standardUnitPrice,
          quotedQuantityNote: `${validPrice} টাকা / ${targetUnit}`,
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);
  };

  // Handler: Delete an item
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    updateItemsAndPersist(updated);
    showToast('আইটেমটি তুলনা তালিকা থেকে অপসারন করা হয়েছে');
  };

  // Handler: Reset to initial user-provided quote list
  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি ইউজারের প্রদত্ত মূল বাজার কোটেশন তালিকায় রিসেট করতে চান?')) {
      updateItemsAndPersist(INITIAL_COMPARISON_ITEMS);
      showToast('মূল বাজার কোটেশন দর পুনরায় লোড করা হয়েছে');
    }
  };

  // Handler: Add new custom item
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const priceNum = parseFloat(newItemPrice) || 0;
    const { standardUnit, standardUnitPrice } = calculateStandardUnitPrice(priceNum, newItemUnit);
    const key = `custom_${Date.now()}`;

    const newItem: ComparisonQuoteItem = {
      id: `cmp_${Date.now()}`,
      name: newItemName.trim(),
      canonicalKey: key,
      category: newItemCategory,
      quotedPrice: priceNum,
      quotedUnit: newItemUnit,
      quotedQuantityNote: `${priceNum} টাকা / ${newItemUnit}`,
      standardUnit,
      standardUnitPrice,
      notes: newItemNotes.trim() || undefined,
      isCustom: true,
    };

    const updated = [newItem, ...items];
    updateItemsAndPersist(updated);

    setNewItemName('');
    setNewItemPrice('');
    setNewItemNotes('');
    setIsAddModalOpen(false);
    showToast(`'${newItem.name}' সফলভাবে যুক্ত হয়েছে`);
  };

  // Handler: Apply comparison rates to Tour Master Budget
  const handleApplyToTourBudget = () => {
    const overridesToApply: Record<string, number> = {};
    let count = 0;

    items.forEach((item) => {
      if (item.canonicalKey && item.standardUnitPrice > 0) {
        overridesToApply[item.canonicalKey] = item.standardUnitPrice;
        count++;
      }
    });

    onApplyRatesToBudget(overridesToApply);
    setIsApplyModalOpen(false);
    showToast(`কোটেশনের ${count}টি দর সফলভাবে মূল টুর বাজেটে কার্যকর করা হয়েছে!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Comparative metrics calculation
  const metrics = useMemo(() => {
    let totalCurrentCost = 0;
    let totalQuotedCost = 0;
    let cheaperCount = 0;
    let expensiveCount = 0;
    let sameCount = 0;
    let matchedTourItems = 0;

    items.forEach((item) => {
      const tourItem = findMatchingTourItem(item);
      const currentRate = getItemBudgetRate(item);
      const quotedRate = item.standardUnitPrice;

      if (tourItem) {
        matchedTourItems++;
        const requiredQty = tourItem.totalQuantity;
        const currentCost = requiredQty * currentRate;
        const quotedCost = requiredQty * quotedRate;

        totalCurrentCost += currentCost;
        totalQuotedCost += quotedCost;

        if (quotedRate < currentRate) {
          cheaperCount++;
        } else if (quotedRate > currentRate) {
          expensiveCount++;
        } else {
          sameCount++;
        }
      } else {
        // Compare with baseline default if available
        if (currentRate > 0) {
          if (quotedRate < currentRate) cheaperCount++;
          else if (quotedRate > currentRate) expensiveCount++;
          else sameCount++;
        } else {
          sameCount++;
        }
      }
    });

    const netSavings = totalCurrentCost - totalQuotedCost;
    const savingsPercent = totalCurrentCost > 0 ? (netSavings / totalCurrentCost) * 100 : 0;

    return {
      totalItems: items.length,
      matchedTourItems,
      totalCurrentCost,
      totalQuotedCost,
      netSavings,
      savingsPercent,
      cheaperCount,
      expensiveCount,
      sameCount,
    };
  }, [items, tourItemsMap, priceOverrides, localBudgetPrices]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const tourItem = findMatchingTourItem(item);
      const currentRate = getItemBudgetRate(item);
      let matchesStatus = true;

      if (statusFilter === 'savings') {
        matchesStatus = currentRate > 0 ? item.standardUnitPrice < currentRate : false;
      } else if (statusFilter === 'extra') {
        matchesStatus = currentRate > 0 ? item.standardUnitPrice > currentRate : false;
      } else if (statusFilter === 'tour_needed') {
        matchesStatus = !!tourItem;
      }

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [items, selectedCategory, searchQuery, statusFilter, tourItemsMap, priceOverrides, localBudgetPrices]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ক্র.',
      'উপাদান',
      'ক্যাটাগরি',
      'কোটেশন দর',
      'কোটেশন একক',
      'প্রতি মানক একক দর (টাকা)',
      'বর্তমান টুর রেট (টাকা)',
      'পার্থক্য (টাকা)',
      'টুরে প্রয়োজন',
      'বর্তমান মোট খরচ',
      'কোটেশনে মোট খরচ',
      'সাশ্রয়/অতিরিক্ত',
    ];

    const rows = filteredItems.map((item, idx) => {
      const tourItem = findMatchingTourItem(item);
      const currentRate = getItemBudgetRate(item);
      const diff = currentRate > 0 ? item.standardUnitPrice - currentRate : 0;
      const qty = tourItem ? `${tourItem.totalQuantity} ${tourItem.unit}` : 'টুরে নেই';
      const curCost = tourItem ? tourItem.totalQuantity * currentRate : 0;
      const quoCost = tourItem ? tourItem.totalQuantity * item.standardUnitPrice : 0;
      const saving = tourItem ? curCost - quoCost : 0;

      return [
        idx + 1,
        `"${item.name}"`,
        `"${CATEGORIES[item.category]?.nameBn || item.category}"`,
        item.quotedPrice,
        `"${item.quotedUnit}"`,
        item.standardUnitPrice,
        currentRate || 'প্রযোজ্য নয়',
        diff,
        `"${qty}"`,
        curCost,
        quoCost,
        saving,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kuakata_tour_market_rate_comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-2xs text-emerald-400 font-semibold tracking-wider uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>বাজার দর যাচাই ও তুলনামূলক বিশ্লেষণ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight flex items-center gap-2">
            <span>কোটেশন দর বনাম বর্তমান বাজেট তুলনা</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              ৫০টি আইটেম সক্রিয়
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            ইউজারের প্রদত্ত নতুন বাজার কোটেশনের সাথে বর্তমান টুর বাজেটের আইটেমভিত্তিক পূর্ণাঙ্গ তুলনা। 
            যেকোনো দর সরাসরি এডিট ও পরিবর্তন করুন এবং প্রয়োজন অনুযায়ী এক ক্লিকে মূল টুর বাজেটে প্রয়োগ করুন।
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="এই কোটেশনের সব দর দিয়ে মূল ৬ বেলার টুর বাজেট আপডেট করুন"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>টুর বাজেটে দর প্রয়োগ করুন</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন আইটেম যোগ</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="CSV এক্সপোর্ট করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all cursor-pointer"
            title="ইউজারের প্রদত্ত মূল কোটেশন তালিকায় রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Comparative Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Total Compared Items */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>তুলনাধীন আইটেম সংখ্যা</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {metrics.totalItems}
            </span>
            <span className="text-xs text-slate-500 font-medium">টি খাদ্য উপাদান</span>
          </div>
          <div className="mt-1 text-2xs text-slate-500 flex items-center gap-1">
            <span>টুরে সরাসরি অন্তর্ভুক্ত:</span>
            <span className="font-semibold text-emerald-700 font-mono">{metrics.matchedTourItems} টি</span>
          </div>
        </div>

        {/* Card 2: Current Tour Budget on these items */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>বর্তমান বাজেটে খরচ</span>
            <span className="text-slate-400 text-xs">১২০ জনের</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs font-semibold text-slate-400">৳</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">
              {formatCurrency(metrics.totalCurrentCost)}
            </span>
          </div>
          <div className="mt-1 text-2xs text-slate-500">
            টুর মেম্বার: <span className="font-semibold text-slate-700">{studentCount} জন</span>
          </div>
        </div>

        {/* Card 3: Quoted Cost on these items */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center justify-between">
            <span>কোটেশন দরে মোট খরচ</span>
            <span className="text-indigo-400 text-xs">নতুন দর</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs font-semibold text-indigo-400">৳</span>
            <span className="text-2xl font-bold text-indigo-950 font-mono">
              {formatCurrency(metrics.totalQuotedCost)}
            </span>
          </div>
          <div className="mt-1 text-2xs text-indigo-600 font-medium">
            প্রাপ্ত বাজার যাচাই মূল্যের ভিত্তিতে
          </div>
        </div>

        {/* Card 4: Net Savings / Variance */}
        <div className={`p-4 rounded-xl border shadow-2xs ${
          metrics.netSavings >= 0 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-rose-50/70 border-rose-200 text-rose-950'
        }`}>
          <div className="text-2xs font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>সম্ভাব্য নিট সাশ্রয়</span>
            {metrics.netSavings >= 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs font-semibold">৳</span>
            <span className="text-2xl font-bold font-mono">
              {metrics.netSavings >= 0 ? '+' : ''}{formatCurrency(metrics.netSavings)}
            </span>
          </div>
          <div className="mt-1 text-2xs font-medium flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded-md font-semibold text-3xs ${
              metrics.netSavings >= 0 ? 'bg-emerald-200/70 text-emerald-900' : 'bg-rose-200/70 text-rose-900'
            }`}>
              {metrics.netSavings >= 0 ? 'সাশ্রয়' : 'অতিরিক্ত'} {Math.abs(metrics.savingsPercent).toFixed(1)}%
            </span>
            <span className="text-slate-500">
              ({metrics.cheaperCount}টিতে কম, {metrics.expensiveCount}টিতে বেশি)
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="কোটেশনের পণ্য খুঁজুন (যেমন: এলাচ, বাসমতি, ঘি)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
            />
          </div>

          {/* Quick status filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-2xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সকল ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter('savings')}
              className={`px-2.5 py-1 text-2xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'savings'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              <span>সাশ্রয়ী দর ({metrics.cheaperCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('extra')}
              className={`px-2.5 py-1 text-2xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'extra'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>বাড়তি দর ({metrics.expensiveCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('tour_needed')}
              className={`px-2.5 py-1 text-2xs font-semibold rounded-lg transition-all ${
                statusFilter === 'tour_needed'
                  ? 'bg-indigo-700 text-white shadow-2xs'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/60'
              }`}
            >
              টুরে ব্যবহৃত ({metrics.matchedTourItems})
            </button>
          </div>
        </div>

        {/* 8 Official Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব ক্যাটাগরি ({items.length})
          </button>
          {ORDERED_CATEGORY_KEYS.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const count = items.filter((i) => i.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span>{cat?.nameBn || catKey}</span>
                <span className={`text-2xs px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Items Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-2xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3 min-w-[170px]">খাদ্য উপাদান ও ক্যাটাগরি</th>
                <th className="py-3 px-3 min-w-[200px] text-center bg-indigo-50/50 text-indigo-900 border-x border-indigo-100/60">
                  প্রাপ্ত কোটেশন দর (এডিটেবল)
                </th>
                <th className="py-3 px-3 min-w-[120px] text-right">
                  প্রতি মানক একক দর
                </th>
                <th className="py-3 px-3 min-w-[200px] text-center bg-emerald-50/70 text-emerald-950 border-x border-emerald-100/80">
                  <div className="flex items-center justify-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>বর্তমান টুর বাজেট দর (এডিটেবল)</span>
                  </div>
                </th>
                <th className="py-3 px-3 min-w-[120px] text-center">
                  দর তারতম্য (পার্থক্য)
                </th>
                <th className="py-3 px-3 min-w-[110px] text-center">
                  টুরে প্রয়োজন
                </th>
                <th className="py-3 px-3 min-w-[110px] text-right">
                  বর্তমান মোট
                </th>
                <th className="py-3 px-3 min-w-[110px] text-right bg-emerald-50/40 text-emerald-950">
                  কোটেশন মোট
                </th>
                <th className="py-3 px-3 min-w-[100px] text-right">
                  সাশ্রয় / ব্যয়
                </th>
                <th className="py-3 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    কোনো খাদ্য উপাদান খুঁজে পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const tourItem = findMatchingTourItem(item);
                  const currentRate = getItemBudgetRate(item);
                  const diffRate = currentRate > 0 ? item.standardUnitPrice - currentRate : 0;
                  const diffPercent = currentRate > 0 ? (diffRate / currentRate) * 100 : 0;

                  const requiredQty = tourItem ? tourItem.totalQuantity : 0;
                  const currentCost = requiredQty * currentRate;
                  const quotedCost = requiredQty * item.standardUnitPrice;
                  const savings = tourItem ? currentCost - quotedCost : 0;

                  const isCheaper = currentRate > 0 && item.standardUnitPrice < currentRate;
                  const isMoreExpensive = currentRate > 0 && item.standardUnitPrice > currentRate;
                  const isSame = currentRate > 0 && item.standardUnitPrice === currentRate;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* # Index */}
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-2xs">
                        {index + 1}
                      </td>

                      {/* Name & Category */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-3xs font-medium px-1.5 py-0.2 rounded-md border ${
                            CATEGORIES[item.category]?.colorClass || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {CATEGORIES[item.category]?.nameBn || item.category}
                          </span>
                          {item.notes && (
                            <span className="text-3xs text-slate-400 truncate max-w-[120px]" title={item.notes}>
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quoted Price & Unit (Inline Editable!) */}
                      <td className="py-2.5 px-3 bg-indigo-50/30 border-x border-indigo-100/60">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quotedPrice === 0 ? '' : item.quotedPrice}
                            placeholder="০"
                            onChange={(e) => handleInlinePriceChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-center font-mono font-bold text-indigo-950 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-xs shadow-inner"
                            title="সরাসরি নতুন দর লিখুন"
                          />
                          <select
                            value={item.quotedUnit}
                            onChange={(e) => handleInlinePriceChange(item.id, item.quotedPrice, e.target.value as QuoteUnitType)}
                            className="px-1.5 py-1 text-2xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="কেজি">/ কেজি</option>
                            <option value="১০০ গ্রাম">/ ১০০ গ্রাম</option>
                            <option value="২৫০ গ্রাম">/ ২৫০ গ্রাম</option>
                            <option value="লিটার">/ লিটার</option>
                            <option value="প্যাকেট">/ প্যাকেট</option>
                            <option value="বোতল">/ বোতল</option>
                            <option value="পিস">/ পিস</option>
                          </select>
                        </div>
                      </td>

                      {/* Equivalent Standard Unit Price */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                        ৳{formatCurrency(item.standardUnitPrice)}
                        <span className="text-3xs text-slate-400 font-normal ml-0.5">/{item.standardUnit}</span>
                      </td>

                      {/* Current Tour Budget Rate (Inline Editable!) */}
                      <td className="py-2.5 px-3 bg-emerald-50/30 border-x border-emerald-100/60">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={currentRate === 0 ? '' : currentRate}
                            placeholder="০"
                            onChange={(e) => handleBudgetPriceChange(item, e.target.value)}
                            className="w-20 px-2 py-1 text-center font-mono font-bold text-emerald-950 bg-white border border-emerald-300 hover:border-emerald-400 focus:border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs shadow-inner"
                            title="বর্তমান টুর বাজেট দর সরাসরি এডিট করুন"
                          />
                          <span className="text-3xs text-slate-500 font-medium whitespace-nowrap">
                            /{tourItem?.unit || item.standardUnit}
                          </span>
                        </div>
                      </td>

                      {/* Difference (Pill) */}
                      <td className="py-2.5 px-3 text-center">
                        {currentRate > 0 ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold ${
                            isCheaper
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isMoreExpensive
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isCheaper && <TrendingDown className="w-3 h-3 text-emerald-600" />}
                            {isMoreExpensive && <TrendingUp className="w-3 h-3 text-rose-600" />}
                            {isSame && <Minus className="w-3 h-3 text-slate-400" />}
                            <span>
                              {diffRate > 0 ? '+' : ''}{formatCurrency(diffRate)} ৳
                            </span>
                            <span className="text-3xs font-normal">
                              ({diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(0)}%)
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-3xs">-</span>
                        )}
                      </td>

                      {/* Tour Required Amount */}
                      <td className="py-2.5 px-3 text-center font-mono">
                        {tourItem ? (
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-2xs">
                            {formatNumberBn(tourItem.totalQuantity)} {tourItem.unit}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-3xs">টুরে নেই</span>
                        )}
                      </td>

                      {/* Current Total Cost */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        {tourItem && currentCost > 0 ? (
                          `৳${formatCurrency(currentCost)}`
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Quoted Total Cost */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold bg-emerald-50/40 text-emerald-950">
                        {tourItem && quotedCost > 0 ? (
                          `৳${formatCurrency(quotedCost)}`
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Savings or Overrun */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {tourItem && savings !== 0 ? (
                          <span className={savings > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                            {savings > 0 ? `+৳${formatCurrency(savings)}` : `-৳${formatCurrency(Math.abs(savings))}`}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Action: Delete */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-md transition-opacity"
                          title="এই আইটেমটি তালিকা থেকে মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Footer: Totals */}
            <tfoot className="bg-slate-900 text-white font-semibold text-xs border-t-2 border-slate-700">
              <tr>
                <td colSpan={7} className="py-3 px-4 text-right">
                  টুরে সরাসরি অন্তর্ভুক্ত {metrics.matchedTourItems}টি পণ্যের মোট খরচ তুলনা:
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300">
                  ৳{formatCurrency(metrics.totalCurrentCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-300 bg-slate-800/80">
                  ৳{formatCurrency(metrics.totalQuotedCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                  {metrics.netSavings >= 0 ? `+৳${formatCurrency(metrics.netSavings)}` : `-৳${formatCurrency(Math.abs(metrics.netSavings))}`}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Info Card explaining how the comparison works */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950">
            কীভাবে কোটেশন দর কাজ করে?
          </div>
          <p className="text-amber-800 leading-relaxed">
            ১. ইনপুট বক্সে যে দর দেওয়া আছে তা ইউজারের সরাসরি বাজার তালিকা অনুসারে প্রতি ১০০ গ্রাম বা প্রতি কেজি হিসেবে সংরক্ষিত। 
            <br />
            ২. আপনি যেকোনো পণ্যের একক দর পরিবর্তন করতে পারেন বা একক (কেজি, ১০০ গ্রাম, লিটার, ইত্যাদি) পরিবর্তন করতে পারেন।
            <br />
            ৩. <strong>&apos;টুর বাজেটে দর প্রয়োগ করুন&apos;</strong> বাটনে ক্লিক করলে এই কোটেশনের রেটগুলো সরাসরি অ্যাপের মূল ৬ বেলার খাবার বাজেটে ও বাজার সামারিতে আপডেট হয়ে যাবে।
          </p>
        </div>
      </div>

      {/* Modal: Apply Rates to Master Tour Budget */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <span className="p-2.5 bg-emerald-50 rounded-xl">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  কোটেশন দর টুর বাজেটে প্রয়োগ করবেন?
                </h3>
                <p className="text-2xs text-slate-500">
                  {metrics.matchedTourItems}টি সক্রিয় উপাদানের একক দর আপডেট করা হবে
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>বর্তমান আনুমানিক খরচ:</span>
                <span className="font-mono font-semibold text-slate-800">৳{formatCurrency(metrics.totalCurrentCost)}</span>
              </div>
              <div className="flex justify-between items-center text-indigo-700 font-medium">
                <span>নতুন কোটেশন দর অনুযায়ী খরচ:</span>
                <span className="font-mono font-bold text-indigo-950">৳{formatCurrency(metrics.totalQuotedCost)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold">
                <span className={metrics.netSavings >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                  {metrics.netSavings >= 0 ? 'সম্ভাব্য সাশ্রয়:' : 'অতিরিক্ত ব্যয়:'}
                </span>
                <span className={`font-mono text-sm ${metrics.netSavings >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {metrics.netSavings >= 0 ? '+' : ''}৳{formatCurrency(metrics.netSavings)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              অনুমোদন দিলে বর্তমান টুর প্ল্যানার, ৬ বেলার খাদ্য তালিকা এবং বাজার সামারির সকল সংশ্লিষ্ট উপাদানের একক দর এই কোটেশনের দরে হালনাগাদ হয়ে যাবে।
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleApplyToTourBudget}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>হ্যাঁ, বাজেটে প্রয়োগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Comparison Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>নতুন খাদ্য উপাদান ও দর যোগ</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  উপাদানের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পোলাও চাল, কাজু বাদাম, শুকনা মরিচ..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    {ORDERED_CATEGORY_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {CATEGORIES[k]?.nameBn || k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    দর একক
                  </label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as QuoteUnitType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="কেজি">প্রতি কেজি</option>
                    <option value="১০০ গ্রাম">প্রতি ১০০ গ্রাম (শ)</option>
                    <option value="২৫০ গ্রাম">প্রতি ২৫০ গ্রাম</option>
                    <option value="লিটার">প্রতি লিটার</option>
                    <option value="প্যাকেট">প্রতি প্যাকেট</option>
                    <option value="বোতল">প্রতি বোতল</option>
                    <option value="পিস">প্রতি পিস</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  কোটেশন দর (টাকা) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    placeholder="যেমন: ১২০"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  নোট বা বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ১ লিটার বোতল, ফ্রেশ মিনিকেট..."
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  আইটেম যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
