export type UnitType = 'কেজি' | 'গ্রাম' | 'লিটার' | 'পিস' | 'প্যাকেট' | 'তোলা' | 'হালি' | 'টাকা';

export type ItemCategory = 
  | 'grains'          // চাল/দানা জাতীয়
  | 'protein'         // আমিষ
  | 'vegetables'      // সবজি
  | 'fruits'          // ফল
  | 'spices'          // মশলা
  | 'oils'            // তেল/ঘি
  | 'dairy_sweets'    // দুধ/বাদাম/মিষ্টি
  | 'sauces_liquids'  // সস/তরল
  | 'beef'
  | 'mutton'
  | 'snacks_bus'
  | 'condiments';

export interface CategoryInfo {
  id: ItemCategory;
  nameBn: string;
  nameEn: string;
  colorClass: string;
  borderClass: string;
}

// 8 Official Rate List & App Categories requested by User
export const ORDERED_CATEGORY_KEYS: ItemCategory[] = [
  'grains',
  'protein',
  'vegetables',
  'fruits',
  'spices',
  'oils',
  'dairy_sweets',
  'sauces_liquids',
];

export function normalizeCategory(cat: string): ItemCategory {
  if (cat === 'beef' || cat === 'mutton') return 'protein';
  if (cat === 'condiments' || cat === 'snacks_bus') return 'sauces_liquids';
  if (ORDERED_CATEGORY_KEYS.includes(cat as ItemCategory)) {
    return cat as ItemCategory;
  }
  return 'spices';
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  grains: {
    id: 'grains',
    nameBn: 'চাল/দানা জাতীয়',
    nameEn: 'Grains & Pulses',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-200',
    borderClass: 'border-amber-200',
  },
  protein: {
    id: 'protein',
    nameBn: 'আমিষ',
    nameEn: 'Protein',
    colorClass: 'bg-rose-50 text-rose-900 border-rose-200',
    borderClass: 'border-rose-200',
  },
  vegetables: {
    id: 'vegetables',
    nameBn: 'সবজি',
    nameEn: 'Vegetables',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    borderClass: 'border-emerald-200',
  },
  fruits: {
    id: 'fruits',
    nameBn: 'ফল',
    nameEn: 'Fruits',
    colorClass: 'bg-lime-50 text-lime-900 border-lime-200',
    borderClass: 'border-lime-200',
  },
  spices: {
    id: 'spices',
    nameBn: 'মশলা',
    nameEn: 'Spices',
    colorClass: 'bg-orange-50 text-orange-900 border-orange-200',
    borderClass: 'border-orange-200',
  },
  oils: {
    id: 'oils',
    nameBn: 'তেল/ঘি',
    nameEn: 'Oils & Ghee',
    colorClass: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    borderClass: 'border-yellow-200',
  },
  dairy_sweets: {
    id: 'dairy_sweets',
    nameBn: 'দুধ/বাদাম/মিষ্টি',
    nameEn: 'Dairy, Nuts & Sweets',
    colorClass: 'bg-purple-50 text-purple-900 border-purple-200',
    borderClass: 'border-purple-200',
  },
  sauces_liquids: {
    id: 'sauces_liquids',
    nameBn: 'সস/তরল',
    nameEn: 'Sauces & Liquids',
    colorClass: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    borderClass: 'border-cyan-200',
  },
};

export function getCategoryForCommodity(name: string, fallback?: ItemCategory): ItemCategory {
  const n = name.trim();
  // 1. চাল/দানা জাতীয়
  if (n.includes('চাল') || n.includes('ডাল') || n.includes('ময়দা') || n.includes('আটা') || n.includes('সুজি')) {
    return 'grains';
  }
  // 2. আমিষ
  if (n.includes('মাছ') || n.includes('মাংস') || n.includes('মুরগি') || n.includes('চিকেন') || 
      n.includes('গরু') || n.includes('খাসি') || n.includes('ডিম') || n.includes('চিংড়ি') || n.includes('শুটকি')) {
    return 'protein';
  }
  // 3. ফল
  if (n.includes('লেবু') || n.includes('আমড়া') || n.includes('আপেল') || n.includes('নাশপাতি') || 
      n.includes('আঙ্গুর') || n.includes('আনারস') || n.includes('কমলা')) {
    return 'fruits';
  }
  // 4. তেল/ঘি
  if (n.includes('তেল') || n.includes('ঘি') || n.includes('বাটার')) {
    return 'oils';
  }
  // 5. সস/তরল
  if (n.includes('সস') || n.includes('সিরকা') || n.includes('ভিনেগার') || n.includes('দই') || 
      n.includes('জুস') || n.includes('কোক') || n.includes('পানি')) {
    return 'sauces_liquids';
  }
  // 6. দুধ/বাদাম/মিষ্টি
  if (n.includes('দুধ') || n.includes('চিনি') || n.includes('মিষ্টি') || n.includes('বাদাম') || 
      n.includes('কিসমিস') || n.includes('মোরব্বা') || n.includes('বোখারা') || n.includes('ক্ষীর') || 
      n.includes('কেক') || n.includes('বিস্কুট')) {
    return 'dairy_sweets';
  }
  // 7. সবজি
  if (n.includes('আলু') || n.includes('পেঁয়াজ') || n.includes('রসুন') || n.includes('আদা') || 
      (n.includes('মরিচ') && n.includes('কাঁচা')) || n.includes('বেগুন') || n.includes('লাউ') || 
      n.includes('পেঁপে') || n.includes('গাজর') || n.includes('কুমড়া') || n.includes('কলা') || 
      n.includes('শিম') || n.includes('চিচিঙ্গা') || n.includes('ক্যাপসিকাম') || n.includes('টমেটো') || 
      n.includes('শসা') || n.includes('পাতা')) {
    return 'vegetables';
  }
  // 8. মশলা
  if (n.includes('জিরা') || n.includes('হলুদ') || n.includes('মরিচ') || n.includes('লবণ') || 
      n.includes('সল্ট') || n.includes('দারুচিনি') || n.includes('এলাচ') || n.includes('লবঙ্গ') || 
      n.includes('মশলা') || n.includes('তেজপাতা') || n.includes('সরিষা') || n.includes('সেন্ট') || 
      n.includes('কালার') || n.includes('জয়ত্রী') || n.includes('জয়ফল') || n.includes('ধনিয়া') || 
      n.includes('মৌরি') || n.includes('রাধুনি') || (n.includes('চিনি') && n.includes('কাবাব'))) {
    return 'spices';
  }
  return fallback || 'spices';
}

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
