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

      {/* Auto-Calculation Formulas Overview Strip */}
      <div className="col-span-2 lg:col-span-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950 space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-semibold text-2xs uppercase tracking-wider">
              ফুল ডাইনামিক ক্যালকুলেশন
            </span>
            <span className="text-xs font-medium text-emerald-900">
              টুর সদস্য <strong className="font-bold underline text-emerald-950">{studentCount} জন</strong> (মূল অনুপাত: ১২০ জনের সাপেক্ষে সব উপাদান স্কেল্ড):
            </span>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-2xs text-slate-500 font-medium">দ্রুত মেম্বার সিলেক্ট:</span>
            {[60, 80, 100, 120, 150, 200].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setStudentCount(preset)}
                className={`px-2 py-0.5 rounded-md text-2xs font-semibold transition-all ${
                  studentCount === preset
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {preset} জন {preset === 120 ? '(মূল)' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-2xs text-emerald-900 pt-1 border-t border-emerald-200/60">
          <span className="bg-white px-2 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
            বাসের নাস্তা: <strong>{studentCount} পিস</strong> কেক + <strong>{studentCount} পিস</strong> জুস
          </span>
          <span className="bg-white px-2 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
            মুরগি (৩ পিস/জন, ১৪ পিস/কেজি): <strong>{((studentCount * 3) / 14).toFixed(1)} কেজি</strong>
          </span>
          <span className="bg-white px-2 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
            রুই মাছ (১ পিস/জন, ৮ পিস/কেজি): <strong>{(studentCount / 8).toFixed(1)} কেজি</strong>
          </span>
          <span className="bg-white px-2 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
            গরুর মাংস (৮৫% বরাদ্দ): <strong>{(studentCount * 0.85 * 0.125).toFixed(1)} কেজি</strong>
          </span>
          <span className="bg-white px-2 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
            খাসির মাংস (১৫% বরাদ্দ): <strong>{(studentCount * 0.15 * 0.125).toFixed(1)} কেজি</strong>
          </span>
          <span className="bg-white px-2 py-1 rounded-md border border-emerald-200/80 shadow-2xs font-medium text-emerald-800">
            চাল, ডাল, আলু, তেল ও মশলা: <strong>{(studentCount / 120).toFixed(2)}x অনুপাতে লাইভ আপডেট</strong>
          </span>
        </div>
      </div>

    </div>
  );
};
