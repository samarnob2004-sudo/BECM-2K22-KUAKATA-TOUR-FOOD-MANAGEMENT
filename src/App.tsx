/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ItemCategory, Meal, MealItem, UnitType } from './types/meal';
import { INITIAL_MEALS_DATA, recalculateAutoScaledMeals, getTourMealsData } from './data/defaultTourData';
import { aggregateMasterItems } from './utils/calculator';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { MasterSummary } from './components/MasterSummary';
import { MealDetailView } from './components/MealDetailView';
import { AnalyticsView } from './components/AnalyticsView';
import { PrintMemo } from './components/PrintMemo';
import { ExportModal } from './components/ExportModal';
import { AlertTriangle } from 'lucide-react';

const STORAGE_KEY_MEALS = 'kuakata_tour_meals_v5';
const STORAGE_KEY_OVERRIDES = 'kuakata_tour_price_overrides_v5';
const STORAGE_KEY_STUDENTS = 'kuakata_tour_student_count_v5';

export default function App() {
  // Initialize state with LocalStorage support
  const [studentCount, setStudentCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        return Math.max(1, parseInt(saved) || 120);
      }
    } catch (e) {
      console.error('Failed to load student count', e);
    }
    return 120;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load meals from localStorage', e);
    }
    return getTourMealsData(120);
  });

  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OVERRIDES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load overrides from localStorage', e);
    }
    return {};
  });

  const [activeTab, setActiveTab] = useState<'summary' | 'meals' | 'analytics' | 'print'>('summary');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(meals));
    } catch (e) {
      console.error('Error saving meals to localStorage', e);
    }
  }, [meals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(priceOverrides));
    } catch (e) {
      console.error('Error saving overrides to localStorage', e);
    }
  }, [priceOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, studentCount.toString());
    } catch (e) {
      console.error('Error saving student count to localStorage', e);
    }
  }, [studentCount]);

  // Reactive Aggregated Master Inventory
  const aggregatedItems = useMemo(() => {
    return aggregateMasterItems(meals, priceOverrides);
  }, [meals, priceOverrides]);

  // Grand Total Calculation
  const grandTotal = useMemo(() => {
    return aggregatedItems.reduce((sum, item) => sum + item.totalCost, 0);
  }, [aggregatedItems]);

  // Handler: Change student count and auto-recalculate scaled meal quantities
  const handleStudentCountChange = (newCount: number) => {
    const validCount = Math.max(1, newCount);
    setStudentCount(validCount);
    setMeals((prevMeals) => recalculateAutoScaledMeals(prevMeals, validCount));
  };

  // Handler: Update Meal Menu Summary
  const handleUpdateMealMenuSummary = (mealId: string, summary: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === mealId ? { ...meal, menuSummary: summary } : meal
      )
    );
  };

  // Handler: Update Master Unit Price (e.g. from the Master Summary view)
  const handleUpdateMasterPrice = (canonicalKey: string, newPrice: number) => {
    setPriceOverrides((prev) => ({
      ...prev,
      [canonicalKey]: newPrice,
    }));

    // Also update in meal items with this canonical key
    setMeals((prevMeals) =>
      prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) =>
          item.canonicalKey === canonicalKey
            ? { ...item, unitPrice: newPrice }
            : item
        ),
      }))
    );
  };

  // Handler: Update Master Total Quantity directly from Master Summary table
  const handleUpdateMasterQuantity = (canonicalKey: string, newQuantity: number) => {
    setMeals((prevMeals) => {
      // Find all items with this canonical key
      const occurrences: { mealId: string; itemId: string; amount: number; unit: UnitType }[] = [];
      prevMeals.forEach((meal) => {
        meal.items.forEach((item) => {
          if (item.canonicalKey === canonicalKey) {
            occurrences.push({ mealId: meal.id, itemId: item.id, amount: item.amount, unit: item.unit });
          }
        });
      });

      if (occurrences.length === 0) return prevMeals;

      // If it only occurs in 1 meal, update directly
      if (occurrences.length === 1) {
        const occ = occurrences[0];
        return prevMeals.map((meal) => {
          if (meal.id !== occ.mealId) return meal;
          return {
            ...meal,
            items: meal.items.map((item) =>
              item.id === occ.itemId 
                ? { ...item, amount: newQuantity, baseAmount: (newQuantity * 120) / studentCount } 
                : item
            ),
          };
        });
      }

      // If it occurs in multiple meals, scale proportionally
      const currentTotal = occurrences.reduce((sum, o) => {
        if (o.unit === 'গ্রাম') return sum + o.amount / 1000;
        return sum + o.amount;
      }, 0);

      const ratio = currentTotal > 0 ? newQuantity / currentTotal : 1;

      return prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => {
          if (item.canonicalKey === canonicalKey) {
            const scaled = parseFloat((item.amount * ratio).toFixed(2));
            return { 
              ...item, 
              amount: scaled,
              baseAmount: (scaled * 120) / studentCount,
            };
          }
          return item;
        }),
      }));
    });
  };

  // Handler: Add new item from Master Summary
  const handleAddNewMasterItem = (data: {
    name: string;
    category: ItemCategory;
    amount: number;
    unit: UnitType;
    unitPrice: number;
    mealId?: string;
  }) => {
    const canonicalKey = data.name.trim().toLowerCase().replace(/\s+/g, '_');
    const targetMealId = data.mealId || 'day2-dinner';

    const newItem: MealItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      canonicalKey,
      category: data.category,
      amount: data.amount,
      baseAmount: (data.amount * 120) / studentCount,
      unit: data.unit,
      unitPrice: data.unitPrice,
    };

    setMeals((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id !== targetMealId) return meal;
        return {
          ...meal,
          items: [...meal.items, newItem],
        };
      })
    );

    if (data.unitPrice > 0) {
      setPriceOverrides((prev) => ({
        ...prev,
        [canonicalKey]: data.unitPrice,
      }));
    }
  };

  // Handler: Update a single item inside a specific meal
  const handleUpdateMealItem = (
    mealId: string,
    itemId: string,
    updates: Partial<MealItem>
  ) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id !== mealId) return meal;
        return {
          ...meal,
          items: meal.items.map((item) => {
            if (item.id !== itemId) return item;
            const updated = { ...item, ...updates };

            if (updates.amount !== undefined) {
              updated.baseAmount = (updates.amount * 120) / studentCount;
            }

            // If unit price was updated, also register in master overrides
            if (updates.unitPrice !== undefined) {
              setPriceOverrides((prev) => ({
                ...prev,
                [item.canonicalKey]: updates.unitPrice!,
              }));
            }

            return updated;
          }),
        };
      })
    );
  };

  // Handler: Add a new item to a meal
  const handleAddMealItem = (mealId: string, newItemData: Omit<MealItem, 'id'>) => {
    const newItem: MealItem = {
      ...newItemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      baseAmount: newItemData.baseAmount ?? (newItemData.amount * 120) / studentCount,
    };

    setMeals((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id !== mealId) return meal;
        return {
          ...meal,
          items: [...meal.items, newItem],
        };
      })
    );

    // If unit price provided, register in overrides
    if (newItemData.unitPrice > 0) {
      setPriceOverrides((prev) => ({
        ...prev,
        [newItemData.canonicalKey]: newItemData.unitPrice,
      }));
    }
  };

  // Handler: Delete an item from a meal
  const handleDeleteMealItem = (mealId: string, itemId: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id !== mealId) return meal;
        return {
          ...meal,
          items: meal.items.filter((item) => item.id !== itemId),
        };
      })
    );
  };

  // Handler: Reset to factory defaults
  const handleConfirmReset = () => {
    const defaultData = getTourMealsData(120);
    setMeals(defaultData);
    setPriceOverrides({});
    setStudentCount(120);
    localStorage.removeItem(STORAGE_KEY_MEALS);
    localStorage.removeItem(STORAGE_KEY_OVERRIDES);
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={() => setIsResetConfirmOpen(true)}
        onExport={() => setIsExportOpen(true)}
        studentCount={studentCount}
        setStudentCount={handleStudentCountChange}
        grandTotal={grandTotal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Metric Cards (Visible in all tabs except Print for cleanliness) */}
        {activeTab !== 'print' && (
          <MetricCards
            grandTotal={grandTotal}
            totalUniqueItems={aggregatedItems.length}
            studentCount={studentCount}
            setStudentCount={handleStudentCountChange}
            mealCount={meals.length}
          />
        )}

        {/* Tab 1: Consolidated Master Requisition and Summary Report */}
        {activeTab === 'summary' && (
          <MasterSummary
            aggregatedItems={aggregatedItems}
            onUpdatePrice={handleUpdateMasterPrice}
            onUpdateQuantity={handleUpdateMasterQuantity}
            onAddNewMasterItem={handleAddNewMasterItem}
            grandTotal={grandTotal}
            studentCount={studentCount}
            setStudentCount={handleStudentCountChange}
          />
        )}

        {/* Tab 2: Meal-by-Meal Detailed Sheet (6 Meals + Bus Snacks) */}
        {activeTab === 'meals' && (
          <MealDetailView
            meals={meals}
            onUpdateMealItem={handleUpdateMealItem}
            onAddMealItem={handleAddMealItem}
            onDeleteMealItem={handleDeleteMealItem}
            onUpdateMealMenuSummary={handleUpdateMealMenuSummary}
            studentCount={studentCount}
            setStudentCount={handleStudentCountChange}
          />
        )}

        {/* Tab 3: Budget Analytics & Visual Breakdown */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            aggregatedItems={aggregatedItems}
            meals={meals}
            grandTotal={grandTotal}
            studentCount={studentCount}
          />
        )}

        {/* Tab 4: Printable Market Memo & Slip with PDF Download */}
        {activeTab === 'print' && (
          <PrintMemo
            aggregatedItems={aggregatedItems}
            grandTotal={grandTotal}
            studentCount={studentCount}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            কুয়াকাটা টুর ২০২৬ · ডিপার্টমেন্ট অব বিল্ডিং ইঞ্জিনিয়ারিং অ্যান্ড কনস্ট্রাকশন ম্যানেজমেন্ট (বিইসিএম) · ব্যাচ ২২ · কুয়েট
          </div>
          <div className="text-slate-400">
            রিয়েল-টাইম খাদ্যদ্রব্যের পরিমাণ ও দাম ক্যালকুলেটর
          </div>
        </div>
      </footer>

      {/* Export / Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        aggregatedItems={aggregatedItems}
        meals={meals}
        grandTotal={grandTotal}
        studentCount={studentCount}
      />

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                মূল ডাটাতে রিসেট করতে চান?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার এডিট করা কাস্টম দর বা পরিমাণ মুছে গিয়ে প্রাথমিক কুয়াকাটা টুর বিইসিএম ২২ তালিকার ডিফল্ট মান ফিরে আসবে।
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors shadow-2xs"
              >
                হ্যাঁ, রিসেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
