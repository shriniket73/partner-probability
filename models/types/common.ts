// models/types/common.ts

export type Gender = 'male' | 'female';

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

export type SexualActivityType = 'never' | 'withinWeek' | 'withinMonth' | 'withinYear';
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
  sexualActivity: SexualActivityType;
  smoking: SmokingFrequency;
  alcohol: AlcoholFrequency;
}