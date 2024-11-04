// models/calculations/sexualActivityProbability.ts

import { Gender, BaseProbabilityResult, ValidationError } from '../types/common';
import { sexualActivityData } from '../data/sexualActivityData';

// Types and Interfaces
export interface SexualActivityPreference {
  recentActivity?: 'never' | 'within_week' | 'within_month' | 'within_year' | 'doesnt_matter';
}

export interface SexualActivityProbabilityParams {
  targetGender: Gender;
  ageRange: [number, number];
  sexualActivityPreference: SexualActivityPreference;
}

export interface SexualActivityProbabilityResult extends BaseProbabilityResult {
  details: {
    recentActivityProbability: number;
    ageGroupProbabilities?: { [ageGroup: string]: number };
  };
}

// Constants for probability bounds
const MIN_PROBABILITY = 0.01;
const MAX_PROBABILITY = 0.99;

// Fallback values for missing data
const FALLBACK_PROBABILITIES = {
  never: 0.2,
  within_week: 0.3,
  within_month: 0.4,
  within_year: 0.5
};

// Validation function
function validateInputs(params: SexualActivityProbabilityParams): void {
  const { targetGender, ageRange, sexualActivityPreference } = params;

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

  if (sexualActivityPreference.recentActivity &&
      !['never', 'within_week', 'within_month', 'within_year', 'doesnt_matter'].includes(sexualActivityPreference.recentActivity)) {
    throw new ValidationError('Invalid recent activity preference');
  }
}

// Helper function to get age group
function getAgeGroup(age: number): string {
  if (age <= 19) return "15-19";
  if (age <= 24) return "20-24";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  return "45-49";
}

// Helper function to get closest available age group
function getClosestAgeGroup(age: number, availableGroups: string[]): string {
  const ageGroup = getAgeGroup(age);
  if (availableGroups.includes(ageGroup)) {
    return ageGroup;
  }
  
  const ageValue = age;
  let closestGroup = availableGroups[0];
  let minDiff = Math.abs(ageValue - parseInt(availableGroups[0].split('-')[0]));

  for (const group of availableGroups) {
    const groupStartAge = parseInt(group.split('-')[0]);
    const diff = Math.abs(ageValue - groupStartAge);
    if (diff < minDiff) {
      minDiff = diff;
      closestGroup = group;
    }
  }
  
  return closestGroup;
}

// Main calculation function
export function calculateSexualActivityProbability(
  params: SexualActivityProbabilityParams
): SexualActivityProbabilityResult {
  try {
    validateInputs(params);

    const { targetGender, ageRange, sexualActivityPreference } = params;
    const genderData = sexualActivityData[targetGender];

    // Return 1 for "doesn't matter" preference
    if (sexualActivityPreference.recentActivity === 'doesnt_matter' || !sexualActivityPreference.recentActivity) {
      return {
        probability: 1,
        confidence: 0.9,
        details: {
          recentActivityProbability: 1,
          ageGroupProbabilities: {}
        }
      };
    }

    const [minAge, maxAge] = ageRange;
    let recentActivityProb = 0;
    let ageGroupsCount = 0;
    const ageGroupProbabilities: { [ageGroup: string]: number } = {};
    
    // Get available age groups from the data
    const availableAgeGroups = Object.keys(genderData.recentActivity);

    // Calculate probability for each age in range
    for (let age = minAge; age <= maxAge; age++) {
      const ageGroup = getClosestAgeGroup(age, availableAgeGroups);
      ageGroupsCount++;

      const activity = genderData.recentActivity[ageGroup];
      let probability: number;

      if (!activity) {
        console.warn(`No activity data for age group ${ageGroup}, using fallback values`);
        probability = FALLBACK_PROBABILITIES[sexualActivityPreference.recentActivity];
      } else {
        switch (sexualActivityPreference.recentActivity) {
          case 'never':
            probability = activity.never || FALLBACK_PROBABILITIES.never;
            break;
          case 'within_week':
            probability = activity.withinWeek || FALLBACK_PROBABILITIES.within_week;
            break;
          case 'within_month':
            probability = (activity.withinWeek || 0) + (activity.withinMonth || 0);
            break;
          case 'within_year':
            probability = (activity.withinWeek || 0) + (activity.withinMonth || 0) + (activity.withinYear || 0);
            break;
          default:
            probability = FALLBACK_PROBABILITIES.within_year;
        }
      }

      recentActivityProb += probability;
      ageGroupProbabilities[ageGroup] = probability;
    }

    // Calculate average probability
    recentActivityProb /= ageGroupsCount;
    
    // Ensure probability is within bounds
    const adjustedProbability = Math.min(MAX_PROBABILITY, Math.max(MIN_PROBABILITY, recentActivityProb));

    return {
      probability: adjustedProbability,
      confidence: calculateConfidence(ageRange, sexualActivityPreference),
      details: {
        recentActivityProbability: recentActivityProb,
        ageGroupProbabilities
      }
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error('Failed to calculate sexual activity probability');
  }
}

// Confidence calculation function
function calculateConfidence(
  ageRange: [number, number],
  preference: SexualActivityPreference
): number {
  let confidence = 0.85; // Base confidence

  // Adjust for age range width
  const ageSpan = ageRange[1] - ageRange[0];
  confidence -= Math.min(0.15, ageSpan * 0.01);

  // Adjust based on activity type
  if (preference.recentActivity === 'never') {
    confidence *= 0.9; // Lower confidence for 'never' as it's harder to verify
  } else if (preference.recentActivity === 'within_year') {
    confidence *= 0.95; // Higher confidence for longer timespan
  }

  // Additional adjustment for wide age ranges
  if (ageSpan > 15) {
    confidence *= 0.9;
  }

  return Math.max(0.6, confidence); // Ensure minimum confidence of 0.6
}

// Export all necessary functions and types
export {
  validateInputs,
  calculateConfidence,
  getAgeGroup,
  getClosestAgeGroup
};