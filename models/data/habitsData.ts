// models/data/habitsData.ts

import { Gender } from '../types/common';

interface SmokingData {
  prevalence: {
    [ageGroup: string]: number;
  };
  types: {
    cigarette: number;
    bidi: number;
    other: number;
  };
  frequency: {
    [type: string]: {
      light: number;     // <5 per day
      moderate: number;  // 5-14 per day
      heavy: number;     // 15+ per day
    };
  };
}

interface AlcoholData {
  prevalence: {
    [ageGroup: string]: number;
  };
  frequency: {
    daily: number;      // almost every day
    weekly: number;     // about once a week
    occasional: number; // less than once a week
  };
}

interface HabitsDistribution {
  smoking: SmokingData;
  alcohol: AlcoholData;
}

// Changed this interface to use Record type
type HabitsData = Record<Gender, HabitsDistribution>;

// Alternative way:
// type HabitsData = {
//   [K in Gender]: HabitsDistribution;
// };

export const habitsData: HabitsData = {
  female: {
    smoking: {
      prevalence: {
        "15-19": 0.008,
        "20-34": 0.030,
        "35-49": 0.071
      },
      types: {
        cigarette: 0.001,
        bidi: 0.001,
        other: 0.039 // other forms of tobacco
      },
      frequency: {
        cigarette: {
          light: 0.795,   // <5 per day
          moderate: 0.090, // 5-14 per day
          heavy: 0.116    // 15+ per day
        },
        bidi: {
          light: 0.514,
          moderate: 0.371,
          heavy: 0.115
        }
      }
    },
    alcohol: {
      prevalence: {
        "15-19": 0.002,
        "20-34": 0.006,
        "35-49": 0.012
      },
      frequency: {
        daily: 0.169,    // almost every day
        weekly: 0.366,   // about once a week
        occasional: 0.466 // less than once a week
      }
    }
  },
  male: {
    smoking: {
      prevalence: {
        "15-19": 0.143,
        "20-34": 0.386,
        "35-49": 0.512
      },
      types: {
        cigarette: 0.132,
        bidi: 0.070,
        other: 0.189
      },
      frequency: {
        cigarette: {
          light: 0.718,
          moderate: 0.197,
          heavy: 0.085
        },
        bidi: {
          light: 0.205,
          moderate: 0.539,
          heavy: 0.256
        }
      }
    },
    alcohol: {
      prevalence: {
        "15-19": 0.058,
        "20-34": 0.227,
        "35-49": 0.299
      },
      frequency: {
        daily: 0.147,
        weekly: 0.434,
        occasional: 0.419
      }
    }
  }
};

export type { HabitsData, HabitsDistribution, SmokingData, AlcoholData };