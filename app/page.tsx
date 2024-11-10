"use client"

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VideoDialog } from "@/components/ui/video-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { calculateTotalProbability } from '@/models/calculations/calculationService';
import { MobileTooltip } from "@/components/ui/MobileTooltip";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@/lib/utils"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Lightbulb,
  Activity,
  HelpCircle, Globe, Github, Copyright, ExternalLink,Loader
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
  
  <div className="space-y-2 text-[0.7rem]">
    <p className="font-medium mb-1 text-[0.7rem]">Considers:</p>
    <ul className="list-disc pl-4 space-y-1">
      <li>BMI</li>
      <li>Waist to hip ratio</li>
      <li>Chronic conditions</li>
      <li>Diabetes and Blood pressure</li>
    </ul>
  </div>
);


const confidenceInfo = (
  <div className="space-y-2 text-[0.7rem]">
    <p className="font-medium mb-2 text-[0.7rem]">Reliability measure (0-100%):</p>
    <ul className="space-y-1">
      <li>90%+ : Very reliable</li>
      <li>70-90%: Fairly reliable</li>
      <li>Below 70%: Less reliable</li>
    </ul>
  </div>
);

// Define the side type directly
type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

interface MobileTooltipProps {
  content: ReactNode;
  iconClassName?: string;
  side?: TooltipSide;
}

// Utility function to determine text size class based on probability
const ResultDisplay = ({ result }: { result: number }) => {
  // Function to determine text size based on length of the formatted number
  function getTextSizeClass(formattedNumber: string): string {
    const length = formattedNumber.length;
    
    if (length > 40) return 'text-[8px]';
    if (length > 35) return 'text-[10px]';
    if (length > 30) return 'text-[12px]';
    if (length > 25) return 'text-[14px]';
    if (length > 20) return 'text-[16px]';
    if (length > 15) return 'text-[18px]';
    return 'text-xl';
  }

  const formattedResult = formatProbabilityResult(result);
  const textSizeClass = getTextSizeClass(formattedResult);

  return (
    <div className="text-center flex flex-col items-center">
      <div className="space-y-3 mb-8 w-full max-w-xl">
        <p className="text-lg">Probability of finding your ideal partner:</p>
          <p className={cn(
            textSizeClass,
            "font-mono font-bold w-full text-center transition-all duration-200",
            "whitespace-nowrap overflow-hidden text-ellipsis"
          )}>
            {formattedResult}
          </p>
      </div>
    </div>
  );
};

// The formatting function remains the same
function formatProbabilityResult(result: number): string {
  if (result === 0) return '0.000%';
  
  function toFullDecimal(number: number): string {
    let str = number.toString();
    
    if (!str.includes('e')) {
      return str;
    }

    let [mantissa, exponent] = str.toLowerCase().split('e');
    let exp = parseInt(exponent);
    mantissa = mantissa.replace('.', '');

    if (exp < 0) {
      return '0.' + '0'.repeat(Math.abs(exp) - 1) + mantissa;
    }
    
    return mantissa;
  }

  const percentage = result * 100;
  const fullDecimal = toFullDecimal(percentage);
  const [whole, decimal = ''] = fullDecimal.split('.');
  
  if (whole !== '0') {
    return `${whole}.${decimal.slice(0, 3).padEnd(3, '0')}%`;
  }

  const firstNonZeroIndex = decimal.indexOf(/[1-9]/.exec(decimal)?.[0] || '');
  
  if (firstNonZeroIndex === -1) {
    return '0.000%';
  }

  const significantDigits = decimal.slice(firstNonZeroIndex, firstNonZeroIndex + 3);
  const leadingZeros = decimal.slice(0, firstNonZeroIndex);
  
  return `0.${leadingZeros}${significantDigits}%`;
}

// Test cases:
// console.log(formatProbabilityResult(7.771561172376096e-16));  // "0.000000000000777%"
// console.log(formatProbabilityResult(0.000004824));           // "0.00000482%"
// console.log(formatProbabilityResult(0.0374));                // "0.037%"
// console.log(formatProbabilityResult(0.374));                 // "0.374%"
// console.log(formatProbabilityResult(3.74));                  // "3.740%"

// Example usage:
// console.log(formatProbabilityResult(7.771561172376096e-16));
// Output: "0.00000000000007771561172376096%"

export default function DelusionCalculator() {
  const [criteria, setCriteria] = useState<CalculatorCriteria>({
    ageRange: [24, 28],
    gender: 'male',
    minHeight: 5,
    minIncome: 5,
    healthyBody: true,
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTips, setShowTips] = useState(false);

  // Add ref for result card scrolling
  const resultRef = useRef<HTMLDivElement>(null);


  const handleCalculate = async () => {
    setIsLoading(true);
    setShowResult(false);
    setError(null);

    try {
      const calculationResult = await calculateTotalProbability(criteria);
      setResult(calculationResult.probability);
      setOverallConfidence(calculationResult.confidence);
      setShowResult(true);
      
      // Enhanced scroll behavior
    setTimeout(() => {
      if (resultRef.current) {
        // For mobile devices
        if (window.innerWidth < 1024) {
          resultRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Add a small offset from the top
          window.scrollBy({
            top: -20,
            behavior: 'smooth'
          });
        }
      }
    }, 100);

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to calculate probability');
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

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Hello  👋🏻</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 sm:space-y-4">
            <DialogDescription className="text-gray-300 text-sm sm:text-base">
              Welcome to Reality Check: Your Partner Probability Calculator.
            </DialogDescription>
            <DialogDescription className="text-gray-300 text-sm sm:text-base">
              It uses real data from{" "}
              <a 
                href="https://mohfw.gov.in/sites/default/files/NFHS-5_Phase-II_0.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1"
              >
                NHFS India's latest survey
                <ExternalLink className="w-3 h-3" />
              </a>
              {" "}to calculate your chances of finding that 'perfect' match.
            </DialogDescription>
            <div>
              <h3 className="text-gray-300 text-xs sm:text-sm mb-2">Quick Tips:</h3>
              <ul className="list-disc list-inside text-gray-300 text-xs sm:text-sm space-y-1">
                <li>Be honest with your preferences</li>
                <li>Consider what criteria truly matter to you</li>
                <li>Use the confidence score to gauge reliability</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="mt-4 sm:mt-6">
            <Button variant="outline" onClick={() => setShowWelcome(false)}>
              Start Reality Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tips Dialog */}
      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
              Tips to Improve Your Chances
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-3 sm:mt-4">
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex gap-2 text-xs sm:text-sm text-gray-300">
                <span className="min-w-[6px]">•</span>
                <span>Height and income criteria can dramatically affect your chances</span>
              </li>
              <li className="flex gap-2 text-xs sm:text-sm text-gray-300">
                <span className="min-w-[6px]">•</span>
                <span>'Doesn't Matter' choices are your probability boosters</span>
              </li>
              <li className="flex gap-2 text-xs sm:text-sm text-gray-300">
                <span className="min-w-[6px]">•</span>
                <span>Consider this a guide, not a verdict</span>
              </li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-2 sm:px-4 py-1 sm:py-1 md:py-1 h-[calc(100vh-2rem)] opacity-80">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Column - Calculator */}
          <div className="w-full lg:w-1/2">
            <Card className="bg-neutral-800 border z-10 border-white shadow-lg text-white h-full overflow-hidden">
            <CardHeader className="sticky top-0 bg-neutral-800 z-10 border-b border-gray-700">
            <div className="flex items-center gap-6">
                {/* Logo Circle */}
                <div className="w-13 h-13 sm:w-13 sm:h-13 flex-shrink-0 rounded-full overflow-hidden border-1 border-white shadow-lg">
                  <Image
                    src="/images/logo2.png"
                    alt="Calculator Logo"
                    width={50}
                    height={50}
                    className="w-full h-full object-cover"
                    priority // This loads the image with higher priority
                  />
                </div>

                {/* Title and Description */}
                <div className="text-left">
                  <CardTitle className="text-lg mb-2">
                    Partner Probability Calculator
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Find out the probability of meeting your ideal partner in India
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

              <CardContent className="p-4 lg:p-6 space-y-6 py-4">
                {/* Gender Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-start gap-8">
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
                        <div key={gender} className="flex items-center space-x-1">
                          <RadioGroupItem value={gender} id={`gender-${gender}`} />
                          <Label htmlFor={`gender-${gender}`}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Age Range */}
                <div className="space-y-2">
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

              {/* Height and Income Container */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Height */}
                <div className="flex-1 space-y-4">
                  <Label className="flex items-center"> 
                    Minimum Height: {formatHeight(criteria.minHeight)}
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
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-700 my-2" />

                {/* Income */}
                <div className="flex-1 space-y-4">
                  <Label className="flex items-center">
                    Minimum Income: {formatIncome(criteria.minIncome)}
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
                  {/* <CustomTooltip 
                    content={healthyBodyInfo}
                    iconClassName="w-4 h-4 text-white hover:text-gray-300"
                    side="right"
                  /> */}
                  <MobileTooltip 
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

              <CardFooter className="sticky bottom-0 bg-neutral-800 border-t border-gray-700 p-4 lg:p-6">
                <div className="flex justify-center gap-2 w-full py-1">
                  <Button 
                    variant="outline" 
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="flex-1 max-w-[200px]"
                  >
                    {isLoading ? 'Calculating...' : 'Calculate Probability'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Results and FAQ */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 lg:gap-6" ref={resultRef}>
            {error && (
              <Card className="bg-red-900 border border-red-500 shadow-lg text-white">
                <CardContent className="p-4">
                  <p>{error}</p>
                </CardContent>
              </Card>
            )}

            {showResult && (
              <>
                {/* Results Card */}
                <Card className="bg-neutral-800 border border-white shadow-lg text-white">
                  <CardContent className="p-6">
                    <div className="text-center flex flex-col items-center">
                        <ResultDisplay result={result} />
                      <div className="flex items-center justify-center text-xs text-gray-400 italic mb-4">
                        <span>Confidence Score: {(overallConfidence * 100).toFixed(2)}%</span>
                        {/* <CustomTooltip 
                          content={confidenceInfo}
                          iconClassName="w-3 h-3 text-gray-400 hover:text-gray-300"
                          side="right"
                        /> */}
                        <MobileTooltip 
                        content={confidenceInfo}
                        iconClassName="w-3 h-3 text-gray-400 hover:text-gray-300 text-[0.8rem]"
                        side="right"
                        />
                      </div>

                      <div className="flex justify-center gap-4 w-full">
                        <VideoDialog shouldShow={result > 0} />
                        <Button variant="outline" onClick={() => setShowTips(true)}>
                          Tips
                        </Button>
                      </div>

                      <div className="w-2/3 h-px bg-gray-700 mt-8 mb-4" />

                      <p className="text-xs text-gray-400 italic max-w-sm px-4">
                        Note: Results are estimates based on demographic data and should be considered approximations.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Card with fixed height */}
                <div className="flex-none"> {/* Added flex-none to prevent stretching */}
                  <Card className="bg-neutral-800 border border-white shadow-lg text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        FAQs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-neutral-800 text-white h-[230px]"> {/* Fixed height container with scroll */}
                        <Accordion type="single" collapsible className="space-y-1">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left">Ronaldo vs Messi?</AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              Ronaldo
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left">What would you prefer: the Manssiere or The Bro?</AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              The Bro.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left">If you punch yourself and it hurts, are you strong or weak?</AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              You're weak.
                            </AccordionContent>
                          </AccordionItem>
                          {/* <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left">If you punch yourself and it hurts, are you strong or weak?</AccordionTrigger>
                            <AccordionContent className="text-gray-300">
                              You're weak.
                            </AccordionContent>
                          </AccordionItem> */}
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Attribute Card */}
                <Card className="bg-neutral-800 border border-white shadow-lg text-white mt-auto">
                  <CardContent className="p-4">
                    <div className="flex flex-row flex-wrap justify-center items-center gap-2 text-sm">
                      <a 
                        href="https://shriniket.me" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="whitespace-nowrap">Made by Shriniket</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <span className="text-gray-500">•</span>

                      <a 
                        href="https://github.com/shriniket73/partner-probability" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="whitespace-nowrap">Github</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <span className="text-gray-500">•</span>

                      <div className="flex items-center gap-1 text-gray-300">
                        <Copyright className="w-4 h-4" />
                        <span className="whitespace-nowrap">{new Date().getFullYear()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}