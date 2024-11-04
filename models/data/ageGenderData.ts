// models/data/ageGenderData.ts

export interface AgeGenderDistribution {
    [ageGroup: string]: {
      male: number;
      female: number;
    };
  }
  
  export const ageGenderData: AgeGenderDistribution = {
    "15-19": { male: 0.092, female: 0.087 },
    "20-24": { male: 0.089, female: 0.085 },
    "25-29": { male: 0.097, female: 0.095 },
    "30-34": { male: 0.086, female: 0.084 },
    "35-39": { male: 0.082, female: 0.081 },
    "40-44": { male: 0.074, female: 0.073 },
    "45-49": { male: 0.066, female: 0.065 },
    "50-54": { male: 0.056, female: 0.055 }
  };
  