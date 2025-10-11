import type { CalculatorParams } from './types';

/**
 * Default values for calculator parameters
 */
export const DEFAULT_CALCULATOR_PARAMS: CalculatorParams = {
  rate: 100,
  rateUnit: 'second',
  duration: 500,
  durationUnit: 'millisecond',
  speedGain: 20,
  maintenance: 2,
  maintenanceUnit: 'hour-per-week',
  implementationTime: 40,
  timeHorizon: 1,
  timeHorizonUnit: 'year',
  computeCostPerHour: 0.5,
  developerHourlyRate: 75,
  optimizationPreference: 50, // Balanced by default
};

/**
 * Settings class that manages calculator parameters with local storage persistence
 */
export class Settings {
  private static readonly STORAGE_KEY = 'iiwsit-calculator-settings';

  /**
   * Load settings from localStorage, falling back to defaults if not found
   */
  static load(): CalculatorParams {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new fields or missing fields
        return { ...DEFAULT_CALCULATOR_PARAMS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }

    return { ...DEFAULT_CALCULATOR_PARAMS };
  }

  /**
   * Save settings to localStorage
   */
  static save(params: CalculatorParams): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(params));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }

  /**
   * Reset settings to defaults and clear localStorage
   */
  static reset(): CalculatorParams {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear settings from localStorage:', error);
    }

    return { ...DEFAULT_CALCULATOR_PARAMS };
  }

  /**
   * Check if settings exist in localStorage
   */
  static hasStoredSettings(): boolean {
    try {
      return localStorage.getItem(this.STORAGE_KEY) !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get a specific setting value with fallback to default
   */
  static get<K extends keyof CalculatorParams>(key: K): CalculatorParams[K] {
    const settings = this.load();
    return settings[key];
  }

  /**
   * Update a specific setting and save to localStorage
   */
  static update<K extends keyof CalculatorParams>(key: K, value: CalculatorParams[K]): void {
    const settings = this.load();
    settings[key] = value;
    this.save(settings);
  }

  /**
   * Update multiple settings at once and save to localStorage
   */
  static updateMultiple(updates: Partial<CalculatorParams>): void {
    const settings = this.load();
    Object.assign(settings, updates);
    this.save(settings);
  }
}
