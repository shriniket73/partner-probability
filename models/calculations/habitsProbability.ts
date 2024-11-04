// models/calculations/habitsProbability.ts

import { Gender, BaseProbabilityResult, ValidationError } from '../types/common';
import { habitsData } from '../data/habitsData';

export type SmokingFrequency = 'never' | 'light' | 'moderate' | 'heavy' | 'any' | 'doesnt_matter';
export type AlcoholFrequency = 'never' | 'occasional' | 'weekly' | 'daily' | 'any' | 'doesnt_matter';

export interface HabitsPreference {
    smoking?: {
      status: 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
    };
    alcohol?: {
      status: 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
    };
  }

export interface HabitsProbabilityParams {
  targetGender: Gender;
  ageRange: [number, number];
  habitsPreference: HabitsPreference;
}

export interface HabitsProbabilityResult extends BaseProbabilityResult {
  details: {
    smokingProbability: number;
    alcoholProbability: number;
    smokingDetails?: {
      typeDistribution: {[key: string]: number};
      frequencyDistribution: {[key: string]: number};
    };
    alcoholDetails?: {
      frequencyDistribution: {[key: string]: number};
    };
  };
}

function validateInputs(params: HabitsProbabilityParams): void {
    const { targetGender, ageRange, habitsPreference } = params;
  
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
  
    if (habitsPreference.smoking?.status && 
        !['never', 'daily', 'occasionally', 'doesnt_matter'].includes(habitsPreference.smoking.status)) {
      throw new ValidationError('Invalid smoking status preference');
    }
  
    if (habitsPreference.alcohol?.status &&
        !['never', 'daily', 'occasionally', 'doesnt_matter'].includes(habitsPreference.alcohol.status)) {
      throw new ValidationError('Invalid alcohol status preference');
    }
  }

function getAgeGroup(age: number): string {
  if (age <= 19) return "15-19";
  if (age <= 34) return "20-34";
  return "35-49";
}


export function calculateHabitsProbability(
    params: HabitsProbabilityParams
  ): HabitsProbabilityResult {
    try {
      validateInputs(params);
      
      const { targetGender, ageRange, habitsPreference } = params;
      const genderData = habitsData[targetGender];
  
      const [minAge, maxAge] = ageRange;
      let smokingProb = 1;
      let alcoholProb = 1;
      let ageGroupsCount = 0;
  
      // Calculate probabilities across age range
      for (let age = minAge; age <= maxAge; age++) {
        const ageGroup = getAgeGroup(age);
        ageGroupsCount++;
  
        // Calculate smoking probability
        if (habitsPreference.smoking) {
          const smokingPrevalence = genderData.smoking.prevalence[ageGroup];
          
          switch (habitsPreference.smoking.status) {
            case 'never':
              // Simple probability of finding a non-smoker
              smokingProb *= (1 - smokingPrevalence);
              break;
            case 'daily':
              // Probability of finding a daily smoker - using heavy/moderate frequency
              smokingProb *= smokingPrevalence * (
                genderData.smoking.frequency.cigarette.heavy +
                genderData.smoking.frequency.cigarette.moderate
              );
              break;
            case 'occasionally':
              // Probability of finding an occasional smoker - using light frequency
              smokingProb *= smokingPrevalence * 
                genderData.smoking.frequency.cigarette.light;
              break;
            case 'doesnt_matter':
              smokingProb = 1;
              break;
          }
        }
  
        // Calculate alcohol probability
        if (habitsPreference.alcohol) {
          const alcoholPrevalence = genderData.alcohol.prevalence[ageGroup];
          
          switch (habitsPreference.alcohol.status) {
            case 'never':
              // Simple probability of finding a non-drinker
              alcoholProb *= (1 - alcoholPrevalence);
              break;
            case 'daily':
              // Probability of finding a daily drinker
              alcoholProb *= alcoholPrevalence * genderData.alcohol.frequency.daily;
              break;
            case 'occasionally':
              // Probability of finding an occasional drinker
              alcoholProb *= alcoholPrevalence * (
                genderData.alcohol.frequency.weekly +
                genderData.alcohol.frequency.occasional
              );
              break;
            case 'doesnt_matter':
              alcoholProb = 1;
              break;
          }
        }
      }
  
      // Average probabilities over age range
      smokingProb = Math.pow(smokingProb, 1/ageGroupsCount);
      alcoholProb = Math.pow(alcoholProb, 1/ageGroupsCount);
  
      // Calculate combined probability
      let finalProbability = 1;
      let weightedFactors = 0;
  
      if (habitsPreference.smoking && habitsPreference.smoking.status !== 'doesnt_matter') {
        finalProbability *= smokingProb;
        weightedFactors++;
      }
  
      if (habitsPreference.alcohol && habitsPreference.alcohol.status !== 'doesnt_matter') {
        finalProbability *= alcoholProb;
        weightedFactors++;
      }
  
      // If no specific preferences were applied or all preferences are "doesn't matter"
      if (weightedFactors === 0) {
        finalProbability = 1;
      } else {
        finalProbability = Math.pow(finalProbability, 1/weightedFactors);
      }
  
      return {
        probability: Math.max(0, Math.min(1, finalProbability)),
        confidence: calculateConfidence(params),
        details: {
          smokingProbability: smokingProb,
          alcoholProbability: alcoholProb,
          smokingDetails: habitsPreference.smoking ? {
            typeDistribution: genderData.smoking.types,
            frequencyDistribution: genderData.smoking.frequency.cigarette
          } : undefined,
          alcoholDetails: habitsPreference.alcohol ? {
            frequencyDistribution: genderData.alcohol.frequency
          } : undefined
        }
      };
  
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to calculate habits probability');
    }
  }

  function calculateConfidence(params: HabitsProbabilityParams): number {
    const { ageRange, habitsPreference } = params;
    let confidence = 0.85; // Base confidence
  
    // Reduce confidence for wider age ranges
    const ageSpan = ageRange[1] - ageRange[0];
    confidence -= Math.min(0.15, ageSpan * 0.01);
  
    // Adjust confidence based on specificity of preferences
    if (habitsPreference.smoking?.status === 'occasionally') {
      confidence *= 0.9; // Less confident about occasional smoking data
    }
    if (habitsPreference.smoking?.status === 'daily') {
      confidence *= 0.95; // More confident about daily smoking data
    }
    if (habitsPreference.alcohol?.status === 'occasionally') {
      confidence *= 0.9; // Less confident about occasional drinking data
    }
    if (habitsPreference.alcohol?.status === 'daily') {
      confidence *= 0.95; // More confident about daily drinking data
    }
    if (habitsPreference.smoking?.status === 'doesnt_matter' || 
        habitsPreference.alcohol?.status === 'doesnt_matter') {
      confidence *= 1; // No impact on confidence for 'doesn't matter'
    }
    if (habitsPreference.smoking?.status === 'never' || 
        habitsPreference.alcohol?.status === 'never') {
      confidence *= 0.98; // High confidence in 'never' responses due to clear definition
    }
  
    return Math.max(0.5, Math.min(1, confidence)); // Ensure confidence stays between 0.5 and 1
  }