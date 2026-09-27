import React from 'react';
import { formatCurrency } from '../utils/calculator';
import { Wallet, Users, PackageCheck, Layers } from 'lucide-react';

interface MetricCardsProps {
  grandTotal: number;
  totalUniqueItems: number;
  studentCount: number;
  setStudentCount: (count: number) => void;
  mealCount: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  grandTotal,
  totalUniqueItems,
  studentCount,
  setStudentCount,
  mealCount,
}) => {
  const perPersonCost = studentCount > 0 ? Math.round(grandTotal / studentCount) : 0;
  const avgMealCost = mealCount > 0 ? Math.round(grandTotal / mealCount) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* Metric 1: Grand Total Tour Food Budget */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">সর্বমোট বাজার বাজেট</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Wallet className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-slate-400">৳</span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCurrency(grandTotal)}
          </span>
        </div>
        <div className="text-2xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>কুয়াকাটা টুর · ৬ বেলা</span>
          <span aria-hidden="true">·</span>
          <span>সম্পূর্ণ কাঁচাবাজার</span>
        </div>
      </div>

      {/* Metric 2: Per Person Cost */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">জনপ্রতি খাবারের খরচ</span>
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-slate-400">৳</span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCurrency(perPersonCost)}
          </span>
        </div>
        <div className="text-2xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>মোট {studentCount} জন শিক্ষার্থী</span>
          <span aria-hidden="true">·</span>
          <span className="text-indigo-600 font-medium">৳{Math.round(perPersonCost / 6)} / বেলা</span>
        </div>
      </div>

      {/* Metric 3: Total Unique Elements */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">মোট বাজার উপাদান</span>
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <PackageCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalUniqueItems}
          </span>
          <span className="text-sm font-medium text-slate-500">টি আইটেম</span>
        </div>
        <div className="text-2xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>কেজি/গ্রাম/পিস/লিটার</span>
          <span aria-hidden="true">·</span>
          <span>একীভূত তালিকা</span>
        </div>
      </div>

      {/* Metric 4: Average per Meal Cost */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">প্রতি বেলার গড় খরচ</span>
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
            <Layers className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-slate-400">৳</span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCurrency(avgMealCost)}
          </span>
        </div>
        <div className="text-2xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>সর্বোচ্চ খরচ: ২য় দিন রাতে</span>
          <span aria-hidden="true">·</span>
          <span>গ্র্যান্ড ফিস্ট</span>
        </div>
      </div>

    </div>
  );
};
