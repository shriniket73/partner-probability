// models/calculations/heightProbability.ts

import { Gender, BaseProbabilityResult, ValidationError } from '../types/common';
import { heightData } from '../data/heightData';

export interface HeightPreference {
  value: number | null;
  comparison?: 'exactly' | 'minimum' | 'maximum';
}

export interface HeightProbabilityParams {
  targetGender: Gender;
  ageRange: [number, number];
  heightPreference: HeightPreference;
}

export interface HeightProbabilityResult extends BaseProbabilityResult {
  details: {
    meanHeight: number;
    standardDeviation: number;
    targetRange?: [number, number];
    ageAdjustedMean: number;
  };
}

function validateInputs(params: HeightProbabilityParams): void {
  const { targetGender, ageRange, heightPreference } = params;

  if (!['male', 'female'].includes(targetGender)) {
    throw new ValidationError('Invalid gender specified');
  }

  if (!Array.isArray(ageRange) || ageRange.length !== 2) {
    throw new ValidationError('Age range must be an array of two numbers');
  }

  const [minAge, maxAge] = ageRange;
  if (minAge < 18 || maxAge > 65 || minAge > maxAge) {
    throw new ValidationError('Invalid age range specified');
  }

  if (heightPreference.value !== null) {
    if (heightPreference.value < 121 || heightPreference.value > 214) {
      throw new ValidationError('Height preference must be between 121 cm and 214 cm');
    }
  }
}

function getAgeGroup(age: number): string {
  if (age <= 25) return "15-25";
  if (age <= 35) return "26-35";
  if (age <= 45) return "36-45";
  if (age <= 55) return "46-55";
  return "56-65";
}

// Enhanced normal CDF calculation with minimum probability threshold
function normalCDF(x: number): number {
  // Set minimum probability to avoid returning exact 0
  const MIN_PROBABILITY = 1e-308; // Smallest possible JavaScript number
  
  let probability = (1 + erf(x / Math.sqrt(2))) / 2;
  
  // Log the calculation details for debugging
  console.log('Normal CDF calculation:', {
    input: x,
    rawProbability: probability,
    finalProbability: Math.max(MIN_PROBABILITY, probability)
  });
  
  return Math.max(MIN_PROBABILITY, probability);
}

// Improved error function implementation
function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export function calculateHeightProbability(params: HeightProbabilityParams): HeightProbabilityResult {
  try {
    validateInputs(params);
    
    const { targetGender, ageRange, heightPreference } = params;
    const genderData = heightData[targetGender];

    // If height doesn't matter, return high probability
    if (!heightPreference.value) {
      return {
        probability: 1,
        confidence: 0.9,
        details: {
          meanHeight: genderData.mean,
          standardDeviation: genderData.standardDeviation,
          ageAdjustedMean: genderData.mean
        }
      };
    }

    // Calculate age-adjusted mean height
    const [minAge, maxAge] = ageRange;
    let ageGroupsCount = 0;
    let sumOfMeans = 0;

    for (let age = minAge; age <= maxAge; age++) {
      const ageGroup = getAgeGroup(age);
      sumOfMeans += genderData.ageRanges[ageGroup].mean;
      ageGroupsCount++;
    }

    const ageAdjustedMean = sumOfMeans / ageGroupsCount;
    const stdDev = genderData.standardDeviation;

    // Calculate z-score
    const zScore = (heightPreference.value - ageAdjustedMean) / stdDev;

    // Calculate probability based on preference
    let probability: number;
    let confidence = 0.85; // base confidence

    // Log calculation details
    console.log('Height Calculation Details:', {
      targetGender,
      preferenceValue: heightPreference.value,
      ageAdjustedMean,
      standardDeviation: stdDev,
      zScore,
      comparison: heightPreference.comparison
    });

    switch (heightPreference.comparison) {
      case 'minimum':
        probability = 1 - normalCDF(zScore);
        break;
      case 'maximum':
        probability = normalCDF(zScore);
        break;
      case 'exactly':
      default:
        // Consider heights within 2 cm as "exact" match
        const lowerZScore = (heightPreference.value - 2 - ageAdjustedMean) / stdDev;
        const upperZScore = (heightPreference.value + 2 - ageAdjustedMean) / stdDev;
        probability = normalCDF(upperZScore) - normalCDF(lowerZScore);
    }

    // Adjust confidence based on how extreme the height is
    const stdDevsAway = Math.abs(zScore);
    if (stdDevsAway > 4) {
      confidence *= 0.6; // very extreme heights
    } else if (stdDevsAway > 3) {
      confidence *= 0.7; // quite extreme heights
    } else if (stdDevsAway > 2) {
      confidence *= 0.85; // somewhat extreme heights
    }

    // Log final results
    console.log('Height Probability Result:', {
      probability,
      confidence,
      stdDevsAway
    });

    return {
      probability: Math.max(1e-308, Math.min(1, probability)), // Ensure minimum probability
      confidence,
      details: {
        meanHeight: genderData.mean,
        standardDeviation: stdDev,
        targetRange: [heightPreference.value - 2, heightPreference.value + 2],
        ageAdjustedMean
      }
    };

  } catch (error) {
    console.error('Height probability calculation error:', error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error('Failed to calculate height probability');
  }
}