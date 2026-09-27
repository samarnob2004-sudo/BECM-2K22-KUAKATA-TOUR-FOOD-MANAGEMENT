export type UnitType = 'কেজি' | 'গ্রাম' | 'লিটার' | 'পিস' | 'প্যাকেট' | 'তোলা' | 'হালি' | 'টাকা';

export type ItemCategory = 
  | 'snacks_bus'      // বাসের নাস্তা (কেক, জুস ইত্যাদি)
  | 'beef'            // গরুর মাংস
  | 'mutton'          // খাসির মাংস
  | 'protein'         // মুরগি, মাছ, ডিম, শুটকি, চিংড়ি
  | 'grains'          // চাল, ডাল, ময়দা
  | 'oils'            // সয়াবিন তেল, সরিষার তেল, ঘি, বাটার অয়েল
  | 'spices'          // মশলাপাতি, জিরা, হলুদ, মরিচ, গরম মশলা
  | 'vegetables'      // আলু, পেয়াজ, রসুন, আদা, শাকসবজি, ফলমূল
  | 'dairy_sweets'    // দুধ, চিনি, মিষ্টি ও বাদাম/ডেজার্ট
  | 'condiments';     // সস, সিরকা, সয়াসস, টকদই, সালাদ উপাদান

export interface CategoryInfo {
  id: ItemCategory;
  nameBn: string;
  nameEn: string;
  colorClass: string;
  borderClass: string;
}

export const CATEGORIES: Record<ItemCategory, CategoryInfo> = {
  snacks_bus: {
    id: 'snacks_bus',
    nameBn: 'বাসের নাস্তা ও ওয়েলকাম স্ন্যাক্স',
    nameEn: 'Bus Snacks & Welcome',
    colorClass: 'bg-teal-50 text-teal-900 border-teal-200',
    borderClass: 'border-teal-200',
  },
  beef: {
    id: 'beef',
    nameBn: 'গরুর মাংস',
    nameEn: 'Beef',
    colorClass: 'bg-red-50 text-red-900 border-red-200',
    borderClass: 'border-red-200',
  },
  mutton: {
    id: 'mutton',
    nameBn: 'খাসির মাংস',
    nameEn: 'Mutton',
    colorClass: 'bg-orange-50 text-orange-900 border-orange-200',
    borderClass: 'border-orange-200',
  },
  protein: {
    id: 'protein',
    nameBn: 'মুরগি, মাছ, ডিম ও চিংড়ি',
    nameEn: 'Poultry, Fish & Eggs',
    colorClass: 'bg-rose-50 text-rose-900 border-rose-200',
    borderClass: 'border-rose-200',
  },
  grains: {
    id: 'grains',
    nameBn: 'চাল, ডাল ও আটা/ময়দা',
    nameEn: 'Grains & Pulses',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-200',
    borderClass: 'border-amber-200',
  },
  oils: {
    id: 'oils',
    nameBn: 'তেল, ঘি ও বাটার',
    nameEn: 'Oils & Fats',
    colorClass: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    borderClass: 'border-yellow-200',
  },
  vegetables: {
    id: 'vegetables',
    nameBn: 'পেঁয়াজ, রসুন, আদা ও শাকসবজি',
    nameEn: 'Vegetables & Aromatics',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    borderClass: 'border-emerald-200',
  },
  spices: {
    id: 'spices',
    nameBn: 'মসলাপাতি ও শুকনা মশলা',
    nameEn: 'Spices & Seasonings',
    colorClass: 'bg-orange-50 text-orange-900 border-orange-200',
    borderClass: 'border-orange-200',
  },
  dairy_sweets: {
    id: 'dairy_sweets',
    nameBn: 'দুধ, চিনি, মিষ্টি ও বাদাম/ডেজার্ট',
    nameEn: 'Dairy, Sweets & Nuts',
    colorClass: 'bg-purple-50 text-purple-900 border-purple-200',
    borderClass: 'border-purple-200',
  },
  condiments: {
    id: 'condiments',
    nameBn: 'সস, ভিনেগার, টকদই ও সালাদ',
    nameEn: 'Sauces, Curd & Salad',
    colorClass: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    borderClass: 'border-cyan-200',
  },
};

export interface MealItem {
  id: string;
  name: string;
  canonicalKey: string; // Used to aggregate identical items across meals
  category: ItemCategory;
  amount: number;
  baseAmount?: number; // Baseline amount at 120 participants for dynamic proportional scaling
  unit: UnitType;
  unitPrice: number; // Price per unit (e.g. rate per kg, per piece, per packet)
  customFixedPrice?: number; // For lump-sum items like '৩০০ টাকার গরম মশলা'
  note?: string; // e.g. "কেজিতে ১৪ পিস, জনপ্রতি ৩ পিস"
  isAutoScaled?: boolean; // Marker if this item auto-scales with student count
}

export interface Meal {
  id: string;
  title: string;
  day: 1 | 2;
  timeSlot: 'যাত্রা' | 'সকাল' | 'দুপুর' | 'রাত';
  description: string;
  menuSummary?: string; // e.g. "খিচুড়ি, আমড়ার চাটনি, ডিমের কোরমা, লেবু"
  items: MealItem[];
}

export interface AggregatedMasterItem {
  canonicalKey: string;
  displayName: string;
  category: ItemCategory;
  totalQuantity: number;
  unit: UnitType;
  secondaryAmountText?: string; // e.g. "৫ কেজি ৪০০ গ্রাম"
  unitPrice: number;
  totalCost: number;
  occurrences: {
    mealId: string;
    mealTitle: string;
    amount: number;
    unit: UnitType;
    note?: string;
  }[];
  manualPriceOverride?: number;
}
