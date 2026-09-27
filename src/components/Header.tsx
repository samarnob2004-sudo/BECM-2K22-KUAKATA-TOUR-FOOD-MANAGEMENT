import React from 'react';
import { 
  ClipboardList, 
  Utensils, 
  PieChart, 
  Download, 
  RotateCcw,
  Users,
  FileDown,
  Tag,
  ChefHat
} from 'lucide-react';

export type AppTab = 'summary' | 'meals' | 'rates' | 'special-dishes' | 'analytics' | 'print';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onReset: () => void;
  onExport: () => void;
  studentCount: number;
  setStudentCount: (count: number) => void;
  grandTotal: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  onExport,
  studentCount,
  setStudentCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Distinctive Brand Lockup */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
              বি
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-none">
                কুয়াকাটা টুর ২০২৬
              </div>
              <div className="text-2xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                <span>বিইসিএম ২২ ব্যাচ</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>খাবার ও বাজার ব্যবস্থাপনা</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links (All 6 Tabs) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ClipboardList className={`w-3.5 h-3.5 ${activeTab === 'summary' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>বাজার সামারি</span>
            </button>

            <button
              onClick={() => setActiveTab('meals')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'meals'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Utensils className={`w-3.5 h-3.5 ${activeTab === 'meals' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>৬ বেলা মেনু</span>
            </button>

            {/* Requested: মূল্য তালিকা */}
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'rates'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Tag className={`w-3.5 h-3.5 ${activeTab === 'rates' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>মূল্য তালিকা</span>
            </button>

            {/* Requested: আইটেম ভিত্তিক ক্যালকুলেটর (পায়েস ও জর্দা) */}
            <button
              onClick={() => setActiveTab('special-dishes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'special-dishes'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ChefHat className={`w-3.5 h-3.5 ${activeTab === 'special-dishes' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>পায়েস ও জর্দা</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <PieChart className={`w-3.5 h-3.5 ${activeTab === 'analytics' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>বাজেট বিশ্লেষণ</span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'print'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileDown className={`w-3.5 h-3.5 ${activeTab === 'print' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>মেমো (PDF)</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions & Stepper */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Live Member Stepper */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/90 text-xs shadow-2xs">
              <Users className="w-3.5 h-3.5 text-emerald-700 hidden sm:inline" />
              <span className="text-slate-500 font-medium text-2xs sm:text-xs">মেম্বার:</span>
              <button
                type="button"
                onClick={() => setStudentCount(Math.max(1, studentCount - 5))}
                title="৫ জন কমান"
                className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-colors shadow-2xs"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="500"
                value={studentCount}
                onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-11 bg-white px-1 py-0.5 border border-slate-300 rounded text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs shadow-inner"
              />
              <button
                type="button"
                onClick={() => setStudentCount(Math.min(500, studentCount + 5))}
                title="৫ জন বাড়ান"
                className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-colors shadow-2xs"
              >
                +
              </button>
              <span className="text-slate-500 text-2xs sm:text-xs">জন</span>
            </div>

            <button
              onClick={onExport}
              title="এক্সপোর্ট ও কপি করুন"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">এক্সপোর্ট</span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              title="মেমো ভিউ ও PDF ডাউনলোড"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF মেমো</span>
            </button>

            <button
              onClick={onReset}
              title="মূল তালিকার ডিফল্ট মানে রিসেট করুন"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation bar */}
        <div className="flex lg:hidden border-t border-slate-100 py-2 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'summary' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 bg-slate-50'
            }`}
          >
            বাজার সামারি
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'meals' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 bg-slate-50'
            }`}
          >
            ৬ বেলার মেনু
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'rates' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 bg-slate-50'
            }`}
          >
            মূল্য তালিকা
          </button>
          <button
            onClick={() => setActiveTab('special-dishes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'special-dishes' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 bg-slate-50'
            }`}
          >
            পায়েস ও জর্দা
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'analytics' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 bg-slate-50'
            }`}
          >
            বাজেট বিশ্লেষণ
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'print' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 bg-slate-50'
            }`}
          >
            PDF মেমো
          </button>
        </div>
      </div>
    </header>
  );
};
