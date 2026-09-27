import { AggregatedMasterItem, CATEGORIES, ItemCategory, Meal, MealItem, UnitType } from '../types/meal';

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
 * Aggregates all meals into a unique master item inventory list.
 * Respects default tour quantities while allowing direct editing of total quantity and rates.
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

  // Populate map with every meal item
  meals.forEach((meal) => {
    meal.items.forEach((item) => {
      if (!map.has(item.canonicalKey)) {
        map.set(item.canonicalKey, {
          canonicalKey: item.canonicalKey,
          displayName: item.name,
          category: item.category,
          items: [],
        });
      }

      const entry = map.get(item.canonicalKey)!;
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

  // Now resolve units and totals
  const aggregated: AggregatedMasterItem[] = [];

  map.forEach((entry) => {
    // Check dominant unit
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
        totalQuantity = totalGrams / 1000;
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
      totalQuantity = entry.items.reduce((sum, i) => sum + i.amount, 0);
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

    // Determine unit price: use custom override if provided, otherwise latest/primary meal rate
    const overridePrice = customPriceOverrides[entry.canonicalKey];
    const unitPrice = overridePrice !== undefined ? overridePrice : (entry.items[0]?.itemUnitPrice || 0);

    // If baseUnit is 'গ্রাম', unitPrice is per kg, so we calculate total accordingly
    let totalCost = 0;
    if (baseUnit === 'টাকা') {
      totalCost = totalQuantity;
    } else if (baseUnit === 'গ্রাম') {
      totalCost = Math.round((totalQuantity / 1000) * unitPrice);
    } else {
      totalCost = Math.round(totalQuantity * unitPrice);
    }

    aggregated.push({
      canonicalKey: entry.canonicalKey,
      displayName: entry.displayName,
      category: entry.category,
      totalQuantity: parseFloat(totalQuantity.toFixed(3)),
      unit: baseUnit,
      secondaryAmountText: secondaryText,
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

  // Sort by category order then by total cost descending
  const categoryOrder: Record<ItemCategory, number> = {
    protein: 1,
    grains: 2,
    oils: 3,
    vegetables: 4,
    spices: 5,
    dairy_sweets: 6,
    condiments: 7,
  };

  return aggregated.sort((a, b) => {
    const catDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
    if (catDiff !== 0) return catDiff;
    return b.totalCost - a.totalCost;
  });
}

/**
 * Calculates summary metrics for the dashboard
 */
export function calculateTourSummary(meals: Meal[], aggregatedItems: AggregatedMasterItem[]) {
  const grandTotalCost = aggregatedItems.reduce((sum, item) => sum + item.totalCost, 0);

  // Category breakdown
  const categoryTotals: Record<ItemCategory, { count: number; cost: number; percentage: number }> = {
    grains: { count: 0, cost: 0, percentage: 0 },
    protein: { count: 0, cost: 0, percentage: 0 },
    oils: { count: 0, cost: 0, percentage: 0 },
    spices: { count: 0, cost: 0, percentage: 0 },
    vegetables: { count: 0, cost: 0, percentage: 0 },
    dairy_sweets: { count: 0, cost: 0, percentage: 0 },
    condiments: { count: 0, cost: 0, percentage: 0 },
  };

  aggregatedItems.forEach((item) => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category].count += 1;
      categoryTotals[item.category].cost += item.totalCost;
    }
  });

  Object.keys(categoryTotals).forEach((key) => {
    const cat = key as ItemCategory;
    categoryTotals[cat].percentage = grandTotalCost > 0
      ? Math.round((categoryTotals[cat].cost / grandTotalCost) * 1000) / 10
      : 0;
  });

  // Meal breakdown
  const mealTotals = meals.map((meal) => {
    const cost = meal.items.reduce((sum, item) => sum + calculateItemCost(item), 0);
    return {
      mealId: meal.id,
      mealTitle: meal.title,
      itemCount: meal.items.length,
      cost,
      percentage: grandTotalCost > 0 ? Math.round((cost / grandTotalCost) * 1000) / 10 : 0,
    };
  });

  return {
    totalItemsCount: aggregatedItems.length,
    grandTotalCost,
    categoryTotals,
    mealTotals,
  };
}
