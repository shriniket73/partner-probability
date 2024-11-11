# Partner Probability Calculator 🔮

A tool that estimates your chances of finding an ideal partner in India based on your preferences.

## How It Works 📊

The calculator uses data from India's latest [National Family Health Survey (NFHS-5)](https://mohfw.gov.in/sites/default/files/NFHS-5_Phase-II_0.pdf) to compute probabilities. It considers multiple factors and applies statistical models to estimate the likelihood of finding someone who matches your criteria.

- All extracted data: `/models/data`
- All calculations: `/models/calculations`

### Core Calculation Factors

#### Height Probability 📏
- Uses normal distribution based on Indian anthropometric data
- Average height in India:
  - Men: 5'5" (165 cm)
  - Women: 5'1" (155 cm)
- Standard deviation calculated by gender
- Details: `/models/data/heightData.ts`
- Formula: `P(Height) = 1 - normalCDF((target_height - mean_height) / std_dev)`

#### Income Distribution 💰
Probability brackets based on annual income:

| Annual Income Slab | Population % | Probability |
|-------------------|--------------|-------------|
| < ₹2.9 LPA        | 89%          | 0.89        |
| ₹2.9 - 5 LPA      | 83%          | 0.83        |
| ₹5 - 10 LPA       | 5.5%         | 0.055       |
| > ₹10 LPA         | 1.3%         | 0.013       |
| > ₹53 LPA (Top 1%)| 0.7%         | 0.007       |
| > ₹2 Cr (Top 0.1%)| 0.07%        | 0.0007      |
| > ₹10 Cr (Top 0.01%) | Negligible | 0.0001      |

#### Health & Lifestyle 🏃‍♂️
Health probability is based on:
- BMI within a healthy range
- Waist-to-hip ratio
- Absence of chronic conditions (e.g., heart disease, cancer, thyroid)
- Normal blood pressure and diabetes levels

#### Habits & Preferences 🚭
Smoking statistics by gender:

- **Never smoked**:
  - Women: 98.5%
  - Men: 65%
- **Regular smokers**:
  - Women: 1.5%
  - Men: 35%

#### Sexual Activity 💝
Probability based on reported frequency:

- **Never**: 35% of population
- **Within Year**: 25% of population
- **Within Month**: 20% of population
- **Within Week**: 15% of population
- **Doesn't Matter**: 100% probability

### Probability Calculation 🧮

The final probability is calculated using the multiplication principle, as all conditions must be met:

```typescript
Total Probability = 
  Height Probability × 
  Income Probability × 
  Health Probability × 
  Habits Probability ×
  SexualActivity Probability
```

### Confidence Score 🎯

The confidence score indicates the reliability of the calculation:
- **90%+**: Very reliable data
- **70-90%**: Fairly reliable data
- **<70%**: Less reliable data

Confidence is reduced for extreme preferences (e.g., very tall height or high income requirements).

## Technical Implementation 🚀

### Architecture

```
models/
├── calculations/
│   ├── calculationService.ts     # Main calculation orchestrator
│   ├── criteriaMapper.ts         # Maps UI inputs to calculation params
│   ├── habitsProbability.ts      # Smoking & drinking calculations
│   ├── healthProbability.ts      # Health-related calculations
│   ├── heightProbability.ts      # Height distribution calculations
│   ├── incomeProbability.ts      # Income bracket calculations
│   └── sexualActivityProbability.ts  # Activity frequency calculations
│
├── data/
│   ├── ageGenderData.ts         # Age & gender distribution data
│   ├── habitsData.ts            # Smoking & drinking statistics
│   ├── healthData.ts            # Health conditions data
│   ├── heightData.ts            # Height distribution data
│   ├── incomeData.ts            # Income bracket data
│   ├── marriageStatusData.ts    # Relationship status data
│   └── sexualActivityData.ts    # Activity frequency data
│
└── types/
    └── common.ts                # Shared type definitions
```

### Key Technologies
- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI**
- **Vercel Analytics**

### Statistical Models
- **Normal Distribution** for height probability
- **Discrete Probability Distribution** for income
- **Boolean Probability** for lifestyle factors
- **Weighted Averages** for confidence scores

## Examples 📈

1. **Moderate Preferences**
   - Height: 5'8" (Male)
   - Income: 10 LPA
   - Non-smoker
   - **Probability**: ~2.3%

2. **Very Selective**
   - Height: 6'0" (Male)
   - Income: 50 LPA
   - Non-smoker, non-drinker
   - **Probability**: ~0.0023%

3. **Highly Selective**
   - Height: 6'2" (Female)
   - Income: 1 Cr PA
   - All lifestyle preferences
   - **Probability**: ~0.000000374%

## Fun Element 🎥

The calculator includes a random video feature that plays humorous content when probabilities are extremely low, adding a light-hearted touch.

## Responsive Design 📱

The calculator is fully responsive and works on:
- **Desktop browsers**
- **Mobile devices**
- **Tablets**

## Links 🔗

- [Live Demo](https://smallpp.in)
- [GitHub Repository](https://github.com/shriniket73/partner-probability)
- [Developer's Website](https://shriniket.me)

## References 📋

1. [NFHS-5 Data (2019-21)](https://dhsprogram.com/pubs/pdf/FR375/FR375.pdf) for age, gender, health, smoking, drinking, and sexual activity data
2. [Youth in India 2022](https://mospi.gov.in/sites/default/files/publication_reports/Youth_in_India_2022.pdf) for age and gender distribution
3. [Height Data Distribution](https://gitnux.org/average-height-in-india/#sources)
4. [Income Distribution Data](https://www.perplexity.ai/search/what-is-the-of-indian-populati-EkY466s8Tt.megsITo7PxQ)

## Contributing 🤝

Feel free to open issues or submit pull requests if you have suggestions for improving the probability calculations or adding new features.

## License 📄

MIT License - feel free to use this code for your own projects!

---

*Note: This calculator is meant for entertainment purposes and uses generalized statistical data. Individual experiences may vary significantly from calculated probabilities.*
