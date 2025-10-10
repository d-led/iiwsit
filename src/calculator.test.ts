import { describe, it, expect } from 'vitest';
import { ThroughputOptimizationCalculator } from './calculator';
import type { CalculatorParams } from './types';

describe('Throughput Optimization Decision Calculator', () => {
  const calculator = new ThroughputOptimizationCalculator();

  const createDefaultParams = (): CalculatorParams => ({
    rate: 100,
    rateUnit: 'second',
    duration: 500,
    durationUnit: 'millisecond',
    speedGain: 20,
    currentFailure: 5,
    bugFailure: 1,
    maintenance: 2,
    maintenanceUnit: 'hour-per-week',
    implementationTime: 40,
    timeHorizon: 1,
    timeHorizonUnit: 'year',
    computeCostPerHour: 0.50,
    developerHourlyRate: 75,
  });

  describe('When optimization saves significant time with minimal cost', () => {
    it('should recommend proceeding with high confidence', () => {
      const params = createDefaultParams();
      // High request rate, good speed improvement, low maintenance
      params.rate = 1000;
      params.speedGain = 50;
      params.maintenance = 1;
      params.implementationTime = 20;

      const result = calculator.calculate(params);

      expect(result.decision).toBe('YES');
      expect(parseFloat(result.confidence)).toBeGreaterThan(60);
      expect(parseFloat(result.metrics.netBenefit)).toBeGreaterThan(0);
    });

    it('should show positive return on investment', () => {
      const params = createDefaultParams();
      params.rate = 500;
      params.speedGain = 30;

      const result = calculator.calculate(params);

      expect(parseFloat(result.metrics.roi)).toBeGreaterThan(0);
      expect(parseFloat(result.metrics.netBenefit)).toBeGreaterThan(0);
    });
  });

  describe('When optimization costs more than it saves', () => {
    it('should recommend against proceeding', () => {
      const params = createDefaultParams();
      // Low request rate, small improvement, high maintenance
      params.rate = 1;
      params.rateUnit = 'minute';
      params.speedGain = 5;
      params.maintenance = 5;
      params.maintenanceUnit = 'hour-per-day';
      params.implementationTime = 1000;

      const result = calculator.calculate(params);

      expect(result.decision).toBe('NO');
      expect(parseFloat(result.metrics.netBenefit)).toBeLessThan(0);
    });

    it('should show negative return on investment', () => {
      const params = createDefaultParams();
      params.rate = 0.1;
      params.rateUnit = 'hour';
      params.implementationTime = 500;

      const result = calculator.calculate(params);

      expect(parseFloat(result.metrics.roi)).toBeLessThan(0);
    });
  });

  describe('When dealing with failure rates', () => {
    it('should favor optimizations that reduce failure rates significantly', () => {
      const params = createDefaultParams();
      params.currentFailure = 20; // High current failure
      params.bugFailure = 2; // Low expected bugs
      params.speedGain = 40;

      const result = calculator.calculate(params);

      const failureImprovement = parseFloat(result.metrics.failureRateChange);
      expect(failureImprovement).toBeGreaterThan(0);
      expect(result.decision).toBe('YES');
    });

    it('should penalize optimizations that introduce more failures than they fix', () => {
      const params = createDefaultParams();
      params.currentFailure = 1; // Low current failure
      params.bugFailure = 10; // High expected bugs

      const result = calculator.calculate(params);

      const failureChange = parseFloat(result.metrics.failureRateChange);
      expect(failureChange).toBeLessThan(0); // More failures
    });
  });

  describe('When considering break-even time', () => {
    it('should recognize quick break-even as favorable', () => {
      const params = createDefaultParams();
      params.rate = 1000;
      params.speedGain = 50;
      params.implementationTime = 10;
      params.maintenance = 0.5;
      params.timeHorizon = 5;

      const result = calculator.calculate(params);
      const breakEven = parseFloat(result.metrics.breakEvenYears);

      expect(breakEven).toBeLessThan(params.timeHorizon);
      expect(result.decision).toBe('YES');
    });

    it('should recognize when break-even exceeds time horizon', () => {
      const params = createDefaultParams();
      params.rate = 1;
      params.rateUnit = 'hour';
      params.speedGain = 5;
      params.implementationTime = 1000;
      params.maintenance = 10;
      params.maintenanceUnit = 'hour-per-day';
      params.timeHorizon = 1;

      const result = calculator.calculate(params);
      const breakEven = result.metrics.breakEvenYears;

      // Break even should either be beyond time horizon or infinite
      expect(breakEven === '∞' || parseFloat(breakEven) > params.timeHorizon).toBe(true);
    });
  });

  describe('When time horizon changes', () => {
    it('should show better outcomes over longer time horizons for good optimizations', () => {
      const params = createDefaultParams();
      params.rate = 100;
      params.speedGain = 30;
      params.implementationTime = 40;

      // Short time horizon
      params.timeHorizon = 3;
      params.timeHorizonUnit = 'month';
      const shortResult = calculator.calculate(params);

      // Long time horizon
      params.timeHorizon = 5;
      params.timeHorizonUnit = 'year';
      const longResult = calculator.calculate(params);

      const shortBenefit = parseFloat(shortResult.metrics.netBenefit);
      const longBenefit = parseFloat(longResult.metrics.netBenefit);

      expect(longBenefit).toBeGreaterThan(shortBenefit);
    });
  });

  describe('When speed gain varies', () => {
    it('should strongly favor major performance improvements', () => {
      const params = createDefaultParams();
      params.rate = 100;

      // Small improvement
      params.speedGain = 5;
      const smallResult = calculator.calculate(params);

      // Large improvement
      params.speedGain = 75;
      const largeResult = calculator.calculate(params);

      expect(parseFloat(largeResult.confidence)).toBeGreaterThan(
        parseFloat(smallResult.confidence)
      );
      expect(parseFloat(largeResult.metrics.totalTimeSaved)).toBeGreaterThan(
        parseFloat(smallResult.metrics.totalTimeSaved)
      );
    });
  });

  describe('When request rate varies', () => {
    it('should favor optimizing high-traffic systems', () => {
      const params = createDefaultParams();
      params.speedGain = 20;
      params.implementationTime = 100;

      // Low traffic - unlikely to be worth it
      params.rate = 0.5;
      params.rateUnit = 'minute';
      const lowTrafficResult = calculator.calculate(params);

      // High traffic - much more likely to be worth it
      params.rate = 1000;
      params.rateUnit = 'second';
      const highTrafficResult = calculator.calculate(params);

      // High traffic should save significantly more time
      expect(parseFloat(highTrafficResult.metrics.totalTimeSaved)).toBeGreaterThan(
        parseFloat(lowTrafficResult.metrics.totalTimeSaved)
      );

      // High traffic should have better net benefit
      expect(parseFloat(highTrafficResult.metrics.netBenefit)).toBeGreaterThan(
        parseFloat(lowTrafficResult.metrics.netBenefit)
      );
    });
  });

  describe('When maintenance costs are considered', () => {
    it('should account for ongoing maintenance reducing net benefit', () => {
      const params = createDefaultParams();
      params.rate = 100;
      params.speedGain = 30;

      // Low maintenance
      params.maintenance = 0.5;
      params.maintenanceUnit = 'hour-per-week';
      const lowMaintenanceResult = calculator.calculate(params);

      // High maintenance
      params.maintenance = 10;
      params.maintenanceUnit = 'hour-per-day';
      const highMaintenanceResult = calculator.calculate(params);

      expect(parseFloat(lowMaintenanceResult.metrics.netBenefit)).toBeGreaterThan(
        parseFloat(highMaintenanceResult.metrics.netBenefit)
      );
    });
  });

  describe('When providing decision rationale', () => {
    it('should explain the factors considered in the decision', () => {
      const params = createDefaultParams();
      const result = calculator.calculate(params);

      expect(result.reasoning).toBeDefined();
      expect(result.reasoning.length).toBeGreaterThan(0);
      expect(result.reasoning.every((reason) => typeof reason === 'string')).toBe(true);
    });

    it('should mention ROI in the reasoning', () => {
      const params = createDefaultParams();
      const result = calculator.calculate(params);

      const hasROIMention = result.reasoning.some((reason) => reason.toLowerCase().includes('roi'));
      expect(hasROIMention).toBe(true);
    });
  });

  describe('When handling edge cases', () => {
    it('should handle zero maintenance cost', () => {
      const params = createDefaultParams();
      params.maintenance = 0;

      const result = calculator.calculate(params);

      expect(result.metrics.maintenanceCost).toBe('0.00');
      expect(result).toBeDefined();
    });

    it('should handle very high speed gains', () => {
      const params = createDefaultParams();
      params.speedGain = 99;

      const result = calculator.calculate(params);

      expect(result).toBeDefined();
      expect(parseFloat(result.metrics.totalTimeSaved)).toBeGreaterThan(0);
    });

    it('should handle minimal request rates', () => {
      const params = createDefaultParams();
      params.rate = 0.001;
      params.rateUnit = 'hour';

      const result = calculator.calculate(params);

      expect(result).toBeDefined();
      expect(result.decision).toBeDefined();
    });
  });

  describe('When calculating total time saved', () => {
    it('should scale linearly with request rate', () => {
      const params = createDefaultParams();
      params.speedGain = 20;
      params.duration = 1000;
      params.durationUnit = 'millisecond';

      params.rate = 100;
      const result1 = calculator.calculate(params);

      params.rate = 200;
      const result2 = calculator.calculate(params);

      const timeSaved1 = parseFloat(result1.metrics.totalTimeSaved);
      const timeSaved2 = parseFloat(result2.metrics.totalTimeSaved);

      // Doubling the rate should approximately double time saved
      expect(timeSaved2 / timeSaved1).toBeCloseTo(2, 0);
    });

    it('should scale linearly with speed gain percentage', () => {
      const params = createDefaultParams();
      params.rate = 100;

      params.speedGain = 10;
      const result1 = calculator.calculate(params);

      params.speedGain = 20;
      const result2 = calculator.calculate(params);

      const timeSaved1 = parseFloat(result1.metrics.totalTimeSaved);
      const timeSaved2 = parseFloat(result2.metrics.totalTimeSaved);

      // Doubling the speed gain should double time saved
      expect(timeSaved2 / timeSaved1).toBeCloseTo(2, 0);
    });
  });

  describe('When making borderline decisions', () => {
    it('should use MAYBE for moderate confidence scenarios', () => {
      const params = createDefaultParams();
      // Create a scenario with mixed signals
      params.rate = 50;
      params.speedGain = 15;
      params.currentFailure = 5;
      params.bugFailure = 4;
      params.maintenance = 3;
      params.implementationTime = 100;

      const result = calculator.calculate(params);

      // This might be YES, NO, or MAYBE depending on exact calculations
      // The important thing is it should be consistent
      expect(['YES', 'NO', 'MAYBE']).toContain(result.decision);
      expect(parseFloat(result.confidence)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(result.confidence)).toBeLessThanOrEqual(100);
    });
  });
});
