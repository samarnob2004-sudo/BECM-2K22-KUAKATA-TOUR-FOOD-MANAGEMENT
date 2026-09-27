import React, { useState } from 'react';
import { Sparkles, Trash2, Eraser, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface QuickActionBarProps {
  onFetchOnlinePrices: () => Promise<void>;
  isFetchingOnline: boolean;
  onClearAllPrices: () => void;
  onClearAllQuantities: () => void;
  statusMessage: string | null;
  onDismissStatus: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  onFetchOnlinePrices,
  isFetchingOnline,
  onClearAllPrices,
  onClearAllQuantities,
  statusMessage,
  onDismissStatus,
}) => {
  const [confirmModal, setConfirmModal] = useState<'prices' | 'quantities' | null>(null);

  const handleConfirmAction = () => {
    if (confirmModal === 'prices') {
      onClearAllPrices();
    } else if (confirmModal === 'quantities') {
      onClearAllQuantities();
    }
    setConfirmModal(null);
  };

  return (
    <div className="mb-5 space-y-2.5">
      {/* 3 Prominent Quick Action Buttons requested by user */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              স্মার্ট কুইক কন্ট্রোলস (Smart Price & Quantity Actions)
            </div>
            <div className="text-2xs text-slate-500">
              অনলাইন থেকে লাইভ বাজার দর বসানো এবং এক ক্লিকে দর বা পরিমাণ রিসেট করার ব্যবস্থা
            </div>
          </div>
        </div>

        {/* The 3 Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Button 1: Fetch Updated Online Market Prices */}
          <button
            type="button"
            onClick={onFetchOnlinePrices}
            disabled={isFetchingOnline}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {isFetchingOnline ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>অনলাইন থেকে আপডেটেড দর খোঁজা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>অনলাইন থেকে বাজার দর আপডেট</span>
              </>
            )}
          </button>

          {/* Button 2: Clear All Prices */}
          <button
            type="button"
            onClick={() => setConfirmModal('prices')}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
            <span>সকল দাম মুছুন</span>
          </button>

          {/* Button 3: Clear All Quantities */}
          <button
            type="button"
            onClick={() => setConfirmModal('quantities')}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Eraser className="w-3.5 h-3.5 text-slate-500 hover:text-amber-700" />
            <span>সকল পরিমাণ মুছুন</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Toast/Notification */}
      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200/90 text-emerald-950 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={onDismissStatus}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation Modal for Clearing Prices or Quantities */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                {confirmModal === 'prices' ? 'সকল দাম মুছে ০ করতে চান?' : 'সকল পরিমাণ মুছে ০ করতে চান?'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmModal === 'prices'
                ? 'তালিকার সমস্ত উপাদানের একক দর ০ টাকা হয়ে যাবে। আপনি নিজের স্থানীয় বাজার অনুযায়ী নতুন দর বসাতে পারবেন।'
                : 'তালিকার সমস্ত খাদ্যোপাদানের পরিমাণ ০ হয়ে যাবে। উপাদানগুলোর নাম ও কাঠামো বজায় থাকবে, আপনি প্রয়োজনমতো নতুন পরিমাণ বসাতে পারবেন।'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-2xs"
              >
                হ্যাঁ, নিশ্চিত মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
