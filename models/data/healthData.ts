// models/data/healthData.ts

import { Gender } from '../types/common';

export type WHRAgeGroup = "15-19" | "20-39" | "40-49";

export interface HealthConditionData {
  prevalence: {
    [ageGroup: string]: number;
  };
  treatmentRate?: number;
  severity?: {
    mild: number;
    moderate: number;
    severe: number;
  };
  impact: number;  // Impact factor on overall health (0-1)
}

export interface BMIData {
  categories: {
    thin: {
      total: number;
      mildThin: number;
      moderateSevere: number;
      impact: number;
    };
    normal: {
      total: number;
      impact: number;
    };
    overweight: {
      total: number;
      impact: number;
    };
    obese: {
      total: number;
      impact: number;
    };
  };
  meanBMI: number;
}

export interface AnemiaData {
  prevalence: {
    total: number;
    mild: number;
    moderate: number;
    severe: number;
  };
  impact: {
    mild: number;
    moderate: number;
    severe: number;
  };
}

export interface WHRData {
    threshold: number;
    prevalence: {
      byAge: {
        [K in WHRAgeGroup]: number;
      };
      byLocation: {
        urban: number;
        rural: number;
      };
    };
    impact: number;
  }

export interface GenderHealthData {
  hypertension: HealthConditionData;
  diabetes: HealthConditionData;
  thyroid: HealthConditionData;
  heartDisease: HealthConditionData;
  cancer: HealthConditionData;
  bmi: BMIData;
  anemia: AnemiaData;
  whr: WHRData;
}

export type HealthData = Record<Gender, GenderHealthData>;

export const healthData: HealthData = {
  female: {
    hypertension: {
      prevalence: {
        "15-19": 0.033,
        "20-24": 0.047,
        "25-29": 0.067,
        "30-39": 0.129,
        "40-49": 0.250
      },
      severity: {
        mild: 0.124,
        moderate: 0.036,
        severe: 0.016
      },
      impact: 0.7
    },
    diabetes: {
      prevalence: {
        "15-19": 0.004,
        "20-34": 0.008,
        "35-49": 0.039
      },
      treatmentRate: 0.807,
      impact: 0.6
    },
    thyroid: {
      prevalence: {
        "15-19": 0.006,
        "20-34": 0.023,
        "35-49": 0.041
      },
      treatmentRate: 0.894,
      impact: 0.4
    },
    heartDisease: {
      prevalence: {
        "15-19": 0.003,
        "20-34": 0.005,
        "35-49": 0.012
      },
      treatmentRate: 0.752,
      impact: 0.8
    },
    cancer: {
      prevalence: {
        "15-19": 0.001,
        "20-34": 0.001,
        "35-49": 0.002
      },
      treatmentRate: 0.814,
      impact: 0.9
    },
    bmi: {
      categories: {
        thin: {
          total: 0.187,
          mildThin: 0.110,
          moderateSevere: 0.077,
          impact: 0.5
        },
        normal: {
          total: 0.573,
          impact: 0.9
        },
        overweight: {
          total: 0.176,
          impact: 0.7
        },
        obese: {
          total: 0.064,
          impact: 0.5
        }
      },
      meanBMI: 22.4
    },
    anemia: {
      prevalence: {
        total: 0.57,
        mild: 0.26,
        moderate: 0.29,
        severe: 0.027
      },
      impact: {
        mild: 0.8,
        moderate: 0.6,
        severe: 0.3
      }
    },
    whr: {
      threshold: 0.85,
      prevalence: {
        byAge: {
          "15-19": 0.46,
          "20-39": 0.57,
          "40-49": 0.65
        },
        byLocation: {
          urban: 0.60,
          rural: 0.55
        }
      },
      impact: 0.7
    }
  },
  male: {
    hypertension: {
      prevalence: {
        "15-19": 0.046,
        "20-24": 0.087,
        "25-29": 0.124,
        "30-34": 0.193,
        "35-39": 0.193,
        "40-44": 0.284,
        "45-49": 0.284
      },
      severity: {
        mild: 0.157,
        moderate: 0.039,
        severe: 0.017
      },
      impact: 0.7
    },
    diabetes: {
      prevalence: {
        "15-19": 0.005,
        "20-34": 0.011,
        "35-49": 0.039
      },
      treatmentRate: 0.715,
      impact: 0.6
    },
    thyroid: {
      prevalence: {
        "15-19": 0.003,
        "20-34": 0.004,
        "35-49": 0.007
      },
      treatmentRate: 0.767,
      impact: 0.4
    },
    heartDisease: {
      prevalence: {
        "15-19": 0.003,
        "20-34": 0.007,
        "35-49": 0.014
      },
      treatmentRate: 0.732,
      impact: 0.8
    },
    cancer: {
      prevalence: {
        "15-19": 0.001,
        "20-34": 0.002,
        "35-49": 0.002
      },
      treatmentRate: 0.828,
      impact: 0.9
    },
    bmi: {
      categories: {
        thin: {
          total: 0.162,
          mildThin: 0.096,
          moderateSevere: 0.066,
          impact: 0.5
        },
        normal: {
          total: 0.609,
          impact: 0.9
        },
        overweight: {
          total: 0.189,
          impact: 0.7
        },
        obese: {
          total: 0.040,
          impact: 0.5
        }
      },
      meanBMI: 22.4
    },
    anemia: {
      prevalence: {
        total: 0.25,
        mild: 0.20,
        moderate: 0.045,
        severe: 0.004
      },
      impact: {
        mild: 0.8,
        moderate: 0.6,
        severe: 0.3
      }
    },
    whr: {
      threshold: 0.90,
      prevalence: {
        byAge: {
          "15-19": 0.28,
          "20-39": 0.44,
          "40-49": 0.60
        },
        byLocation: {
          urban: 0.50,
          rural: 0.46
        }
      },
      impact: 0.7
    }
  }
};