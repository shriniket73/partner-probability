"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateTotalProbability } from '@/models/calculations/calculationService';
import { UICalculatorCriteria } from '@/models/calculations/criteriaMapper';
import { Gender } from '@/models/types/common';
import { 
  Users,  // For gender
  CalendarRange,  // For age
  Ruler,  // For height
  Cigarette,  // For smoking
  Wine,  // For drinking
  BriefcaseBusiness,
  VenetianMask,
  Activity
} from 'lucide-react';


// Type definitions
type SmokingFrequency = 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
type AlcoholFrequency = 'never' | 'daily' | 'occasionally' | 'doesnt_matter';
type ActivityType = 'never' | 'withinWeek' | 'withinMonth' | 'withinYear' | 'doesnt_matter';
type Gender = 'male' | 'female';

// Interfaces
interface CalculatorCriteria {
  ageRange: [number, number];
  gender: Gender;
  minHeight: number;
  minIncome: number;
  healthyBody: boolean;
  noSmoking: boolean;     // Add this
  noDrinking: boolean;    // Add this
  previousPartners: 'none' | 'some' | 'doesnt_matter';
  sexualActivity: ActivityType;
  smoking: SmokingFrequency;
  alcohol: AlcoholFrequency;
}

// For CalculatorCriteria, if it's needed for type checking:
type Props = {
  criteria: CalculatorCriteria;  // Now it's used
};

// Constants
const genderOptions: Gender[] = ['male', 'female'];


const smokingOptions: { value: SmokingFrequency; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'doesnt_matter', label: "Doesn't Matter" }
];

const alcoholOptions: { value: AlcoholFrequency; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'doesnt_matter', label: "Doesn't Matter" }
];

const sexualActivityOptions: { value: ActivityType; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'withinWeek', label: 'Within Week' },
  { value: 'withinMonth', label: 'Within Month' },
  { value: 'withinYear', label: 'Within Year' },
  { value: 'doesnt_matter', label: "Doesn't Matter" }
];

function formatProbabilityResult(result: number): string {
  if (result === 0) return '0.000%';
  
  // Convert to percentage
  const percentage = result * 100;
  
  // Convert to string and split at decimal point
  const [whole, decimal = ''] = percentage.toString().split('.');
  
  if (!decimal) {
    return `${whole}.000%`;
  }

  // Find first non-zero digit
  const firstNonZeroIndex = decimal.split('').findIndex(digit => digit !== '0');
  
  if (firstNonZeroIndex === -1) {
    return `${whole}.000%`;
  }

  // Get 3 digits starting from first non-zero digit
  const significantDecimals = decimal.slice(firstNonZeroIndex, firstNonZeroIndex + 3);
  // Pad with zeros if less than 3 digits available
  const paddedDecimals = significantDecimals.padEnd(3, '0');
  
  // Reconstruct the number with leading zeros in decimal if any
  const leadingZeros = decimal.slice(0, firstNonZeroIndex);
  
  return `${whole}.${leadingZeros}${paddedDecimals}%`;
}

export default function DelusionCalculator() {
  const [criteria, setCriteria] = useState<UICalculatorCriteria>({
    ageRange: [24, 28],
    gender: 'male',
    minHeight: 5,
    minIncome: 5,
    healthyBody: false,
    noSmoking: false,
    noDrinking: false,
    sexualActivity: 'never',
    smoking: 'never',
    alcohol: 'never',
  });

  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<number>(0.087);
  const [overallConfidence, setOverallConfidence] = useState(0.85);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setShowResult(false);
    setError(null);

    try {
      const calculationResult = await calculateTotalProbability(criteria);
      setResult(calculationResult.probability);
      setOverallConfidence(calculationResult.confidence);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate probability');
      console.error('Calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const formatHeight = (height: number) => `${Math.floor(height)}'${Math.round((height % 1) * 12)}"`;
  const formatIncome = (income: number) => `${income} LPA`;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-3xl mx-auto bg-neutral-800 border border-white shadow-lg text-white">
        <CardHeader>
          <CardTitle>Delusion Calculator</CardTitle>
          <CardDescription>Find out the probability of meeting your ideal partner in India</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Gender Selection */}
          <div className="space-y-4">
          <Label className="flex items-center">
            Looking for
            <Users className="w-4 h-4 ml-1 text-white" />
          </Label>          
            <RadioGroup 
              value={criteria.gender}
              onValueChange={(value) => setCriteria(prev => ({ ...prev, gender: value as Gender }))}
              className="flex items-center space-x-4"
            >
              {genderOptions.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={`gender-${gender}`} />
                  <Label htmlFor={`gender-${gender}`}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Age Range */}
          <div className="space-y-4">
            <Label className="flex items-center">
              Age Range: {criteria.ageRange[0]} - {criteria.ageRange[1]}
              <CalendarRange className="w-4 h-4 ml-1 text-white" />
            </Label>
            <Slider
              value={criteria.ageRange}
              onValueChange={(value) => {
                if (Array.isArray(value) && value.length === 2) {
                  setCriteria(prev => ({ ...prev, ageRange: value as [number, number] }));
                }
              }}
              min={18}
              max={49}
              step={1}
              dual
            />
          </div>

          {/* Height */}
          <div className="space-y-4">
              <Label className="flex items-center"> Minimum Height: {formatHeight(criteria.minHeight)}
                <Ruler className="w-4 h-4 ml-1.5 text-white" />
              </Label>
            <Slider
              value={[criteria.minHeight]}
              min={4}
              max={7}
              step={0.1}
              onValueChange={(value) => {
                if (Array.isArray(value)) {
                  setCriteria(prev => ({ ...prev, minHeight: value[0] }));
                } else {
                  setCriteria(prev => ({ ...prev, minHeight: value }));
                }
              }}
            />
            <div className="flex justify-end">
            </div>
          </div>

          {/* Income */}
          <div className="space-y-4">
              <Label className="flex items-center">Minimum Income: {formatIncome(criteria.minIncome)}
                <BriefcaseBusiness className="w-4 h-4 ml-1 text-white" />
              </Label>
            <Slider
            value={[criteria.minIncome]}
            min={1}
            max={50}
            step={1}
            onValueChange={(value) => {
              if (Array.isArray(value)) {
                setCriteria(prev => ({ ...prev, minIncome: value[0] }));
              } else {
                setCriteria(prev => ({ ...prev, minIncome: value }));
              }
            }}
          />
            <div className="flex justify-end">
            </div>
          </div>

          {/* Health and Lifestyle */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="healthyBody"
                  checked={criteria.healthyBody}
                  onCheckedChange={(checked) => 
                    setCriteria(prev => ({ ...prev, healthyBody: checked as boolean }))}
                />
                  <Label className="flex items-center"> Healthy Body </Label>
                   <Activity className="w-4 h-4 ml-1 text-white" />
              </div>
            </div>

            {/* Smoking Preferences */}
            <div className="space-y-4">
                <Label className="flex items-center"> Smoking Habits
                  <Cigarette className="w-4 h-4 ml-1 text-white" />
                </Label>
              <div className="grid grid-cols-2 gap-4">
                {smokingOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={criteria.smoking === option.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCriteria(prev => ({ ...prev, smoking: option.value }));
                        }
                      }}
                    />
                    <Label>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Alcohol Preferences */}
            <div className="space-y-4">
                <Label className="flex items-center">Drinking Habits
                  <Wine className="w-4 h-4 ml-1 text-white" />
                </Label>
              <div className="grid grid-cols-2 gap-4">
                {alcoholOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={criteria.alcohol === option.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCriteria(prev => ({ ...prev, alcohol: option.value }));
                        }
                      }}
                    />
                    <Label>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sexual Activity */}
          <div className="space-y-4">
            <Label className="flex items-center" >Sexual Activity
              <VenetianMask className="w-4 h-4 ml-1 text-white" />
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {sexualActivityOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={criteria.sexualActivity === option.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCriteria(prev => ({ ...prev, sexualActivity: option.value }));
                      }
                    }}
                  />
                  <Label>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleCalculate}
            disabled={isLoading}
            className="w-60 mx-auto"
          >
            {isLoading ? 'Calculating...' : 'Calculate Probability'}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="w-full max-w-2xl mx-auto bg-red-900 border border-red-500 shadow-lg text-white">
          <CardContent className="p-4">
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {showResult && (
        <Card className="w-full max-w-3xl mx-auto bg-neutral-800 border border-white shadow-lg text-white">
          <CardContent className="flex justify-between items-center p-6 space-x-4">
            <div className="space-y-2">
            <p>Looking for a {criteria.gender} partner</p>
              <p>Age: {criteria.ageRange[0]} to {criteria.ageRange[1]}</p>
              <p>Height: at least {formatHeight(criteria.minHeight)}</p>
              <p>Income: at least {formatIncome(criteria.minIncome)}</p>
              <p>Smoking: {smokingOptions.find(opt => opt.value === criteria.smoking)?.label}</p>
              <p>Drinking: {alcoholOptions.find(opt => opt.value === criteria.alcohol)?.label}</p>
              <p>{criteria.healthyBody ? "Has a healthy body" : "Health Doesn't Matter"}</p>
              <p>Sexual Activity: {
                sexualActivityOptions.find(opt => opt.value === criteria.sexualActivity)?.label
              }</p>
            </div>

            <div className="w-px h-full bg-white" />

            <div className="text-center">
              <p className="text-lg">Probability of finding your ideal partner:</p>
              <p className="text-4xl font-bold mt-2">
                {formatProbabilityResult(result)}
              </p>
              <p className="text-sm text-gray-400 italic">
                Confidence Score: {(overallConfidence * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-400 italic">
                Note: Results are estimates based on demographic data and should be considered approximations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}