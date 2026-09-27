import { UnitType } from './meal';

export interface SpecialDishItem {
  id: string;
  name: string;
  amount: number;
  baseAmount: number; // Baseline amount for 120 servings
  unit: UnitType;
  unitPrice: number;
  note?: string;
}

export interface SpecialDish {
  id: 'payesh' | 'zorda';
  title: string;
  subtitle: string;
  description: string;
  servings: number;
  items: SpecialDishItem[];
}

export const INITIAL_PAYESH_ITEMS: SpecialDishItem[] = [
  {
    id: 'payesh-rice',
    name: 'পোলাও চাল (চিনিগুঁড়া সুগন্ধি)',
    amount: 6,
    baseAmount: 6,
    unit: 'কেজি',
    unitPrice: 145,
    note: 'জনপ্রতি ৫০ গ্রাম চাল বরাদ্দ',
  },
  {
    id: 'payesh-milk',
    name: 'খাঁটি তরল গরুর দুধ (ফুল ক্রিম)',
    amount: 30,
    baseAmount: 30,
    unit: 'লিটার',
    unitPrice: 90,
    note: 'প্রতি কেজি চালে ৫ লিটার খাঁটি দুধ',
  },
  {
    id: 'payesh-sugar',
    name: 'সাদা চিনি',
    amount: 7.5,
    baseAmount: 7.5,
    unit: 'কেজি',
    unitPrice: 135,
    note: 'মিষ্টির ঘনত্ব অনুযায়ী ১:১.২৫ অনুপাত',
  },
  {
    id: 'payesh-ghee',
    name: 'খাঁটি গাওয়া ঘি',
    amount: 0.5,
    baseAmount: 0.5,
    unit: 'কেজি',
    unitPrice: 1400,
    note: 'চাল ভাজা ও শাহী সুবাসের জন্য',
  },
  {
    id: 'payesh-kismis',
    name: 'ইরানি কিশমিশ',
    amount: 0.5,
    baseAmount: 0.5,
    unit: 'কেজি',
    unitPrice: 550,
    note: 'ধুয়ে ভিজিয়ে পরিবেশনে ব্যবহার',
  },
  {
    id: 'payesh-kaju',
    name: 'কাজুবাদাম ও পেস্তাবাদাম কুচি',
    amount: 0.6,
    baseAmount: 0.6,
    unit: 'কেজি',
    unitPrice: 1500,
    note: 'ঘিয়ে হালকা ভাজা কুচি',
  },
  {
    id: 'payesh-cardamom',
    name: 'সবুজ ছোট এলাচ',
    amount: 50,
    baseAmount: 50,
    unit: 'গ্রাম',
    unitPrice: 3800, // 3800/kg
    note: 'মুখ ফাঁটিয়ে দেওয়া এলাচ গুঁড়া/দানা',
  },
  {
    id: 'payesh-cinnamon',
    name: 'দারুচিনি ও তেজপাতা',
    amount: 50,
    baseAmount: 50,
    unit: 'গ্রাম',
    unitPrice: 600,
    note: 'ফোড়ন ও হালকা সুবাসের জন্য',
  },
  {
    id: 'payesh-condensed-milk',
    name: 'কনডেন্সড মিল্ক (ঐচ্ছিক শাহী স্বাদ)',
    amount: 3,
    baseAmount: 3,
    unit: 'টিন' as UnitType,
    unitPrice: 180,
    note: 'পায়েসের ক্রিমি টেক্সচার ও টেস্ট বাড়াতে',
  },
];

export const INITIAL_ZORDA_ITEMS: SpecialDishItem[] = [
  {
    id: 'zorda-rice',
    name: 'বাসমতি / প্রিমিয়াম সুগন্ধি পোলাও চাল',
    amount: 6,
    baseAmount: 6,
    unit: 'কেজি',
    unitPrice: 160,
    note: '৮০% সিদ্ধ করে পানি ঝরানো চাল (৫০ গ্রাম/জন)',
  },
  {
    id: 'zorda-sugar',
    name: 'সাদা চিনি',
    amount: 7,
    baseAmount: 7,
    unit: 'কেজি',
    unitPrice: 135,
    note: 'চালের চেয়ে সামান্য বেশি চিনি সিরা তৈরি',
  },
  {
    id: 'zorda-ghee',
    name: 'খাঁটি গাওয়া ঘি',
    amount: 1.5,
    baseAmount: 1.5,
    unit: 'কেজি',
    unitPrice: 1400,
    note: 'শাহী জর্দার প্রধান ফ্লেভার ও স্মুথনেস',
  },
  {
    id: 'zorda-baby-sweet',
    name: 'বেবি সুইট (ছোট লাল মিষ্টি)',
    amount: 3,
    baseAmount: 3,
    unit: 'কেজি',
    unitPrice: 350,
    note: 'জর্দার ওপরে ডেকোরেশন ও পরিবেশন',
  },
  {
    id: 'zorda-mowa',
    name: 'খাঁটি মাওয়া / গুঁড়া দুধ মাওয়া',
    amount: 1,
    baseAmount: 1,
    unit: 'কেজি',
    unitPrice: 450,
    note: 'দমে দেওয়ার সময় ওপরে ছিটিয়ে দেওয়া',
  },
  {
    id: 'zorda-morobba',
    name: 'চালকুমড়ার মোরব্বা কুচি (লাল-সবুজ)',
    amount: 1,
    baseAmount: 1,
    unit: 'কেজি',
    unitPrice: 300,
    note: 'ঐতিহ্যবাহী বিয়ের স্বাদের জন্য',
  },
  {
    id: 'zorda-nuts',
    name: 'কাজুবাদাম ও কাঠবাদাম কুচি',
    amount: 0.6,
    baseAmount: 0.6,
    unit: 'কেজি',
    unitPrice: 1300,
    note: 'ঘিয়ে ভাজা শাহী ড্রাই ফ্রুটস',
  },
  {
    id: 'zorda-kismis',
    name: 'কিশমিশ',
    amount: 0.4,
    baseAmount: 0.4,
    unit: 'কেজি',
    unitPrice: 550,
    note: 'ঘিয়ে ভেজে মেশানো',
  },
  {
    id: 'zorda-color',
    name: 'ফুড কালার (জাফরানি জর্দা রঙ)',
    amount: 2,
    baseAmount: 2,
    unit: 'কৌটা' as UnitType,
    unitPrice: 80,
    note: 'চাল সিদ্ধ করার পানিতে দেওয়া রঙ',
  },
  {
    id: 'zorda-orange-juice',
    name: 'মাল্টা / কমলার তাজা রস ও খোসা কুচি',
    amount: 1,
    baseAmount: 1,
    unit: 'কেজি',
    unitPrice: 220,
    note: 'রাজকীয় সাইট্রাস ফ্লেভারের জন্য',
  },
  {
    id: 'zorda-spices',
    name: 'ছোট এলাচ ও দারুচিনি',
    amount: 40,
    baseAmount: 40,
    unit: 'গ্রাম',
    unitPrice: 3200,
    note: 'ঘিয়ে ফোড়ন দেওয়ার জন্য',
  },
];
