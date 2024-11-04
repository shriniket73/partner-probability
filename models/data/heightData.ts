// models/data/heightData.ts

import { Gender } from '../types/common';

export interface HeightDistribution {
  mean: number;
  standardDeviation: number;
  ageRanges: {
    [key: string]: {
      mean: number;
      standardDeviation: number;
    };
  };
}

export type HeightData = Record<Gender, HeightDistribution>;

export const heightData: HeightData = {
  male: {
    mean: 165.1,
    standardDeviation: 6.5,
    ageRanges: {
      "15-25": { mean: 166.3, standardDeviation: 6.5 },
      "26-35": { mean: 165.8, standardDeviation: 6.5 },
      "36-45": { mean: 164.9, standardDeviation: 6.5 },
      "46-55": { mean: 163.7, standardDeviation: 6.5 },
      "56-65": { mean: 162.5, standardDeviation: 6.5 }
    }
  },
  female: {
    mean: 152.6,
    standardDeviation: 6.0,
    ageRanges: {
      "15-25": { mean: 154.2, standardDeviation: 6.0 },
      "26-35": { mean: 153.1, standardDeviation: 6.0 },
      "36-45": { mean: 152.4, standardDeviation: 6.0 },
      "46-55": { mean: 151.6, standardDeviation: 6.0 },
      "56-65": { mean: 150.8, standardDeviation: 6.0 }
    }
  }
};