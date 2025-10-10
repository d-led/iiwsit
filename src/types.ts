// Type definitions for the throughput optimization calculator

export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
export type RateUnit = 'second' | 'minute' | 'hour';
export type MaintenanceUnit = 'hour-per-day' | 'hour-per-week' | 'hour-per-month';
export type TimeHorizonUnit = 'month' | 'year';

export interface CalculatorParams {
  rate: number;
  rateUnit: RateUnit;
  duration: number;
  durationUnit: TimeUnit;
  speedGain: number;
  currentFailure: number;
  bugFailure: number;
  maintenance: number;
  maintenanceUnit: MaintenanceUnit;
  implementationTime: number;
  timeHorizon: number;
  timeHorizonUnit: TimeHorizonUnit;
  // Monetary parameters
  computeCostPerHour: number;
  developerHourlyRate: number;
  // Optimization preference: 0 = pure cost optimization, 100 = pure throughput optimization, 50 = balanced
  optimizationPreference: number;
}

export interface CalculationMetrics {
  ratePerHour: string;
  durationHours: string;
  totalRequestsPerYear: string;
  totalRequestsOverHorizon: string;
  timeSavedPerRequest: string;
  totalTimeSaved: string;
  implementationCost: string;
  maintenanceCost: string;
  totalCost: string;
  netBenefit: string;
  roi: string;
  breakEvenYears: string;
  currentFailedRequests: string;
  bugFailedRequests: string;
  netFailureChange: string;
  failureRateChange: string;
  // Monetary metrics
  computeCostSavings: string;
  implementationCostMoney: string;
  maintenanceCostMoney: string;
  totalCostMoney: string;
  netBenefitMoney: string;
  roiMoney: string;
  breakEvenYearsMoney: string;
}

export interface DecisionFactors {
  netBenefit: number;
  roi: number;
  breakEvenYears: number;
  timeHorizonYears: number;
  failureRateChange: number;
  speedGainFraction: number;
  totalTimeSaved: number;
  totalCost: number;
}

export interface DecisionResult {
  decision: 'YES' | 'NO' | 'MAYBE';
  confidence: string;
  reasoning: string[];
}

export interface CalculationResult {
  decision: 'YES' | 'NO' | 'MAYBE';
  confidence: string;
  metrics: CalculationMetrics;
  reasoning: string[];
}

// Global variables injected by Vite at build time
declare global {
  const __GIT_BRANCH__: string;
  const __GIT_COMMIT__: string;
}
