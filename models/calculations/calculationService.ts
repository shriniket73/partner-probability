// calculationService.ts

import { 
    Gender, 
    CalculatorCriteria,
    BaseProbabilityResult
  } from '../types/common';
  import { calculateHeightProbability } from './heightProbability';
  import { calculateIncomeProbability } from './incomeProbability';
  import { calculateHealthProbability } from './healthProbability';
  import { calculateSexualActivityProbability } from './sexualActivityProbability';
  import { calculateHabitsProbability } from './habitsProbability';
  import { mapUIToCalculationParams } from './criteriaMapper';
  
  export interface CalculationParams {
    heightParams: {
      targetGender: Gender;
      ageRange: [number, number];
      heightPreference: {
        value: number;
        comparison: 'minimum' | 'maximum' | 'exactly';
      };
    };
    incomeParams: {
      targetGender: Gender;
      ageRange: [number, number];
      incomePreference: {
        value: number;
        comparison: 'minimum' | 'maximum' | 'range';
      };
      location?: 'urban' | 'rural';
    };
    healthParams: {
      targetGender: Gender;
      ageRange: [number, number];
      healthPreference: {
        conditions?: Record<string, boolean | string>;
      };
    };
    sexualActivityParams: {
      targetGender: Gender;
      ageRange: [number, number];
      sexualActivityPreference: {
        recentActivity?: 'never' | 'within_week' | 'within_month' | 'within_year' | 'doesnt_matter';
      };
    };
    habitsParams: {
      targetGender: Gender;
      ageRange: [number, number];
      habitsPreference: {
        smoking?: {
          status: 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
        };
        alcohol?: {
          status: 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
        };
      };
    };
  }
  
 // calculationService.ts

export async function calculateTotalProbability(criteria: CalculatorCriteria) {
    try {
      const params = mapUIToCalculationParams(criteria) as CalculationParams;
   
      // Calculate individual probabilities with detailed logging
      const heightProb = calculateHeightProbability(params.heightParams);
      console.log('Height Probability:', {
        value: heightProb.probability,
        confidence: heightProb.confidence,
        params: params.heightParams
      });
  
      const incomeProb = calculateIncomeProbability(params.incomeParams);
      console.log('Income Probability:', {
        value: incomeProb.probability,
        confidence: incomeProb.confidence,
        params: params.incomeParams
      });
  
      const healthProb = calculateHealthProbability(params.healthParams);
      console.log('Health Probability:', {
        value: healthProb.probability,
        confidence: healthProb.confidence,
        params: params.healthParams
      });
  
      const activityProb = calculateSexualActivityProbability(params.sexualActivityParams);
      console.log('Sexual Activity Probability:', {
        value: activityProb.probability,
        confidence: activityProb.confidence,
        params: params.sexualActivityParams
      });
  
      const habitsProb = calculateHabitsProbability(params.habitsParams);
      console.log('Habits Probability:', {
        value: habitsProb.probability,
        confidence: habitsProb.confidence,
        params: params.habitsParams
      });
  
      // Validate probabilities before multiplication
      const probabilities = [
        { name: 'height', value: heightProb.probability },
        { name: 'income', value: incomeProb.probability },
        { name: 'health', value: healthProb.probability },
        { name: 'activity', value: activityProb.probability },
        { name: 'habits', value: habitsProb.probability }
      ];
  
      // Check for invalid probabilities
      probabilities.forEach(prob => {
        if (isNaN(prob.value) || prob.value < 0 || prob.value > 1) {
          console.error(`Invalid probability for ${prob.name}:`, prob.value);
          throw new Error(`Invalid probability value for ${prob.name}`);
        }
      });
  
      // Calculate total probability with intermediate steps
      let totalProbability = 1;
      probabilities.forEach(prob => {
        totalProbability *= prob.value;
        console.log(`After multiplying ${prob.name}:`, totalProbability);
      });
  
      // Calculate weighted confidence based on how selective each criterion is
      const totalWeight = probabilities.reduce((sum, prob) => sum + (1 / prob.value), 0);
      const weightedConfidence = (
        (heightProb.confidence / heightProb.probability) +
        (incomeProb.confidence / incomeProb.probability) +
        (healthProb.confidence / healthProb.probability) +
        (activityProb.confidence / activityProb.probability) +
        (habitsProb.confidence / habitsProb.probability)
      ) / totalWeight;
  
      console.log('Final Calculation Results:', {
        totalProbability,
        weightedConfidence,
        probabilityComponents: probabilities,
      });
  
      return {
        probability: Math.max(0, Math.min(1, totalProbability)),
        confidence: weightedConfidence,
        details: {
          height: heightProb,
          income: incomeProb,
          health: healthProb,
          activity: activityProb,
          habits: habitsProb
        }
      } as BaseProbabilityResult;
    } catch (error) {
      console.error('Calculation failed:', error);
      throw error;
    }
  }
  
  // Helper function to ensure valid probability
  function validateProbability(value: number, name: string): number {
    if (isNaN(value) || value < 0 || value > 1) {
      console.error(`Invalid ${name} probability:`, value);
      throw new Error(`${name} probability must be between 0 and 1`);
    }
    return value;
  }