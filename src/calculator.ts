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
   */
  private makeDecision(
    timeFactors: DecisionFactors,
    moneyFactors: {
      netBenefitMoney: number;
      roiMoney: number;
      breakEvenYearsMoney: number;
      computeCostSavings: number;
      totalCostMoney: number;
    }
  ): DecisionResult {
    const { timeHorizonYears, failureRateChange, speedGainFraction } = timeFactors;

    const { netBenefitMoney, roiMoney, breakEvenYearsMoney } = moneyFactors;

    let score = 0;
    let maxScore = 0;
    const reasons: string[] = [];

    // Add explanation of the scoring system
    reasons.push(
      'Scoring: Each factor contributes points based on its impact. Higher scores indicate stronger recommendations.'
    );

    // Factor 1: Monetary Net Benefit (40 points) - PRIMARY DRIVER
    maxScore += 40;
    if (netBenefitMoney > 0) {
      const benefitScore = Math.min(40, (netBenefitMoney / moneyFactors.totalCostMoney) * 15);
      score += benefitScore;
      reasons.push(
        `Positive financial benefit of 💰${netBenefitMoney.toFixed(2)} (+${benefitScore.toFixed(1)} points)`
      );
    } else {
      reasons.push(
        `Negative financial benefit of 💰${Math.abs(netBenefitMoney).toFixed(2)} (0 points - no benefit)`
      );
    }

    // Factor 2: ROI (30 points) - Monetary focus
    maxScore += 30;
    let roiScore = 0;

    if (roiMoney > 200) {
      roiScore += 30;
      reasons.push(
        `Excellent monetary ROI of ${roiMoney.toFixed(0)}% (+30 points - exceptional return)`
      );
    } else if (roiMoney > 100) {
      roiScore += 25;
      reasons.push(`Great monetary ROI of ${roiMoney.toFixed(0)}% (+25 points - strong return)`);
    } else if (roiMoney > 50) {
      roiScore += 20;
      reasons.push(`Good monetary ROI of ${roiMoney.toFixed(0)}% (+20 points - solid return)`);
    } else if (roiMoney > 20) {
      roiScore += 15;
      reasons.push(`Moderate monetary ROI of ${roiMoney.toFixed(0)}% (+15 points - decent return)`);
    } else if (roiMoney > 0) {
      roiScore += 10;
      reasons.push(`Low monetary ROI of ${roiMoney.toFixed(0)}% (+10 points - minimal return)`);
    } else {
      reasons.push(`Negative monetary ROI of ${roiMoney.toFixed(0)}% (0 points - no return)`);
    }
    score += roiScore;

    // Factor 3: Break-even time (20 points) - Monetary focus
    maxScore += 20;
    if (isFinite(breakEvenYearsMoney)) {
      if (breakEvenYearsMoney < timeHorizonYears * 0.25) {
        score += 20;
        reasons.push(
          `Quick monetary break-even in ${breakEvenYearsMoney.toFixed(2)} years (+20 points - very fast payback)`
        );
      } else if (breakEvenYearsMoney < timeHorizonYears * 0.5) {
        score += 15;
        reasons.push(
          `Reasonable monetary break-even in ${breakEvenYearsMoney.toFixed(2)} years (+15 points - good payback)`
        );
      } else if (breakEvenYearsMoney < timeHorizonYears) {
        score += 10;
        reasons.push(
          `Monetary break-even within time horizon at ${breakEvenYearsMoney.toFixed(2)} years (+10 points - acceptable payback)`
        );
      } else {
        reasons.push(
          `Monetary break-even beyond time horizon at ${breakEvenYearsMoney.toFixed(2)} years (0 points - too long)`
        );
      }
    } else {
      reasons.push('Never breaks even monetarily (0 points - infinite payback time)');
    }

    // Factor 4: Failure rate improvement (15 points)
    maxScore += 15;
    if (failureRateChange > 0.03) {
      score += 15;
      reasons.push(
        `Significant failure rate reduction of ${(failureRateChange * 100).toFixed(2)}% (+15 points - major reliability improvement)`
      );
    } else if (failureRateChange > 0.01) {
      score += 10;
      reasons.push(
        `Moderate failure rate reduction of ${(failureRateChange * 100).toFixed(2)}% (+10 points - good reliability improvement)`
      );
    } else if (failureRateChange > 0) {
      score += 5;
      reasons.push(
        `Small failure rate reduction of ${(failureRateChange * 100).toFixed(2)}% (+5 points - minor reliability improvement)`
      );
    } else if (failureRateChange === 0) {
      score += 7;
      reasons.push('No change in failure rate (+7 points - no additional risk)');
    } else if (failureRateChange > -0.01) {
      score += 3;
      reasons.push(
        `Minor failure rate increase of ${(Math.abs(failureRateChange) * 100).toFixed(2)}% (+3 points - acceptable risk increase)`
      );
    } else {
      reasons.push(
        `Significant failure rate increase of ${(Math.abs(failureRateChange) * 100).toFixed(2)}% (0 points - major risk increase)`
      );
    }

    // Factor 5: Speed gain magnitude (10 points)
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

    // Calculate failure impact
    const currentFailureRate = params.currentFailure / 100;
    const bugFailureRate = params.bugFailure / 100;
    const currentFailedRequests = totalRequestsOverHorizon * currentFailureRate;
    const bugFailedRequests = totalRequestsOverHorizon * bugFailureRate;

    // Net failure change (positive means fewer failures)
    const failureRateChange = (params.currentFailure - params.bugFailure) / 100;

    // Decision logic with confidence calculation
    const decision = this.makeDecision(
      {
        netBenefit,
        roi,
        breakEvenYears,
        timeHorizonYears,
        failureRateChange,
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
      }
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
        currentFailedRequests: currentFailedRequests.toFixed(0),
        bugFailedRequests: bugFailedRequests.toFixed(0),
        netFailureChange: (currentFailedRequests - bugFailedRequests).toFixed(0),
        failureRateChange: (failureRateChange * 100).toFixed(2),
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
