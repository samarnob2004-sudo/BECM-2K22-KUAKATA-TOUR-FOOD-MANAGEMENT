import React, { useState } from 'react';
import { AggregatedMasterItem, CATEGORIES, ItemCategory, Meal } from '../types/meal';
import { formatCurrency, formatNumberBn } from '../utils/calculator';
import { X, Copy, Check, Download, FileSpreadsheet, Share2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  aggregatedItems: AggregatedMasterItem[];
  meals: Meal[];
  grandTotal: number;
  studentCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  aggregatedItems,
  meals,
  grandTotal,
  studentCount,
}) => {
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'tsv' | null>(null);

  if (!isOpen) return null;

  const perPerson = studentCount > 0 ? Math.round(grandTotal / studentCount) : 0;

  // Generate WhatsApp summary text
  const generateWhatsAppText = () => {
    let text = `🌴 *কুয়াকাটা টুর ২০২৬ — বিইসিএম ২২ ব্যাচ*\n`;
    text += `🍛 *৬ বেলার সামগ্রিক খাবার ও কাঁচাবাজার হিসাব*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👥 মোট সদস্য: ${studentCount} জন\n`;
    text += `💰 সর্বমোট বাজার বাজেট: ৳ ${formatCurrency(grandTotal)}\n`;
    text += `👤 জনপ্রতি খাবারের খরচ: ৳ ${formatCurrency(perPerson)}\n`;
    text += `📦 মোট বাজার উপাদান: ${aggregatedItems.length} টি\n\n`;

    text += `📋 *প্রধান আইটেমসমূহের সারসংক্ষেপ:*\n`;
    aggregatedItems.slice(0, 25).forEach((item, idx) => {
      text += `${idx + 1}. ${item.displayName}: ${formatNumberBn(item.totalQuantity)} ${item.unit} — ৳${formatCurrency(item.totalCost)}\n`;
    });

    if (aggregatedItems.length > 25) {
      text += `...এবং আরও ${aggregatedItems.length - 25}টি মসলা ও অন্যান্য উপাদান।\n`;
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✅ কুয়াকাটা টুর ফুড অ্যান্ড বাজার কমিটি, বিইসিএম ২২, কুয়েট।`;
    return text;
  };

  const copyToClipboard = (text: string, type: 'whatsapp' | 'tsv') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Download CSV with UTF-8 BOM
  const downloadCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Excel Bengali font support
    csv += 'ক্রমিক,উপাদানের নাম,ক্যাটাগরি,সর্বমোট পরিমাণ,একক,দর (টাকা),মোট টাকা (টাকা),কোন কোন বেলায় প্রয়োজন\n';

    aggregatedItems.forEach((item, index) => {
      const cat = CATEGORIES[item.category]?.nameBn || 'অন্যান্য';
      const occurrencesStr = item.occurrences
        .map(o => `${o.mealTitle} (${o.amount} ${o.unit})`)
        .join('; ');

      const row = [
        index + 1,
        `"${item.displayName}"`,
        `"${cat}"`,
        item.totalQuantity,
        item.unit,
        item.unitPrice,
        item.totalCost,
        `"${occurrencesStr}"`,
      ];
      csv += row.join(',') + '\n';
    });

    // Append grand total row
    csv += `\n,,সর্বমোট হিসাব,,,,"${grandTotal}","${studentCount} জন অংশগ্রহণকারী - জনপ্রতি ৳${perPerson}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kuakata_Tour_BECM22_Bazar_Hisab.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Tab-separated format for direct copy-paste to Google Sheets
  const generateTSV = () => {
    let tsv = 'ক্রমিক\tউপাদানের নাম\tক্যাটাগরি\tসর্বমোট পরিমাণ\tএকক\tদর (টাকা)\tমোট টাকা (টাকা)\n';
    aggregatedItems.forEach((item, idx) => {
      const cat = CATEGORIES[item.category]?.nameBn || '';
      tsv += `${idx + 1}\t${item.displayName}\t${cat}\t${item.totalQuantity}\t${item.unit}\t${item.unitPrice}\t${item.totalCost}\n`;
    });
    tsv += `\nসর্বমোট\t\t\t\t\t\t${grandTotal}\n`;
    return tsv;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base">
              বাজারের হিসাব এক্সপোর্ট ও শেয়ার করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Option 1: WhatsApp / Messenger Text */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>হোয়াটসঅ্যাপ ও মেসেঞ্জার মেসেজ ফরম্যাট</span>
                </div>
                <div className="text-2xs text-slate-500">
                  বিইসিএম ২২ ব্যাচ গ্রুপে সহজে কপি করে পোস্ট করার জন্য
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(generateWhatsAppText(), 'whatsapp')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                {copiedType === 'whatsapp' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>টেক্সট কপি</span>
                  </>
                )}
              </button>
            </div>
            
            <pre className="text-2xs bg-white p-3 rounded-lg border border-slate-200 max-h-36 overflow-y-auto font-sans text-slate-700 whitespace-pre-wrap">
              {generateWhatsAppText()}
            </pre>
          </div>

          {/* Option 2: Excel / CSV Download */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>এক্সেল সিএসভি ফাইল ডাউনলোড (.csv)</span>
              </div>
              <div className="text-2xs text-slate-500 mt-0.5">
                বাংলা ফন্ট সাপোর্ট সহ মাইক্রোসফট এক্সেলে সরাসরি ওপেন হবে
              </div>
            </div>

            <button
              onClick={downloadCSV}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাউনলোড</span>
            </button>
          </div>

          {/* Option 3: Copy for Google Sheets */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-900">
                গুগল শিট / স্প্রেডশিট কপি
              </div>
              <div className="text-2xs text-slate-500 mt-0.5">
                ক্লিপবোর্ডে কপি করে সরাসরি গুগল শিটে পেস্ট করতে পারবেন
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(generateTSV(), 'tsv')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedType === 'tsv' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>শিট কপি</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
