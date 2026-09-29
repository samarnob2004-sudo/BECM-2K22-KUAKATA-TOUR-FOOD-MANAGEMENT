import React from 'react';
import { AggregatedMasterItem, CATEGORIES, ItemCategory, ORDERED_CATEGORY_KEYS, Meal } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { PieChart, TrendingUp, Award, Layers } from 'lucide-react';

interface AnalyticsViewProps {
  aggregatedItems: AggregatedMasterItem[];
  meals: Meal[];
  grandTotal: number;
  studentCount: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  aggregatedItems,
  meals,
  grandTotal,
  studentCount,
}) => {
  // Category breakdown calculation for the 8 official categories
  const categoryStats = ORDERED_CATEGORY_KEYS.map((catKey) => {
    const info = CATEGORIES[catKey];
    const items = aggregatedItems.filter((i) => i.category === catKey);
    const totalCost = items.reduce((sum, i) => sum + i.totalCost, 0);
    const percentage = grandTotal > 0 ? (totalCost / grandTotal) * 100 : 0;

    return {
      key: catKey,
      name: info.nameBn,
      totalCost,
      itemCount: items.length,
      percentage,
      color: catKey === 'protein' ? 'bg-rose-500' :
             catKey === 'grains' ? 'bg-amber-500' :
             catKey === 'oils' ? 'bg-yellow-500' :
             catKey === 'vegetables' ? 'bg-emerald-500' :
             catKey === 'fruits' ? 'bg-lime-500' :
             catKey === 'spices' ? 'bg-orange-400' :
             catKey === 'dairy_sweets' ? 'bg-purple-500' : 'bg-cyan-500',
    };
  }).filter(c => c.itemCount > 0).sort((a, b) => b.totalCost - a.totalCost);

  // Meal breakdown
  const mealStats = meals.map((meal) => {
    const mealCost = meal.items.reduce((sum, item) => {
      if (item.customFixedPrice) return sum + item.customFixedPrice;
      if (item.unit === 'গ্রাম') return sum + (item.amount / 1000) * item.unitPrice;
      return sum + item.amount * item.unitPrice;
    }, 0);
    const percentage = grandTotal > 0 ? (mealCost / grandTotal) * 100 : 0;

    return {
      id: meal.id,
      title: meal.title,
      cost: mealCost,
      percentage,
      itemCount: meal.items.length,
    };
  });

  // Top 10 most expensive items
  const top10Items = [...aggregatedItems]
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 10);

  // Key Tour Commodity Totals (Crucial quick stats for tour management!)
  const totalRiceKg = aggregatedItems
    .filter(i => i.canonicalKey.includes('rice'))
    .reduce((sum, i) => sum + i.totalQuantity, 0);

  const totalOilKg = aggregatedItems
    .filter(i => i.canonicalKey.includes('oil'))
    .reduce((sum, i) => sum + i.totalQuantity, 0);

  const totalMeatKg = aggregatedItems
    .filter(i => i.canonicalKey === 'chicken' || i.canonicalKey === 'beef' || i.canonicalKey === 'mutton' || i.canonicalKey === 'beef_mutton')
    .reduce((sum, i) => sum + i.totalQuantity, 0);

  const totalChickenKg = aggregatedItems
    .find(i => i.canonicalKey === 'chicken')?.totalQuantity || 0;

  const totalBeefKg = aggregatedItems
    .find(i => i.canonicalKey === 'beef')?.totalQuantity || 0;

  const totalMuttonKg = aggregatedItems
    .find(i => i.canonicalKey === 'mutton')?.totalQuantity || 0;

  const totalRuiKg = aggregatedItems
    .find(i => i.canonicalKey === 'rui_fish')?.totalQuantity || 0;

  const totalShrimpKg = aggregatedItems
    .filter(i => i.canonicalKey.includes('shrimp'))
    .reduce((sum, i) => sum + i.totalQuantity, 0);

  const totalFishKg = aggregatedItems
    .filter(i => i.canonicalKey === 'rui_fish' || i.canonicalKey.includes('shrimp'))
    .reduce((sum, i) => sum + i.totalQuantity, 0);

  const totalEggPcs = aggregatedItems
    .find(i => i.canonicalKey === 'egg')?.totalQuantity || 0;

  return (
    <div className="space-y-5">
      
      {/* Quick Volume Highlights Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs text-slate-500 font-medium">মোট চাল প্রয়োজন</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumberBn(totalRiceKg)} <span className="text-xs font-normal text-slate-500">কেজি</span>
          </div>
          <div className="text-3xs text-slate-400 mt-1">পোলাও + বাসমতি + সাদা ভাত</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs text-slate-500 font-medium">মোট ভোজ্য তেল</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumberBn(totalOilKg)} <span className="text-xs font-normal text-slate-500">কেজি</span>
          </div>
          <div className="text-3xs text-slate-400 mt-1">সয়াবিন ও খাঁটি সরিষা তেল</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs text-slate-500 font-medium">মোট মাংস (মুরগি+গরু+খাসি)</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumberBn(totalMeatKg)} <span className="text-xs font-normal text-slate-500">কেজি</span>
          </div>
          <div className="text-3xs text-slate-400 mt-1">
            {totalChickenKg.toFixed(1)}কে মুরগি · {totalBeefKg.toFixed(1)}কে গরু · {totalMuttonKg.toFixed(1)}কে খাসি
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-2xs text-slate-500 font-medium">মোট মাছ ও চিংড়ি</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumberBn(totalFishKg)} <span className="text-xs font-normal text-slate-500">কেজি</span>
          </div>
          <div className="text-3xs text-slate-400 mt-1">
            {totalRuiKg.toFixed(1)}কে রুই · {totalShrimpKg.toFixed(1)}কে চিংড়ি
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-2xs text-slate-500 font-medium">মোট ডিম লাগবে</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {totalEggPcs} <span className="text-xs font-normal text-slate-500">পিস</span>
          </div>
          <div className="text-3xs text-slate-400 mt-1">কোরমা, ভর্তা ও টিকিয়া তৈরিতে</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Category Breakdown Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                ক্যাটাগরিভিত্তিক ব্যয়ের বিভাজন
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">কোন খাতে কত টাকা ও মোট বাজেটের কত শতাংশ খরচ</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ১০০%
            </span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-2xs">{cat.itemCount} টি</span>
                    <span className="font-mono font-bold text-slate-900">৳ {formatCurrency(cat.totalCost)}</span>
                    <span className="font-mono text-emerald-700 font-bold w-12 text-right">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(100, Math.max(1, cat.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Breakdown Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                বেলা অনুযায়ী খরচের তুলনা (৬ বেলা + বাস)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">প্রতি বেলার মেনুর মোট বাজেট ও ব্যয়ের অনুপাত</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {meals.length} টি স্লট
            </span>
          </div>

          <div className="space-y-3">
            {mealStats.map((meal) => (
              <div key={meal.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{meal.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-2xs">{meal.itemCount} টি</span>
                    <span className="font-mono font-bold text-slate-900">৳ {formatCurrency(meal.cost)}</span>
                    <span className="font-mono text-slate-700 font-bold w-12 text-right">
                      {meal.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(1, meal.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 10 Major Cost Items */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              সর্বোচ্চ ব্যয়ের শীর্ষ ১০টি বাজার উপাদান
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">এই উপাদানগুলোতে মোট বাজেটের সিংহভাগ ব্যয় হবে</p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            টপ বাজেট আইটেমস
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4 w-12 text-center">র‍্যাংক</th>
                <th className="py-2.5 px-4">উপাদানের নাম</th>
                <th className="py-2.5 px-4 text-right">সর্বমোট পরিমাণ</th>
                <th className="py-2.5 px-4 text-right">একক দর (৳)</th>
                <th className="py-2.5 px-4 text-right">মোট ব্যয় (৳)</th>
                <th className="py-2.5 px-4 text-right">বাজেট শেয়ার (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {top10Items.map((item, idx) => {
                const sharePercent = grandTotal > 0 ? (item.totalCost / grandTotal) * 100 : 0;

                return (
                  <tr key={item.canonicalKey} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-xs text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {item.displayName}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-800">
                      {formatNumberBn(item.totalQuantity)} {item.unit}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      ৳ {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      ৳ {formatCurrency(item.totalCost)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-700">
                      {sharePercent.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
