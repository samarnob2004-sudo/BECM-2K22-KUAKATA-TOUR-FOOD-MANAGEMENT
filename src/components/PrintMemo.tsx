import React, { useState, useRef } from 'react';
import { AggregatedMasterItem, CATEGORIES, ItemCategory } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { Printer, Calendar, MapPin, Users, Download, Loader2 } from 'lucide-react';

interface PrintMemoProps {
  aggregatedItems: AggregatedMasterItem[];
  grandTotal: number;
  studentCount: number;
}

export const PrintMemo: React.FC<PrintMemoProps> = ({
  aggregatedItems,
  grandTotal,
  studentCount,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const memoContentRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownloadPdf = async () => {
    if (!memoContentRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const opt = {
        margin: [8, 8, 8, 8] as [number, number, number, number],
        filename: `Kuakata_Tour_BECM22_Bazar_Memo.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all' as const, 'css' as const, 'legacy' as const] },
      };

      await html2pdf().set(opt).from(memoContentRef.current).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to browser print if library fails
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Print Trigger Toolbar (Hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-slate-700">
          <strong className="text-slate-900 font-semibold">বাজারের মেমো ডাউনলোড ও প্রিন্ট:</strong> পুরো ৬ বেলার একীভূত কাঁচাবাজারের উপাদান, পরিমাণ, একক দর ও মোট খরচের অফিসিয়াল মেমো।
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Main Requested Feature: PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>পিডিএফ তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>বাজারের মেমো PDF ডাউনলোড</span>
              </>
            )}
          </button>

          {/* Browser Print Button */}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4/Formal Document Format) */}
      <div 
        ref={memoContentRef} 
        id="tour-memo-printable"
        className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0"
      >
        
        {/* Formal Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5 mb-5">
          <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (কুয়েট)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            কুয়াকাটা টুর ২০২৬ · ৬ বেলার সামগ্রিক কাঁচাবাজার তালিকা
          </h1>
          <div className="text-sm font-semibold text-emerald-800 mt-0.5">
            বিল্ডিং ইঞ্জিনিয়ারিং অ্যান্ড কনস্ট্রাকশন ম্যানেজমেন্ট (বিইসিএম) — ব্যাচ '২২
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>তারিখ: {currentDate}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>স্থান: কুয়াকাটা, পটুয়াখালী</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>মোট অংশগ্রহণকারী: {studentCount} জন</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">
              মোট খাদ্য উপাদান: {aggregatedItems.length} টি
            </span>
          </div>
        </div>

        {/* Grouped Items List by Category */}
        <div className="space-y-6">
          {(Object.keys(CATEGORIES) as ItemCategory[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const items = aggregatedItems.filter((i) => i.category === catKey);
            if (items.length === 0) return null;

            const categorySum = items.reduce((sum, i) => sum + i.totalCost, 0);

            return (
              <div key={catKey} className="break-inside-avoid">
                <div className="bg-slate-100 px-3 py-1.5 rounded flex items-center justify-between border-l-4 border-emerald-700 mb-2">
                  <span className="font-bold text-xs text-slate-900">
                    {cat.nameBn} ({items.length} টি উপাদান)
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    উপ-মোট: ৳ {formatCurrency(categorySum)}
                  </span>
                </div>

                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300">
                      <th className="py-1.5 px-2 border-r border-slate-300 w-8 text-center">ক্র.</th>
                      <th className="py-1.5 px-2.5 border-r border-slate-300">উপাদানের নাম ও বিবরণ</th>
                      <th className="py-1.5 px-2.5 border-r border-slate-300 text-right w-28">মোট পরিমাণ</th>
                      <th className="py-1.5 px-2.5 border-r border-slate-300 text-right w-24">দর (৳)</th>
                      <th className="py-1.5 px-2.5 border-r border-slate-300 text-right w-28">মোট টাকা (৳)</th>
                      <th className="py-1.5 px-2 text-center w-12">ক্রয় টিক</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((item, idx) => (
                      <tr key={item.canonicalKey} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 px-2.5 border-r border-slate-300">
                          <span className="font-semibold text-slate-900">{item.displayName}</span>
                          {item.secondaryAmountText && (
                            <span className="text-slate-500 text-3xs ml-1.5 font-normal">
                              ({item.secondaryAmountText})
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono font-bold text-slate-900">
                          {formatNumberBn(item.totalQuantity)} {item.unit}
                        </td>
                        <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono text-slate-700">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono font-bold text-slate-900">
                          ৳ {formatCurrency(item.totalCost)}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <div className="w-3.5 h-3.5 border border-slate-400 rounded mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Grand Total Summary Box */}
        <div className="mt-8 border-2 border-slate-800 p-4 bg-slate-50 rounded-lg break-inside-avoid">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase font-bold text-slate-600">
                কুয়াকাটা টুর ২০২৬ বাজার হিসাব পরিসমাপ্তি
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                ৬ বেলা খাবার · ১২০ জন ছাত্রছাত্রী · সর্বমোট উপাদান: {aggregatedItems.length} টি
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">সর্বমোট প্রাক্কলিত বাজেট</div>
              <div className="text-2xl font-black font-mono tabular-nums text-slate-900">
                ৳ {formatCurrency(grandTotal)}
              </div>
              <div className="text-2xs text-emerald-800 font-medium">
                (জনপ্রতি গড়: ৳ {formatCurrency(studentCount > 0 ? Math.round(grandTotal / studentCount) : 0)})
              </div>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mt-16 pt-8 border-t border-slate-300 grid grid-cols-3 gap-4 text-center break-inside-avoid">
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-xs font-semibold text-slate-800">
              বাজার উপ-কমিটি
            </div>
            <div className="text-2xs text-slate-500">বিইসিএম ২২ ব্যাচ, কুয়েট</div>
          </div>

          <div>
            <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-xs font-semibold text-slate-800">
              অর্থ ও হিসাব কমিটি
            </div>
            <div className="text-2xs text-slate-500">বিইসিএম ২২ ব্যাচ, কুয়েট</div>
          </div>

          <div>
            <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-xs font-semibold text-slate-800">
              টুর আহ্বায়ক / সিআর
            </div>
            <div className="text-2xs text-slate-500">বিইসিএম ২২ ব্যাচ, কুয়েট</div>
          </div>
        </div>

      </div>
    </div>
  );
};
