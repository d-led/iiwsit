/**
 * UI module for DOM manipulation and display logic
 */
import type { CalculationResult } from './types';
import { humanizeYears } from './utils/humanize';
import {
  getConfidenceExplanation,
  generateConfidenceFactorsText,
  generateConfidenceMessage,
} from './presentation';

/**
 * Display app version in footer
 */
export function displayVersion(): void {
  const versionElement = document.getElementById('app-version');
  if (versionElement) {
    // These will be replaced at build time by Vite
    const branch = typeof __GIT_BRANCH__ !== 'undefined' ? __GIT_BRANCH__ : 'dev';
    const commit = typeof __GIT_COMMIT__ !== 'undefined' ? __GIT_COMMIT__ : 'local';
    versionElement.textContent = `${branch}-${commit}`;
  }
}

/**
 * Update floating bubble content and styling
 */
export function updateFloatingBubble(decision: string, confidence: string): void {
  const floatingBubble = document.getElementById('floating-bubble') as HTMLDivElement;
  const bubbleButton = document.getElementById('bubble-button') as HTMLButtonElement;
  const bubbleDecision = document.getElementById('bubble-decision') as HTMLDivElement;
  const bubbleConfidence = document.getElementById('bubble-confidence') as HTMLDivElement;

  // Update bubble content
  bubbleDecision.textContent = decision;
  bubbleConfidence.textContent = `${confidence}%`;

  // Update bubble styling based on decision
  bubbleButton.className = 'btn btn-circle shadow-2xl hover:scale-110 transition-transform';
  bubbleButton.style.width = '70px';
  bubbleButton.style.height = '70px';

  if (decision === 'YES') {
    bubbleButton.classList.add('btn-yes');
  } else if (decision === 'NO') {
    bubbleButton.classList.add('btn-no');
  } else {
    bubbleButton.classList.add('btn-maybe');
  }

  // Show bubble with animation
  floatingBubble.style.display = 'block';
  setTimeout(() => {
    floatingBubble.classList.add('show');
  }, 100);
}

/**
 * Display calculation results in the UI
 * Story: Show the results to the user in a clear, organized way
 */
export function displayResults(result: CalculationResult): void {
  // Show the results section
  showResultsSection();

  // Update mobile bubble with quick decision summary
  updateFloatingBubble(result.decision, result.confidence);

  // Display the main decision prominently
  displayDecisionBadge(result);

  // Show confidence information with context
  displayConfidenceInformation(result);

  // Display all calculated metrics
  displayMetricsTable(result);

  // Display detailed explanation
  displayExplanation(result);
}

// ============================================================================
// Display Result Components (Literate Programming Pattern)
// ============================================================================

/**
 * Show the results section and hide the placeholder
 */
function showResultsSection(): void {
  const resultsSection = document.getElementById('results-section') as HTMLDivElement;
  const resultsPlaceholder = document.getElementById('results-placeholder') as HTMLDivElement;

  resultsSection.style.display = 'block';
  resultsPlaceholder.style.display = 'none';
}

/**
 * Display the decision badge with appropriate styling
 */
function displayDecisionBadge(result: CalculationResult): void {
  const decisionBadge = document.getElementById('decision-badge') as HTMLDivElement;

  decisionBadge.textContent = result.decision;
  decisionBadge.className = 'text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4';

  const styleClass = getDecisionStyleClass(result.decision);
  if (styleClass) {
    decisionBadge.classList.add(styleClass);
  }
}

/**
 * Get the CSS class for a decision type
 */
function getDecisionStyleClass(decision: string): string {
  switch (decision) {
    case 'YES':
      return 'decision-yes';
    case 'NO':
      return 'decision-no';
    case 'MAYBE':
      return 'decision-maybe';
    default:
      return '';
  }
}

/**
 * Display confidence information with context and explanation
 */
function displayConfidenceInformation(result: CalculationResult): void {
  const confidence = document.getElementById('confidence') as HTMLDivElement;

  const confidenceValue = parseFloat(result.confidence);
  const decision = result.decision === 'YES' ? 'proceed' : 'not proceed';
  const optimizationPreference = getOptimizationPreferenceValue();

  // Display main confidence message
  displayMainConfidenceMessage(confidence, result.confidence, decision, optimizationPreference);

  // Display confidence explanation
  displayConfidenceExplanationText(confidenceValue);

  // Display confidence factors
  displayConfidenceFactors(optimizationPreference);
}

/**
 * Get current optimization preference value from form
 */
function getOptimizationPreferenceValue(): number {
  const slider = document.getElementById('optimization-preference') as HTMLInputElement;
  return parseFloat(slider.value);
}

/**
 * Display the main confidence message with context
 */
function displayMainConfidenceMessage(
  confidenceElement: HTMLDivElement,
  confidence: string,
  decision: string,
  optimizationPreference: number
): void {
  const confidenceValue = parseFloat(confidence);
  const confidenceMessage = generateConfidenceMessage(
    confidenceValue,
    decision,
    optimizationPreference
  );
  confidenceElement.textContent = `Confidence: ${confidence}% (${confidenceMessage})`;
}

/**
 * Display the confidence explanation text
 */
function displayConfidenceExplanationText(confidenceValue: number): void {
  const confidenceElement = document.getElementById('confidence-explanation');
  if (confidenceElement) {
    const explanationText = getConfidenceExplanation(confidenceValue);
    confidenceElement.textContent = explanationText;
  }
}

/**
 * Display confidence factors breakdown
 */
function displayConfidenceFactors(optimizationPreference: number): void {
  const costWeight = (100 - optimizationPreference) / 100;
  const throughputWeight = optimizationPreference / 100;

  const confidenceFactorsText = generateConfidenceFactorsText(costWeight, throughputWeight);

  let confidenceFactorsElement = document.getElementById('confidence-factors');
  if (!confidenceFactorsElement) {
    confidenceFactorsElement = createConfidenceFactorsElement();
  }

  confidenceFactorsElement.textContent = confidenceFactorsText;
}

/**
 * Create confidence factors element if it doesn't exist
 */
function createConfidenceFactorsElement(): HTMLDivElement {
  const element = document.createElement('div');
  element.id = 'confidence-factors';
  element.className = 'text-xs text-base-content/50 italic mt-1';

  const confidenceElement = document.getElementById('confidence-explanation');
  if (confidenceElement && confidenceElement.parentNode) {
    confidenceElement.parentNode.insertBefore(element, confidenceElement.nextSibling);
  }

  return element;
}

/**
 * Display metrics table with all calculation results
 */
function displayMetricsTable(result: CalculationResult): void {
  const metricsTableBody = document.getElementById('metrics-table-body') as HTMLTableSectionElement;
  const metricGroups = buildMetricGroups(result.metrics);

  metricsTableBody.innerHTML = metricGroups.map((group) => renderMetricGroup(group)).join('');
}

/**
 * Build metric groups from calculation metrics
 */
function buildMetricGroups(metrics: CalculationResult['metrics']) {
  return [buildComputeResourcesGroup(metrics), buildMoneyMetricsGroup(metrics)];
}

/**
 * Build compute resources metric group
 */
function buildComputeResourcesGroup(metrics: CalculationResult['metrics']) {
  return {
    title: 'Compute Resources',
    rows: [
      { label: 'Request Rate', value: `${metrics.ratePerHour} req/hour` },
      {
        label: 'Total Requests (over time horizon)',
        value: Number(metrics.totalRequestsOverHorizon).toLocaleString(),
      },
      {
        label: 'Time Saved Per Request',
        value: `${(parseFloat(metrics.timeSavedPerRequest) * 3600000).toFixed(2)} ms`,
      },
      { label: 'Total Time Saved', value: `${metrics.totalTimeSaved} hours`, positive: true },
      { label: 'Implementation Cost', value: `${metrics.implementationCost} hours` },
      { label: 'Maintenance Cost', value: `${metrics.maintenanceCost} hours` },
      { label: 'Total Cost', value: `${metrics.totalCost} hours` },
      {
        label: 'Net Benefit',
        value: `${metrics.netBenefit} hours`,
        colored: true,
        isPositive: parseFloat(metrics.netBenefit) > 0,
      },
      {
        label: 'Return on Investment (ROI)',
        value: `${metrics.roi}%`,
        colored: true,
        isPositive: parseFloat(metrics.roi) > 0,
      },
      { label: 'Break-Even Time (Time-based)', value: humanizeYears(metrics.breakEvenYears) },
      {
        label: 'Failure Rate Change',
        value: `${parseFloat(metrics.failureRateChange) >= 0 ? '+' : ''}${metrics.failureRateChange}%`,
        colored: true,
        isPositive: parseFloat(metrics.failureRateChange) >= 0,
      },
    ],
  };
}

/**
 * Build money metrics group
 */
function buildMoneyMetricsGroup(metrics: CalculationResult['metrics']) {
  return {
    title: 'Money',
    rows: [
      {
        label: 'Compute Cost Savings',
        value: `💰${metrics.computeCostSavings}`,
        positive: true,
      },
      {
        label: 'Implementation Cost (Money)',
        value: `💰${metrics.implementationCostMoney}`,
      },
      {
        label: 'Maintenance Cost (Money)',
        value: `💰${metrics.maintenanceCostMoney}`,
      },
      {
        label: 'Total Cost (Money)',
        value: `💰${metrics.totalCostMoney}`,
      },
      {
        label: 'Net Benefit (Money)',
        value: `💰${metrics.netBenefitMoney}`,
        colored: true,
        isPositive: parseFloat(metrics.netBenefitMoney) > 0,
      },
      {
        label: 'Return on Investment (Money)',
        value: `${metrics.roiMoney}%`,
        colored: true,
        isPositive: parseFloat(metrics.roiMoney) > 0,
      },
      {
        label: 'Break-Even Time (Money-based)',
        value: humanizeYears(metrics.breakEvenYearsMoney),
      },
    ],
  };
}

/**
 * Render a metric group as HTML
 */
function renderMetricGroup(group: { title: string; rows: any[] }): string {
  const groupHeader = `
    <tr>
      <td colspan="2" class="font-bold text-lg pt-4 pb-2 border-b-2 border-base-300">${group.title}</td>
    </tr>
  `;

  const groupRows = group.rows.map((row) => renderMetricRow(row)).join('');

  return groupHeader + groupRows;
}

/**
 * Render a single metric row as HTML
 */
function renderMetricRow(row: any): string {
  const valueClass = getMetricValueClass(row);

  return `
    <tr>
      <td class="font-semibold">${row.label}</td>
      <td class="${valueClass}">${row.value}</td>
    </tr>
  `;
}

/**
 * Get the CSS class for a metric value based on its properties
 */
function getMetricValueClass(row: any): string {
  if (row.colored) {
    return row.isPositive ? 'text-success font-bold' : 'text-error font-bold';
  } else if (row.positive) {
    return 'text-success font-bold';
  }
  return '';
}

/**
 * Display detailed explanation of the decision
 */
function displayExplanation(result: CalculationResult): void {
  const explanationContent = document.getElementById('explanation-content') as HTMLDivElement;

  let html = '';
  html += buildDecisionAlert(result.decision);
  html += buildDecisionFactors(result.reasoning);
  html += buildInterpretation(result.metrics);

  explanationContent.innerHTML = html;
}

/**
 * Build decision alert box based on decision type
 */
function buildDecisionAlert(decision: string): string {
  const alerts = {
    YES: `<div class="alert alert-success mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span><strong>Recommendation:</strong> Proceed with the optimization</span>
    </div>`,
    MAYBE: `<div class="alert alert-warning mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <span><strong>Recommendation:</strong> Proceed with caution</span>
    </div>`,
    NO: `<div class="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span><strong>Recommendation:</strong> Do not proceed with this optimization</span>
    </div>`,
  };

  return alerts[decision as keyof typeof alerts] || '';
}

/**
 * Build decision factors list
 */
function buildDecisionFactors(reasoning: string[]): string {
  let html = '<h4 class="text-xl font-bold mb-3">Decision Factors:</h4>';
  html += '<ul class="list-disc list-inside space-y-2 mb-6">';

  reasoning.forEach((reason, index) => {
    if (index === 0) {
      html += `<li class="text-sm text-base-content/70 italic mb-2">${reason}</li>`;
    } else {
      html += `<li>${reason}</li>`;
    }
  });

  html += '</ul>';
  return html;
}

/**
 * Build interpretation section
 */
function buildInterpretation(metrics: CalculationResult['metrics']): string {
  let html = '<h4 class="text-xl font-bold mb-3">What This Means:</h4>';
  html += '<div class="space-y-3">';

  html += buildNetBenefitInterpretation(metrics.netBenefit);
  html += buildROIInterpretation(metrics.roiMoney);
  html += buildBreakEvenInterpretation(metrics.breakEvenYearsMoney);

  html += '</div>';
  return html;
}

/**
 * Build net benefit interpretation
 */
function buildNetBenefitInterpretation(netBenefitStr: string): string {
  const netBenefit = parseFloat(netBenefitStr);

  if (netBenefit > 0) {
    return (
      `<p>Over your time horizon, you will save a net of <strong class="text-success">${netBenefitStr} hours</strong> ` +
      `(${(netBenefit / 24).toFixed(1)} days) after accounting for implementation and maintenance costs.</p>`
    );
  } else {
    return (
      `<p>The optimization will <strong class="text-error">cost more time than it saves</strong>. You'll lose ` +
      `${Math.abs(netBenefit).toFixed(2)} hours (${(Math.abs(netBenefit) / 24).toFixed(1)} days) over your time horizon.</p>`
    );
  }
}

/**
 * Build ROI interpretation
 */
function buildROIInterpretation(roiMoneyStr: string): string {
  const roiMoneyValue = parseFloat(roiMoneyStr);

  if (roiMoneyValue > 0) {
    return `<p>For every 💰 invested, you'll get back <strong class="text-success">💰${(roiMoneyValue / 100 + 1).toFixed(2)}</strong> in total value (including your original investment).</p>`;
  }
  return '';
}

/**
 * Build break-even interpretation
 */
function buildBreakEvenInterpretation(breakEvenYearsStr: string): string {
  const breakEvenMoneyYears = parseFloat(breakEvenYearsStr);

  if (!isFinite(breakEvenMoneyYears)) {
    return '';
  }

  const timeHorizon = parseFloat(
    (document.getElementById('time-horizon') as HTMLInputElement).value
  );
  const timeHorizonUnit = (document.getElementById('time-horizon-unit') as HTMLSelectElement).value;
  const timeHorizonYears = timeHorizonUnit === 'year' ? timeHorizon : timeHorizon / 12;

  if (breakEvenMoneyYears < timeHorizonYears) {
    return (
      `<p>The optimization will <strong class="text-success">pay for itself in ${breakEvenYearsStr} years</strong>, ` +
      `which is within your planned time horizon.</p>`
    );
  } else {
    return (
      `<p>The optimization would take <strong class="text-warning">${breakEvenYearsStr} years to pay for itself</strong>, ` +
      `which exceeds your planned time horizon.</p>`
    );
  }
}

