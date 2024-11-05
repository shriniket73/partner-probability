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
  
  export async function calculateTotalProbability(criteria: CalculatorCriteria) {
    try {
      const params = mapUIToCalculationParams(criteria) as CalculationParams;
   
      // Calculate individual probabilities
      const heightProb = calculateHeightProbability(params.heightParams);
      console.log('Height Probability:', heightProb);
  
      const incomeProb = calculateIncomeProbability(params.incomeParams);
      console.log('Income Probability:', incomeProb);
  
      const healthProb = calculateHealthProbability(params.healthParams);
      console.log('Health Probability:', healthProb);
  
      const activityProb = calculateSexualActivityProbability(params.sexualActivityParams);
      console.log('Sexual Activity Probability:', activityProb);
  
      const habitsProb = calculateHabitsProbability(params.habitsParams);
      console.log('Habits Probability:', habitsProb);
  
      // Calculate total probability by multiplying all
      const totalProbability = 
        heightProb.probability *
        incomeProb.probability *
        healthProb.probability *
        activityProb.probability *
        habitsProb.probability;
        console.log('Total Probability:',totalProbability);
        console.log('-------------------');
      // Calculate overall confidence as the average of individual confidences
      const overallConfidence = (
        heightProb.confidence +
        incomeProb.confidence +
        healthProb.confidence +
        activityProb.confidence +
        habitsProb.confidence
      ) / 5;
  
      return {
        probability: Math.max(0, Math.min(1, totalProbability)),
        confidence: overallConfidence,
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