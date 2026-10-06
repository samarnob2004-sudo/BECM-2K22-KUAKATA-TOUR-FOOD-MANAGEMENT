import React, { useState, useMemo } from 'react';
import { ComparisonQuoteItem, QuoteUnitType } from '../types/comparison';
import { AggregatedMasterItem, CATEGORIES, ItemCategory, ORDERED_CATEGORY_KEYS, UnitType } from '../types/meal';
import { calculateStandardUnitPrice, INITIAL_COMPARISON_ITEMS } from '../data/defaultComparisonData';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { 
  Scale, 
  Search, 
  Plus, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Layers, 
  Sparkles,
  Settings2,
  X
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
  onUpdateMasterQuantity?: (canonicalKey: string, newQty: number) => void;
  onApplyRatesToBudget: (rates: Record<string, number>) => void;
  savedComparisonItems?: ComparisonQuoteItem[];
  onSaveComparisonItems?: (items: ComparisonQuoteItem[]) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  aggregatedItems,
  studentCount,
  priceOverrides = {},
  onUpdateBudgetPrice,
  onUpdateMasterQuantity,
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

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'savings' | 'extra' | 'tour_needed'>('all');

  // Modals & Messages
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [editingItemModal, setEditingItemModal] = useState<ComparisonQuoteItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('spices');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [newItemUnit, setNewItemUnit] = useState<QuoteUnitType>('কেজি');
  const [newItemBudgetRate, setNewItemBudgetRate] = useState<string>('');
  const [newItemRequiredQty, setNewItemRequiredQty] = useState<string>('');
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

  // Helper getters for effective values of an item
  const getItemBudgetRate = (quoteItem: ComparisonQuoteItem): number => {
    if (quoteItem.customBudgetRate !== undefined) {
      return quoteItem.customBudgetRate;
    }
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

  const getEffectiveQuantity = (quoteItem: ComparisonQuoteItem): number => {
    if (quoteItem.customRequiredQty !== undefined) {
      return quoteItem.customRequiredQty;
    }
    const tourItem = findMatchingTourItem(quoteItem);
    return tourItem ? tourItem.totalQuantity : 0;
  };

  const getEffectiveUnit = (quoteItem: ComparisonQuoteItem): UnitType => {
    if (quoteItem.customRequiredUnit) {
      return quoteItem.customRequiredUnit;
    }
    const tourItem = findMatchingTourItem(quoteItem);
    return tourItem?.unit || quoteItem.standardUnit;
  };

  const getEffectiveCurrentCost = (quoteItem: ComparisonQuoteItem): number => {
    if (quoteItem.customCurrentTotal !== undefined) {
      return quoteItem.customCurrentTotal;
    }
    const qty = getEffectiveQuantity(quoteItem);
    const rate = getItemBudgetRate(quoteItem);
    return Math.round(qty * rate);
  };

  const getEffectiveQuotedCost = (quoteItem: ComparisonQuoteItem): number => {
    if (quoteItem.customQuotedTotal !== undefined) {
      return quoteItem.customQuotedTotal;
    }
    const qty = getEffectiveQuantity(quoteItem);
    const rate = quoteItem.standardUnitPrice;
    return Math.round(qty * rate);
  };

  // Sync to parent / localStorage
  const updateItemsAndPersist = (newItems: ComparisonQuoteItem[]) => {
    setItems(newItems);
    if (onSaveComparisonItems) {
      onSaveComparisonItems(newItems);
    }
  };

  // 1. Column Edit: Item Name
  const handleNameChange = (id: string, newName: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    );
    updateItemsAndPersist(updated);
  };

  // 2. Column Edit: Category
  const handleCategoryChange = (id: string, newCat: ItemCategory) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, category: newCat } : item
    );
    updateItemsAndPersist(updated);
  };

  // 3. Column Edit: Notes
  const handleNotesChange = (id: string, newNotes: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, notes: newNotes } : item
    );
    updateItemsAndPersist(updated);
  };

  // 4. Column Edit: Quoted Price & Unit
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
          customQuotedTotal: undefined, // Recalculate
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);
  };

  // 5. Column Edit: Standard Unit Price & Unit
  const handleStandardPriceChange = (id: string, standardVal: number, standardUnitVal?: UnitType) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const standardUnitPrice = Math.max(0, standardVal);
        const standardUnit = standardUnitVal || item.standardUnit;
        let quotedPrice = standardUnitPrice;
        if (item.quotedUnit === '১০০ গ্রাম') {
          quotedPrice = Math.round(standardUnitPrice / 10);
        } else if (item.quotedUnit === '২৫০ গ্রাম') {
          quotedPrice = Math.round(standardUnitPrice / 4);
        } else if (item.quotedUnit === 'গ্রাম') {
          quotedPrice = Number((standardUnitPrice / 1000).toFixed(2));
        }
        return {
          ...item,
          standardUnitPrice,
          standardUnit,
          quotedPrice,
          quotedQuantityNote: `${quotedPrice} টাকা / ${item.quotedUnit}`,
          customQuotedTotal: undefined,
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);
  };

  // 6. Column Edit: Current Tour Budget Rate
  const handleBudgetPriceChange = (quoteItem: ComparisonQuoteItem, valStr: string) => {
    const val = parseFloat(valStr);
    const validRate = isNaN(val) ? 0 : Math.max(0, val);

    setLocalBudgetPrices((prev) => ({
      ...prev,
      [quoteItem.canonicalKey]: validRate,
    }));

    const updated = items.map((item) => {
      if (item.id === quoteItem.id) {
        return {
          ...item,
          customBudgetRate: validRate,
          customCurrentTotal: undefined,
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);

    if (onUpdateBudgetPrice) {
      onUpdateBudgetPrice(quoteItem.canonicalKey, validRate);
    }
  };

  // 7. Column Edit: Tour Required Quantity & Unit
  const handleRequiredQtyChange = (quoteItem: ComparisonQuoteItem, valStr: string) => {
    const val = parseFloat(valStr);
    const validQty = isNaN(val) ? 0 : Math.max(0, val);

    const updated = items.map((item) => {
      if (item.id === quoteItem.id) {
        return {
          ...item,
          customRequiredQty: validQty,
          customCurrentTotal: undefined,
          customQuotedTotal: undefined,
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);

    if (onUpdateMasterQuantity) {
      const tourItem = findMatchingTourItem(quoteItem);
      if (tourItem) {
        onUpdateMasterQuantity(tourItem.canonicalKey, validQty);
      }
    }
  };

  const handleRequiredUnitChange = (id: string, newUnit: UnitType) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, customRequiredUnit: newUnit } : item
    );
    updateItemsAndPersist(updated);
  };

  // 8. Column Edit: Current Total Cost (Manual Override)
  const handleCurrentTotalChange = (quoteItem: ComparisonQuoteItem, valStr: string) => {
    const val = parseFloat(valStr);
    const validTotal = isNaN(val) ? 0 : Math.max(0, val);
    const qty = getEffectiveQuantity(quoteItem);

    const updated = items.map((item) => {
      if (item.id === quoteItem.id) {
        return {
          ...item,
          customCurrentTotal: validTotal,
          customBudgetRate: qty > 0 ? Math.round(validTotal / qty) : item.customBudgetRate,
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);

    if (qty > 0 && onUpdateBudgetPrice) {
      onUpdateBudgetPrice(quoteItem.canonicalKey, Math.round(validTotal / qty));
    }
  };

  // 9. Column Edit: Quoted Total Cost (Manual Override)
  const handleQuotedTotalChange = (quoteItem: ComparisonQuoteItem, valStr: string) => {
    const val = parseFloat(valStr);
    const validTotal = isNaN(val) ? 0 : Math.max(0, val);
    const qty = getEffectiveQuantity(quoteItem);

    const updated = items.map((item) => {
      if (item.id === quoteItem.id) {
        const newStandardRate = qty > 0 ? Math.round(validTotal / qty) : item.standardUnitPrice;
        return {
          ...item,
          customQuotedTotal: validTotal,
          standardUnitPrice: newStandardRate,
        };
      }
      return item;
    });
    updateItemsAndPersist(updated);
  };

  // Delete an item
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    updateItemsAndPersist(updated);
    showToast('আইটেমটি তালিকা থেকে সরানো হয়েছে');
  };

  // Reset to initial user-provided quote list
  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি ইউজারের প্রদত্ত মূল বাজার কোটেশন তালিকায় রিসেট করতে চান? সকল কাস্টম এডিট ডিফল্টে ফিরে যাবে।')) {
      setLocalBudgetPrices({});
      updateItemsAndPersist(INITIAL_COMPARISON_ITEMS);
      showToast('মূল বাজার কোটেশন দর পুনরায় লোড করা হয়েছে');
    }
  };

  // Add new item
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const priceNum = parseFloat(newItemPrice) || 0;
    const { standardUnit, standardUnitPrice } = calculateStandardUnitPrice(priceNum, newItemUnit);
    const key = `custom_${Date.now()}`;
    const budgetRateNum = parseFloat(newItemBudgetRate) || 0;
    const qtyNum = parseFloat(newItemRequiredQty) || 0;

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
      customBudgetRate: budgetRateNum > 0 ? budgetRateNum : undefined,
      customRequiredQty: qtyNum > 0 ? qtyNum : undefined,
      notes: newItemNotes.trim() || undefined,
      isCustom: true,
    };

    const updated = [newItem, ...items];
    updateItemsAndPersist(updated);

    setNewItemName('');
    setNewItemPrice('');
    setNewItemBudgetRate('');
    setNewItemRequiredQty('');
    setNewItemNotes('');
    setIsAddModalOpen(false);
    showToast(`'${newItem.name}' সফলভাবে যুক্ত হয়েছে`);
  };

  // Apply comparison rates to Tour Master Budget
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
    showToast(`কোটেশনের ${count}টি দর সফলভাবে মূল টুর বাজেটে প্রয়োগ করা হয়েছে!`);
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
      const qty = getEffectiveQuantity(item);
      const currentRate = getItemBudgetRate(item);
      const quotedRate = item.standardUnitPrice;
      const currentCost = getEffectiveCurrentCost(item);
      const quotedCost = getEffectiveQuotedCost(item);

      if (qty > 0 || tourItem) {
        matchedTourItems++;
        totalCurrentCost += currentCost;
        totalQuotedCost += quotedCost;
      }

      if (currentRate > 0) {
        if (quotedRate < currentRate) {
          cheaperCount++;
        } else if (quotedRate > currentRate) {
          expensiveCount++;
        } else {
          sameCount++;
        }
      } else {
        sameCount++;
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

      const currentRate = getItemBudgetRate(item);
      const qty = getEffectiveQuantity(item);
      const tourItem = findMatchingTourItem(item);
      let matchesStatus = true;

      if (statusFilter === 'savings') {
        matchesStatus = currentRate > 0 ? item.standardUnitPrice < currentRate : false;
      } else if (statusFilter === 'extra') {
        matchesStatus = currentRate > 0 ? item.standardUnitPrice > currentRate : false;
      } else if (statusFilter === 'tour_needed') {
        matchesStatus = qty > 0 || !!tourItem;
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
      'প্রয়োজনীয় একক',
      'বর্তমান মোট খরচ',
      'কোটেশনে মোট খরচ',
      'সাশ্রয়/অতিরিক্ত',
      'নোট',
    ];

    const rows = filteredItems.map((item, idx) => {
      const currentRate = getItemBudgetRate(item);
      const diff = currentRate > 0 ? item.standardUnitPrice - currentRate : 0;
      const qty = getEffectiveQuantity(item);
      const unit = getEffectiveUnit(item);
      const curCost = getEffectiveCurrentCost(item);
      const quoCost = getEffectiveQuotedCost(item);
      const saving = curCost - quoCost;

      return [
        idx + 1,
        `"${item.name}"`,
        `"${CATEGORIES[item.category]?.nameBn || item.category}"`,
        item.quotedPrice,
        `"${item.quotedUnit}"`,
        item.standardUnitPrice,
        currentRate || 'প্রযোজ্য নয়',
        diff,
        qty,
        `"${unit}"`,
        curCost,
        quoCost,
        saving,
        `"${item.notes || ''}"`,
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
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight flex items-center gap-2 flex-wrap">
            <span>কোটেশন দর বনাম বর্তমান বাজেট তুলনা</span>
            <span className="text-2xs bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Edit3 className="w-3 h-3 text-emerald-400" />
              <span>প্রতিটি কলাম এডিটেবল</span>
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            ইউজারের প্রদত্ত বাজার কোটেশন ও টুর বাজেটের পূর্ণাঙ্গ তুলনা। 
            <strong> নাম, ক্যাটাগরি, কোটেশন দর, একক, বর্তমান বাজেট রেট, প্রয়োজনীয় পরিমাণ ও মোট খরচ</strong> — টেবিলের প্রতিটি কলাম সরাসরি পরিবর্তনযোগ্য।
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
            <span>টুরে প্রয়োজন চিহ্নিত:</span>
            <span className="font-semibold text-emerald-700 font-mono">{metrics.matchedTourItems} টি</span>
          </div>
        </div>

        {/* Card 2: Current Tour Budget on these items */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>বর্তমান বাজেটে মোট খরচ</span>
            <span className="text-slate-400 text-xs">{studentCount} জনের</span>
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

      {/* Comparison Items Table (All Columns Editable) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50/80 border-b border-slate-200 text-2xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">টেবিলের প্রতিটি কলাম এডিটেবল:</span>
            <span>নাম, ক্যাটাগরি, কোটেশন রেট, মানক দর, বাজেট দর, পরিমাণ বা মোট খরচ সরাসরি ইনপুটে ক্লিক করে এডিট করুন।</span>
          </div>
          <span className="text-3xs text-slate-400">
            পরিবর্তনসমূহ স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 text-2xs uppercase tracking-wider font-semibold">
                {/* 1. Index */}
                <th className="py-3 px-2 w-10 text-center">#</th>

                {/* 2. Item Name, Category & Notes */}
                <th className="py-3 px-3 min-w-[210px]">
                  <div className="flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-emerald-600" />
                    <span>উপাদান ও ক্যাটাগরি</span>
                  </div>
                </th>

                {/* 3. Quoted Price & Unit */}
                <th className="py-3 px-3 min-w-[195px] text-center bg-indigo-50/60 text-indigo-900 border-x border-indigo-100/70">
                  <div className="flex items-center justify-center gap-1">
                    <Edit3 className="w-3 h-3 text-indigo-600" />
                    <span>কোটেশন দর ও একক</span>
                  </div>
                </th>

                {/* 4. Standard Equivalent Price & Unit */}
                <th className="py-3 px-3 min-w-[155px] text-center bg-slate-100/50 border-r border-slate-200/80">
                  <div className="flex items-center justify-center gap-1">
                    <Edit3 className="w-3 h-3 text-slate-500" />
                    <span>প্রতি মানক একক দর</span>
                  </div>
                </th>

                {/* 5. Current Tour Budget Rate */}
                <th className="py-3 px-3 min-w-[165px] text-center bg-emerald-50/70 text-emerald-950 border-r border-emerald-100/80">
                  <div className="flex items-center justify-center gap-1">
                    <Edit3 className="w-3 h-3 text-emerald-700" />
                    <span>টুর বাজেট দর</span>
                  </div>
                </th>

                {/* 6. Rate Difference */}
                <th className="py-3 px-3 min-w-[110px] text-center border-r border-slate-200/60">
                  দর পার্থক্য
                </th>

                {/* 7. Tour Required Quantity & Unit */}
                <th className="py-3 px-3 min-w-[160px] text-center bg-amber-50/50 text-amber-950 border-r border-amber-100/80">
                  <div className="flex items-center justify-center gap-1">
                    <Edit3 className="w-3 h-3 text-amber-700" />
                    <span>টুরে প্রয়োজন</span>
                  </div>
                </th>

                {/* 8. Current Total Cost */}
                <th className="py-3 px-3 min-w-[130px] text-center bg-slate-50 border-r border-slate-200/60">
                  <div className="flex items-center justify-center gap-1">
                    <Edit3 className="w-3 h-3 text-slate-500" />
                    <span>বর্তমান মোট (৳)</span>
                  </div>
                </th>

                {/* 9. Quoted Total Cost */}
                <th className="py-3 px-3 min-w-[130px] text-center bg-indigo-50/40 text-indigo-950 border-r border-indigo-100/60">
                  <div className="flex items-center justify-center gap-1">
                    <Edit3 className="w-3 h-3 text-indigo-600" />
                    <span>কোটেশন মোট (৳)</span>
                  </div>
                </th>

                {/* 10. Savings / Cost Variance */}
                <th className="py-3 px-3 min-w-[110px] text-center bg-emerald-50/40 text-emerald-950">
                  সাশ্রয় / ব্যয়
                </th>

                {/* 11. Actions */}
                <th className="py-3 px-2 w-16 text-center">অ্যাকশন</th>
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
                  const currentRate = getItemBudgetRate(item);
                  const standardRate = item.standardUnitPrice;
                  const diffRate = currentRate > 0 ? standardRate - currentRate : 0;
                  const diffPercent = currentRate > 0 ? (diffRate / currentRate) * 100 : 0;

                  const requiredQty = getEffectiveQuantity(item);
                  const requiredUnit = getEffectiveUnit(item);
                  const currentCost = getEffectiveCurrentCost(item);
                  const quotedCost = getEffectiveQuotedCost(item);
                  const savings = currentCost - quotedCost;

                  const isCheaper = currentRate > 0 && standardRate < currentRate;
                  const isMoreExpensive = currentRate > 0 && standardRate > currentRate;
                  const isSame = currentRate > 0 && standardRate === currentRate;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* 1. Index */}
                      <td className="py-2.5 px-2 text-center text-slate-400 font-mono text-2xs">
                        {index + 1}
                      </td>

                      {/* 2. Column Edit: Food Item Name, Category & Notes */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleNameChange(item.id, e.target.value)}
                            className="w-full px-2 py-0.5 font-semibold text-slate-900 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded text-xs transition-all focus:outline-none"
                            placeholder="উপাদানের নাম..."
                            title="পণ্যের নাম পরিবর্তন করতে ক্লিক করুন"
                          />
                          <div className="flex items-center gap-1.5">
                            <select
                              value={item.category}
                              onChange={(e) => handleCategoryChange(item.id, e.target.value as ItemCategory)}
                              className={`text-3xs font-medium px-1.5 py-0.5 rounded border bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                                CATEGORIES[item.category]?.colorClass || 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                              title="ক্যাটাগরি পরিবর্তন করুন"
                            >
                              {ORDERED_CATEGORY_KEYS.map((k) => (
                                <option key={k} value={k}>
                                  {CATEGORIES[k]?.nameBn || k}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              placeholder="+ নোট..."
                              className="text-3xs text-slate-500 hover:text-slate-800 bg-transparent hover:bg-white focus:bg-white px-1 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-300 transition-all focus:outline-none w-24 truncate"
                              title="নোট বা বিবরণ এডিট করুন"
                            />
                          </div>
                        </div>
                      </td>

                      {/* 3. Column Edit: Quoted Price & Unit */}
                      <td className="py-2.5 px-3 bg-indigo-50/30 border-x border-indigo-100/60">
                        <div className="flex items-center gap-1 justify-center">
                          <span className="text-xs font-semibold text-indigo-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quotedPrice === 0 ? '' : item.quotedPrice}
                            placeholder="০"
                            onChange={(e) => handleInlinePriceChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 text-center font-mono font-bold text-indigo-950 bg-white border border-indigo-200 hover:border-indigo-300 focus:border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs shadow-inner"
                            title="কোটেশন দর লিখুন"
                          />
                          <select
                            value={item.quotedUnit}
                            onChange={(e) => handleInlinePriceChange(item.id, item.quotedPrice, e.target.value as QuoteUnitType)}
                            className="px-1 py-1 text-2xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            title="কোটেশনের একক বাছাই করুন"
                          >
                            <option value="কেজি">/কেজি</option>
                            <option value="১০০ গ্রাম">/১০০ গ্রাম</option>
                            <option value="২৫০ গ্রাম">/২৫০ গ্রাম</option>
                            <option value="গ্রাম">/গ্রাম</option>
                            <option value="লিটার">/লিটার</option>
                            <option value="প্যাকেট">/প্যাকেট</option>
                            <option value="বোতল">/বোতল</option>
                            <option value="পিস">/পিস</option>
                          </select>
                        </div>
                      </td>

                      {/* 4. Column Edit: Standard Unit Price & Unit */}
                      <td className="py-2.5 px-3 bg-slate-50/50 border-r border-slate-200/80">
                        <div className="flex items-center gap-1 justify-center">
                          <span className="text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.standardUnitPrice === 0 ? '' : item.standardUnitPrice}
                            placeholder="০"
                            onChange={(e) => handleStandardPriceChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 text-center font-mono font-bold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 text-xs shadow-inner"
                            title="প্রতি মানক একক দর সরাসরি এডিট করুন"
                          />
                          <select
                            value={item.standardUnit}
                            onChange={(e) => handleStandardPriceChange(item.id, item.standardUnitPrice, e.target.value as UnitType)}
                            className="px-1 py-1 text-2xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500 cursor-pointer"
                            title="মানক একক বাছাই করুন"
                          >
                            <option value="কেজি">/কেজি</option>
                            <option value="লিটার">/লিটার</option>
                            <option value="প্যাকেট">/প্যাকেট</option>
                            <option value="পিস">/পিস</option>
                            <option value="গ্রাম">/গ্রাম</option>
                          </select>
                        </div>
                      </td>

                      {/* 5. Column Edit: Current Tour Budget Rate */}
                      <td className="py-2.5 px-3 bg-emerald-50/30 border-r border-emerald-100/80">
                        <div className="flex items-center gap-1 justify-center">
                          <span className="text-xs font-semibold text-emerald-600">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={currentRate === 0 ? '' : currentRate}
                            placeholder="০"
                            onChange={(e) => handleBudgetPriceChange(item, e.target.value)}
                            className="w-16 px-1.5 py-1 text-center font-mono font-bold text-emerald-950 bg-white border border-emerald-300 hover:border-emerald-400 focus:border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs shadow-inner"
                            title="বর্তমান টুর বাজেট দর পরিবর্তন করুন"
                          />
                          <span className="text-3xs text-slate-500 font-medium whitespace-nowrap">
                            /{requiredUnit}
                          </span>
                        </div>
                      </td>

                      {/* 6. Rate Difference (Computed Pill) */}
                      <td className="py-2.5 px-3 text-center border-r border-slate-200/60">
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
                          </span>
                        ) : (
                          <span className="text-slate-400 text-3xs">-</span>
                        )}
                      </td>

                      {/* 7. Column Edit: Tour Required Quantity & Unit */}
                      <td className="py-2.5 px-3 bg-amber-50/30 border-r border-amber-100/80">
                        <div className="flex items-center gap-1 justify-center">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={requiredQty === 0 ? '' : requiredQty}
                            placeholder="০"
                            onChange={(e) => handleRequiredQtyChange(item, e.target.value)}
                            className="w-16 px-1.5 py-1 text-center font-mono font-bold text-amber-950 bg-white border border-amber-300 hover:border-amber-400 focus:border-amber-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-xs shadow-inner"
                            title="টুরের প্রয়োজনীয় পরিমাণ এডিট করুন"
                          />
                          <select
                            value={requiredUnit}
                            onChange={(e) => handleRequiredUnitChange(item.id, e.target.value as UnitType)}
                            className="px-1 py-1 text-2xs font-medium bg-white border border-amber-200 rounded-lg text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                            title="একক বাছাই করুন"
                          >
                            <option value="কেজি">কেজি</option>
                            <option value="গ্রাম">গ্রাম</option>
                            <option value="লিটার">লিটার</option>
                            <option value="প্যাকেট">প্যাকেট</option>
                            <option value="পিস">পিস</option>
                            <option value="বোতল">বোতল</option>
                          </select>
                        </div>
                      </td>

                      {/* 8. Column Edit: Current Total Cost */}
                      <td className="py-2.5 px-2 bg-slate-50/60 border-r border-slate-200/60">
                        <div className="flex items-center gap-0.5 justify-center">
                          <span className="text-2xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={currentCost === 0 ? '' : currentCost}
                            placeholder="০"
                            onChange={(e) => handleCurrentTotalChange(item, e.target.value)}
                            className="w-20 px-1 py-1 text-right font-mono font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs shadow-inner"
                            title="বর্তমান মোট খরচ এডিট করতে পারেন"
                          />
                        </div>
                      </td>

                      {/* 9. Column Edit: Quoted Total Cost */}
                      <td className="py-2.5 px-2 bg-indigo-50/30 border-r border-indigo-100/60">
                        <div className="flex items-center gap-0.5 justify-center">
                          <span className="text-2xs font-semibold text-indigo-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={quotedCost === 0 ? '' : quotedCost}
                            placeholder="০"
                            onChange={(e) => handleQuotedTotalChange(item, e.target.value)}
                            className="w-20 px-1 py-1 text-right font-mono font-bold text-indigo-950 bg-white border border-indigo-200 hover:border-indigo-300 focus:border-indigo-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 text-xs shadow-inner"
                            title="কোটেশন মোট খরচ এডিট করতে পারেন"
                          />
                        </div>
                      </td>

                      {/* 10. Savings / Cost Variance (Pill) */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {currentCost > 0 && quotedCost > 0 ? (
                          <span className={savings >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                            {savings >= 0 ? `+৳${formatCurrency(savings)}` : `-৳${formatCurrency(Math.abs(savings))}`}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-3xs">-</span>
                        )}
                      </td>

                      {/* 11. Actions: Full Edit Modal & Delete */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingItemModal(item)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="সম্পূর্ণ বিবরণী সম্পাদনা করুন"
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="এই আইটেমটি মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                  মোট হিসাবকৃত {metrics.matchedTourItems}টি খাদ্য উপাদানের সামগ্রিক মোট খরচ:
                </td>
                <td className="py-3 px-2 text-right font-mono text-slate-300">
                  ৳{formatCurrency(metrics.totalCurrentCost)}
                </td>
                <td className="py-3 px-2 text-right font-mono text-indigo-300 bg-slate-800/80">
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

      {/* Info Card explaining how all editable columns work */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950">
            প্রতিটি কলাম সম্পাদনা গাইড:
          </div>
          <p className="text-amber-800 leading-relaxed">
            ১. <strong>উপাদান ও ক্যাটাগরি:</strong> সরাসরি নাম লিখুন এবং ড্রপডাউন থেকে ৮টি মূল ক্যাটাগরির যেকোনোটি নির্বাচন করুন।
            <br />
            ২. <strong>কোটেশন ও মানক দর:</strong> ১০০ গ্রাম বা কেজির যেকোনো দর বসান, অপরটি স্বয়ংক্রিয়ভাবে সিঙ্ক হয়ে যাবে।
            <br />
            ৩. <strong>টুর বাজেট দর:</strong> বাজেট দর পরিবর্তন করলে তা সরাসরি মূল ৬ বেলার মেনু ও বাজার সামারিতে আপডেট হয়।
            <br />
            ৪. <strong>টুরে প্রয়োজন ও মোট:</strong> প্রয়োজনীয় পরিমাণ (যেমন: ২০ কেজি) পরিবর্তন করলে মোট খরচ ও সাশ্রয় রিয়েল-টাইমে আপডেট হয়।
            <br />
            ৫. ডানপাশের <strong>সেটিংস (⚙️) আইকনে</strong> ক্লিক করে যেকোনো আইটেম পপআপ উইন্ডোতেও বিস্তারিতভাবে সম্পাদনা করতে পারেন।
          </p>
        </div>
      </div>

      {/* Modal: Edit Row Item Completely (All fields in one clean dialog) */}
      {editingItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                  <Edit3 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    উপাদান বিস্তারিত সম্পাদনা
                  </h3>
                  <p className="text-2xs text-slate-500">
                    {editingItemModal.name} - এর সকল কলাম ও তথ্য আপডেট করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItemModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  উপাদানের নাম
                </label>
                <input
                  type="text"
                  value={editingItemModal.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingItemModal((prev) => prev ? { ...prev, name: val } : null);
                    handleNameChange(editingItemModal.id, val);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Category & Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editingItemModal.category}
                    onChange={(e) => {
                      const val = e.target.value as ItemCategory;
                      setEditingItemModal((prev) => prev ? { ...prev, category: val } : null);
                      handleCategoryChange(editingItemModal.id, val);
                    }}
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
                    নোট বা বিবরণ
                  </label>
                  <input
                    type="text"
                    value={editingItemModal.notes || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingItemModal((prev) => prev ? { ...prev, notes: val } : null);
                      handleNotesChange(editingItemModal.id, val);
                    }}
                    placeholder="যেমন: ফ্রেশ মিনিকেট..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Quoted Price & Unit */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-indigo-950 font-semibold mb-1">
                    প্রাপ্ত কোটেশন দর (টাকা)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingItemModal.quotedPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingItemModal((prev) => prev ? { ...prev, quotedPrice: val } : null);
                      handleInlinePriceChange(editingItemModal.id, val, editingItemModal.quotedUnit);
                    }}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-xl text-indigo-950 font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-indigo-950 font-semibold mb-1">
                    কোটেশন একক
                  </label>
                  <select
                    value={editingItemModal.quotedUnit}
                    onChange={(e) => {
                      const val = e.target.value as QuoteUnitType;
                      setEditingItemModal((prev) => prev ? { ...prev, quotedUnit: val } : null);
                      handleInlinePriceChange(editingItemModal.id, editingItemModal.quotedPrice, val);
                    }}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="কেজি">প্রতি কেজি</option>
                    <option value="১০০ গ্রাম">প্রতি ১০০ গ্রাম (শ)</option>
                    <option value="২৫০ গ্রাম">প্রতি ২৫০ গ্রাম</option>
                    <option value="গ্রাম">প্রতি গ্রাম</option>
                    <option value="লিটার">প্রতি লিটার</option>
                    <option value="প্যাকেট">প্রতি প্যাকেট</option>
                    <option value="বোতল">প্রতি বোতল</option>
                    <option value="পিস">প্রতি পিস</option>
                  </select>
                </div>
              </div>

              {/* Standard Price & Budget Price */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-emerald-950 font-semibold mb-1">
                    মানক একক দর (টাকা/কেজি বা পিস)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingItemModal.standardUnitPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingItemModal((prev) => prev ? { ...prev, standardUnitPrice: val } : null);
                      handleStandardPriceChange(editingItemModal.id, val);
                    }}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-emerald-950 font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-emerald-950 font-semibold mb-1">
                    বর্তমান টুর বাজেট দর (টাকা)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={getItemBudgetRate(editingItemModal)}
                    onChange={(e) => {
                      handleBudgetPriceChange(editingItemModal, e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-emerald-950 font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Required Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div>
                  <label className="block text-amber-950 font-semibold mb-1">
                    টুরে প্রয়োজন (পরিমাণ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={getEffectiveQuantity(editingItemModal)}
                    onChange={(e) => {
                      handleRequiredQtyChange(editingItemModal, e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-amber-200 rounded-xl text-amber-950 font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-amber-950 font-semibold mb-1">
                    প্রয়োজনীয় একক
                  </label>
                  <select
                    value={getEffectiveUnit(editingItemModal)}
                    onChange={(e) => {
                      const val = e.target.value as UnitType;
                      handleRequiredUnitChange(editingItemModal.id, val);
                    }}
                    className="w-full px-3 py-2 border border-amber-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="কেজি">কেজি</option>
                    <option value="গ্রাম">গ্রাম</option>
                    <option value="লিটার">লিটার</option>
                    <option value="প্যাকেট">প্যাকেট</option>
                    <option value="পিস">পিস</option>
                    <option value="বোতল">বোতল</option>
                  </select>
                </div>
              </div>

              {/* Totals Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-3xs text-slate-500">বর্তমান মোট</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    ৳{formatCurrency(getEffectiveCurrentCost(editingItemModal))}
                  </div>
                </div>
                <div>
                  <div className="text-3xs text-slate-500">কোটেশন মোট</div>
                  <div className="font-mono font-bold text-indigo-950 mt-0.5">
                    ৳{formatCurrency(getEffectiveQuotedCost(editingItemModal))}
                  </div>
                </div>
                <div>
                  <div className="text-3xs text-slate-500">সাশ্রয়</div>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">
                    ৳{formatCurrency(getEffectiveCurrentCost(editingItemModal) - getEffectiveQuotedCost(editingItemModal))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingItemModal(null)}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs cursor-pointer"
              >
                সম্পাদনা সম্পন্ন
              </button>
            </div>
          </div>
        </div>
      )}

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
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
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
                    কোটেশন একক
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

              <div className="grid grid-cols-2 gap-3">
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
                    বর্তমান বাজেট দর (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="যেমন: ১৩৫"
                      value={newItemBudgetRate}
                      onChange={(e) => setNewItemBudgetRate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  টুরের জন্য মোট প্রয়োজন (ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="যেমন: ২৫"
                  value={newItemRequiredQty}
                  onChange={(e) => setNewItemRequiredQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
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
