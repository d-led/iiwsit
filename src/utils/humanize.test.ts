import { describe, it, expect } from 'vitest';
import { humanizeYears, formatNumber, formatMoney, humanizeHours } from './humanize';

describe('humanizeYears', () => {
  it('should handle infinity', () => {
    expect(humanizeYears('∞')).toBe('Never');
    expect(humanizeYears(Infinity)).toBe('Never');
    expect(humanizeYears('Infinity')).toBe('Never');
  });

  it('should handle NaN and invalid values', () => {
    expect(humanizeYears(NaN)).toBe('Never');
    expect(humanizeYears('invalid')).toBe('Never');
  });

  it('should format small durations (less than a day)', () => {
    const result = humanizeYears(0.001); // ~8.76 hours
    expect(result).toContain('hour');
  });

  it('should format durations in days', () => {
    const result = humanizeYears(0.01); // ~3.65 days
    expect(result).toContain('d');
  });

  it('should format durations in months and years', () => {
    const result = humanizeYears(1.5); // 1.5 years
    expect(result).toMatch(/y|mo/);
  });

  it('should format whole years', () => {
    const result = humanizeYears(2);
    expect(result).toContain('y');
  });

  it('should handle string input', () => {
    const result = humanizeYears('1.5');
    expect(result).toMatch(/y|mo/);
  });
});

describe('formatNumber', () => {
  it('should format numbers with default decimals (0)', () => {
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(1234567)).toBe('1.2M');
  });

  it('should format numbers with specified decimals', () => {
    expect(formatNumber(123.456, 2)).toBe('123.46');
  });

  it('should handle large numbers with K/M/B notation', () => {
    expect(formatNumber(15000)).toBe('15.0K');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(1500000000)).toBe('1.5B');
  });

  it('should handle small numbers', () => {
    expect(formatNumber(123)).toBe('123');
    expect(formatNumber(1234)).toBe('1,234');
  });

  it('should handle string input', () => {
    expect(formatNumber('1234')).toBe('1,234');
  });

  it('should handle NaN', () => {
    expect(formatNumber(NaN)).toBe('0');
    expect(formatNumber('invalid')).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234');
    expect(formatNumber(-15000)).toBe('-15.0K');
  });
});

describe('formatMoney', () => {
  it('should format money with default decimals (2)', () => {
    expect(formatMoney(1234.56)).toBe('💰 1,234.56');
  });

  it('should format large amounts with K/M/B notation', () => {
    expect(formatMoney(15000)).toBe('💰 15.0K');
    expect(formatMoney(1500000)).toBe('💰 1.5M');
    expect(formatMoney(1500000000)).toBe('💰 1.5B');
  });

  it('should handle small amounts', () => {
    expect(formatMoney(123.45)).toBe('💰 123.45');
  });

  it('should handle string input', () => {
    expect(formatMoney('1234.56')).toBe('💰 1,234.56');
  });

  it('should handle NaN', () => {
    expect(formatMoney(NaN)).toBe('💰 0.00');
    expect(formatMoney('invalid')).toBe('💰 0.00');
  });

  it('should handle negative amounts', () => {
    expect(formatMoney(-1234.56)).toBe('-💰 1,234.56');
    expect(formatMoney(-15000)).toBe('-💰 15.0K');
  });

  it('should handle zero', () => {
    expect(formatMoney(0)).toBe('💰 0.00');
  });
});

describe('humanizeHours', () => {
  it('should handle NaN and invalid values', () => {
    expect(humanizeHours(NaN)).toBe('0 hours');
    expect(humanizeHours('invalid')).toBe('0 hours');
    expect(humanizeHours(Infinity)).toBe('0 hours');
  });

  it('should format sub-hour durations', () => {
    const result = humanizeHours(0.5); // 30 minutes
    expect(result).toContain('minute');
  });

  it('should format durations less than a day', () => {
    const result = humanizeHours(5); // 5 hours
    expect(result).toContain('hour');
  });

  it('should format durations in days', () => {
    const result = humanizeHours(48); // 2 days
    expect(result).toContain('day');
  });

  it('should format long durations', () => {
    const result = humanizeHours(24 * 365); // 1 year
    expect(result).toMatch(/y|mo|w|d/);
  });

  it('should handle string input', () => {
    const result = humanizeHours('24');
    expect(result).toContain('day');
  });

  it('should handle zero', () => {
    const result = humanizeHours(0);
    expect(result).toContain('0');
  });
});

