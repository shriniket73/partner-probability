// models/calculations/incomeProbability.ts

import { Gender, BaseProbabilityResult, ValidationError } from '../types/common';
import { incomeData, IncomeBracket } from '../data/incomeData';

export interface IncomePreference {
  value: number | null;
  comparison?: 'minimum' | 'maximum' | 'range';
  maxValue?: number;
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

function calculateMinimumProbability(income: number, brackets: IncomeBracket[]): number {
  const annualIncome = income;

  if (annualIncome < brackets[0].threshold) {
    return 1;
  }

  for (let i = 0; i < brackets.length - 1; i++) {
    if (annualIncome > brackets[i].threshold && annualIncome <= brackets[i + 1].threshold) {
      const lowerBracket = brackets[i];
      const upperBracket = brackets[i + 1];
      
      const logIncomeLower = Math.log(lowerBracket.threshold);
      const logIncomeUpper = Math.log(upperBracket.threshold);
      const logIncomeTarget = Math.log(annualIncome);
      
      const logProbLower = Math.log(lowerBracket.percentage);
      const logProbUpper = Math.log(upperBracket.percentage);
      
      const position = (logIncomeTarget - logIncomeLower) / (logIncomeUpper - logIncomeLower);
      const logProb = logProbLower + (logProbUpper - logProbLower) * position;
      
      return Math.exp(logProb);
    }
  }

  const lastBracket = brackets[brackets.length - 1];
  const logFactor = Math.log(annualIncome / lastBracket.threshold + 1) / Math.log(2);
  return Math.max(lastBracket.percentage * Math.exp(-logFactor), 0.00001);
}

function calculateMaximumProbability(income: number, brackets: IncomeBracket[]): number {
  const annualIncome = income * 100000;
  
  for (let i = 0; i < brackets.length; i++) {
    if (annualIncome <= brackets[i].threshold) {
      if (i === 0) return 1;
      
      const lowerBracket = i > 0 ? brackets[i - 1] : brackets[0];
      const upperBracket = brackets[i];
      
      const logIncomeLower = Math.log(lowerBracket.threshold);
      const logIncomeUpper = Math.log(upperBracket.threshold);
      const logIncomeTarget = Math.log(annualIncome);
      
      const logProbLower = Math.log(lowerBracket.percentage);
      const logProbUpper = Math.log(upperBracket.percentage);
      
      const position = (logIncomeTarget - logIncomeLower) / (logIncomeUpper - logIncomeLower);
      const logProb = logProbLower + (logProbUpper - logProbLower) * position;
      return Math.exp(logProb);
    }
  }
  return 1;
}

function calculateRangeProbability(minIncome: number, maxIncome: number, brackets: IncomeBracket[]): number {
  const minProb = calculateMinimumProbability(minIncome, brackets);
  const maxProb = calculateMaximumProbability(maxIncome, brackets);
  return Math.abs(maxProb - minProb);
}

function calculateConfidence(income: number, gender: Gender): number {
  let confidence = 0.90;
  const annualIncome = income * 100000;
  
  if (annualIncome > 20000000) confidence *= 0.85;
  if (annualIncome > 50000000) confidence *= 0.80;
  if (annualIncome > 100000000) confidence *= 0.75;
  if (gender === 'female') confidence *= 0.95;

  return Math.max(0.65, confidence);
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

    const probability = calculateMinimumProbability(incomePreference.value!, genderData.baseBrackets);
    const adjustedProbability = probability * genderData.femaleAdjustment;
    const confidence = calculateConfidence(incomePreference.value!, targetGender);

    return {
      probability: Math.max(0, Math.min(1, adjustedProbability)),
      confidence,
      details: {
        medianIncome: genderData.baseBrackets[0].threshold / 100000,
        adjustedIncome: incomePreference.value!,
        targetRange: undefined
      }
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error('Failed to calculate income probability');
  }
}

export { validateInputs, calculateConfidence };