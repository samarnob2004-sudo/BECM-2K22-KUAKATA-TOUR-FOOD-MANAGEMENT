import { ItemCategory, UnitType } from './meal';

export type QuoteUnitType = 'কেজি' | '১০০ গ্রাম' | '২৫০ গ্রাম' | 'গ্রাম' | 'লিটার' | 'পিস' | 'প্যাকেট' | 'বোতল';

export interface ComparisonQuoteItem {
  id: string;
  name: string;
  canonicalKey: string;
  category: ItemCategory;
  quotedPrice: number; // e.g. 50 (taka)
  quotedUnit: QuoteUnitType; // e.g. '১০০ গ্রাম'
  quotedQuantityNote?: string; // e.g. "১০০ gm", "১ বোতল (1 litre)"
  standardUnit: UnitType; // e.g. 'কেজি' or 'প্যাকেট' or 'পিস' or 'লিটার'
  standardUnitPrice: number; // Converted equivalent price per standard unit (e.g. 50 / 100g = 500 / kg)
  notes?: string;
  isCustom?: boolean;
}

export interface ComparisonSummary {
  totalItems: number;
  matchedTourItemsCount: number;
  cheaperItemsCount: number;
  expensiveItemsCount: number;
  sameItemsCount: number;
  totalCurrentCost: number;
  totalQuotedCost: number;
  netSavings: number; // positive = saved money, negative = extra cost
  savingsPercentage: number;
}
