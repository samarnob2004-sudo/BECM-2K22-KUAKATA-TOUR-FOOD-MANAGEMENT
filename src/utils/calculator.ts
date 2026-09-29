import { AggregatedMasterItem, CATEGORIES, ItemCategory, Meal, MealItem, UnitType, getCategoryForCommodity } from '../types/meal';

/**
 * Calculates the individual total price for a single meal item
 */
export function calculateItemCost(item: MealItem): number {
  if (item.customFixedPrice !== undefined && item.customFixedPrice > 0) {
    return Math.round(item.customFixedPrice);
  }

  if (item.unit === 'গ্রাম') {
    // Rate is entered per Kg (1000g)
    return Math.round((item.amount / 1000) * item.unitPrice);
  }

  return Math.round(item.amount * item.unitPrice);
}

/**
 * Formats a number to Bengali digits or locale string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatNumberBn(num: number, decimals: number = 2): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return parseFloat(num.toFixed(decimals)).toString();
}

/**
 * Resolves an item's normalized canonical key and clean display name.
 * Merges meal-specific variations (e.g. 'রূপচাঁদা / রুই মাছ (ফ্রাই)' and 'রুই মাছ (ভুনা ও মুড়িঘন্ট)' -> 'রুই মাছ')
 * so that no duplicate item names exist in the master market summary.
 */
export function normalizeItemIdentity(item: MealItem): { key: string; name: string; category: ItemCategory } {
  const rawName = item.name.trim();

  // 1. Rui Fish / Fish Fry variants
  if (
    rawName.includes('রুই') || 
    rawName.includes('রূপচাঁদা') || 
    rawName.includes('রূপচাদা') || 
    rawName.includes('রুপচাদা') || 
    item.canonicalKey === 'rui_fish' || 
    item.canonicalKey === 'fish_fry'
  ) {
    return { key: 'rui_fish', name: 'রুই মাছ', category: 'protein' };
  }

  // 2. Chicken variants
  if (rawName.includes('মুরগি') || rawName.includes('চিকেন') || item.canonicalKey === 'chicken') {
    return { key: 'chicken', name: 'মুরগি', category: 'protein' };
  }

  // 3. Beef & Mutton
  if (rawName.includes('গরু') || item.canonicalKey === 'beef') {
    return { key: 'beef', name: 'গরুর মাংস', category: 'protein' };
  }
  if (rawName.includes('খাসি') || item.canonicalKey === 'mutton') {
    return { key: 'mutton', name: 'খাসির মাংস', category: 'protein' };
  }

  // 4. Rice variants
  if (rawName.includes('সাদা চাল') || item.canonicalKey === 'rice_white') {
    return { key: 'rice_white', name: 'সাদা চাল (ভাত)', category: 'grains' };
  }
  if (rawName.includes('পোলাও চাল') || rawName.includes('চিনিগুড়া') || item.canonicalKey === 'polao_rice' || item.canonicalKey === 'chinigura_rice') {
    return { key: 'polao_rice', name: 'পোলাও চাল', category: 'grains' };
  }
  if (rawName.includes('বাসমতি') || item.canonicalKey === 'basmati_rice') {
    return { key: 'basmati_rice', name: 'বাসমতি চাল', category: 'grains' };
  }

  // 5. Lentils
  if (rawName.includes('মসুর ডাল') || item.canonicalKey === 'lentil_mosur') {
    return { key: 'lentil_mosur', name: 'মসুর ডাল', category: 'grains' };
  }
  if (rawName.includes('মুগ ডাল') || item.canonicalKey === 'lentil_mug') {
    return { key: 'lentil_mug', name: 'মুগ ডাল', category: 'grains' };
  }
  if (rawName.includes('ছোলার ডাল') || item.canonicalKey === 'lentil_chola') {
    return { key: 'lentil_chola', name: 'ছোলার ডাল', category: 'grains' };
  }

  // 6. Oils
  if (rawName.includes('সয়াবিন তেল') || item.canonicalKey === 'soybean_oil') {
    return { key: 'soybean_oil', name: 'সয়াবিন তেল', category: 'oils' };
  }
  if ((rawName.includes('সরিষা') && rawName.includes('তেল')) || item.canonicalKey === 'mustard_oil') {
    return { key: 'mustard_oil', name: 'সরিষার তেল', category: 'oils' };
  }
  if (rawName.includes('সাদা সরিষা') || item.canonicalKey === 'white_mustard') {
    return { key: 'white_mustard', name: 'সাদা সরিষা', category: 'spices' };
  }
  if (rawName.includes('ঘি') || item.canonicalKey === 'ghee') {
    return { key: 'ghee', name: 'ঘি', category: 'oils' };
  }

  // 7. Eggs & Shrimp
  if (rawName.includes('ডিম') || item.canonicalKey === 'egg') {
    return { key: 'egg', name: 'ডিম', category: 'protein' };
  }
  if ((rawName.includes('চিংড়ি') && !rawName.includes('শুটকি')) || item.canonicalKey === 'shrimp_small') {
    return { key: 'shrimp_small', name: 'মাঝারি চিংড়ি', category: 'protein' };
  }
  if (rawName.includes('চিংড়ি শুটকি') || item.canonicalKey === 'shrimp_dried') {
    return { key: 'shrimp_dried', name: 'চিংড়ি শুটকি', category: 'protein' };
  }

  // 8. Vegetables with multiple preparations
  if (rawName.includes('আলু') && !rawName.includes('বোখারা')) {
    return { key: 'potato', name: 'আলু', category: 'vegetables' };
  }
  if (rawName.includes('পেঁয়াজ') || rawName.includes('পেয়াজ')) {
    return { key: 'onion', name: 'পেঁয়াজ', category: 'vegetables' };
  }
  if (rawName.includes('রসুন')) {
    return { key: 'garlic', name: 'রসুন', category: 'vegetables' };
  }
  if (rawName.includes('আদা')) {
    return { key: 'ginger', name: 'আদা', category: 'vegetables' };
  }
  if (rawName.includes('কাঁচা মরিচ')) {
    return { key: 'green_chilli', name: 'কাঁচা মরিচ', category: 'vegetables' };
  }
  if (rawName.includes('বেগুন')) {
    return { key: 'eggplant', name: 'বেগুন', category: 'vegetables' };
  }
  if (rawName.includes('পেঁপে')) {
    return { key: 'papaya', name: 'পেঁপে', category: 'vegetables' };
  }
  if (rawName.includes('গাজর')) {
    return { key: 'carrot', name: 'গাজর', category: 'vegetables' };
  }
  if (rawName.includes('শসা')) {
    return { key: 'cucumber', name: 'শসা', category: 'vegetables' };
  }
  if (rawName.includes('টমেটো') && !rawName.includes('সস')) {
    return { key: 'tomato', name: 'টমেটো', category: 'vegetables' };
  }
  if (rawName.includes('লাউ')) {
    return { key: 'bottle_gourd', name: 'লাউ', category: 'vegetables' };
  }
  if (rawName.includes('মিষ্টি কুমড়া')) {
    return { key: 'sweet_pumpkin', name: 'মিষ্টি কুমড়া', category: 'vegetables' };
  }
  if (rawName.includes('কাঁচকলা')) {
    return { key: 'green_banana', name: 'কাঁচকলা', category: 'vegetables' };
  }
  if (rawName.includes('শিম')) {
    return { key: 'beans', name: 'শিম', category: 'vegetables' };
  }
  if (rawName.includes('চিচিঙ্গা')) {
    return { key: 'snake_gourd', name: 'চিচিঙ্গা', category: 'vegetables' };
  }
  if (rawName.includes('ক্যাপসিকাম')) {
    return { key: 'capsicum', name: 'ক্যাপসিকাম', category: 'vegetables' };
  }
  if (rawName.includes('ধনিয়া পাতা')) {
    return { key: 'coriander_leaves', name: 'ধনিয়া পাতা', category: 'vegetables' };
  }
  if (rawName.includes('পুদিনা পাতা')) {
    return { key: 'mint_leaves', name: 'পুদিনা পাতা', category: 'vegetables' };
  }

  // 9. Fruits
  if (rawName.includes('লেবু') && !rawName.includes('কমলা')) {
    return { key: 'lemon', name: 'লেবু', category: 'fruits' };
  }
  if (rawName.includes('আমড়া')) {
    return { key: 'amra', name: 'আমড়া', category: 'fruits' };
  }
  if (rawName.includes('আপেল')) {
    return { key: 'apple', name: 'আপেল', category: 'fruits' };
  }
  if (rawName.includes('নাশপাতি')) {
    return { key: 'pear', name: 'নাশপাতি', category: 'fruits' };
  }
  if (rawName.includes('আঙ্গুর')) {
    return { key: 'grapes', name: 'আঙ্গুর', category: 'fruits' };
  }
  if (rawName.includes('আনারস')) {
    return { key: 'pineapple', name: 'আনারস', category: 'fruits' };
  }
  if (rawName.includes('কমলা')) {
    return { key: 'orange', name: 'কমলা লেবু', category: 'fruits' };
  }

  // 10. Spices
  if (rawName.includes('জিরা')) {
    return { key: 'cumin', name: 'জিরা', category: 'spices' };
  }
  if (rawName.includes('হলুদ')) {
    return { key: 'turmeric', name: 'হলুদ গুড়া', category: 'spices' };
  }
  if (rawName.includes('শুকনা মরিচ গুড়া') || rawName.includes('গুড়া মরিচ') || rawName.includes('শুকনা গুড়া মরিচ')) {
    return { key: 'dry_chilli_powder', name: 'শুকনা মরিচ গুড়া', category: 'spices' };
  }
  if (rawName.includes('আস্ত শুকনা মরিচ') || rawName.includes('শুকনা মরিচ (ভাজা)')) {
    return { key: 'dry_chilli_whole', name: 'আস্ত শুকনা মরিচ', category: 'spices' };
  }
  if (rawName.includes('লবণ') && !rawName.includes('বিট') && !rawName.includes('টেস্টিং')) {
    return { key: 'salt', name: 'লবণ', category: 'spices' };
  }
  if (rawName.includes('বিট লবণ')) {
    return { key: 'bit_salt', name: 'বিট লবণ', category: 'spices' };
  }
  if (rawName.includes('টেস্টিং সল্ট')) {
    return { key: 'testing_salt', name: 'টেস্টিং সল্ট', category: 'spices' };
  }
  if (rawName.includes('দারুচিনি')) {
    return { key: 'cinnamon', name: 'দারুচিনি', category: 'spices' };
  }
  if (rawName.includes('ছোট এলাচ') || (rawName.includes('এলাচ') && !rawName.includes('বড়'))) {
    return { key: 'cardamom_green', name: 'ছোট এলাচ', category: 'spices' };
  }
  if (rawName.includes('বড় এলাচ')) {
    return { key: 'cardamom_black', name: 'বড় এলাচ', category: 'spices' };
  }
  if (rawName.includes('গোল মরিচ')) {
    return { key: 'black_pepper', name: 'গোল মরিচ', category: 'spices' };
  }
  if (rawName.includes('লবঙ্গ')) {
    return { key: 'cloves', name: 'লবঙ্গ', category: 'spices' };
  }
  if (rawName.includes('শাহী মরিচ')) {
    return { key: 'shahi_morich', name: 'শাহী মরিচ', category: 'spices' };
  }
  if (rawName.includes('স্টার মশলা')) {
    return { key: 'star_anise', name: 'স্টার মশলা (মৌরি ফুল)', category: 'spices' };
  }
  if (rawName.includes('কাবাব চিনি')) {
    return { key: 'kabab_chini', name: 'কাবাব চিনি', category: 'spices' };
  }
  if (rawName.includes('মৌরি')) {
    return { key: 'fennel', name: 'মৌরি', category: 'spices' };
  }
  if (rawName.includes('রাধুনি')) {
    return { key: 'radhuni', name: 'রাধুনি', category: 'spices' };
  }
  if (rawName.includes('জয়ত্রী')) {
    return { key: 'mace', name: 'জয়ত্রী', category: 'spices' };
  }
  if (rawName.includes('জয়ফল')) {
    return { key: 'nutmeg', name: 'জয়ফল', category: 'spices' };
  }
  if (rawName.includes('আস্ত ধনিয়া')) {
    return { key: 'coriander_seeds', name: 'আস্ত ধনিয়া', category: 'spices' };
  }
  if (rawName.includes('তেজপাতা')) {
    return { key: 'bay_leaves', name: 'তেজপাতা', category: 'spices' };
  }
  if (rawName.includes('মাছের মশলা')) {
    return { key: 'fish_masala', name: 'মাছের মশলা', category: 'spices' };
  }
  if (rawName.includes('রোস্ট মশলা')) {
    return { key: 'roast_masala', name: 'রোস্ট মশলা', category: 'spices' };
  }
  if (rawName.includes('গরম মশলা')) {
    return { key: 'garam_masala_lump', name: 'গরম মশলা (মিক্স)', category: 'spices' };
  }
  if (rawName.includes('ফুড কালার') || rawName.includes('জর্দা রঙ') || item.canonicalKey === 'aci_color') {
    return { key: 'aci_color', name: 'ACI ফুড কালার (জর্দা)', category: 'spices' };
  }
  if (rawName.includes('জাফরান')) {
    return { key: 'zafran_scent', name: 'জাফরান সেন্ট', category: 'spices' };
  }
  if (rawName.includes('অরেঞ্জ সেন্ট')) {
    return { key: 'orange_scent', name: 'অরেঞ্জ সেন্ট', category: 'spices' };
  }

  // 11. Dairy, Nuts, Sweets
  if (rawName.includes('গুড়া দুধ')) {
    return { key: 'powder_milk', name: 'গুড়া দুধ', category: 'dairy_sweets' };
  }
  if (rawName.includes('চিনি') && !rawName.includes('গুড়া') && !rawName.includes('কাবাব')) {
    return { key: 'sugar', name: 'চিনি', category: 'dairy_sweets' };
  }
  if (rawName.includes('কিসমিস')) {
    return { key: 'raisin', name: 'কিসমিস', category: 'dairy_sweets' };
  }
  if (rawName.includes('চিনা বাদাম')) {
    return { key: 'peanuts', name: 'চিনা বাদাম', category: 'dairy_sweets' };
  }
  if (rawName.includes('কাজু বাদাম')) {
    return { key: 'cashew_nuts', name: 'কাজু বাদাম', category: 'dairy_sweets' };
  }
  if (rawName.includes('কাঠবাদাম')) {
    return { key: 'almonds', name: 'কাঠবাদাম', category: 'dairy_sweets' };
  }
  if (rawName.includes('পেস্তা বাদাম')) {
    return { key: 'pistachio', name: 'পেস্তা বাদাম', category: 'dairy_sweets' };
  }
  if (rawName.includes('ছোট মিষ্টি')) {
    return { key: 'small_sweets', name: 'ছোট মিষ্টি (জর্দা মিষ্টি)', category: 'dairy_sweets' };
  }
  if (rawName.includes('মোরব্বা')) {
    return { key: 'morobba', name: 'মোরব্বা', category: 'dairy_sweets' };
  }
  if (rawName.includes('ক্ষীর মিক্স')) {
    return { key: 'kheer_mix', name: 'ক্ষীর মিক্স', category: 'dairy_sweets' };
  }
  if (rawName.includes('আলু বোখারা')) {
    return { key: 'aloo_bokhara', name: 'আলু বোখারা', category: 'dairy_sweets' };
  }
  if (rawName.includes('টোস্ট বিস্কুট')) {
    return { key: 'plain_toast', name: 'টোস্ট বিস্কুট (প্লেইন)', category: 'dairy_sweets' };
  }
  if (rawName.includes('মাফিন কেক') || item.canonicalKey === 'muffin_cake') {
    return { key: 'muffin_cake', name: 'মাফিন কেক', category: 'dairy_sweets' };
  }

  // 12. Sauces & Liquids
  if (rawName.includes('টমেটো সস')) {
    return { key: 'tomato_sauce', name: 'টমেটো সস', category: 'sauces_liquids' };
  }
  if (rawName.includes('সয়া সস')) {
    return { key: 'soy_sauce', name: 'সয়া সস', category: 'sauces_liquids' };
  }
  if (rawName.includes('সিরকা') || rawName.includes('ভিনেগার')) {
    return { key: 'vinegar', name: 'সিরকা (ভিনেগার)', category: 'sauces_liquids' };
  }
  if (rawName.includes('টক দই')) {
    return { key: 'curd', name: 'টক দই', category: 'sauces_liquids' };
  }
  if (rawName.includes('জুস')) {
    return { key: 'juice_pack', name: 'জুস (প্যাক)', category: 'sauces_liquids' };
  }
  if (rawName.includes('কোকাকোলা') || rawName.includes('কোক')) {
    return { key: 'coca_cola', name: 'কোকাকোলা (কোল্ড ড্রিংকস)', category: 'sauces_liquids' };
  }

  // General fallback: strip parenthetical notes for clean display
  const cleaned = rawName.replace(/\s*\([^)]*\)/g, '').trim();
  const cat = getCategoryForCommodity(cleaned, item.category);
  return {
    key: item.canonicalKey || cleaned.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '_'),
    name: cleaned || rawName,
    category: cat,
  };
}

/**
 * Aggregates all meals into a unique master item inventory list.
 * Deduplicates by unified identity and display name, guaranteeing that no item appears twice!
 */
export function aggregateMasterItems(
  meals: Meal[],
  customPriceOverrides: Record<string, number> = {}
): AggregatedMasterItem[] {
  const map = new Map<string, {
    canonicalKey: string;
    displayName: string;
    category: ItemCategory;
    items: {
      mealId: string;
      mealTitle: string;
      amount: number;
      unit: UnitType;
      note?: string;
      itemUnitPrice: number;
      fixedPrice?: number;
    }[];
  }>();

  // Populate map with every meal item, resolved via normalizeItemIdentity
  meals.forEach((meal) => {
    meal.items.forEach((item) => {
      const identity = normalizeItemIdentity(item);

      if (!map.has(identity.key)) {
        map.set(identity.key, {
          canonicalKey: identity.key,
          displayName: identity.name,
          category: identity.category,
          items: [],
        });
      }

      const entry = map.get(identity.key)!;
      entry.items.push({
        mealId: meal.id,
        mealTitle: meal.title,
        amount: item.amount,
        unit: item.unit,
        note: item.note,
        itemUnitPrice: item.unitPrice,
        fixedPrice: item.customFixedPrice,
      });
    });
  });

  // Resolve units and totals
  const rawAggregated: AggregatedMasterItem[] = [];

  map.forEach((entry) => {
    const hasKg = entry.items.some(i => i.unit === 'কেজি');
    const hasGram = entry.items.some(i => i.unit === 'গ্রাম');
    const hasLiter = entry.items.some(i => i.unit === 'লিটার');
    const hasPiece = entry.items.some(i => i.unit === 'পিস' || i.unit === 'হালি');
    const hasPacket = entry.items.some(i => i.unit === 'প্যাকেট');
    const hasTola = entry.items.some(i => i.unit === 'তোলা');
    const hasLumpSum = entry.items.some(i => i.unit === 'টাকা');

    let totalQuantity = 0;
    let baseUnit: UnitType = 'কেজি';
    let secondaryText = '';

    if (hasKg || hasGram) {
      baseUnit = 'কেজি';
      let totalGrams = 0;
      entry.items.forEach(i => {
        if (i.unit === 'কেজি') {
          totalGrams += i.amount * 1000;
        } else if (i.unit === 'গ্রাম') {
          totalGrams += i.amount;
        } else {
          totalGrams += i.amount * 1000;
        }
      });

      if (totalGrams >= 1000) {
        totalQuantity = Math.round((totalGrams / 1000) * 100) / 100;
        const kgPart = Math.floor(totalGrams / 1000);
        const gramPart = Math.round(totalGrams % 1000);
        if (gramPart > 0) {
          secondaryText = `${kgPart} কেজি ${gramPart} গ্রাম`;
        }
      } else {
        baseUnit = 'গ্রাম';
        totalQuantity = totalGrams;
        secondaryText = `${formatNumberBn(totalGrams / 1000, 3)} কেজি`;
      }
    } else if (hasLiter) {
      baseUnit = 'লিটার';
      totalQuantity = Math.round(entry.items.reduce((sum, i) => sum + i.amount, 0) * 100) / 100;
    } else if (hasPiece) {
      baseUnit = 'পিস';
      totalQuantity = entry.items.reduce((sum, i) => {
        if (i.unit === 'হালি') return sum + i.amount * 4;
        return sum + i.amount;
      }, 0);
    } else if (hasPacket) {
      baseUnit = 'প্যাকেট';
      totalQuantity = entry.items.reduce((sum, i) => sum + i.amount, 0);
    } else if (hasTola) {
      baseUnit = 'তোলা';
      totalQuantity = entry.items.reduce((sum, i) => sum + i.amount, 0);
    } else if (hasLumpSum) {
      baseUnit = 'টাকা';
      totalQuantity = entry.items.reduce((sum, i) => sum + (i.fixedPrice || i.amount), 0);
    } else {
      totalQuantity = entry.items.reduce((sum, i) => sum + i.amount, 0);
      baseUnit = entry.items[0]?.unit || 'কেজি';
    }

    const overridePrice = customPriceOverrides[entry.canonicalKey];
    const unitPrice = overridePrice !== undefined ? overridePrice : (entry.items[0]?.itemUnitPrice || 0);

    let totalCost = 0;
    if (baseUnit === 'গ্রাম') {
      totalCost = Math.round((totalQuantity / 1000) * unitPrice);
    } else if (baseUnit === 'টাকা') {
      totalCost = Math.round(totalQuantity);
    } else {
      totalCost = Math.round(totalQuantity * unitPrice);
    }

    rawAggregated.push({
      canonicalKey: entry.canonicalKey,
      displayName: entry.displayName,
      category: entry.category,
      totalQuantity,
      unit: baseUnit,
      secondaryAmountText: secondaryText || undefined,
      unitPrice,
      totalCost,
      occurrences: entry.items.map(i => ({
        mealId: i.mealId,
        mealTitle: i.mealTitle,
        amount: i.amount,
        unit: i.unit,
        note: i.note,
      })),
      manualPriceOverride: overridePrice,
    });
  });

  // Second-pass absolute deduplication by clean displayName to guarantee ZERO duplicate names!
  const finalMap = new Map<string, AggregatedMasterItem>();

  rawAggregated.forEach((item) => {
    const nameKey = item.displayName.trim();
    if (!finalMap.has(nameKey)) {
      finalMap.set(nameKey, { ...item });
    } else {
      // Merge into existing entry
      const existing = finalMap.get(nameKey)!;
      existing.totalQuantity = Math.round((existing.totalQuantity + item.totalQuantity) * 100) / 100;
      existing.occurrences = [...existing.occurrences, ...item.occurrences];
      if (item.unitPrice > 0 && existing.unitPrice === 0) {
        existing.unitPrice = item.unitPrice;
      }
      
      // Recalculate cost accurately for the merged total
      if (existing.unit === 'গ্রাম') {
        existing.totalCost = Math.round((existing.totalQuantity / 1000) * existing.unitPrice);
      } else if (existing.unit === 'টাকা') {
        existing.totalCost = Math.round(existing.totalQuantity);
      } else {
        existing.totalCost = Math.round(existing.totalQuantity * existing.unitPrice);
      }

      // Update secondary display text for kg/g
      if (existing.unit === 'কেজি' && existing.totalQuantity > 0) {
        const totalGrams = Math.round(existing.totalQuantity * 1000);
        const kgPart = Math.floor(totalGrams / 1000);
        const gramPart = Math.round(totalGrams % 1000);
        if (gramPart > 0) {
          existing.secondaryAmountText = `${kgPart} কেজি ${gramPart} গ্রাম`;
        }
      }
    }
  });

  const categoryOrderMap = new Map<string, number>();
  const ORDERED_KEYS: ItemCategory[] = [
    'grains',
    'protein',
    'vegetables',
    'fruits',
    'spices',
    'oils',
    'dairy_sweets',
    'sauces_liquids',
  ];
  ORDERED_KEYS.forEach((k, idx) => categoryOrderMap.set(k, idx));

  return Array.from(finalMap.values()).sort((a, b) => {
    const catA = categoryOrderMap.get(a.category) ?? 99;
    const catB = categoryOrderMap.get(b.category) ?? 99;
    if (catA !== catB) return catA - catB;
    return a.displayName.localeCompare(b.displayName, 'bn');
  });
}
