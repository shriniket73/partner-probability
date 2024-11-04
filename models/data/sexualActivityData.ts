// models/data/sexualActivityData.ts

import { Gender } from '../types/common';

export interface SexualActivityDistribution {
  recentActivity: {
    [ageGroup: string]: {
      withinWeek: number;
      withinMonth: number;
      withinYear: number;
      moreThanYear: number;
      never: number;
    };
  };
}

export type SexualActivityData = Record<Gender, SexualActivityDistribution>;

export const sexualActivityData: SexualActivityData = {
  female: {
    recentActivity: {
      "15-19": { withinWeek: 0.063, withinMonth: 0.021, withinYear: 0.046, moreThanYear: 0.004, never: 0.849 },
      "20-24": { withinWeek: 0.283, withinMonth: 0.114, withinYear: 0.162, moreThanYear: 0.014, never: 0.370 },
      "25-29": { withinWeek: 0.426, withinMonth: 0.197, withinYear: 0.181, moreThanYear: 0.027, never: 0.096 },
      "30-34": { withinWeek: 0.467, withinMonth: 0.238, withinYear: 0.166, moreThanYear: 0.043, never: 0.025 }
    }
  },
  male: {
    recentActivity: {
      "15-19": { withinWeek: 0.015, withinMonth: 0.010, withinYear: 0.043, moreThanYear: 0.006, never: 0.923 },
      "20-24": { withinWeek: 0.127, withinMonth: 0.055, withinYear: 0.125, moreThanYear: 0.041, never: 0.640 },
      "25-29": { withinWeek: 0.333, withinMonth: 0.113, withinYear: 0.149, moreThanYear: 0.050, never: 0.317 },
      "30-34": { withinWeek: 0.464, withinMonth: 0.192, withinYear: 0.138, moreThanYear: 0.052, never: 0.112 }
    }
  }
};
