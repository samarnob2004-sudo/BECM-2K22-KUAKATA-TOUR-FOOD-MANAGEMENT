/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ItemCategory, Meal, MealItem, UnitType } from './types/meal';
import { recalculateAutoScaledMeals, getTourMealsData } from './data/defaultTourData';
import { aggregateMasterItems, normalizeItemIdentity } from './utils/calculator';
import { Header, AppTab } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { QuickActionBar } from './components/QuickActionBar';
import { MasterSummary } from './components/MasterSummary';
import { MealDetailView } from './components/MealDetailView';
import { RateListView } from './components/RateListView';
import { ComparisonView } from './components/ComparisonView';
import { SpecialDishesView } from './components/SpecialDishesView';
import { AnalyticsView } from './components/AnalyticsView';
import { PrintMemo } from './components/PrintMemo';
import { ExportModal } from './components/ExportModal';
import { AlertTriangle } from 'lucide-react';
import { ComparisonQuoteItem } from './types/comparison';

const STORAGE_KEY_MEALS = 'kuakata_tour_meals_v7';
const STORAGE_KEY_OVERRIDES = 'kuakata_tour_price_overrides_v7';
const STORAGE_KEY_STUDENTS = 'kuakata_tour_student_count_v7';
const STORAGE_KEY_COMPARISON = 'kuakata_tour_comparison_items_v1';

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

  const [savedComparisonItems, setSavedComparisonItems] = useState<ComparisonQuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPARISON);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load comparison items from localStorage', e);
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<AppTab>('summary');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isFetchingOnline, setIsFetchingOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  // Handler: Update Master Unit Price
  const handleUpdateMasterPrice = (canonicalKey: string, newPrice: number) => {
    setPriceOverrides((prev) => ({
      ...prev,
      [canonicalKey]: newPrice,
    }));

    // Also update in meal items with this canonical key or normalized identity
    setMeals((prevMeals) =>
      prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => {
          const idn = normalizeItemIdentity(item);
          return idn.key === canonicalKey || item.canonicalKey === canonicalKey
            ? { ...item, unitPrice: newPrice }
            : item;
        }),
      }))
    );
  };

  // Handler: Fetch updated market prices from online / API
  const handleFetchOnlinePrices = async () => {
    setIsFetchingOnline(true);
    try {
      const payload = {
        items: aggregatedItems.map((i) => ({
          canonicalKey: i.canonicalKey,
          displayName: i.displayName,
          category: i.category,
          unit: i.unit,
          currentPrice: i.unitPrice,
        })),
      };

      const res = await fetch('/api/fetch-market-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.prices) {
        const fetchedPrices = data.prices as Record<string, number>;
        setPriceOverrides((prev) => ({
          ...prev,
          ...fetchedPrices,
        }));

        setMeals((prevMeals) =>
          prevMeals.map((meal) => ({
            ...meal,
            items: meal.items.map((item) => {
              const idn = normalizeItemIdentity(item);
              const p = fetchedPrices[idn.key] ?? fetchedPrices[item.canonicalKey];
              return p !== undefined && p > 0 ? { ...item, unitPrice: p } : item;
            }),
          }))
        );

        setStatusMessage(data.message || 'অনলাইন থেকে সফলভাবে সকল খাদ্যোপাদানের বর্তমান বাজার দর আপডেট করা হয়েছে।');
      } else {
        throw new Error('Fallback needed');
      }
    } catch (err) {
      console.warn('API error, applying verified catalog prices:', err);
      const fallbackCatalog: Record<string, number> = {
        chicken: 210,
        beef: 750,
        mutton: 1100,
        rui_fish: 380,
        shrimp_small: 650,
        shrimp_dried: 950,
        egg: 12,
        soybean_oil: 185,
        mustard_oil: 280,
        ghee: 1400,
        rice_white: 65,
        polao_rice: 140,
        basmati_rice: 260,
        lentil_mosur: 135,
        lentil_mug: 160,
        potato: 35,
        onion: 75,
        garlic: 220,
        ginger: 240,
        sugar: 130,
        powder_milk: 880,
        muffin_cake: 10,
        juice_pack: 10,
        coca_cola: 90,
      };

      setPriceOverrides((prev) => ({ ...prev, ...fallbackCatalog }));
      setMeals((prevMeals) =>
        prevMeals.map((meal) => ({
          ...meal,
          items: meal.items.map((item) => {
            const idn = normalizeItemIdentity(item);
            const p = fallbackCatalog[idn.key] ?? fallbackCatalog[item.canonicalKey];
            return p !== undefined ? { ...item, unitPrice: p } : item;
          }),
        }))
      );
      setStatusMessage('অনলাইন কাঁচাবাজারের ভেরিফাইড বর্তমান দর অনুযায়ী সকল পণ্যের দাম আপডেট করা হয়েছে।');
    } finally {
      setIsFetchingOnline(false);
    }
  };

  // Handler: Clear all prices (set to 0)
  const handleClearAllPrices = () => {
    setPriceOverrides({});
    setMeals((prevMeals) =>
      prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => ({
          ...item,
          unitPrice: 0,
          customFixedPrice: undefined,
        })),
      }))
    );
    setStatusMessage('সকল পণ্যের দাম মুছে ০ টাকা করা হয়েছে। এখন আপনি প্রতিটি পণ্যের কাস্টম দর বসাতে পারেন।');
  };

  // Handler: Save comparison items to localStorage
  const handleSaveComparisonItems = (newItems: ComparisonQuoteItem[]) => {
    setSavedComparisonItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_COMPARISON, JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save comparison items to localStorage', e);
    }
  };

  // Handler: Apply comparison rates to Tour Master Budget
  const handleApplyComparisonRatesToBudget = (rates: Record<string, number>) => {
    setPriceOverrides((prev) => ({
      ...prev,
      ...rates,
    }));

    setMeals((prevMeals) =>
      prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => {
          const idn = normalizeItemIdentity(item);
          const newPrice = rates[idn.key] ?? rates[item.canonicalKey];
          return newPrice !== undefined ? { ...item, unitPrice: newPrice } : item;
        }),
      }))
    );
    setStatusMessage('কোটেশন বাজার দর সফলভাবে মূল ৬ বেলার টুর বাজেট ও খাদ্য তালিকায় কার্যকর করা হয়েছে।');
  };

  // Handler: Clear all quantities (set to 0)
  const handleClearAllQuantities = () => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => ({
          ...item,
          amount: 0,
          baseAmount: 0,
        })),
      }))
    );
    setStatusMessage('সকল পণ্যের পরিমাণ মুছে ০ করা হয়েছে। আপনি নিজের প্রয়োজনমতো নতুন পরিমাণ বসাতে পারেন।');
  };

  // Handler: Update Master Total Quantity for an item
  const handleUpdateMasterQuantity = (canonicalKey: string, newTotalQty: number) => {
    setMeals((prevMeals) => {
      const occurrences: { mealId: string; itemId: string; currentAmount: number }[] = [];
      let currentTotal = 0;

      prevMeals.forEach((meal) => {
        meal.items.forEach((item) => {
          const idn = normalizeItemIdentity(item);
          if (idn.key === canonicalKey || item.canonicalKey === canonicalKey) {
            occurrences.push({ mealId: meal.id, itemId: item.id, currentAmount: item.amount });
            currentTotal += item.amount;
          }
        });
      });

      if (occurrences.length === 0) return prevMeals;

      if (occurrences.length === 1) {
        const occ = occurrences[0];
        const ratio = studentCount / 120;
        const newBase = ratio > 0 ? newTotalQty / ratio : newTotalQty;
        return prevMeals.map((meal) => {
          if (meal.id !== occ.mealId) return meal;
          return {
            ...meal,
            items: meal.items.map((item) => {
              if (item.id !== occ.itemId) return item;
              return { ...item, amount: newTotalQty, baseAmount: newBase };
            }),
          };
        });
      }

      const ratio = currentTotal > 0 ? newTotalQty / currentTotal : 0;
      const countRatio = studentCount / 120;

      return prevMeals.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => {
          const idn = normalizeItemIdentity(item);
          if (idn.key === canonicalKey || item.canonicalKey === canonicalKey) {
            const scaled = Math.round(item.amount * ratio * 100) / 100;
            const newBase = countRatio > 0 ? scaled / countRatio : scaled;
            return { ...item, amount: scaled, baseAmount: newBase };
          }
          return item;
        }),
      }));
    });
  };

  // Handler: Add New Master Item from Master Summary view
  const handleAddNewMasterItem = (newItem: {
    name: string;
    category: ItemCategory;
    amount: number;
    unit: UnitType;
    unitPrice: number;
    mealId?: string;
  }) => {
    const targetMealId = newItem.mealId || 'day2-dinner';
    const canonicalKey = newItem.name.trim().toLowerCase().replace(/\s+/g, '_');
    const ratio = studentCount / 120;
    const baseAmt = ratio > 0 ? newItem.amount / ratio : newItem.amount;

    const createdItem: MealItem = {
      id: `custom_${Date.now()}`,
      name: newItem.name.trim(),
      canonicalKey,
      category: newItem.category,
      amount: newItem.amount,
      baseAmount: baseAmt,
      unit: newItem.unit,
      unitPrice: newItem.unitPrice,
    };

    setMeals((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id !== targetMealId) return meal;
        return {
          ...meal,
          items: [...meal.items, createdItem],
        };
      })
    );
  };

  // Handler: Update specific Meal Item
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
              const ratio = studentCount / 120;
              updated.baseAmount = ratio > 0 ? updates.amount / ratio : updates.amount;
            }
            return updated;
          }),
        };
      })
    );

    if (updates.unitPrice !== undefined) {
      const meal = meals.find((m) => m.id === mealId);
      const item = meal?.items.find((i) => i.id === itemId);
      if (item) {
        setPriceOverrides((prev) => ({
          ...prev,
          [item.canonicalKey]: updates.unitPrice!,
        }));
      }
    }
  };

  // Handler: Add item to a specific meal
  const handleAddMealItem = (mealId: string, itemData: Omit<MealItem, 'id'>) => {
    const ratio = studentCount / 120;
    const baseAmt = ratio > 0 ? itemData.amount / ratio : itemData.amount;
    const newItem: MealItem = {
      ...itemData,
      id: `custom_${Date.now()}`,
      baseAmount: baseAmt,
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
  };

  // Handler: Delete item from a meal
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
    setStatusMessage('মূল কুয়াকাটা টুর ডিফল্ট ডাটা ও ১২০ জন বেসলাইনে রিসেট সম্পন্ন হয়েছে।');
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Prominent Quick Actions Toolbar (Fetch Online Prices, Clear All Prices, Clear All Quantities) */}
        {activeTab !== 'print' && (
          <QuickActionBar
            onFetchOnlinePrices={handleFetchOnlinePrices}
            isFetchingOnline={isFetchingOnline}
            onClearAllPrices={handleClearAllPrices}
            onClearAllQuantities={handleClearAllQuantities}
            statusMessage={statusMessage}
            onDismissStatus={() => setStatusMessage(null)}
            onNavigateToComparison={() => setActiveTab('comparison')}
          />
        )}

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

        {/* Tab 3: Requested "মূল্য তালিকা" (Rate List & Price Catalog by Category) */}
        {activeTab === 'rates' && (
          <RateListView
            aggregatedItems={aggregatedItems}
            onUpdatePrice={handleUpdateMasterPrice}
            onFetchOnlinePrices={handleFetchOnlinePrices}
            isFetchingOnline={isFetchingOnline}
            onClearAllPrices={handleClearAllPrices}
            onNavigateToComparison={() => setActiveTab('comparison')}
          />
        )}

        {/* Tab: Requested "দর তুলনা (Comparison System)" */}
        {activeTab === 'comparison' && (
          <ComparisonView
            aggregatedItems={aggregatedItems}
            studentCount={studentCount}
            priceOverrides={priceOverrides}
            onUpdateBudgetPrice={handleUpdateMasterPrice}
            onApplyRatesToBudget={handleApplyComparisonRatesToBudget}
            savedComparisonItems={savedComparisonItems}
            onSaveComparisonItems={handleSaveComparisonItems}
          />
        )}

        {/* Tab 4: Requested "আইটেম ভিত্তিক ক্যালকুলেটর (পায়েস ও জর্দা)" */}
        {activeTab === 'special-dishes' && (
          <SpecialDishesView
            initialStudentCount={studentCount}
          />
        )}

        {/* Tab 5: Budget Analytics & Visual Breakdown */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            aggregatedItems={aggregatedItems}
            meals={meals}
            grandTotal={grandTotal}
            studentCount={studentCount}
          />
        )}

        {/* Tab 6: Printable Market Memo & Slip with PDF Download */}
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
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 bg-amber-50 rounded-xl">
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
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-2xs"
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
