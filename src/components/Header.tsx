import React from 'react';
import { 
  ClipboardList, 
  Utensils, 
  PieChart, 
  Printer, 
  Download, 
  RotateCcw,
  Users,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'summary' | 'meals' | 'analytics' | 'print';
  setActiveTab: (tab: 'summary' | 'meals' | 'analytics' | 'print') => void;
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
  grandTotal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                বি
              </span>
              <span>কুয়াকাটা টুর ২০২৬ <span className="text-emerald-700 font-semibold text-sm">· বিইসিএম ২২</span></span>
            </span>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'summary'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>বাজার সামারি ও রিকুইজিশন</span>
            </button>

            <button
              onClick={() => setActiveTab('meals')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'meals'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>বেলা অনুযায়ী মেনু (৬ বেলা)</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>বাজেট বিশ্লেষণ</span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'print'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>বাজারের মেমো (PDF/প্রিন্ট)</span>
            </button>
          </nav>

          {/* Zone 3: Primary actions & Member count */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600">টুর মেম্বার:</span>
              <input
                type="number"
                min="1"
                max="500"
                value={studentCount}
                onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 bg-white px-1.5 py-0.5 border border-slate-300 rounded text-center font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-slate-600">জন</span>
            </div>

            <button
              onClick={onExport}
              title="এক্সপোর্ট ও কপি করুন"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">এক্সপোর্ট / শেয়ার</span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              title="মেমো ভিউ ও PDF ডাউনলোড"
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">বাজারের মেমো PDF</span>
            </button>

            <button
              onClick={onReset}
              title="মূল ডাটাতে রিসেট করুন"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-200 py-2 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'summary' ? 'bg-emerald-700 text-white' : 'text-slate-600'
            }`}
          >
            বাজার সামারি
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'meals' ? 'bg-emerald-700 text-white' : 'text-slate-600'
            }`}
          >
            ৬ বেলা মেনু
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-emerald-700 text-white' : 'text-slate-600'
            }`}
          >
            বাজেট বিশ্লেষণ
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'print' ? 'bg-emerald-700 text-white' : 'text-slate-600'
            }`}
          >
            বাজার মেমো PDF
          </button>
        </div>
      </div>
    </header>
  );
};
