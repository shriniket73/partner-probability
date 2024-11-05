// models/calculations/criteriaMapper.ts

import { 
    Gender,
    CalculatorCriteria,
    SmokingFrequency,
    AlcoholFrequency,
    ActivityType
} from '../types/common';
import { HeightPreference } from './heightProbability';
import { IncomePreference } from './incomeProbability';
import { HealthPreference } from './healthProbability';
import { SexualActivityPreference } from './sexualActivityProbability';
import { HabitsPreference } from './habitsProbability';

function mapSmokingStatus(status: SmokingFrequency): 'never' | 'daily' | 'occasionally' | 'doesnt_matter' {
  return status; // Direct mapping since input categories match calculation categories
}

function mapAlcoholStatus(status: AlcoholFrequency): 'never' | 'daily' | 'occasionally' | 'doesnt_matter' {
  return status; // Direct mapping since input categories match calculation categories
}

function mapRecentActivity(activity: ActivityType): 'never' | 'within_week' | 'within_month' | 'within_year' | 'doesnt_matter' {
    switch (activity) {
      case 'never':
        return 'never';
      case 'withinWeek':
        return 'within_week';
      case 'withinMonth':
        return 'within_month';
      case 'withinYear':
        return 'within_year';
      case 'doesnt_matter':
        return 'doesnt_matter';
      default:
        return 'doesnt_matter';
    }
  }

export function mapUIToCalculationParams(criteria: CalculatorCriteria) {
  return {
    heightParams: {
      targetGender: criteria.gender,
      ageRange: criteria.ageRange,
      heightPreference: {
        value: criteria.minHeight * 30.48, // Convert feet to cm
        comparison: 'minimum' as const
      }
    },

    incomeParams: {
      targetGender: criteria.gender,
      ageRange: criteria.ageRange,
      incomePreference: {
        value: criteria.minIncome * 100000, // Convert lakhs to rupees
        comparison: 'minimum' as const
      }
    },

    healthParams: {
      targetGender: criteria.gender,
      ageRange: criteria.ageRange,
      healthPreference: {
        conditions: {
          bmi: criteria.healthyBody ? 'normal' : 'any'
        }
      }
    },

    sexualActivityParams: {
      targetGender: criteria.gender,
      ageRange: criteria.ageRange,
      sexualActivityPreference: {
        recentActivity: mapRecentActivity(criteria.sexualActivity)
      }
    },

    habitsParams: {
      targetGender: criteria.gender,
      ageRange: criteria.ageRange,
      habitsPreference: {
        smoking: {
          status: mapSmokingStatus(criteria.smoking)
        },
        alcohol: {
          status: mapAlcoholStatus(criteria.alcohol)
        }
      }
    }
  };
}