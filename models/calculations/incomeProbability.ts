// models/calculations/incomeProbability.ts

import { Gender, BaseProbabilityResult, ValidationError } from '../types/common';
import { incomeData, IncomeBracket } from '../data/incomeData';

export interface IncomePreference {
  value: number | null;
  comparison?: 'minimum' | 'maximum' | 'range';
  maxValue?: number;  // For range comparison
}

export interface IncomeProbabilityParams {
  targetGender: Gender;
  ageRange: [number, number];
  incomePreference: IncomePreference;
}

export interface IncomeProbabilityResult extends BaseProbabilityResult {
  details: {
    medianIncome: number;
    adjustedIncome: number;
    targetRange?: [number, number];
  };
}

function validateInputs(params: IncomeProbabilityParams): void {
  const { targetGender, ageRange, incomePreference } = params;

  if (!['male', 'female'].includes(targetGender)) {
    throw new ValidationError('Invalid gender specified');
  }

  if (!Array.isArray(ageRange) || ageRange.length !== 2) {
    throw new ValidationError('Age range must be an array of two numbers');
  }

  const [minAge, maxAge] = ageRange;
  if (minAge < 18 || maxAge > 55 || minAge > maxAge) {
    throw new ValidationError('Invalid age range specified');
  }

  if (incomePreference.value === null || incomePreference.value < 0) {
    throw new ValidationError('Income must be provided and cannot be negative');
  }

  if (incomePreference.comparison === 'range' && !incomePreference.maxValue) {
    throw new ValidationError('Maximum value required for range comparison');
  }
}

export function calculateIncomeProbability(params: IncomeProbabilityParams): IncomeProbabilityResult {
  try {
    validateInputs(params);
    const { targetGender, incomePreference } = params;
    const genderData = incomeData[targetGender];

    // Determine the adjusted income considering female adjustment if applicable
    const adjustedIncome = incomePreference.value! * (targetGender === 'female' ? genderData.femaleAdjustment : 1);

    // Calculate probability based on income brackets
    let probability = 0;
    if (incomePreference.comparison === 'minimum') {
      probability = calculateMinimumProbability(adjustedIncome, genderData.baseBrackets);
    } else if (incomePreference.comparison === 'maximum') {
      probability = calculateMaximumProbability(adjustedIncome, genderData.baseBrackets);
    } else if (incomePreference.comparison === 'range' && incomePreference.maxValue) {
      probability = calculateRangeProbability(adjustedIncome, incomePreference.maxValue, genderData.baseBrackets);
    } else {
      // Default to minimum comparison
      probability = calculateMinimumProbability(adjustedIncome, genderData.baseBrackets);
    }


    // Apply a logarithmic scaling to adjust the probability
    probability = Math.log(probability + 1) / Math.log(2); // Logarithmic adjustment to provide better distribution

    // Cap probability between 0 and 1
    probability = Math.max(0, Math.min(1, probability));

    return {
      probability,
      confidence: 0.85, // Base confidence value
      details: {
        medianIncome: genderData.baseBrackets[0].threshold,
        adjustedIncome,
        targetRange: incomePreference.comparison === 'range' ? [incomePreference.value, incomePreference.maxValue!] : undefined,
      }
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation Error:', error.message); // Log validation errors
      throw error;
    }
    console.error('Unexpected Error:', error.message); // Log unexpected errors
    throw new Error('Failed to calculate income probability');
  }
}

function calculateRangeProbability(minIncome: number, maxIncome: number, brackets: IncomeBracket[]): number {
  const minProb = calculateMinimumProbability(minIncome, brackets);
  const maxProb = calculateMaximumProbability(maxIncome, brackets);
  return Math.abs(maxProb - minProb);
}

function calculateMinimumProbability(income: number, brackets: IncomeBracket[]): number {
  for (let i = 0; i < brackets.length; i++) {
    if (income <= brackets[i].threshold) {
      return brackets[i].percentage; // Directly use the percentage to indicate how rare the income level is
    }
  }
  return brackets[brackets.length - 1].percentage; // Return the lowest percentage for very high incomes
}

function calculateMaximumProbability(income: number, brackets: IncomeBracket[]): number {
  for (let i = 0; i < brackets.length; i++) {
    if (income <= brackets[i].threshold) {
      return brackets[i].percentage;
    }
  }
  return 1;
}