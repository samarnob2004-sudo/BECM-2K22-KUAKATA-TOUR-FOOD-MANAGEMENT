import React, { useState } from 'react';
import { CATEGORIES, ItemCategory, Meal, MealItem, UnitType } from '../types/meal';
import { calculateItemCost, formatCurrency } from '../utils/calculator';
import { Plus, Trash2, Calendar, Clock, UtensilsCrossed, Edit2, Check, X, Info } from 'lucide-react';

interface MealDetailViewProps {
  meals: Meal[];
  onUpdateMealItem: (mealId: string, itemId: string, updates: Partial<MealItem>) => void;
  onAddMealItem: (mealId: string, item: Omit<MealItem, 'id'>) => void;
  onDeleteMealItem: (mealId: string, itemId: string) => void;
  onUpdateMealMenuSummary?: (mealId: string, summary: string) => void;
  studentCount?: number;
  setStudentCount?: (count: number) => void;
}

export const MealDetailView: React.FC<MealDetailViewProps> = ({
  meals,
  onUpdateMealItem,
  onAddMealItem,
  onDeleteMealItem,
  onUpdateMealMenuSummary,
  studentCount = 120,
  setStudentCount,
}) => {
  const [activeMealId, setActiveMealId] = useState<string>(meals[0]?.id || 'day1-bus');
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [isEditingMenuSummary, setIsEditingMenuSummary] = useState<boolean>(false);
  const [tempMenuSummary, setTempMenuSummary] = useState<string>('');

  // New item form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ItemCategory>('vegetables');
  const [newAmount, setNewAmount] = useState<number>(1);
  const [newUnit, setNewUnit] = useState<UnitType>('কেজি');
  const [newUnitPrice, setNewUnitPrice] = useState<number>(100);
  const [newNote, setNewNote] = useState('');

  const currentMeal = meals.find((m) => m.id === activeMealId) || meals[0];

  const currentMealTotal = currentMeal.items.reduce((sum, item) => {
    return sum + calculateItemCost(item);
  }, 0);

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const canonicalKey = newName.trim().toLowerCase().replace(/\s+/g, '_');

    onAddMealItem(currentMeal.id, {
      name: newName.trim(),
      canonicalKey,
      category: newCategory,
      amount: newAmount,
      unit: newUnit,
      unitPrice: newUnitPrice,
      note: newNote.trim() || undefined,
    });

    // Reset form
    setNewName('');
    setNewAmount(1);
    setNewUnitPrice(100);
    setNewNote('');
    setIsAddingItem(false);
  };

  const startEditSummary = () => {
    setTempMenuSummary(currentMeal.menuSummary || currentMeal.description);
    setIsEditingMenuSummary(true);
  };

  const saveEditSummary = () => {
    if (onUpdateMealMenuSummary) {
      onUpdateMealMenuSummary(currentMeal.id, tempMenuSummary);
    }
    setIsEditingMenuSummary(false);
  };

  return (
    <div className="space-y-5">
      
      {/* 7 Time-Slot Selector Tabs (Bus Snacks + 6 Meals) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {meals.map((meal, index) => {
          const isSelected = meal.id === activeMealId;
          const mealCost = meal.items.reduce((sum, i) => sum + calculateItemCost(i), 0);

          return (
            <button
              key={meal.id}
              onClick={() => {
                setActiveMealId(meal.id);
                setIsAddingItem(false);
                setIsEditingMenuSummary(false);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all relative ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-2xs mb-1">
                <span className={`font-semibold ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {meal.timeSlot === 'যাত্রা' ? 'শুরুতে' : `বেলা ০${index}`}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-3xs font-medium ${
                  isSelected ? 'bg-emerald-900/80 text-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {meal.timeSlot}
                </span>
              </div>
              <div className="font-bold text-xs leading-snug truncate">
                {meal.title}
              </div>
              <div className={`text-xs font-mono font-semibold mt-1.5 tabular-nums ${
                isSelected ? 'text-emerald-100' : 'text-emerald-700'
              }`}>
                ৳ {formatCurrency(mealCost)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Meal Details Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Meal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <Calendar className="w-3.5 h-3.5" />
                {mealLabel(currentMeal.day, currentMeal.timeSlot)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentMeal.timeSlot}
              </span>
              <span aria-hidden="true">·</span>
              <span>মোট {currentMeal.items.length} টি উপাদান</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentMeal.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentMeal.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
            {setStudentCount && (
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <span className="text-slate-600 font-medium">মেম্বার:</span>
                <button
                  type="button"
                  onClick={() => setStudentCount(Math.max(1, studentCount - 5))}
                  title="৫ জন কমান"
                  className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  -
                </button>
                <span className="font-mono font-bold text-emerald-900 px-1">{studentCount} জন</span>
                <button
                  type="button"
                  onClick={() => setStudentCount(Math.min(500, studentCount + 5))}
                  title="৫ জন বাড়ান"
                  className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  +
                </button>
              </div>
            )}

            <div className="text-right">
              <div className="text-2xs text-slate-500 font-medium">এই বেলার সর্বমোট খরচ</div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-800">
                ৳ {formatCurrency(currentMealTotal)}
              </div>
            </div>

            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="px-3 py-2 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>উপাদান যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Editable Menu Food Summary Card */}
        <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-2 flex-1">
            <UtensilsCrossed className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-950">খাবারের মেনু: </span>
              {isEditingMenuSummary ? (
                <div className="inline-flex items-center gap-1.5 mt-1 sm:mt-0">
                  <input
                    type="text"
                    value={tempMenuSummary}
                    onChange={(e) => setTempMenuSummary(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditSummary();
                      if (e.key === 'Escape') setIsEditingMenuSummary(false);
                    }}
                    className="px-2 py-0.5 text-xs bg-white border border-amber-400 rounded focus:outline-none focus:ring-1 focus:ring-amber-600 w-80 max-w-full font-medium text-slate-900"
                    placeholder="মেনু আইটেমসমূহ লিখুন..."
                    autoFocus
                  />
                  <button
                    onClick={saveEditSummary}
                    className="p-1 bg-amber-700 text-white rounded hover:bg-amber-800"
                    title="সংরক্ষণ"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsEditingMenuSummary(false)}
                    className="p-1 text-slate-500 hover:bg-amber-200 rounded"
                    title="বাতিল"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="text-amber-900 font-semibold bg-white/70 px-2 py-0.5 rounded border border-amber-200/70 inline-block">
                  {currentMeal.menuSummary || currentMeal.description}
                </span>
              )}
            </div>
          </div>

          {!isEditingMenuSummary && (
            <button
              onClick={startEditSummary}
              className="text-2xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2 py-1 rounded hover:bg-amber-100 transition-colors shrink-0"
            >
              <Edit2 className="w-3 h-3" />
              <span>মেনু টেক্সট এডিট করুন</span>
            </button>
          )}
        </div>

        {/* Add Item Form (Expandable) */}
        {isAddingItem && (
          <form onSubmit={handleAddNewItem} className="p-4 bg-emerald-50/70 border-b border-emerald-200">
            <div className="text-xs font-semibold text-emerald-900 mb-3">
              নতুন উপাদান যোগ করুন ({currentMeal.title})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-2xs font-medium text-slate-600 mb-1">উপাদানের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পোলাও চাল, খাসির মাংস..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-2xs font-medium text-slate-600 mb-1">ক্যাটাগরি</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ItemCategory)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {(Object.keys(CATEGORIES) as ItemCategory[]).map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {CATEGORIES[catKey].nameBn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-medium text-slate-600 mb-1">পরিমাণ</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-2xs font-medium text-slate-600 mb-1">একক</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as UnitType)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
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

              <div>
                <label className="block text-2xs font-medium text-slate-600 mb-1">একক দর (৳)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={newUnitPrice}
                  onChange={(e) => setNewUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <input
                type="text"
                placeholder="বিশেষ নোট (ঐচ্ছিক, যেমন: জনপ্রতি ৩ পিস)"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-72 text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md shadow-2xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Meal Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                <th className="py-3 px-3.5 w-12 text-center">ক্রমিক</th>
                <th className="py-3 px-4">উপাদানের নাম</th>
                <th className="py-3 px-4">ক্যাটাগরি ও বিবরণ</th>
                <th className="py-3 px-4 text-right w-44">পরিমাণ ও ইউনিট</th>
                <th className="py-3 px-4 text-right w-36">দর (৳)</th>
                <th className="py-3 px-4 text-right w-36">মোট খরচ (৳)</th>
                <th className="py-3 px-3 w-12 text-center">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {currentMeal.items.map((item, index) => {
                const itemCost = calculateItemCost(item);
                const cat = CATEGORIES[item.category] || {
                  nameBn: 'সাধারণ',
                };

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {/* Index */}
                    <td className="py-2.5 px-3.5 text-center text-xs font-mono text-slate-400">
                      {index + 1}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => onUpdateMealItem(currentMeal.id, item.id, { name: e.target.value })}
                          className="font-medium text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-slate-300 focus:outline-none text-sm w-full"
                        />
                        {item.isAutoScaled && (
                          <span 
                            title={`জনসংখ্যা পরিবর্তন হলে এই উপাদানের পরিমাণ স্বয়ংক্রিয়ভাবে হিসাব হয়`}
                            className="inline-flex items-center text-3xs font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded shrink-0"
                          >
                            অটো-হিসাব
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category & Note */}
                    <td className="py-2.5 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-2xs text-slate-600">{cat.nameBn}</span>
                        {item.note && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 font-medium italic">{item.note}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Quantity & Unit (Editable) */}
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.amount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onUpdateMealItem(currentMeal.id, item.id, { amount: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 text-right px-2 py-0.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => onUpdateMealItem(currentMeal.id, item.id, { unit: e.target.value as UnitType })}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-1 py-0.5 focus:bg-white focus:outline-none text-slate-700"
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
                    </td>

                    {/* Unit Price (Editable) */}
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-slate-400">৳</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.customFixedPrice ? item.customFixedPrice : item.unitPrice}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (item.customFixedPrice) {
                              onUpdateMealItem(currentMeal.id, item.id, { customFixedPrice: isNaN(val) ? 0 : val });
                            } else {
                              onUpdateMealItem(currentMeal.id, item.id, { unitPrice: isNaN(val) ? 0 : val });
                            }
                          }}
                          className="w-20 text-right px-2 py-0.5 text-sm font-mono font-medium bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="text-3xs text-slate-400 text-right mt-0.5">
                        {item.unit === 'গ্রাম' ? 'কেজি দর' : `প্রতি ${item.unit}`}
                      </div>
                    </td>

                    {/* Total Cost */}
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      ৳ {formatCurrency(itemCost)}
                    </td>

                    {/* Delete button */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onDeleteMealItem(currentMeal.id, item.id)}
                        title="উপাদান মুছে ফেলুন"
                        className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Subtotal Footer */}
            <tfoot>
              <tr className="bg-slate-100 text-slate-900 font-semibold border-t border-slate-300">
                <td colSpan={3} className="py-3 px-4 font-bold text-sm">
                  {currentMeal.title} - সাবটোটাল ({currentMeal.items.length} টি উপাদান)
                </td>
                <td colSpan={2} className="py-3 px-4 text-right text-xs text-slate-600">
                  এই বেলার মোট খরচ:
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-mono tabular-nums font-bold text-emerald-800 text-base sm:text-lg">
                    ৳ {formatCurrency(currentMealTotal)}
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

    </div>
  );
};

function mealLabel(day: number, slot: string): string {
  if (slot === 'যাত্রা') return 'যাত্রার প্রাক্কালে';
  return `দিন ${day} · ${slot}`;
}
