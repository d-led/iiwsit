/**
 * Presentation utilities for formatting and generating user-facing text
 * These are pure functions with no DOM dependencies
 */

/**
 * Generate confidence explanation based on confidence percentage
 */
export function getConfidenceExplanation(confidence: number): string {
  const riskPercent = (100 - confidence).toFixed(0);

  if (confidence >= 80) {
    return `Proceed with confidence - estimated ${riskPercent}% risk of negative outcome`;
  } else if (confidence >= 65) {
    return `Likely beneficial - estimated ${riskPercent}% risk of negative outcome`;
  } else if (confidence >= 50) {
    return `Mixed signals - estimated ${riskPercent}% risk of negative outcome`;
  } else if (confidence >= 35) {
    return `Risky proposition - estimated ${riskPercent}% risk of negative outcome`;
  } else {
    return `High risk - estimated ${riskPercent}% risk of negative outcome`;
  }
}

/**
 * Generate dynamic confidence factors explanation based on optimization preference
 */
export function generateConfidenceFactorsText(costWeight: number, throughputWeight: number): string {
  // Calculate the actual weights used in the scoring system
  const financialBenefitWeight = Math.round(40 * costWeight);
  const timeBenefitWeight = Math.round(40 * throughputWeight);
  const financialROIWeight = Math.round(30 * costWeight);
  const timeROIWeight = Math.round(30 * throughputWeight);
  const financialBreakEvenWeight = Math.round(20 * costWeight);
  const timeBreakEvenWeight = Math.round(20 * throughputWeight);
  const failureImpactWeight = 15; // This stays constant
  const speedGainWeight = 10; // This stays constant

  const factors: string[] = [];

  if (financialBenefitWeight > 0) {
    factors.push(`Financial Benefit (${financialBenefitWeight}%)`);
  }
  if (timeBenefitWeight > 0) {
    factors.push(`Time Benefit (${timeBenefitWeight}%)`);
  }
  if (financialROIWeight > 0) {
    factors.push(`Financial ROI (${financialROIWeight}%)`);
  }
  if (timeROIWeight > 0) {
    factors.push(`Time ROI (${timeROIWeight}%)`);
  }
  if (financialBreakEvenWeight > 0) {
    factors.push(`Financial Break-Even (${financialBreakEvenWeight}%)`);
  }
  if (timeBreakEvenWeight > 0) {
    factors.push(`Time Break-Even (${timeBreakEvenWeight}%)`);
  }
  if (failureImpactWeight > 0) {
    factors.push(`Failure Rate Impact (${failureImpactWeight}%)`);
  }
  if (speedGainWeight > 0) {
    factors.push(`Speed Gain (${speedGainWeight}%)`);
  }

  return `Confidence is based on ${factors.length} factors: ${factors.join(', ')}`;
}

/**
 * Generate context-aware confidence message based on optimization preference
 */
export function generateConfidenceMessage(confidenceValue: number, decision: string, optimizationPreference: number): string {
  const confidencePercent = confidenceValue.toFixed(0);

  // Determine the optimization focus context
  let focusContext = '';
  if (optimizationPreference < 33) {
    focusContext = ' from a cost optimization perspective';
  } else if (optimizationPreference > 67) {
    focusContext = ' from a throughput optimization perspective';
  } else {
    focusContext = ' from a balanced perspective';
  }

  if (decision === 'proceed') {
    return `${confidencePercent}% confident this optimization is beneficial${focusContext}`;
  } else {
    return `${confidencePercent}% confident this optimization is not worthwhile${focusContext}`;
  }
}

