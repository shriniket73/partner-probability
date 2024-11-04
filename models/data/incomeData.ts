// models/data/incomeData.ts

import { Gender } from '../types/common';

export interface IncomeBracket {
  threshold: number;
  percentage: number;
}

export interface IncomeDistribution {
  baseBrackets: IncomeBracket[];
  femaleAdjustment: number; // Adjustment factor for female tax filers (15% of total)
}

export type IncomeData = Record<Gender, IncomeDistribution>;

export const incomeData: IncomeData = {
  male: {
    baseBrackets: [
      { threshold: 290000, percentage: 0.89 },
      { threshold: 500000, percentage: 0.83 },
      { threshold: 1000000, percentage: 0.055 },
      { threshold: 5300000, percentage: 0.013 },
      { threshold: 20000000, percentage: 0.0007 },
      { threshold: 100000000, percentage: 0.0001 } // Top 0.01%
    ],
    femaleAdjustment: 1.0 // No adjustment for males
  },
  female: {
    baseBrackets: [
      { threshold: 290000, percentage: 0.89 },
      { threshold: 500000, percentage: 0.83 },
      { threshold: 1000000, percentage: 0.055 },
      { threshold: 5300000, percentage: 0.013 },
      { threshold: 20000000, percentage: 0.0007 },
      { threshold: 100000000, percentage: 0.0001 } // Top 0.01%
    ],
    femaleAdjustment: 0.15 // Female tax filers are ~15% of total
  }
};