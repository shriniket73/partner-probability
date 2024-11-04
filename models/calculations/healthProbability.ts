// healthProbability.ts

import { Gender, BaseProbabilityResult, ValidationError } from '../types/common';
import { healthData, GenderHealthData, WHRAgeGroup } from '../data/healthData';

// Types and Interfaces
type HealthConditionKey = 'hypertension' | 'diabetes' | 'thyroid' | 'heartDisease' | 'cancer' | 'bmi' | 'anemia' | 'whr';

type HealthConditionWithTreatment = {
  prevalence: { [key: string]: number };
  treatmentRate?: number;
  impact: number;
};

function isHealthCondition(key: string): key is HealthConditionKey {
  return ['hypertension', 'diabetes', 'thyroid', 'heartDisease', 'cancer', 'bmi', 'anemia', 'whr'].includes(key);
}

export interface HealthPreference {
  conditions?: {
    hypertension?: boolean;
    diabetes?: boolean;
    thyroid?: boolean;
    heartDisease?: boolean;
    cancer?: boolean;
    bmi?: 'normal' | 'any';
    anemia?: boolean;
    whr?: boolean;
  };
}

export interface HealthProbabilityParams {
  targetGender: Gender;
  ageRange: [number, number];
  healthPreference: HealthPreference;
  location?: 'urban' | 'rural';
}

export interface HealthProbabilityResult extends BaseProbabilityResult {
  details: {
    conditionProbabilities: {
      [key in HealthConditionKey]?: number;
    };
    treatmentFactors: {
      [key in HealthConditionKey]?: number;
    };
    impactFactors: {
      [key in HealthConditionKey]?: number;
    };
    whrThreshold?: number;
  };
}

// Helper Functions
function validateInputs(params: HealthProbabilityParams): void {
  const { targetGender, ageRange } = params;

  if (!['male', 'female'].includes(targetGender)) {
    throw new ValidationError('Invalid gender specified');
  }

  if (!Array.isArray(ageRange) || ageRange.length !== 2) {
    throw new ValidationError('Age range must be an array of two numbers');
  }

  const [minAge, maxAge] = ageRange;
  if (minAge < 18 || maxAge > 49 || minAge > maxAge) {
    throw new ValidationError('Invalid age range specified');
  }
}

function getAgeGroup(age: number): string {
  if (age <= 19) return "15-19";
  if (age <= 24) return "20-24";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  return "45-49";
}

function getWHRAgeGroup(age: number): WHRAgeGroup {
  if (age <= 19) return "15-19";
  if (age <= 39) return "20-39";
  return "40-49";
}

// Main Calculation Function
export function calculateHealthProbability(params: HealthProbabilityParams): HealthProbabilityResult {
  try {
    validateInputs(params);
    
    const { targetGender, ageRange, healthPreference, location = 'urban' } = params;
    const genderData = healthData[targetGender];

    // If healthyBody is not required, return 1
    if (!healthPreference.conditions || Object.keys(healthPreference.conditions).length === 0) {
      return {
        probability: 1,
        confidence: 0.9,
        details: {
          conditionProbabilities: {},
          treatmentFactors: {},
          impactFactors: {}
        }
      };
    }

    const [minAge, maxAge] = ageRange;
    let healthyProbability = 0;
    let ageGroupsCount = 0;

    // Calculate probabilities for each age in range
    for (let age = minAge; age <= maxAge; age++) {
      const ageGroup = getAgeGroup(age);
      const whrAgeGroup = getWHRAgeGroup(age);
      ageGroupsCount++;

      // Start with base probability of 1
      let ageGroupProbability = 1;

      // Calculate probability of each condition
      if (healthPreference.conditions.hypertension) {
        ageGroupProbability *= (1 - genderData.hypertension.prevalence[ageGroup]);
      }
      
      if (healthPreference.conditions.diabetes) {
        ageGroupProbability *= (1 - genderData.diabetes.prevalence[ageGroup]);
      }
      
      if (healthPreference.conditions.thyroid) {
        ageGroupProbability *= (1 - genderData.thyroid.prevalence[ageGroup]);
      }
      
      if (healthPreference.conditions.heartDisease) {
        ageGroupProbability *= (1 - genderData.heartDisease.prevalence[ageGroup]);
      }
      
      if (healthPreference.conditions.cancer) {
        ageGroupProbability *= (1 - genderData.cancer.prevalence[ageGroup]);
      }
      
      if (healthPreference.conditions.anemia) {
        ageGroupProbability *= (1 - genderData.anemia.prevalence.total);
      }

      if (healthPreference.conditions.whr) {
        const whrProb = 1 - (
          (genderData.whr.prevalence.byAge[whrAgeGroup] + 
           genderData.whr.prevalence.byLocation[location]) / 2
        );
        ageGroupProbability *= whrProb;
      }

      // BMI calculation
      if (healthPreference.conditions.bmi === 'normal') {
        ageGroupProbability *= genderData.bmi.categories.normal.total;
      }

      healthyProbability += ageGroupProbability;
    }

    // Average probability across age groups
    const finalProbability = healthyProbability / ageGroupsCount;

    // Prepare detailed probabilities for response
    const conditionProbabilities: { [key in HealthConditionKey]?: number } = {};
    const treatmentFactors: { [key in HealthConditionKey]?: number } = {};
    const impactFactors: { [key in HealthConditionKey]?: number } = {};

    // Calculate average probabilities for details
    const avgAge = Math.floor((minAge + maxAge) / 2);
    const avgAgeGroup = getAgeGroup(avgAge);
    const avgWHRAgeGroup = getWHRAgeGroup(avgAge);

    if (healthPreference.conditions.hypertension) {
      conditionProbabilities.hypertension = 1 - genderData.hypertension.prevalence[avgAgeGroup];
      impactFactors.hypertension = genderData.hypertension.impact;
    }

    if (healthPreference.conditions.diabetes) {
      conditionProbabilities.diabetes = 1 - genderData.diabetes.prevalence[avgAgeGroup];
      treatmentFactors.diabetes = genderData.diabetes.treatmentRate || 1;
      impactFactors.diabetes = genderData.diabetes.impact;
    }

    if (healthPreference.conditions.thyroid) {
      conditionProbabilities.thyroid = 1 - genderData.thyroid.prevalence[avgAgeGroup];
      treatmentFactors.thyroid = genderData.thyroid.treatmentRate || 1;
      impactFactors.thyroid = genderData.thyroid.impact;
    }

    if (healthPreference.conditions.heartDisease) {
      conditionProbabilities.heartDisease = 1 - genderData.heartDisease.prevalence[avgAgeGroup];
      treatmentFactors.heartDisease = genderData.heartDisease.treatmentRate || 1;
      impactFactors.heartDisease = genderData.heartDisease.impact;
    }

    if (healthPreference.conditions.cancer) {
      conditionProbabilities.cancer = 1 - genderData.cancer.prevalence[avgAgeGroup];
      treatmentFactors.cancer = genderData.cancer.treatmentRate || 1;
      impactFactors.cancer = genderData.cancer.impact;
    }

    if (healthPreference.conditions.anemia) {
      conditionProbabilities.anemia = 1 - genderData.anemia.prevalence.total;
      const severityImpact = (
        genderData.anemia.prevalence.mild * genderData.anemia.impact.mild +
        genderData.anemia.prevalence.moderate * genderData.anemia.impact.moderate +
        genderData.anemia.prevalence.severe * genderData.anemia.impact.severe
      ) / genderData.anemia.prevalence.total;
      impactFactors.anemia = severityImpact;
    }

    if (healthPreference.conditions.whr) {
      const whrProb = 1 - (
        (genderData.whr.prevalence.byAge[avgWHRAgeGroup] + 
         genderData.whr.prevalence.byLocation[location]) / 2
      );
      conditionProbabilities.whr = whrProb;
      impactFactors.whr = genderData.whr.impact;
    }

    if (healthPreference.conditions.bmi) {
      if (healthPreference.conditions.bmi === 'normal') {
        conditionProbabilities.bmi = genderData.bmi.categories.normal.total;
        impactFactors.bmi = genderData.bmi.categories.normal.impact;
      }
    }

    return {
      probability: Math.max(0, Math.min(1, finalProbability)),
      confidence: calculateConfidence(healthPreference),
      details: {
        conditionProbabilities,
        treatmentFactors,
        impactFactors,
        whrThreshold: genderData.whr.threshold
      }
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error('Failed to calculate health probability');
  }
}

function calculateConfidence(healthPreference: HealthPreference): number {
  let confidence = 0.85;

  if (healthPreference.conditions) {
    const conditionCount = Object.keys(healthPreference.conditions).length;
    confidence -= Math.min(0.15, conditionCount * 0.02);

    // Additional confidence adjustments for more uncertain conditions
    if (healthPreference.conditions.cancer) confidence -= 0.05;
    if (healthPreference.conditions.heartDisease) confidence -= 0.03;
    if (healthPreference.conditions.whr) confidence -= 0.02;
    if (healthPreference.conditions.anemia) confidence -= 0.02;
  }

  return Math.max(0.6, confidence);
}

export { validateInputs, calculateConfidence };