import React from 'react';
import { formatCurrency } from '../utils/calculator';
import { Wallet, Users, PackageCheck, Layers, Sparkles } from 'lucide-react';

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* Metric 1: Grand Total Tour Food Budget */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium tracking-wide">সর্বমোট বাজার বাজেট</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-slate-400">৳</span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
        <div className="text-2xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <span>কুয়াকাটা টুর</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>৬ বেলা খাবার ও বাসের নাস্তা</span>
        </div>
      </div>

      {/* Metric 2: Per Person Cost */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium tracking-wide">জনপ্রতি খাবারের খরচ</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-slate-400">৳</span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(perPersonCost)}
            </span>
          </div>
        </div>
        <div className="text-2xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <span>মোট {studentCount} জন মেম্বার</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-indigo-600 font-medium">৳{Math.round(perPersonCost / 6)} / বেলা</span>
        </div>
      </div>

      {/* Metric 3: Total Unique Elements */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium tracking-wide">মোট বাজার উপাদান</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <PackageCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {totalUniqueItems}
            </span>
            <span className="text-sm font-medium text-slate-500">টি আইটেম</span>
          </div>
        </div>
        <div className="text-2xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <span>চাল, ডাল, তেল, সবজি, মাছ, মাংস</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>একীভূত</span>
        </div>
      </div>

      {/* Metric 4: Average per Meal Cost */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium tracking-wide">প্রতি বেলার গড় খরচ</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-slate-400">৳</span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(avgMealCost)}
            </span>
          </div>
        </div>
        <div className="text-2xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <span>সর্বোচ্চ খরচ: ২য় দিন রাতে</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>গ্র্যান্ড ফিস্ট</span>
        </div>
      </div>

      {/* Auto-Calculation Formulas Overview Strip */}
      <div className="col-span-2 lg:col-span-4 bg-white border border-emerald-200 rounded-xl p-4 text-xs text-slate-700 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  স্বয়ংক্রিয় খাদ্য ও বাজার অনুপাত স্কেলার
                </span>
                <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  লাইভ ক্যালকুলেশন
                </span>
              </div>
              <p className="text-2xs text-slate-500 mt-0.5">
                সদস্য সংখ্যা <strong className="text-emerald-900 font-bold">{studentCount} জন</strong> (বেসলাইন ১২০ জনের তুলনায় অনুপাত: <span className="font-mono font-bold text-slate-800">{(studentCount / 120).toFixed(2)}x</span>)
              </p>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-2xs text-slate-400 font-medium">কুইক সিলেক্ট:</span>
            {[60, 80, 100, 120, 150, 180, 200].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setStudentCount(preset)}
                className={`px-2.5 py-1 rounded-md text-2xs font-semibold transition-all ${
                  studentCount === preset
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200'
                }`}
              >
                {preset} জন {preset === 120 ? '(বেস)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic breakdown tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-2xs">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-slate-500">বাসের নাস্তা</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {studentCount} পিস কেক + {studentCount} জুস
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-slate-500">মুরগির মাংস (১ম দিন দু)</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {((studentCount * 3) / 14).toFixed(1)} কেজি <span className="text-slate-400 font-normal">({studentCount * 3} পিস)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-slate-500">রুই মাছ (২য় দিন দু)</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {(studentCount / 8).toFixed(1)} কেজি <span className="text-slate-400 font-normal">({studentCount} পিস)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-slate-500">গরুর মাংস (৮৫% জন)</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {(studentCount * 0.85 * 0.125).toFixed(1)} কেজি <span className="text-slate-400 font-normal">(১২৫ গ্রাম/জন)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-slate-500">খাসির মাংস (১৫% জন)</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {(studentCount * 0.15 * 0.125).toFixed(1)} কেজি <span className="text-slate-400 font-normal">(১২৫ গ্রাম/জন)</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 text-emerald-950">
            <div className="text-emerald-700 font-medium">চাল, ডাল, তেল, সবজি, মশলা</div>
            <div className="font-bold mt-0.5">
              {(studentCount / 120).toFixed(2)}x অনুপাতে স্কেল্ড
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
