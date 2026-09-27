import { Meal, MealItem, UnitType } from '../types/meal';

export const BASE_STUDENT_COUNT = 120;

/**
 * Baseline definition of all 6 meals + bus snacks designed for exactly 120 participants.
 * Each item has a baseAmount defined.
 */
const BASELINE_TOUR_MEALS: Meal[] = [
  {
    id: 'day1-bus',
    title: 'বাসের নাস্তা (যাত্রার শুরুতে)',
    day: 1,
    timeSlot: 'যাত্রা',
    description: 'কুয়াকাটার উদ্দেশ্যে রওনা হওয়ার শুরুতে বাসে পরিবেশন করা হবে',
    menuSummary: 'মাফিন কেক, জুস',
    items: [
      {
        id: 'bus-1',
        name: 'মাফিন কেক',
        canonicalKey: 'muffin_cake',
        category: 'snacks_bus',
        baseAmount: 120,
        amount: 120,
        unit: 'পিস',
        unitPrice: 10,
        note: 'জনপ্রতি ১ পিস (১২০ জনের জন্য)',
        isAutoScaled: true,
      },
      {
        id: 'bus-2',
        name: 'জুস (প্যাক)',
        canonicalKey: 'juice_pack',
        category: 'snacks_bus',
        baseAmount: 120,
        amount: 120,
        unit: 'পিস',
        unitPrice: 10,
        note: 'জনপ্রতি ১ পিস (১২০ জনের জন্য)',
        isAutoScaled: true,
      },
    ],
  },
  {
    id: 'day1-breakfast',
    title: '১ম দিন সকাল',
    day: 1,
    timeSlot: 'সকাল',
    description: 'খিচুড়ি, আমড়ার চাটনি, ডিমের কোরমা ও লেবু',
    menuSummary: 'খিচুড়ি, আমড়ার চাটনি, ডিমের কোরমা, লেবু',
    items: [
      { id: 'd1b-1', name: 'পোলাও চাল', canonicalKey: 'polao_rice', category: 'grains', baseAmount: 16, amount: 16, unit: 'কেজি', unitPrice: 140 },
      { id: 'd1b-2', name: 'আমড়া (চাটনির জন্য)', canonicalKey: 'amra', category: 'vegetables', baseAmount: 8, amount: 8, unit: 'কেজি', unitPrice: 60 },
      { id: 'd1b-3a', name: 'মসুর ডাল', canonicalKey: 'lentil_mosur', category: 'grains', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 135 },
      { id: 'd1b-3b', name: 'মুগ ডাল', canonicalKey: 'lentil_mug', category: 'grains', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 160 },
      { id: 'd1b-4', name: 'পেঁয়াজ', canonicalKey: 'onion', category: 'vegetables', baseAmount: 12, amount: 12, unit: 'কেজি', unitPrice: 75 },
      { id: 'd1b-5', name: 'ডিম (কোরমা)', canonicalKey: 'egg', category: 'protein', baseAmount: 125, amount: 125, unit: 'পিস', unitPrice: 12, note: 'জনপ্রতি ১ পিস (১২০ জন + ৫ অতিরিক্ত)', isAutoScaled: true },
      { id: 'd1b-6', name: 'রসুন', canonicalKey: 'garlic', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 220 },
      { id: 'd1b-7', name: 'জিরা', canonicalKey: 'cumin', category: 'spices', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 900 },
      { id: 'd1b-8', name: 'আদা', canonicalKey: 'ginger', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 240 },
      { id: 'd1b-9', name: 'হলুদ গুড়া', canonicalKey: 'turmeric', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 320 },
      { id: 'd1b-10', name: 'শুকনা মরিচ গুড়া', canonicalKey: 'dry_chilli_powder', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 420 },
      { id: 'd1b-11', name: 'কাঁচা মরিচ', canonicalKey: 'green_chilli', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 120 },
      { id: 'd1b-12', name: 'আলু', canonicalKey: 'potato', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 35 },
      { id: 'd1b-13', name: 'কিসমিস (ছোট)', canonicalKey: 'raisin', category: 'dairy_sweets', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 550 },
      { id: 'd1b-14', name: 'ঘি', canonicalKey: 'ghee', category: 'oils', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 1400 },
      { id: 'd1b-15', name: 'চিনি', canonicalKey: 'sugar', category: 'dairy_sweets', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 130 },
      { id: 'd1b-16', name: 'গুড়া দুধ (ডিপ্লোমা)', canonicalKey: 'powder_milk', category: 'dairy_sweets', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 880 },
      { id: 'd1b-17', name: 'লবণ', canonicalKey: 'salt', category: 'spices', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 40 },
      { id: 'd1b-18', name: 'চিনা বাদাম', canonicalKey: 'peanuts', category: 'dairy_sweets', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 200 },
      { id: 'd1b-19', name: 'টমেটো সস', canonicalKey: 'tomato_sauce', category: 'condiments', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 180 },
      { id: 'd1b-20', name: 'গরম মশলা (মিক্স)', canonicalKey: 'garam_masala_lump', category: 'spices', baseAmount: 1, amount: 1, unit: 'টাকা', unitPrice: 300, customFixedPrice: 300, note: 'দাড়চিনি, এলাচ, লবঙ্গ, গোলমরিচ, জয়ত্রি' },
      { id: 'd1b-21', name: 'আস্ত শুকনা মরিচ', canonicalKey: 'dry_chilli_whole', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 450 },
      { id: 'd1b-22', name: 'সরিষার তেল', canonicalKey: 'mustard_oil', category: 'oils', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 280 },
      { id: 'd1b-23', name: 'সয়াবিন তেল', canonicalKey: 'soybean_oil', category: 'oils', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 185 },
      { id: 'd1b-24', name: 'লেবু', canonicalKey: 'lemon', category: 'vegetables', baseAmount: 120, amount: 120, unit: 'পিস', unitPrice: 5, note: 'জনপ্রতি ১ পিস (১২০ পিস)', isAutoScaled: true },
    ],
  },
  {
    id: 'day1-lunch',
    title: '১ম দিন দুপুর',
    day: 1,
    timeSlot: 'দুপুর',
    description: 'চিকেন ঝাল ফ্রাই, সাদা ভাত, রূপচাঁদা ফ্রাই / রুই মাছ, ডাল, পায়েস',
    menuSummary: 'চিকেন ঝাল ফ্রাই, সাদা ভাত, রূপচাদা ফ্রাই ,ডাল , পায়েশ',
    items: [
      { id: 'd1l-1', name: 'সাদা চাল (ভাত)', canonicalKey: 'rice_white', category: 'grains', baseAmount: 20, amount: 20, unit: 'কেজি', unitPrice: 65 },
      { id: 'd1l-2a', name: 'মসুর ডাল', canonicalKey: 'lentil_mosur', category: 'grains', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 135 },
      { id: 'd1l-2b', name: 'মুগ ডাল', canonicalKey: 'lentil_mug', category: 'grains', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 160 },
      { id: 'd1l-3', name: 'পেঁয়াজ', canonicalKey: 'onion', category: 'vegetables', baseAmount: 12, amount: 12, unit: 'কেজি', unitPrice: 75 },
      { id: 'd1l-4', name: 'রসুন', canonicalKey: 'garlic', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 220 },
      { id: 'd1l-5', name: 'আদা', canonicalKey: 'ginger', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 240 },
      { id: 'd1l-6', name: 'জিরা', canonicalKey: 'cumin', category: 'spices', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 900 },
      { id: 'd1l-7', name: 'হলুদ গুড়া', canonicalKey: 'turmeric', category: 'spices', baseAmount: 50, amount: 50, unit: 'গ্রাম', unitPrice: 320 },
      { id: 'd1l-8', name: 'গুড়া মরিচ', canonicalKey: 'dry_chilli_powder', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 420 },
      { id: 'd1l-9', name: 'আস্ত শুকনা মরিচ', canonicalKey: 'dry_chilli_whole', category: 'spices', baseAmount: 50, amount: 50, unit: 'গ্রাম', unitPrice: 450 },
      { id: 'd1l-10', name: 'কাঁচা মরিচ', canonicalKey: 'green_chilli', category: 'vegetables', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 120 },
      { id: 'd1l-11', name: 'চিনা বাদাম', canonicalKey: 'peanuts', category: 'dairy_sweets', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 200 },
      { id: 'd1l-12', name: 'মাছের মশলা', canonicalKey: 'fish_masala', category: 'spices', baseAmount: 2, amount: 2, unit: 'প্যাকেট', unitPrice: 65, note: '২ প্যাকেট' },
      { id: 'd1l-13', name: 'সয়া সস', canonicalKey: 'soy_sauce', category: 'condiments', baseAmount: 1, amount: 1, unit: 'লিটার', unitPrice: 220 },
      { id: 'd1l-14', name: 'সয়াবিন তেল', canonicalKey: 'soybean_oil', category: 'oils', baseAmount: 10, amount: 10, unit: 'কেজি', unitPrice: 185 },
      { id: 'd1l-15', name: 'টমেটো সস', canonicalKey: 'tomato_sauce', category: 'condiments', baseAmount: 2.5, amount: 2.5, unit: 'লিটার', unitPrice: 180 },
      { id: 'd1l-16', name: 'টক দই', canonicalKey: 'curd', category: 'condiments', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 140 },
      {
        id: 'd1l-17',
        name: 'মুরগি (চিকেন ঝাল ফ্রাই)',
        canonicalKey: 'chicken',
        category: 'protein',
        baseAmount: 25.7,
        amount: 25.7,
        unit: 'কেজি',
        unitPrice: 210,
        note: 'কেজিতে ১৪ পিস, জনপ্রতি ৩ পিস (১২০ জন = ৩৬০ পিস)',
        isAutoScaled: true,
      },
      {
        id: 'd1l-18',
        name: 'রূপচাঁদা / রুই মাছ (ফ্রাই)',
        canonicalKey: 'fish_fry',
        category: 'protein',
        baseAmount: 15,
        amount: 15,
        unit: 'কেজি',
        unitPrice: 380,
        note: 'কেজিতে ৮ পিস কাটা, জনপ্রতি ১ পিস (১২০ পিস)',
        isAutoScaled: true,
      },
      // Payesh Items
      { id: 'd1l-p1', name: 'চিনিগুড়া চাল (পায়েস)', canonicalKey: 'chinigura_rice', category: 'grains', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 150 },
      { id: 'd1l-p2', name: 'গুড়া দুধ (ডিপ্লোমা)', canonicalKey: 'powder_milk', category: 'dairy_sweets', baseAmount: 5, amount: 5, unit: 'কেজি', unitPrice: 880 },
      { id: 'd1l-p3', name: 'কিসমিস', canonicalKey: 'raisin', category: 'dairy_sweets', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 550 },
      { id: 'd1l-p4', name: 'চিনা বাদাম', canonicalKey: 'peanuts', category: 'dairy_sweets', baseAmount: 400, amount: 400, unit: 'গ্রাম', unitPrice: 200 },
      { id: 'd1l-p5', name: 'কাজু বাদাম', canonicalKey: 'cashew_nuts', category: 'dairy_sweets', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 1300 },
      { id: 'd1l-p6', name: 'ক্ষীর মিক্স', canonicalKey: 'kheer_mix', category: 'dairy_sweets', baseAmount: 4, amount: 4, unit: 'প্যাকেট', unitPrice: 80, note: '৪ প্যাকেট' },
      { id: 'd1l-p7', name: 'জাফরান সেন্ট', canonicalKey: 'zafran_scent', category: 'spices', baseAmount: 2, amount: 2, unit: 'তোলা', unitPrice: 150, note: '২ তোলা' },
      { id: 'd1l-p8', name: 'চিনি', canonicalKey: 'sugar', category: 'dairy_sweets', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 130 },
    ],
  },
  {
    id: 'day1-dinner',
    title: '১ম দিন রাত',
    day: 1,
    timeSlot: 'রাত',
    description: 'গরু/খাসি, সাদা ভাত, সালাদ, মিক্সড সবজি, ঘন ডাল, লেবু',
    menuSummary: 'গরু/খাসি, সাদা ভাত, সালাদ, মিক্সড সবজি, ঘন ডাল, লেবু',
    items: [
      {
        id: 'd1d-1a',
        name: 'গরুর মাংস',
        canonicalKey: 'beef',
        category: 'beef',
        baseAmount: 12.8,
        amount: 12.8,
        unit: 'কেজি',
        unitPrice: 750,
        note: 'জনপ্রতি ১২৫ গ্রাম হিসেবে ৮৫% অংশ (১২.৮ কেজি)',
        isAutoScaled: true,
      },
      {
        id: 'd1d-1b',
        name: 'খাসির মাংস',
        canonicalKey: 'mutton',
        category: 'mutton',
        baseAmount: 2.3,
        amount: 2.3,
        unit: 'কেজি',
        unitPrice: 1100,
        note: 'জনপ্রতি ১২৫ গ্রাম হিসেবে ১৫% অংশ (২.৩ কেজি)',
        isAutoScaled: true,
      },
      { id: 'd1d-2', name: 'সাদা চাল (ভাত)', canonicalKey: 'rice_white', category: 'grains', baseAmount: 18, amount: 18, unit: 'কেজি', unitPrice: 65 },
      { id: 'd1d-3', name: 'মুগ ডাল (ঘন ডাল)', canonicalKey: 'lentil_mug', category: 'grains', baseAmount: 5, amount: 5, unit: 'কেজি', unitPrice: 160 },
      { id: 'd1d-4', name: 'আলু', canonicalKey: 'potato', category: 'vegetables', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 35 },
      { id: 'd1d-5', name: 'লাউ', canonicalKey: 'bottle_gourd', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 50, note: '২ টা (প্রতিটি ২ কেজি)' },
      { id: 'd1d-6', name: 'পেঁপে (মিক্সড সবজি)', canonicalKey: 'papaya', category: 'vegetables', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 40 },
      { id: 'd1d-7', name: 'গাজর', canonicalKey: 'carrot', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 80 },
      { id: 'd1d-8', name: 'মিষ্টি কুমড়া', canonicalKey: 'sweet_pumpkin', category: 'vegetables', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 40 },
      { id: 'd1d-9', name: 'কাঁচকলা', canonicalKey: 'green_banana', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'পিস', unitPrice: 10, note: '১ হালি' },
      { id: 'd1d-10', name: 'শিম', canonicalKey: 'beans', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 60 },
      { id: 'd1d-11', name: 'সয়াবিন তেল', canonicalKey: 'soybean_oil', category: 'oils', baseAmount: 8, amount: 8, unit: 'কেজি', unitPrice: 185 },
      { id: 'd1d-12', name: 'পেঁয়াজ', canonicalKey: 'onion', category: 'vegetables', baseAmount: 7, amount: 7, unit: 'কেজি', unitPrice: 75 },
      { id: 'd1d-13', name: 'রসুন', canonicalKey: 'garlic', category: 'vegetables', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 220 },
      { id: 'd1d-14', name: 'আদা', canonicalKey: 'ginger', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 240 },
      { id: 'd1d-15', name: 'জিরা', canonicalKey: 'cumin', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 900 },
      { id: 'd1d-16', name: 'হলুদ গুড়া', canonicalKey: 'turmeric', category: 'spices', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 320 },
      { id: 'd1d-17', name: 'শুকনা গুড়া মরিচ', canonicalKey: 'dry_chilli_powder', category: 'spices', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 420 },
      { id: 'd1d-18', name: 'কাঁচা মরিচ', canonicalKey: 'green_chilli', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 120 },
      { id: 'd1d-19', name: 'চিনা বাদাম', canonicalKey: 'peanuts', category: 'dairy_sweets', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 200 },
      { id: 'd1d-20', name: 'টক দই', canonicalKey: 'curd', category: 'condiments', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 140 },
      { id: 'd1d-21', name: 'শসা (সালাদ)', canonicalKey: 'cucumber', category: 'vegetables', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 50 },
      { id: 'd1d-22', name: 'লেবু', canonicalKey: 'lemon', category: 'vegetables', baseAmount: 120, amount: 120, unit: 'পিস', unitPrice: 5, note: 'জনপ্রতি ১ পিস (১২০ পিস)', isAutoScaled: true },
    ],
  },
  {
    id: 'day2-breakfast',
    title: '২য় দিন সকাল',
    day: 2,
    timeSlot: 'সকাল',
    description: 'সাদা ভাত, আলু-ডিম ভর্তা, বেগুন ভাজি, চিংড়ি-শুটকি ভর্তা, ডাল',
    menuSummary: 'সাদা ভাত, আলু-ডিম ভর্তা, বেগুন ভাজি, চিংড়ি-শুটকি ভর্তা, ডাল',
    items: [
      { id: 'd2b-1', name: 'সাদা চাল (ভাত)', canonicalKey: 'rice_white', category: 'grains', baseAmount: 16, amount: 16, unit: 'কেজি', unitPrice: 65 },
      { id: 'd2b-2', name: 'আলু (আলু ভর্তা)', canonicalKey: 'potato', category: 'vegetables', baseAmount: 12, amount: 12, unit: 'কেজি', unitPrice: 35 },
      { id: 'd2b-3', name: 'বেগুন (বেগুন ভাজি)', canonicalKey: 'eggplant', category: 'vegetables', baseAmount: 9, amount: 9, unit: 'কেজি', unitPrice: 60 },
      { id: 'd2b-4', name: 'চিংড়ি শুটকি (ভর্তা)', canonicalKey: 'shrimp_dried', category: 'protein', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 950 },
      { id: 'd2b-5a', name: 'মসুর ডাল', canonicalKey: 'lentil_mosur', category: 'grains', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 135 },
      { id: 'd2b-5b', name: 'মুগ ডাল', canonicalKey: 'lentil_mug', category: 'grains', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 160 },
      { id: 'd2b-6', name: 'পেঁয়াজ', canonicalKey: 'onion', category: 'vegetables', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 75 },
      { id: 'd2b-7', name: 'ডিম (ডিম ভর্তা)', canonicalKey: 'egg', category: 'protein', baseAmount: 30, amount: 30, unit: 'পিস', unitPrice: 12, note: 'ডিম ভর্তার জন্য (৩০ টি ডিম)', isAutoScaled: true },
      { id: 'd2b-8', name: 'শুকনা মরিচ (ভাজা)', canonicalKey: 'dry_chilli_whole', category: 'spices', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 450 },
      { id: 'd2b-9', name: 'রসুন', canonicalKey: 'garlic', category: 'vegetables', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 220 },
      { id: 'd2b-10', name: 'জিরা', canonicalKey: 'cumin', category: 'spices', baseAmount: 30, amount: 30, unit: 'গ্রাম', unitPrice: 900 },
      { id: 'd2b-11', name: 'সয়াবিন তেল', canonicalKey: 'soybean_oil', category: 'oils', baseAmount: 3.5, amount: 3.5, unit: 'কেজি', unitPrice: 185 },
      { id: 'd2b-12', name: 'কাঁচা মরিচ', canonicalKey: 'green_chilli', category: 'vegetables', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 120 },
      { id: 'd2b-13', name: 'সরিষা তেল (ভর্তা)', canonicalKey: 'mustard_oil', category: 'oils', baseAmount: 1.8, amount: 1.8, unit: 'কেজি', unitPrice: 280 },
    ],
  },
  {
    id: 'day2-lunch',
    title: '২য় দিন দুপুর',
    day: 2,
    timeSlot: 'দুপুর',
    description: 'মুড়িঘন্ট মাছের মাথা দিয়ে, রুই মাছ ভুনা, ভাত, মিক্সড সবজি, সালাদ',
    menuSummary: 'মুড়িঘন্ট মাছের মাথা দিয়ে, রুই মাছ ভুনা, ভাত, মিক্সড সবজি, সালাদ',
    items: [
      { id: 'd2l-1', name: 'সাদা চাল (ভাত)', canonicalKey: 'rice_white', category: 'grains', baseAmount: 18, amount: 18, unit: 'কেজি', unitPrice: 65 },
      { id: 'd2l-2', name: 'মুগ ডাল (মুড়িঘন্ট)', canonicalKey: 'lentil_mug', category: 'grains', baseAmount: 5, amount: 5, unit: 'কেজি', unitPrice: 160 },
      {
        id: 'd2l-3',
        name: 'রুই মাছ (ভুনা ও মুড়িঘন্ট)',
        canonicalKey: 'rui_fish',
        category: 'protein',
        baseAmount: 15,
        amount: 15,
        unit: 'কেজি',
        unitPrice: 350,
        note: 'কেজিতে ৮ পিস কাটা, জনপ্রতি ১ পিস (১২০ পিস) + মাথা দিয়ে মুড়িঘন্ট',
        isAutoScaled: true,
      },
      { id: 'd2l-4a', name: 'আলু', canonicalKey: 'potato', category: 'vegetables', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 35 },
      { id: 'd2l-4b', name: 'লাউ', canonicalKey: 'bottle_gourd', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 50, note: '২ পিস (মোট ৪ কেজি)' },
      { id: 'd2l-4c', name: 'পেঁপে (মিক্সড সবজি)', canonicalKey: 'papaya', category: 'vegetables', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 40 },
      { id: 'd2l-4d', name: 'গাজর', canonicalKey: 'carrot', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 80 },
      { id: 'd2l-4e', name: 'মিষ্টি কুমড়া', canonicalKey: 'sweet_pumpkin', category: 'vegetables', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 40 },
      { id: 'd2l-4f', name: 'কাঁচকলা', canonicalKey: 'green_banana', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'পিস', unitPrice: 10, note: '১ হালি' },
      { id: 'd2l-4g', name: 'শিম', canonicalKey: 'beans', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 60 },
      { id: 'd2l-5', name: 'সয়াবিন তেল', canonicalKey: 'soybean_oil', category: 'oils', baseAmount: 9, amount: 9, unit: 'কেজি', unitPrice: 185 },
      { id: 'd2l-6', name: 'পেঁয়াজ', canonicalKey: 'onion', category: 'vegetables', baseAmount: 8, amount: 8, unit: 'কেজি', unitPrice: 75 },
      { id: 'd2l-7', name: 'রসুন', canonicalKey: 'garlic', category: 'vegetables', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 220 },
      { id: 'd2l-8', name: 'আদা', canonicalKey: 'ginger', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 240 },
      { id: 'd2l-9', name: 'জিরা', canonicalKey: 'cumin', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 900 },
      { id: 'd2l-10', name: 'চিনা বাদাম', canonicalKey: 'peanuts', category: 'dairy_sweets', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 200 },
      { id: 'd2l-11', name: 'সাদা সরিষা', canonicalKey: 'white_mustard', category: 'spices', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 180 },
      { id: 'd2l-12', name: 'কাঁচা মরিচ', canonicalKey: 'green_chilli', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 120 },
      { id: 'd2l-13', name: 'শুকনা মরিচ গুড়া', canonicalKey: 'dry_chilli_powder', category: 'spices', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 420 },
      { id: 'd2l-14', name: 'হলুদ গুড়া', canonicalKey: 'turmeric', category: 'spices', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 320 },
      { id: 'd2l-15', name: 'টমেটো সস', canonicalKey: 'tomato_sauce', category: 'condiments', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 180 },
      { id: 'd2l-16', name: 'গুড়া দুধ', canonicalKey: 'powder_milk', category: 'dairy_sweets', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 880 },
      { id: 'd2l-17', name: 'মাছের মশলা', canonicalKey: 'fish_masala', category: 'spices', baseAmount: 2, amount: 2, unit: 'প্যাকেট', unitPrice: 65, note: '২ প্যাকেট' },
      { id: 'd2l-18', name: 'টমেটো (সালাদ ও তরকারি)', canonicalKey: 'tomato', category: 'vegetables', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 50 },
      { id: 'd2l-19', name: 'শসা (সালাদ)', canonicalKey: 'cucumber', category: 'vegetables', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 50 },
    ],
  },
  {
    id: 'day2-dinner',
    title: '২য় দিন রাত',
    day: 2,
    timeSlot: 'রাত',
    description: 'পোলাও, চাইনিজ ভেজিটেবল, মাঝারি চিংড়ি ভুনা, টিকিয়া, রোস্ট, গরু/খাসি, রাইতা সালাদ, জর্দা-মিষ্টি, কোক',
    menuSummary: 'পোলাও, চাইনিজ ভেজিটেবল, মাঝারি চিংড়ি ভুনা, টিকিয়া, রোস্ট, গরু/খাসি, রাইতা সালাদ, জর্দা-মিষ্টি, কোক',
    items: [
      { id: 'd2d-1', name: 'পোলাও চাল', canonicalKey: 'polao_rice', category: 'grains', baseAmount: 23, amount: 23, unit: 'কেজি', unitPrice: 140 },
      { id: 'd2d-2', name: 'সয়াবিন তেল', canonicalKey: 'soybean_oil', category: 'oils', baseAmount: 20, amount: 20, unit: 'কেজি', unitPrice: 185 },
      { id: 'd2d-3', name: 'বাটার অয়েল', canonicalKey: 'butter_oil', category: 'oils', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 850 },
      { id: 'd2d-4', name: 'ঘি', canonicalKey: 'ghee', category: 'oils', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 1400 },
      { id: 'd2d-5', name: 'পেঁপে (চাইনিজ ভেজিটেবল)', canonicalKey: 'papaya', category: 'vegetables', baseAmount: 10, amount: 10, unit: 'কেজি', unitPrice: 40 },
      { id: 'd2d-6', name: 'গাজর (চাইনিজ ভেজিটেবল)', canonicalKey: 'carrot', category: 'vegetables', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 80 },
      { id: 'd2d-7', name: 'আলু', canonicalKey: 'potato', category: 'vegetables', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 35 },
      { id: 'd2d-8', name: 'শিম', canonicalKey: 'beans', category: 'vegetables', baseAmount: 800, amount: 800, unit: 'গ্রাম', unitPrice: 60 },
      { id: 'd2d-9', name: 'চিচিঙ্গা', canonicalKey: 'snake_gourd', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 50 },
      { id: 'd2d-10', name: 'মুরগি (রোস্ট ও টিকিয়া)', canonicalKey: 'chicken', category: 'protein', baseAmount: 34, amount: 34, unit: 'কেজি', unitPrice: 210, note: 'রোস্ট ও টিকিয়ার মাংস' },
      {
        id: 'd2d-11a',
        name: 'গরুর মাংস',
        canonicalKey: 'beef',
        category: 'beef',
        baseAmount: 12.8,
        amount: 12.8,
        unit: 'কেজি',
        unitPrice: 750,
        note: 'জনপ্রতি ১২৫ গ্রাম হিসেবে ৮৫% অংশ (১২.৮ কেজি)',
        isAutoScaled: true,
      },
      {
        id: 'd2d-11b',
        name: 'খাসির মাংস',
        canonicalKey: 'mutton',
        category: 'mutton',
        baseAmount: 2.3,
        amount: 2.3,
        unit: 'কেজি',
        unitPrice: 1100,
        note: 'জনপ্রতি ১২৫ গ্রাম হিসেবে ১৫% অংশ (২.৩ কেজি)',
        isAutoScaled: true,
      },
      { id: 'd2d-12', name: 'মাঝারি চিংড়ি (চিংড়ি ভুনা)', canonicalKey: 'shrimp_small', category: 'protein', baseAmount: 7, amount: 7, unit: 'কেজি', unitPrice: 650 },
      { id: 'd2d-13', name: 'ACI ফুড কালার (জর্দা)', canonicalKey: 'aci_color', category: 'spices', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 70 },
      { id: 'd2d-14', name: 'পাকিস্তানি বাসমতি চাল (জর্দা)', canonicalKey: 'basmati_rice', category: 'grains', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 260 },
      { id: 'd2d-15', name: 'অরেঞ্জ সেন্ট (১ নাম্বার)', canonicalKey: 'orange_scent', category: 'spices', baseAmount: 50, amount: 50, unit: 'গ্রাম', unitPrice: 120 },
      { id: 'd2d-16', name: 'চিনি', canonicalKey: 'sugar', category: 'dairy_sweets', baseAmount: 6, amount: 6, unit: 'কেজি', unitPrice: 130 },
      { id: 'd2d-17', name: 'কিসমিস', canonicalKey: 'raisin', category: 'dairy_sweets', baseAmount: 500, amount: 500, unit: 'গ্রাম', unitPrice: 550 },
      { id: 'd2d-18', name: 'কাজু বাদাম', canonicalKey: 'cashew_nuts', category: 'dairy_sweets', baseAmount: 400, amount: 400, unit: 'গ্রাম', unitPrice: 1300 },
      { id: 'd2d-19', name: 'পেস্তা বাদাম', canonicalKey: 'pistachio', category: 'dairy_sweets', baseAmount: 300, amount: 300, unit: 'গ্রাম', unitPrice: 2200 },
      { id: 'd2d-20', name: 'আনারস', canonicalKey: 'pineapple', category: 'vegetables', baseAmount: 2, amount: 2, unit: 'পিস', unitPrice: 60, note: '২ পিস' },
      { id: 'd2d-21', name: 'কমলা লেবু', canonicalKey: 'orange', category: 'vegetables', baseAmount: 10, amount: 10, unit: 'পিস', unitPrice: 35, note: '১০ পিস' },
      { id: 'd2d-22', name: 'জাফরান সেন্ট', canonicalKey: 'zafran_scent', category: 'spices', baseAmount: 1, amount: 1, unit: 'তোলা', unitPrice: 150, note: '১ তোলা' },
      { id: 'd2d-23', name: 'কাঠবাদাম', canonicalKey: 'almonds', category: 'dairy_sweets', baseAmount: 300, amount: 300, unit: 'গ্রাম', unitPrice: 1100 },
      { id: 'd2d-24', name: 'ছোট মিষ্টি (জর্দা মিষ্টি)', canonicalKey: 'small_sweets', category: 'dairy_sweets', baseAmount: 240, amount: 240, unit: 'পিস', unitPrice: 15, note: '১২০ জন, জনপ্রতি ২ পিস (২৪০ পিস)', isAutoScaled: true },
      { id: 'd2d-25', name: 'ময়দা (টিকিয়ার জন্য)', canonicalKey: 'flour', category: 'grains', baseAmount: 3, amount: 3, unit: 'কেজি', unitPrice: 65 },
      { id: 'd2d-26', name: 'ছোলার ডাল (টিকিয়া)', canonicalKey: 'lentil_chola', category: 'grains', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 110 },
      { id: 'd2d-27', name: 'ডিম', canonicalKey: 'egg', category: 'protein', baseAmount: 40, amount: 40, unit: 'পিস', unitPrice: 12, note: 'টিকিয়া ও রোস্টে (৪০ টি ডিম)', isAutoScaled: true },
      { id: 'd2d-28', name: 'মোরব্বা', canonicalKey: 'morobba', category: 'dairy_sweets', baseAmount: 1.5, amount: 1.5, unit: 'কেজি', unitPrice: 280 },
      { id: 'd2d-coke', name: 'কোকাকোলা (কোল্ড ড্রিংকস)', canonicalKey: 'coca_cola', category: 'snacks_bus', baseAmount: 30, amount: 30, unit: 'লিটার', unitPrice: 90, note: '১২০ জন শিক্ষার্থী, জনপ্রতি ২৫০ মিলি', isAutoScaled: true },

      // Spices, Sauces, Curd, Salads (বিশেষ মশলা ও সালাদ তালিকা)
      { id: 'd2d-sp1', name: 'দারুচিনি', canonicalKey: 'cinnamon', category: 'spices', baseAmount: 400, amount: 400, unit: 'গ্রাম', unitPrice: 650 },
      { id: 'd2d-sp2', name: 'ছোট এলাচ', canonicalKey: 'cardamom_green', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 3800 },
      { id: 'd2d-sp3', name: 'গোল মরিচ', canonicalKey: 'black_pepper', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 1200 },
      { id: 'd2d-sp4', name: 'লবঙ্গ', canonicalKey: 'cloves', category: 'spices', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 1600 },
      { id: 'd2d-sp5', name: 'শাহী মরিচ', canonicalKey: 'shahi_morich', category: 'spices', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 1100 },
      { id: 'd2d-sp6', name: 'বড় এলাচ (কালো)', canonicalKey: 'cardamom_black', category: 'spices', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 2400 },
      { id: 'd2d-sp7', name: 'স্টার মশলা (মৌরি ফুল)', canonicalKey: 'star_anise', category: 'spices', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 1400 },
      { id: 'd2d-sp8', name: 'কাবাব চিনি', canonicalKey: 'kabab_chini', category: 'spices', baseAmount: 100, amount: 100, unit: 'গ্রাম', unitPrice: 1800 },
      { id: 'd2d-sp9', name: 'মৌরি', canonicalKey: 'fennel', category: 'spices', baseAmount: 50, amount: 50, unit: 'গ্রাম', unitPrice: 400 },
      { id: 'd2d-sp10', name: 'রাধুনি', canonicalKey: 'radhuni', category: 'spices', baseAmount: 50, amount: 50, unit: 'গ্রাম', unitPrice: 500 },
      { id: 'd2d-sp11', name: 'জয়ত্রী', canonicalKey: 'mace', category: 'spices', baseAmount: 120, amount: 120, unit: 'গ্রাম', unitPrice: 3400 },
      { id: 'd2d-sp12', name: 'জয়ফল', canonicalKey: 'nutmeg', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 1200 },
      { id: 'd2d-sp13', name: 'আস্ত ধনিয়া', canonicalKey: 'coriander_seeds', category: 'spices', baseAmount: 600, amount: 600, unit: 'গ্রাম', unitPrice: 240 },
      { id: 'd2d-sp14', name: 'জিরা', canonicalKey: 'cumin', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 900 },
      { id: 'd2d-sp15', name: 'তেজপাতা', canonicalKey: 'bay_leaves', category: 'spices', baseAmount: 150, amount: 150, unit: 'গ্রাম', unitPrice: 220 },
      { id: 'd2d-sp16', name: 'টক দই (রাইতা ও রোস্ট)', canonicalKey: 'curd', category: 'condiments', baseAmount: 8, amount: 8, unit: 'কেজি', unitPrice: 140 },
      { id: 'd2d-sp17', name: 'সরিষা তেল', canonicalKey: 'mustard_oil', category: 'oils', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 280 },
      { id: 'd2d-sp18', name: 'টমেটো সস', canonicalKey: 'tomato_sauce', category: 'condiments', baseAmount: 2.5, amount: 2.5, unit: 'কেজি', unitPrice: 180 },
      { id: 'd2d-sp19', name: 'সয়া সস', canonicalKey: 'soy_sauce', category: 'condiments', baseAmount: 1, amount: 1, unit: 'লিটার', unitPrice: 220 },
      { id: 'd2d-sp20', name: 'সিরকা (ভিনেগার)', canonicalKey: 'vinegar', category: 'condiments', baseAmount: 2, amount: 2, unit: 'লিটার', unitPrice: 120 },
      { id: 'd2d-sp21', name: 'লবণ', canonicalKey: 'salt', category: 'spices', baseAmount: 7, amount: 7, unit: 'কেজি', unitPrice: 40 },
      { id: 'd2d-sp22', name: 'গুড়া দুধ', canonicalKey: 'powder_milk', category: 'dairy_sweets', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 880 },
      { id: 'd2d-sp23', name: 'আলু বোখারা', canonicalKey: 'aloo_bokhara', category: 'dairy_sweets', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 650 },
      { id: 'd2d-sp24', name: 'রোস্ট মশলা', canonicalKey: 'roast_masala', category: 'spices', baseAmount: 2, amount: 2, unit: 'প্যাকেট', unitPrice: 65, note: '২ টা' },
      { id: 'd2d-sp25', name: 'টেস্টিং সল্ট', canonicalKey: 'testing_salt', category: 'spices', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 350 },
      { id: 'd2d-sp26', name: 'টোস্ট বিস্কুট (প্লেইন)', canonicalKey: 'plain_toast', category: 'dairy_sweets', baseAmount: 2.5, amount: 2.5, unit: 'কেজি', unitPrice: 220 },
      { id: 'd2d-sp27', name: 'শসা (রাইতা সালাদ)', canonicalKey: 'cucumber', category: 'vegetables', baseAmount: 20, amount: 20, unit: 'কেজি', unitPrice: 50 },
      { id: 'd2d-sp28', name: 'গাজর', canonicalKey: 'carrot', category: 'vegetables', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 80 },
      { id: 'd2d-sp29', name: 'আপেল', canonicalKey: 'apple', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 260 },
      { id: 'd2d-30', name: 'নাশপাতি', canonicalKey: 'pear', category: 'vegetables', baseAmount: 1, amount: 1, unit: 'কেজি', unitPrice: 280 },
      { id: 'd2d-sp31', name: 'টমেটো', canonicalKey: 'tomato', category: 'vegetables', baseAmount: 4, amount: 4, unit: 'কেজি', unitPrice: 50 },
      { id: 'd2d-sp32', name: 'আঙ্গুর', canonicalKey: 'grapes', category: 'vegetables', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 320 },
      { id: 'd2d-sp33', name: 'বিট লবণ (রাইতা সালাদ)', canonicalKey: 'bit_salt', category: 'spices', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 120 },
      { id: 'd2d-sp34', name: 'চিনি', canonicalKey: 'sugar', category: 'dairy_sweets', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 130 },
      { id: 'd2d-sp35', name: 'পুদিনা পাতা', canonicalKey: 'mint_leaves', category: 'vegetables', baseAmount: 200, amount: 200, unit: 'গ্রাম', unitPrice: 200 },
      { id: 'd2d-sp36', name: 'ধনিয়া পাতা', canonicalKey: 'coriander_leaves', category: 'vegetables', baseAmount: 250, amount: 250, unit: 'গ্রাম', unitPrice: 180 },
      { id: 'd2d-sp37', name: 'কাঁচা মরিচ', canonicalKey: 'green_chilli', category: 'vegetables', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 120 },
      { id: 'd2d-sp38', name: 'ক্যাপসিকাম (চাইনিজ ভেজিটেবল)', canonicalKey: 'capsicum', category: 'vegetables', baseAmount: 2, amount: 2, unit: 'কেজি', unitPrice: 250 },
      { id: 'd2d-sp39', name: 'লেবু', canonicalKey: 'lemon', category: 'vegetables', baseAmount: 120, amount: 120, unit: 'পিস', unitPrice: 5, note: 'জনপ্রতি ১ পিস (১২০ পিস)', isAutoScaled: true },
    ],
  },
];

// Quick lookup map to recover base amount for 120 participants
const BASELINE_ITEM_MAP = new Map<string, number>();
BASELINE_TOUR_MEALS.forEach((meal) => {
  meal.items.forEach((item) => {
    BASELINE_ITEM_MAP.set(`${meal.id}:${item.id}`, item.baseAmount || item.amount);
    BASELINE_ITEM_MAP.set(`${meal.id}:${item.canonicalKey}`, item.baseAmount || item.amount);
    BASELINE_ITEM_MAP.set(item.id, item.baseAmount || item.amount);
  });
});

/**
 * Calculates dynamically scaled quantity and note for ANY item according to
 * the exact ratio fixed at baseline (120 participants).
 */
export function calculateScaledItem(
  item: MealItem,
  mealId: string,
  count: number
): { amount: number; note?: string; customFixedPrice?: number } {
  const safeCount = Math.max(1, count);
  const baseAmount = item.baseAmount ?? 
    BASELINE_ITEM_MAP.get(`${mealId}:${item.id}`) ?? 
    BASELINE_ITEM_MAP.get(`${mealId}:${item.canonicalKey}`) ?? 
    BASELINE_ITEM_MAP.get(item.id) ?? 
    item.amount;

  // 1. Bus Snacks (Muffin Cake & Juice) - 1 piece per person
  if (item.canonicalKey === 'muffin_cake' || item.canonicalKey === 'juice_pack') {
    return {
      amount: safeCount,
      note: `জনপ্রতি ১ পিস (${safeCount} জনের জন্য)`,
    };
  }

  // 2. Day 1 Lunch Chicken - 3 pieces per person, 14 pieces per kg
  if (item.canonicalKey === 'chicken' && mealId === 'day1-lunch') {
    const kg = parseFloat(((safeCount * 3) / 14).toFixed(1));
    return {
      amount: kg,
      note: `কেজিতে ১৪ পিস, জনপ্রতি ৩ পিস (${safeCount} জন = ${safeCount * 3} পিস)`,
    };
  }

  // 3. Day 1 Lunch Fish fry / Rui - 1 piece per person, 8 pieces per kg
  if ((item.canonicalKey === 'fish_fry' || item.canonicalKey === 'rui_fish') && mealId === 'day1-lunch') {
    const kg = parseFloat((safeCount / 8).toFixed(1));
    return {
      amount: kg,
      note: `কেজিতে ৮ পিস কাটা, জনপ্রতি ১ পিস (${safeCount} পিস)`,
    };
  }

  // 4. Day 2 Lunch Rui Fish - 1 piece per person, 8 pieces per kg + head for murighonto
  if (item.canonicalKey === 'rui_fish' && mealId === 'day2-lunch') {
    const kg = parseFloat((safeCount / 8).toFixed(1));
    return {
      amount: kg,
      note: `কেজিতে ৮ পিস কাটা, জনপ্রতি ১ পিস (${safeCount} পিস) + মাথা দিয়ে মুড়িঘন্ট`,
    };
  }

  // 5. Beef (Day 1 Dinner & Day 2 Dinner) - 85% group, 125g per person
  if (item.canonicalKey === 'beef') {
    const kg = parseFloat((safeCount * 0.85 * 0.125).toFixed(1));
    return {
      amount: kg,
      note: `জনপ্রতি ১২৫ গ্রাম হিসেবে ৮৫% অংশ (${kg} কেজি)`,
    };
  }

  // 6. Mutton (Day 1 Dinner & Day 2 Dinner) - 15% group, 125g per person
  if (item.canonicalKey === 'mutton') {
    const kg = parseFloat((safeCount * 0.15 * 0.125).toFixed(1));
    return {
      amount: kg,
      note: `জনপ্রতি ১২৫ গ্রাম হিসেবে ১৫% অংশ (${kg} কেজি)`,
    };
  }

  // 7. Lemons - 1 piece per person
  if (item.canonicalKey === 'lemon') {
    return {
      amount: safeCount,
      note: `জনপ্রতি ১ পিস (${safeCount} পিস)`,
    };
  }

  // 8. Day 1 Breakfast Egg - 1 per person + scaled buffer
  if (item.canonicalKey === 'egg' && mealId === 'day1-breakfast') {
    const buffer = Math.max(1, Math.round((5 / BASE_STUDENT_COUNT) * safeCount));
    const totalEgg = safeCount + buffer;
    return {
      amount: totalEgg,
      note: `জনপ্রতি ১ পিস (${safeCount} জন + ${buffer} অতিরিক্ত)`,
    };
  }

  // 9. Day 2 Breakfast Egg (egg bhorta) - proportional to baseline 30
  if (item.canonicalKey === 'egg' && mealId === 'day2-breakfast') {
    const eggCount = Math.max(1, Math.round((30 / BASE_STUDENT_COUNT) * safeCount));
    return {
      amount: eggCount,
      note: `ডিম ভর্তার জন্য (${eggCount} টি ডিম)`,
    };
  }

  // 10. Day 2 Dinner Egg (tikiya & roast) - proportional to baseline 40
  if (item.canonicalKey === 'egg' && mealId === 'day2-dinner') {
    const eggCount = Math.max(1, Math.round((40 / BASE_STUDENT_COUNT) * safeCount));
    return {
      amount: eggCount,
      note: `টিকিয়া ও রোস্টে (${eggCount} টি ডিম)`,
    };
  }

  // 11. Day 2 Dinner Small Sweets - 2 pieces per person
  if (item.canonicalKey === 'small_sweets' && mealId === 'day2-dinner') {
    return {
      amount: safeCount * 2,
      note: `${safeCount} জন, জনপ্রতি ২ পিস (${safeCount * 2} পিস)`,
    };
  }

  // 12. Day 2 Dinner Coca-Cola - 250ml per person
  if (item.canonicalKey === 'coca_cola' && mealId === 'day2-dinner') {
    const liters = Math.ceil(safeCount * 0.25);
    return {
      amount: liters,
      note: `${safeCount} জন শিক্ষার্থী, জনপ্রতি ২৫০ মিলি`,
    };
  }

  // 13. Lump-sum fixed price item (গরম মশলা ৩০০ টাকার)
  if (item.customFixedPrice !== undefined && item.customFixedPrice > 0) {
    const scaledFixedPrice = Math.max(50, Math.round(((300 * safeCount) / BASE_STUDENT_COUNT) / 10) * 10);
    return {
      amount: 1,
      customFixedPrice: scaledFixedPrice,
    };
  }

  // 14. ALL OTHER MATERIALS: Scaled strictly according to their baseline ratio (baseAmount / 120)
  const rawScaled = (baseAmount * safeCount) / BASE_STUDENT_COUNT;

  switch (item.unit) {
    case 'কেজি': {
      // For large amounts >= 10 kg, 1 decimal place. For smaller amounts, 2 decimal places.
      const scaledKg = rawScaled >= 10 
        ? parseFloat(rawScaled.toFixed(1)) 
        : parseFloat(rawScaled.toFixed(2));
      return { amount: Math.max(0.05, scaledKg) };
    }

    case 'গ্রাম': {
      // In Bangladeshi spice markets, weights are measured in multiples of 5g (e.g. 85g, 125g, 165g)
      if (baseAmount >= 100) {
        return { amount: Math.max(5, Math.round(rawScaled / 5) * 5) };
      }
      return { amount: Math.max(1, Math.round(rawScaled)) };
    }

    case 'লিটার': {
      return { amount: Math.max(0.1, parseFloat(rawScaled.toFixed(2))) };
    }

    case 'পিস':
    case 'হালি': {
      return { amount: Math.max(1, Math.round(rawScaled)) };
    }

    case 'প্যাকেট':
    case 'তোলা': {
      return { amount: Math.max(0.5, parseFloat(rawScaled.toFixed(1))) };
    }

    case 'টাকা': {
      return { amount: Math.max(10, Math.round(rawScaled / 10) * 10) };
    }

    default:
      return { amount: parseFloat(rawScaled.toFixed(2)) };
  }
}

/**
 * Returns the full tour dataset dynamically computed for any participant count.
 */
export function getTourMealsData(studentCount: number = 120): Meal[] {
  const safeCount = Math.max(1, studentCount);

  return BASELINE_TOUR_MEALS.map((meal) => {
    return {
      ...meal,
      items: meal.items.map((item) => {
        const scaled = calculateScaledItem(item, meal.id, safeCount);
        return {
          ...item,
          baseAmount: item.baseAmount ?? item.amount,
          amount: scaled.amount,
          note: scaled.note ?? item.note,
          customFixedPrice: scaled.customFixedPrice ?? item.customFixedPrice,
          isAutoScaled: true,
        };
      }),
    };
  });
}

export const INITIAL_MEALS_DATA: Meal[] = getTourMealsData(120);

/**
 * Dynamically recalculates EVERY material in the tour according to the ratio
 * fixed at the start (120 participants), preserving custom items and rates.
 */
export function recalculateAutoScaledMeals(currentMeals: Meal[], count: number): Meal[] {
  const safeCount = Math.max(1, count);

  return currentMeals.map((meal) => {
    return {
      ...meal,
      items: meal.items.map((item) => {
        const scaled = calculateScaledItem(item, meal.id, safeCount);
        const resolvedBaseAmount = item.baseAmount ?? 
          BASELINE_ITEM_MAP.get(`${meal.id}:${item.id}`) ?? 
          BASELINE_ITEM_MAP.get(`${meal.id}:${item.canonicalKey}`) ?? 
          BASELINE_ITEM_MAP.get(item.id) ?? 
          item.amount;

        return {
          ...item,
          baseAmount: resolvedBaseAmount,
          amount: scaled.amount,
          note: scaled.note ?? item.note,
          customFixedPrice: scaled.customFixedPrice ?? item.customFixedPrice,
          isAutoScaled: true,
        };
      }),
    };
  });
}
