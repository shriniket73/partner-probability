// models/data/marriageStatusData.ts

export interface MarriageStatus {
    neverMarried: number;
    currentlyMarried: number;
    divorced: number;
    widowed: number;
    separated: number;
    deserted: number;
  }
  
  export interface MarriageStatusDistribution {
    [ageGroup: string]: {
      male: MarriageStatus;
      female: MarriageStatus;
    };
  }
  
  export const marriageStatusData: MarriageStatusDistribution = {
    "15-19": {
      male: { neverMarried: 0.981, currentlyMarried: 0.017, divorced: 0, widowed: 0, separated: 0, deserted: 0 },
      female: { neverMarried: 0.867, currentlyMarried: 0.126, divorced: 0, widowed: 0, separated: 0.001, deserted: 0 }
    },
    "20-24": {
      male: { neverMarried: 0.787, currentlyMarried: 0.205, divorced: 0.002, widowed: 0, separated: 0.002, deserted: 0 },
      female: { neverMarried: 0.389, currentlyMarried: 0.599, divorced: 0.002, widowed: 0.002, separated: 0.004, deserted: 0.001 }
    },
    // Add other age groups following the same structure
  };
  