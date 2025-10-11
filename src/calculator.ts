import type {
  CalculatorParams,
  CalculationResult,
  DecisionFactors,
  DecisionResult,
  TimeUnit,
  RateUnit,
  MaintenanceUnit,
  TimeHorizonUnit,
} from './types';

export class ThroughputOptimizationCalculator {
  private readonly HOURS_PER_DAY = 24;
  private readonly DAYS_PER_YEAR = 365;
  private readonly SECONDS_PER_HOUR = 3600;

  /**
   * Convert various time units to hours for consistent calculation
   */
  private convertToHours(value: number, unit: TimeUnit): number {
    const conversions: Record<TimeUnit, number> = {
      millisecond: value / (1000 * this.SECONDS_PER_HOUR),
      second: value / this.SECONDS_PER_HOUR,
      minute: value / 60,
      hour: value,
      day: value * this.HOURS_PER_DAY,
      month: value * this.HOURS_PER_DAY * 30, // approximate
      year: value * this.HOURS_PER_DAY * this.DAYS_PER_YEAR,
    };
    return conversions[unit];
  }

  /**
   * Convert rate to requests per hour
   */
  private convertRateToPerHour(value: number, unit: RateUnit): number {
    const conversions: Record<RateUnit, number> = {
      second: value * this.SECONDS_PER_HOUR,
      minute: value * 60,
      hour: value,
    };
    return conversions[unit];
  }

  /**
   * Convert maintenance time to hours per year
   */
  private convertMaintenanceToHoursPerYear(value: number, unit: MaintenanceUnit): number {
    const conversions: Record<MaintenanceUnit, number> = {
      'hour-per-day': value * this.DAYS_PER_YEAR,
      'hour-per-week': value * 52,
      'hour-per-month': value * 12,
    };
    return conversions[unit];
  }

  /**
   * Convert time horizon to years
   */
  private convertTimeHorizonToYears(value: number, unit: TimeHorizonUnit): number {
    const conversions: Record<TimeHorizonUnit, number> = {
      month: value / 12,
      year: value,
    };
    return conversions[unit];
  }

  /**
   * Make a decision based on calculated factors
   * Primary focus: Financial ROI
   * Secondary: Speed improvement value
   * Adjustable via optimizationPreference: 0 = pure cost, 100 = pure throughput, 50 = balanced
   */
  private makeDecision(
    timeFactors: DecisionFactors,
    moneyFactors: {
      netBenefitMoney: number;
      roiMoney: number;
      breakEvenYearsMoney: number;
      computeCostSavings: number;
      totalCostMoney: number;
    },
    optimizationPreference: number
  ): DecisionResult {
    const {
      timeHorizonYears,
      speedGainFraction,
      netBenefit,
      roi,
      breakEvenYears,
    } = timeFactors;

    const { netBenefitMoney, roiMoney, breakEvenYearsMoney } = moneyFactors;

    // Calculate weight distribution based on optimization preference
    // 0 = pure cost (100% money, 0% time), 100 = pure throughput (0% money, 100% time), 50 = balanced (50/50)
    const costWeight = (100 - optimizationPreference) / 100; // 1.0 at pref=0, 0.0 at pref=100, 0.5 at pref=50
    const throughputWeight = optimizationPreference / 100; // 0.0 at pref=0, 1.0 at pref=100, 0.5 at pref=50

    let score = 0;
    let maxScore = 0;
    const reasons: string[] = [];

    // Add explanation of the scoring system
    const prefDescription =
      optimizationPreference < 33
        ? 'Cost-optimized'
        : optimizationPreference > 67
          ? 'Throughput-optimized'
          : 'Balanced';
    reasons.push(
      `Scoring (${prefDescription} mode): Each factor contributes points based on its impact. Higher scores indicate stronger recommendations.`
    );

    // Factor 1a: Monetary Net Benefit (weighted by cost preference)
    const moneyBenefitWeight = 40 * costWeight;
    maxScore += moneyBenefitWeight;
    if (netBenefitMoney > 0) {
      const benefitScore = Math.min(
        moneyBenefitWeight,
        (netBenefitMoney / moneyFactors.totalCostMoney) * 15 * costWeight
      );
      score += benefitScore;
      reasons.push(
        `Positive financial benefit of 💰${netBenefitMoney.toFixed(2)} (+${benefitScore.toFixed(1)} points, weight: ${(costWeight * 100).toFixed(0)}%)`
      );
    } else {
      reasons.push(
        `Negative financial benefit of 💰${Math.abs(netBenefitMoney).toFixed(2)} (0 points - no benefit)`
      );
    }

    // Factor 1b: Time-based Net Benefit (weighted by throughput preference)
    const timeBenefitWeight = 40 * throughputWeight;
    maxScore += timeBenefitWeight;
    if (netBenefit > 0) {
      const benefitScore = Math.min(
        timeBenefitWeight,
        (netBenefit / timeFactors.totalCost) * 15 * throughputWeight
      );
      score += benefitScore;
      reasons.push(
        `Positive time benefit of ${netBenefit.toFixed(2)} hours (+${benefitScore.toFixed(1)} points, weight: ${(throughputWeight * 100).toFixed(0)}%)`
      );
    } else {
      reasons.push(
        `Negative time benefit of ${Math.abs(netBenefit).toFixed(2)} hours (0 points - no benefit)`
      );
    }

    // Factor 2a: Monetary ROI (weighted by cost preference)
    const moneyRoiWeight = 30 * costWeight;
    maxScore += moneyRoiWeight;
    let roiMoneyScore = 0;

    if (roiMoney > 200) {
      roiMoneyScore = moneyRoiWeight;
      reasons.push(
        `Excellent monetary ROI of ${roiMoney.toFixed(0)}% (+${roiMoneyScore.toFixed(1)} points - exceptional return, weight: ${(costWeight * 100).toFixed(0)}%)`
      );
    } else if (roiMoney > 100) {
      roiMoneyScore = moneyRoiWeight * 0.83;
      reasons.push(
        `Great monetary ROI of ${roiMoney.toFixed(0)}% (+${roiMoneyScore.toFixed(1)} points - strong return)`
      );
    } else if (roiMoney > 50) {
      roiMoneyScore = moneyRoiWeight * 0.67;
      reasons.push(
        `Good monetary ROI of ${roiMoney.toFixed(0)}% (+${roiMoneyScore.toFixed(1)} points - solid return)`
      );
    } else if (roiMoney > 20) {
      roiMoneyScore = moneyRoiWeight * 0.5;
      reasons.push(
        `Moderate monetary ROI of ${roiMoney.toFixed(0)}% (+${roiMoneyScore.toFixed(1)} points - decent return)`
      );
    } else if (roiMoney > 0) {
      roiMoneyScore = moneyRoiWeight * 0.33;
      reasons.push(
        `Low monetary ROI of ${roiMoney.toFixed(0)}% (+${roiMoneyScore.toFixed(1)} points - minimal return)`
      );
    } else {
      reasons.push(`Negative monetary ROI of ${roiMoney.toFixed(0)}% (0 points - no return)`);
    }
    score += roiMoneyScore;

    // Factor 2b: Time-based ROI (weighted by throughput preference)
    const timeRoiWeight = 30 * throughputWeight;
    maxScore += timeRoiWeight;
    let roiTimeScore = 0;

    if (roi > 200) {
      roiTimeScore = timeRoiWeight;
      reasons.push(
        `Excellent time ROI of ${roi.toFixed(0)}% (+${roiTimeScore.toFixed(1)} points - exceptional return, weight: ${(throughputWeight * 100).toFixed(0)}%)`
      );
    } else if (roi > 100) {
      roiTimeScore = timeRoiWeight * 0.83;
      reasons.push(
        `Great time ROI of ${roi.toFixed(0)}% (+${roiTimeScore.toFixed(1)} points - strong return)`
      );
    } else if (roi > 50) {
      roiTimeScore = timeRoiWeight * 0.67;
      reasons.push(
        `Good time ROI of ${roi.toFixed(0)}% (+${roiTimeScore.toFixed(1)} points - solid return)`
      );
    } else if (roi > 20) {
      roiTimeScore = timeRoiWeight * 0.5;
      reasons.push(
        `Moderate time ROI of ${roi.toFixed(0)}% (+${roiTimeScore.toFixed(1)} points - decent return)`
      );
    } else if (roi > 0) {
      roiTimeScore = timeRoiWeight * 0.33;
      reasons.push(
        `Low time ROI of ${roi.toFixed(0)}% (+${roiTimeScore.toFixed(1)} points - minimal return)`
      );
    } else {
      reasons.push(`Negative time ROI of ${roi.toFixed(0)}% (0 points - no return)`);
    }
    score += roiTimeScore;

    // Factor 3a: Monetary Break-even time (weighted by cost preference)
    const moneyBreakEvenWeight = 20 * costWeight;
    maxScore += moneyBreakEvenWeight;
    if (isFinite(breakEvenYearsMoney)) {
      if (breakEvenYearsMoney < timeHorizonYears * 0.25) {
        score += moneyBreakEvenWeight;
        reasons.push(
          `Quick monetary break-even in ${breakEvenYearsMoney.toFixed(2)} years (+${moneyBreakEvenWeight.toFixed(1)} points - very fast payback, weight: ${(costWeight * 100).toFixed(0)}%)`
        );
      } else if (breakEvenYearsMoney < timeHorizonYears * 0.5) {
        score += moneyBreakEvenWeight * 0.75;
        reasons.push(
          `Reasonable monetary break-even in ${breakEvenYearsMoney.toFixed(2)} years (+${(moneyBreakEvenWeight * 0.75).toFixed(1)} points - good payback)`
        );
      } else if (breakEvenYearsMoney < timeHorizonYears) {
        score += moneyBreakEvenWeight * 0.5;
        reasons.push(
          `Monetary break-even within time horizon at ${breakEvenYearsMoney.toFixed(2)} years (+${(moneyBreakEvenWeight * 0.5).toFixed(1)} points - acceptable payback)`
        );
      } else {
        reasons.push(
          `Monetary break-even beyond time horizon at ${breakEvenYearsMoney.toFixed(2)} years (0 points - too long)`
        );
      }
    } else {
      reasons.push('Never breaks even monetarily (0 points - infinite payback time)');
    }

    // Factor 3b: Time-based Break-even (weighted by throughput preference)
    const timeBreakEvenWeight = 20 * throughputWeight;
    maxScore += timeBreakEvenWeight;
    if (isFinite(breakEvenYears)) {
      if (breakEvenYears < timeHorizonYears * 0.25) {
        score += timeBreakEvenWeight;
        reasons.push(
          `Quick time-based break-even in ${breakEvenYears.toFixed(2)} years (+${timeBreakEvenWeight.toFixed(1)} points - very fast payback, weight: ${(throughputWeight * 100).toFixed(0)}%)`
        );
      } else if (breakEvenYears < timeHorizonYears * 0.5) {
        score += timeBreakEvenWeight * 0.75;
        reasons.push(
          `Reasonable time-based break-even in ${breakEvenYears.toFixed(2)} years (+${(timeBreakEvenWeight * 0.75).toFixed(1)} points - good payback)`
        );
      } else if (breakEvenYears < timeHorizonYears) {
        score += timeBreakEvenWeight * 0.5;
        reasons.push(
          `Time-based break-even within time horizon at ${breakEvenYears.toFixed(2)} years (+${(timeBreakEvenWeight * 0.5).toFixed(1)} points - acceptable payback)`
        );
      } else {
        reasons.push(
          `Time-based break-even beyond time horizon at ${breakEvenYears.toFixed(2)} years (0 points - too long)`
        );
      }
    } else {
      reasons.push('Never breaks even on time (0 points - infinite payback time)');
    }

    // Factor 4: Speed gain magnitude (10 points)
    maxScore += 10;
    if (speedGainFraction > 0.5) {
      score += 10;
      reasons.push(
        `Major speed improvement of ${(speedGainFraction * 100).toFixed(1)}% (+10 points)`
      );
    } else if (speedGainFraction > 0.3) {
      score += 8;
      reasons.push(
        `Significant speed improvement of ${(speedGainFraction * 100).toFixed(1)}% (+8 points)`
      );
    } else if (speedGainFraction > 0.1) {
      score += 5;
      reasons.push(
        `Moderate speed improvement of ${(speedGainFraction * 100).toFixed(1)}% (+5 points)`
      );
    } else {
      score += 2;
      reasons.push(
        `Minor speed improvement of ${(speedGainFraction * 100).toFixed(1)}% (+2 points)`
      );
    }

    // Calculate confidence
    const confidence = (score / maxScore) * 100;

    // Make decision
    let decision: 'YES' | 'NO' | 'MAYBE';
    if (confidence >= 60) {
      decision = 'YES';
    } else if (confidence >= 40) {
      decision = 'MAYBE';
    } else {
      decision = 'NO';
    }

    return {
      decision,
      confidence: confidence.toFixed(1),
      reasoning: reasons,
    };
  }

  /**
   * Calculate whether the optimization is worth it
   */
  public calculate(params: CalculatorParams): CalculationResult {
    // Convert all inputs to consistent units
    const ratePerHour = this.convertRateToPerHour(params.rate, params.rateUnit);
    const durationHours = this.convertToHours(params.duration, params.durationUnit);
    const maintenanceHoursPerYear = this.convertMaintenanceToHoursPerYear(
      params.maintenance,
      params.maintenanceUnit
    );
    const timeHorizonYears = this.convertTimeHorizonToYears(
      params.timeHorizon,
      params.timeHorizonUnit
    );

    // Calculate total requests over time horizon
    const totalRequestsPerYear = ratePerHour * this.HOURS_PER_DAY * this.DAYS_PER_YEAR;
    const totalRequestsOverHorizon = totalRequestsPerYear * timeHorizonYears;

    // Calculate time savings
    const speedGainFraction = params.speedGain / 100;
    const timeSavedPerRequest = durationHours * speedGainFraction;
    const totalTimeSaved = timeSavedPerRequest * totalRequestsOverHorizon;

    // Calculate costs (time-based)
    const implementationCost = params.implementationTime;
    const maintenanceCost = maintenanceHoursPerYear * timeHorizonYears;
    const totalCost = implementationCost + maintenanceCost;

    // Calculate net benefit (time-based)
    const netBenefit = totalTimeSaved - totalCost;

    // Calculate monetary savings
    // Compute cost savings = time saved * cost per hour of compute
    const totalComputeHoursSaved = totalTimeSaved;
    const computeCostSavings = totalComputeHoursSaved * params.computeCostPerHour;

    // Implementation cost in money (developer time)
    const implementationCostMoney = params.implementationTime * params.developerHourlyRate;

    // Maintenance cost in money (developer time)
    const maintenanceCostMoney = maintenanceCost * params.developerHourlyRate;

    // Total cost in money
    const totalCostMoney = implementationCostMoney + maintenanceCostMoney;

    // Net benefit in money
    const netBenefitMoney = computeCostSavings - totalCostMoney;

    // Calculate ROI (time-based)
    const roi = totalCost > 0 ? (netBenefit / totalCost) * 100 : 0;

    // Calculate ROI (money-based)
    const roiMoney = totalCostMoney > 0 ? (netBenefitMoney / totalCostMoney) * 100 : 0;

    // Calculate break-even time (in years)
    const breakEvenYears =
      totalTimeSaved > 0 ? totalCost / (totalTimeSaved / timeHorizonYears) : Infinity;

    // Calculate break-even time in money (in years)
    const breakEvenYearsMoney =
      computeCostSavings > 0 ? totalCostMoney / (computeCostSavings / timeHorizonYears) : Infinity;

    // Decision logic with confidence calculation
    const decision = this.makeDecision(
      {
        netBenefit,
        roi,
        breakEvenYears,
        timeHorizonYears,
        speedGainFraction,
        totalTimeSaved,
        totalCost,
      },
      {
        netBenefitMoney,
        roiMoney,
        breakEvenYearsMoney,
        computeCostSavings,
        totalCostMoney,
      },
      params.optimizationPreference
    );

    return {
      decision: decision.decision,
      confidence: decision.confidence,
      metrics: {
        ratePerHour: ratePerHour.toFixed(2),
        durationHours: durationHours.toFixed(6),
        totalRequestsPerYear: totalRequestsPerYear.toFixed(0),
        totalRequestsOverHorizon: totalRequestsOverHorizon.toFixed(0),
        timeSavedPerRequest: timeSavedPerRequest.toFixed(8),
        totalTimeSaved: totalTimeSaved.toFixed(2),
        implementationCost: implementationCost.toFixed(2),
        maintenanceCost: maintenanceCost.toFixed(2),
        totalCost: totalCost.toFixed(2),
        netBenefit: netBenefit.toFixed(2),
        roi: roi.toFixed(2),
        breakEvenYears: isFinite(breakEvenYears) ? breakEvenYears.toFixed(2) : '∞',
        // Monetary metrics
        computeCostSavings: computeCostSavings.toFixed(2),
        implementationCostMoney: implementationCostMoney.toFixed(2),
        maintenanceCostMoney: maintenanceCostMoney.toFixed(2),
        totalCostMoney: totalCostMoney.toFixed(2),
        netBenefitMoney: netBenefitMoney.toFixed(2),
        roiMoney: roiMoney.toFixed(2),
        breakEvenYearsMoney: isFinite(breakEvenYearsMoney) ? breakEvenYearsMoney.toFixed(2) : '∞',
      },
      reasoning: decision.reasoning,
    };
  }
}
