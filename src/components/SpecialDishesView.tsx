import React, { useState, useEffect } from 'react';
import { SpecialDishItem, INITIAL_PAYESH_ITEMS, INITIAL_ZORDA_ITEMS } from '../types/specialDish';
import { UnitType } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { Utensils, Plus, Trash2, RotateCcw, Users, Sparkles, ChefHat, Info } from 'lucide-react';

interface SpecialDishesViewProps {
  initialStudentCount: number;
}

const STORAGE_KEY_PAYESH = 'kuakata_special_payesh_v1';
const STORAGE_KEY_ZORDA = 'kuakata_special_zorda_v1';
const STORAGE_KEY_PAYESH_SERVINGS = 'kuakata_payesh_servings_v1';
const STORAGE_KEY_ZORDA_SERVINGS = 'kuakata_zorda_servings_v1';

export const SpecialDishesView: React.FC<SpecialDishesViewProps> = ({
  initialStudentCount,
}) => {
  const [activeDish, setActiveDish] = useState<'payesh' | 'zorda'>('payesh');

  // Payesh State
  const [payeshServings, setPayeshServings] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYESH_SERVINGS);
      return saved ? Math.max(1, parseInt(saved)) : initialStudentCount || 120;
    } catch {
      return initialStudentCount || 120;
    }
  });

  const [payeshItems, setPayeshItems] = useState<SpecialDishItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYESH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PAYESH_ITEMS;
  });

  // Zorda State
  const [zordaServings, setZordaServings] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ZORDA_SERVINGS);
      return saved ? Math.max(1, parseInt(saved)) : initialStudentCount || 120;
    } catch {
      return initialStudentCount || 120;
    }
  });

  const [zordaItems, setZordaItems] = useState<SpecialDishItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ZORDA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ZORDA_ITEMS;
  });

  // Add Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState<number>(1);
  const [newUnit, setNewUnit] = useState<UnitType>('কেজি');
  const [newUnitPrice, setNewUnitPrice] = useState<number>(100);
  const [newNote, setNewNote] = useState('');

  // Sync Payesh to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAYESH, JSON.stringify(payeshItems));
      localStorage.setItem(STORAGE_KEY_PAYESH_SERVINGS, payeshServings.toString());
    } catch (e) {
      console.error(e);
    }
  }, [payeshItems, payeshServings]);

  // Sync Zorda to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ZORDA, JSON.stringify(zordaItems));
      localStorage.setItem(STORAGE_KEY_ZORDA_SERVINGS, zordaServings.toString());
    } catch (e) {
      console.error(e);
    }
  }, [zordaItems, zordaServings]);

  // Dynamic Scaling of items based on Servings (120 baseline)
  const scaleItems = (items: SpecialDishItem[], servings: number) => {
    const ratio = servings / 120;
    return items.map((item) => {
      let scaledAmount = item.baseAmount * ratio;
      if (item.unit === 'গ্রাম') {
        scaledAmount = Math.round(scaledAmount);
      } else {
        scaledAmount = Math.round(scaledAmount * 100) / 100;
      }
      return {
        ...item,
        amount: scaledAmount,
      };
    });
  };

  const currentServings = activeDish === 'payesh' ? payeshServings : zordaServings;
  const setServings = (val: number) => {
    const count = Math.max(1, val);
    if (activeDish === 'payesh') {
      setPayeshServings(count);
    } else {
      setZordaServings(count);
    }
  };

  const rawItems = activeDish === 'payesh' ? payeshItems : zordaItems;
  const displayedItems = scaleItems(rawItems, currentServings);

  // Calculate Costs
  const calculateItemCost = (item: SpecialDishItem) => {
    if (item.unit === 'গ্রাম') {
      return (item.amount / 1000) * item.unitPrice;
    }
    return item.amount * item.unitPrice;
  };

  const totalCost = displayedItems.reduce((sum, item) => sum + calculateItemCost(item), 0);
  const perPersonCost = currentServings > 0 ? Math.round(totalCost / currentServings) : 0;

  // Handlers for modifying items
  const handleUpdateItem = (itemId: string, updates: Partial<SpecialDishItem>) => {
    const updater = (prev: SpecialDishItem[]) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, ...updates };
        if (updates.amount !== undefined) {
          const ratio = currentServings / 120;
          updated.baseAmount = ratio > 0 ? updates.amount / ratio : updates.amount;
        }
        return updated;
      });

    if (activeDish === 'payesh') {
      setPayeshItems(updater);
    } else {
      setZordaItems(updater);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (activeDish === 'payesh') {
      setPayeshItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setZordaItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  const handleResetDish = () => {
    if (activeDish === 'payesh') {
      setPayeshItems(INITIAL_PAYESH_ITEMS);
      setPayeshServings(120);
    } else {
      setZordaItems(INITIAL_ZORDA_ITEMS);
      setZordaServings(120);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const ratio = currentServings / 120;
    const baseAmt = ratio > 0 ? newAmount / ratio : newAmount;

    const newItem: SpecialDishItem = {
      id: `${activeDish}-${Date.now()}`,
      name: newName.trim(),
      amount: newAmount,
      baseAmount: baseAmt,
      unit: newUnit,
      unitPrice: newUnitPrice,
      note: newNote.trim() || undefined,
    };

    if (activeDish === 'payesh') {
      setPayeshItems((prev) => [...prev, newItem]);
    } else {
      setZordaItems((prev) => [...prev, newItem]);
    }

    setNewName('');
    setNewAmount(1);
    setNewUnitPrice(100);
    setNewNote('');
    setIsAddingItem(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Selector Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-2xs text-amber-400 font-semibold tracking-wider uppercase">
            <ChefHat className="w-3.5 h-3.5" />
            <span>আইটেম ভিত্তিক বিশেষ ক্যালকুলেটর</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
            পায়েস ও জর্দা রেসিপি ও খরচ ক্যালকুলেটর
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            টুরের বিশেষ দুই শাহী ডেজার্ট—পায়েস ও জর্দার জন্য নির্ধারিত উপকরণ, পরিমাণ ও খরচের স্বয়ংক্রিয় প্রাক্কলন। প্রয়োজনমতো নতুন উপাদান যোগ ও দর পরিবর্তন করুন।
          </p>
        </div>

        {/* Dish Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shrink-0">
          <button
            onClick={() => {
              setActiveDish('payesh');
              setIsAddingItem(false);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeDish === 'payesh'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>🍨 শাহী পায়েস</span>
          </button>

          <button
            onClick={() => {
              setActiveDish('zorda');
              setIsAddingItem(false);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeDish === 'zorda'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>🍚 শাহী জর্দা</span>
          </button>
        </div>
      </div>

      {/* Serving Controller & Metric Cards for Current Dish */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Servings Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">পরিবেশন সংখ্যা (মেম্বার)</span>
              <span className="p-1 rounded bg-amber-50 text-amber-700">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setServings(currentServings - 5)}
                className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="1000"
                value={currentServings}
                onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                className="w-16 text-center font-mono font-bold text-lg text-slate-900 bg-slate-50 border border-slate-300 rounded-lg py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setServings(currentServings + 5)}
                className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-colors"
              >
                +
              </button>
              <span className="text-xs text-slate-500 font-medium">জন</span>
            </div>
          </div>
          <div className="text-3xs text-slate-400 mt-2 pt-1 border-t border-slate-100 flex items-center gap-1">
            <span>অনুপাত: {(currentServings / 120).toFixed(2)}x</span>
            <span aria-hidden="true">·</span>
            <span>১২০ জন বেসলাইন</span>
          </div>
        </div>

        {/* Total Cost Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              {activeDish === 'payesh' ? 'পায়েসের মোট বাজেট' : 'জর্দার মোট বাজেট'}
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              ৳ {formatCurrency(totalCost)}
            </div>
          </div>
          <div className="text-3xs text-slate-400 mt-2 pt-1 border-t border-slate-100">
            মোট {displayedItems.length} টি শাহী উপাদান অন্তর্ভুক্ত
          </div>
        </div>

        {/* Per-person Cost */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">জনপ্রতি খরচ</div>
            <div className="text-2xl font-bold font-mono text-amber-900 tabular-nums">
              ৳ {formatCurrency(perPersonCost)}
            </div>
          </div>
          <div className="text-3xs text-slate-400 mt-2 pt-1 border-t border-slate-100">
            প্রতিজনের মিষ্টিমুখ পরিবেশন
          </div>
        </div>

        {/* Quick Presets & Add */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-950 mb-1">কুইক মেম্বার সিলেক্ট</div>
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              {[60, 80, 100, 120, 150].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setServings(preset)}
                  className={`px-2 py-0.5 rounded text-2xs font-semibold transition-all ${
                    currentServings === preset
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-amber-200">
            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="px-2.5 py-1 text-2xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>উপাদান যোগ</span>
            </button>
            <button
              onClick={handleResetDish}
              title="ডিফল্ট রেসিপিতে রিসেট করুন"
              className="text-2xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>রিসেট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Dish Item Panel */}
      {isAddingItem && (
        <form onSubmit={handleAddNewItem} className="bg-white p-5 rounded-xl border-2 border-amber-500 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="font-bold text-sm text-amber-950 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-700" />
              <span>
                {activeDish === 'payesh' ? 'পায়েসে নতুন উপকরণ যুক্ত করুন' : 'জর্দায় নতুন উপকরণ যুক্ত করুন'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-2xs font-semibold text-slate-700 mb-1">উপকরণের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: জাফরান, মাওয়া, চেরি ফল..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">পরিমাণ ও একক</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                  className="w-20 text-xs px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono font-bold text-right"
                />
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as UnitType)}
                  className="flex-1 text-xs px-1.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 text-slate-800"
                >
                  <option value="কেজি">কেজি</option>
                  <option value="গ্রাম">গ্রাম</option>
                  <option value="লিটার">লিটার</option>
                  <option value="পিস">পিস</option>
                  <option value="প্যাকেট">প্যাকেট</option>
                  <option value="তোলা">তোলা</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">একক দর (৳)</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={newUnitPrice}
                onChange={(e) => setNewUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono font-medium text-right"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 mb-1">নোট / ব্যবহার</label>
              <input
                type="text"
                placeholder="যেমন: ওপরে ছিটানোর জন্য"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg shadow-2xs"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}

      {/* Dish Items Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">
              {activeDish === 'payesh' ? '🍨 শাহী পায়েস তৈরির উপাদান ও প্রাক্কলন' : '🍚 শাহী জর্দা তৈরির উপাদান ও প্রাক্কলন'}
            </span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
              {currentServings} জনের জন্য
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            পরিমাণ বা দর সরাসরি এডিট করা যায়
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3.5 w-12 text-center">ক্রমিক</th>
                <th className="py-2.5 px-4">উপকরণের নাম</th>
                <th className="py-2.5 px-4 text-right w-44">পরিমাণ ও একক</th>
                <th className="py-2.5 px-4 text-right w-36">একক দর (৳)</th>
                <th className="py-2.5 px-4 text-right w-36">মোট খরচ (৳)</th>
                <th className="py-2.5 px-4 hidden md:table-cell">রেসিপি নোট / টিপস</th>
                <th className="py-2.5 px-3 w-12 text-center">মুছুন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {displayedItems.map((item, idx) => {
                const itemCost = calculateItemCost(item);

                return (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 px-3.5 text-center text-xs font-mono text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                        className="font-semibold text-slate-900 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-slate-300 focus:outline-none text-sm w-full"
                      />
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.amount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            handleUpdateItem(item.id, { amount: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 text-right px-2 py-0.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(item.id, { unit: e.target.value as UnitType })}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:bg-white focus:outline-none text-slate-700 font-medium"
                        >
                          <option value="কেজি">কেজি</option>
                          <option value="গ্রাম">গ্রাম</option>
                          <option value="লিটার">লিটার</option>
                          <option value="পিস">পিস</option>
                          <option value="প্যাকেট">প্যাকেট</option>
                          <option value="তোলা">তোলা</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-slate-400">৳</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice === 0 ? '' : item.unitPrice}
                          placeholder="দর"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            handleUpdateItem(item.id, { unitPrice: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 text-right px-2 py-0.5 text-sm font-mono font-medium bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        ৳ {formatCurrency(itemCost)}
                      </div>
                    </td>

                    <td className="py-2.5 px-4 hidden md:table-cell text-xs text-slate-500 italic">
                      {item.note || '—'}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="উপাদানটি মুছে ফেলুন"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Table Footer */}
            <tfoot>
              <tr className="bg-amber-50/80 text-slate-900 font-semibold border-t-2 border-amber-200">
                <td colSpan={2} className="py-3.5 px-4 font-bold text-sm text-amber-950">
                  {activeDish === 'payesh' ? 'শাহী পায়েস মোট বাজেট' : 'শাহী জর্দা মোট বাজেট'} ({displayedItems.length} টি উপাদান)
                </td>
                <td colSpan={2} className="py-3.5 px-4 text-right text-xs text-slate-700">
                  মোট খরচ:
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="font-mono tabular-nums font-black text-amber-900 text-base sm:text-lg">
                    ৳ {formatCurrency(totalCost)}
                  </div>
                  <div className="text-3xs text-slate-500 font-normal">
                    (জনপ্রতি ৳ {perPersonCost})
                  </div>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
