"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { VideoDialog } from "@/components/ui/video-dialog";
import { calculateTotalProbability } from '@/models/calculations/calculationService';
import { 
  Gender, 
  SmokingFrequency, 
  AlcoholFrequency, 
  ActivityType,
  CalculatorCriteria 
} from '@/models/types/common';
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

const healthyBodyInfo = (
  <div className="space-y-2">
    <p className="font-medium mb-1">Considers:</p>
    <ul className="list-disc pl-4 space-y-1">
      <li>BMI</li>
      <li>Waist to hip ratio</li>
      <li>No chronic conditions</li>
      <li>Normal diabetes and blood pressure</li>
    </ul>
  </div>
);


const confidenceInfo = (
  <div>
    Reliability measure (0-100%):
    <br />
    90%+ : Very reliable
    <br />
    70-90%: Fairly reliable
    <br />
    Below 70%: Less reliable
  </div>
);

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
  const [criteria, setCriteria] = useState<CalculatorCriteria>({
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
  const formatIncome = (income: number) => {
    if (income >= 100) {
      return `${(income/100).toFixed(1)} Cr PA`;
    }
    return `${income} LPA`;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-3xl mx-auto bg-neutral-800 border border-white shadow-lg text-white">
        <CardHeader>
          <CardTitle>Partner Probability Calculator</CardTitle>
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
            max={100}
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
          <div className="flex items-center space-x-4">
            <Checkbox
              id="healthyBody"
              checked={criteria.healthyBody}
              onCheckedChange={(checked) => 
                setCriteria(prev => ({ ...prev, healthyBody: checked as boolean }))}
            />
            <div className="flex items-center gap-1">
              <Label htmlFor="healthyBody">Healthy Body</Label>
              <CustomTooltip 
                content={healthyBodyInfo}
                iconClassName="w-4 h-4 text-white hover:text-gray-300"
                side="right"
              />
            </div>
          </div>

          {/* Smoking Preferences */}
          <div className="space-y-4">
            <div className="flex items-center">
            <Label className="flex items-center">Smoking Habits
              <Cigarette className="w-4 h-4 ml-1" />
              </Label>
            </div>
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

          {/* Drinking Preferences */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Label className="flex items-center">Drinking Habits
              <Wine className="w-4 h-4 ml-1 text-white" />
              </Label>
            </div>
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

            <div className="text-center flex flex-col items-center">
              <div className="space-y-3 mb-8">
                <p className="text-lg">Probability of finding your ideal partner:</p>
                <p className="text-4xl font-bold">
                  {formatProbabilityResult(result)}
                </p>
              </div>

              <div className="flex items-center justify-center text-sm text-gray-400 italic mb-6">
                <span>Confidence Score: {(overallConfidence * 100).toFixed(2)}%</span>
                <CustomTooltip 
                  content={confidenceInfo}
                  iconClassName="w-3 h-3 text-gray-400 hover:text-gray-300"
                  side="right"
                />
              </div>

              {/* Space reserved for button that doesn't affect layout */}
              <div className="h-0 relative">
                <div className="absolute left-1/2 -translate-x-1/2 mb-6">
                  <VideoDialog shouldShow={result < 0.1} />
                </div>
              </div>

              <div className="w-2/3 h-px bg-gray-700 mt-16 mb-8" /> {/* Added mt-16 to create space for button */}

              <p className="text-xs text-gray-400 italic max-w-sm px-4">
                Note: Results are estimates based on demographic data and should be considered approximations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}