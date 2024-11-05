// models/types/common.ts


export interface BaseProbabilityResult {
  probability: number;
  confidence: number;
  details?: Record<string, any>;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export type Gender = 'male' | 'female';
export type ActivityType = 'never' | 'withinWeek' | 'withinMonth' | 'withinYear' | 'doesnt_matter';
export type SmokingFrequency = 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
export type AlcoholFrequency = 'never' | 'daily' | 'occasionally' | 'doesnt_matter';

export interface CalculatorCriteria {
  ageRange: [number, number];
  gender: Gender;
  minHeight: number;
  minIncome: number;
  healthyBody: boolean;
  noSmoking: boolean;
  noDrinking: boolean;
  sexualActivity: ActivityType;
  smoking: SmokingFrequency;
  alcohol: AlcoholFrequency;
}