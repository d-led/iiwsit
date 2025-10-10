import './styles.css';
import { ThroughputOptimizationCalculator } from './calculator';
import type { CalculatorParams, CalculationResult } from './types';
import { Settings } from './settings';
import { humanizeYears } from './utils/humanize';

// Initialize the calculator
const calculator = new ThroughputOptimizationCalculator();

// Get DOM elements
const form = document.getElementById('calculator-form') as HTMLFormElement;
const resultsSection = document.getElementById('results-section') as HTMLDivElement;
const resultsPlaceholder = document.getElementById('results-placeholder') as HTMLDivElement;
const decisionBadge = document.getElementById('decision-badge') as HTMLDivElement;
const confidence = document.getElementById('confidence') as HTMLDivElement;
const metricsTableBody = document.getElementById('metrics-table-body') as HTMLTableSectionElement;
const explanationContent = document.getElementById('explanation-content') as HTMLDivElement;

// Floating bubble elements (mobile only)
const floatingBubble = document.getElementById('floating-bubble') as HTMLDivElement;
const bubbleButton = document.getElementById('bubble-button') as HTMLButtonElement;
const bubbleDecision = document.getElementById('bubble-decision') as HTMLDivElement;
const bubbleConfidence = document.getElementById('bubble-confidence') as HTMLDivElement;

// Reset button
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;

// Debounced calculation
let calculateTimeout: number | null = null;

/**
 * Load settings from localStorage and populate the form
 */
function loadSettings(): void {
  const settings = Settings.load();

  // Populate form fields
  (document.getElementById('rate') as HTMLInputElement).value = settings.rate.toString();
  (document.getElementById('rate-unit') as HTMLSelectElement).value = settings.rateUnit;
  (document.getElementById('duration') as HTMLInputElement).value = settings.duration.toString();
  (document.getElementById('duration-unit') as HTMLSelectElement).value = settings.durationUnit;
  (document.getElementById('speed-gain') as HTMLInputElement).value = settings.speedGain.toString();
  (document.getElementById('current-failure') as HTMLInputElement).value =
    settings.currentFailure.toString();
  (document.getElementById('bug-failure') as HTMLInputElement).value =
    settings.bugFailure.toString();
  (document.getElementById('maintenance') as HTMLInputElement).value =
    settings.maintenance.toString();
  (document.getElementById('maintenance-unit') as HTMLSelectElement).value =
    settings.maintenanceUnit;
  (document.getElementById('implementation-time') as HTMLInputElement).value =
    settings.implementationTime.toString();
  (document.getElementById('time-horizon') as HTMLInputElement).value =
    settings.timeHorizon.toString();
  (document.getElementById('time-horizon-unit') as HTMLSelectElement).value =
    settings.timeHorizonUnit;
  (document.getElementById('compute-cost') as HTMLInputElement).value =
    settings.computeCostPerHour.toString();
  (document.getElementById('developer-rate') as HTMLInputElement).value =
    settings.developerHourlyRate.toString();

  // Update slider value displays
  updateSliderDisplays();
}

/**
 * Save current form values to localStorage
 */
function saveSettings(): void {
  const params = gatherFormParams();
  Settings.save(params);
}

/**
 * Gather current form parameters
 */
function gatherFormParams(): CalculatorParams {
  return {
    rate: parseFloat((document.getElementById('rate') as HTMLInputElement).value),
    rateUnit: (document.getElementById('rate-unit') as HTMLSelectElement).value as any,
    duration: parseFloat((document.getElementById('duration') as HTMLInputElement).value),
    durationUnit: (document.getElementById('duration-unit') as HTMLSelectElement).value as any,
    speedGain: parseFloat((document.getElementById('speed-gain') as HTMLInputElement).value),
    currentFailure: parseFloat(
      (document.getElementById('current-failure') as HTMLInputElement).value
    ),
    bugFailure: parseFloat((document.getElementById('bug-failure') as HTMLInputElement).value),
    maintenance: parseFloat((document.getElementById('maintenance') as HTMLInputElement).value),
    maintenanceUnit: (document.getElementById('maintenance-unit') as HTMLSelectElement)
      .value as any,
    implementationTime: parseFloat(
      (document.getElementById('implementation-time') as HTMLInputElement).value
    ),
    timeHorizon: parseFloat((document.getElementById('time-horizon') as HTMLInputElement).value),
    timeHorizonUnit: (document.getElementById('time-horizon-unit') as HTMLSelectElement)
      .value as any,
    computeCostPerHour: parseFloat(
      (document.getElementById('compute-cost') as HTMLInputElement).value
    ),
    developerHourlyRate: parseFloat(
      (document.getElementById('developer-rate') as HTMLInputElement).value
    ),
  };
}

/**
 * Reset form to default values
 */
function resetToDefaults(): void {
  Settings.reset();
  loadSettings();
  calculate(); // Recalculate with default values
}

/**
 * Update slider value displays
 */
function updateSliderDisplays(): void {
  const currentFailureSlider = document.getElementById('current-failure') as HTMLInputElement;
  const currentFailureValue = document.getElementById('current-failure-value') as HTMLSpanElement;
  if (currentFailureValue) {
    currentFailureValue.textContent = `${currentFailureSlider.value}%`;
  }

  const bugFailureSlider = document.getElementById('bug-failure') as HTMLInputElement;
  const bugFailureValue = document.getElementById('bug-failure-value') as HTMLSpanElement;
  if (bugFailureValue) {
    bugFailureValue.textContent = `${bugFailureSlider.value}%`;
  }
}

/**
 * Generate confidence explanation based on confidence percentage
 */
function getConfidenceExplanation(confidence: number): string {
  const riskPercent = (100 - confidence).toFixed(0);

  if (confidence >= 80) {
    return `Go ahead - only ${riskPercent}% chance of losing money`;
  } else if (confidence >= 65) {
    return `Likely good - ${riskPercent}% chance of losing money`;
  } else if (confidence >= 50) {
    return `Maybe - ${riskPercent}% chance of losing money`;
  } else if (confidence >= 35) {
    return `Risky - ${riskPercent}% chance of losing money`;
  } else {
    return `Don't do it - ${riskPercent}% chance of losing money`;
  }
}

function triggerCalculation() {
  if (calculateTimeout !== null) {
    clearTimeout(calculateTimeout);
  }

  calculateTimeout = window.setTimeout(() => {
    calculate();
  }, 300); // 300ms debounce
}

function calculate() {
  // Gather input values
  const params = gatherFormParams();

  // Validate inputs
  const values = Object.values(params).filter((v) => typeof v === 'number');
  if (values.some((v) => isNaN(v))) {
    return; // Silently skip invalid inputs during auto-calculation
  }

  // Save settings after successful validation
  saveSettings();

  // Calculate
  const result = calculator.calculate(params);

  // Display results
  displayResults(result);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Handle form submission (in case user presses Enter)
  if (form) {
    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      calculate();
    });
  }

  // Add change listeners to all inputs for auto-calculation
  if (form) {
    const allInputs = form.querySelectorAll('input, select');
    allInputs.forEach((input) => {
      input.addEventListener('input', triggerCalculation);
      input.addEventListener('change', triggerCalculation);
    });
  }

  // Update slider value displays in real-time
  const currentFailureSlider = document.getElementById('current-failure') as HTMLInputElement;
  const currentFailureValue = document.getElementById('current-failure-value') as HTMLSpanElement;
  if (currentFailureSlider && currentFailureValue) {
    currentFailureSlider.addEventListener('input', () => {
      currentFailureValue.textContent = `${currentFailureSlider.value}%`;
    });
  }

  const bugFailureSlider = document.getElementById('bug-failure') as HTMLInputElement;
  const bugFailureValue = document.getElementById('bug-failure-value') as HTMLSpanElement;
  if (bugFailureSlider && bugFailureValue) {
    bugFailureSlider.addEventListener('input', () => {
      bugFailureValue.textContent = `${bugFailureSlider.value}%`;
    });
  }

  // Load settings and perform initial calculation on page load
  loadSettings();
  calculate();

  // Handle floating bubble click (scroll to results)
  if (bubbleButton && resultsSection) {
    bubbleButton.addEventListener('click', () => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Handle reset button click
  if (resetButton) {
    resetButton.addEventListener('click', resetToDefaults);
  }
});

function displayResults(result: CalculationResult): void {
  // Show results section, hide placeholder
  resultsSection.style.display = 'block';
  resultsPlaceholder.style.display = 'none';

  // Update floating bubble (mobile)
  updateFloatingBubble(result.decision, result.confidence);

  // Display decision badge
  decisionBadge.textContent = result.decision;

  // Reset to base classes and add decision-specific class
  decisionBadge.className = 'text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4';

  if (result.decision === 'YES') {
    decisionBadge.classList.add('decision-yes');
  } else if (result.decision === 'NO') {
    decisionBadge.classList.add('decision-no');
  } else {
    decisionBadge.classList.add('decision-maybe');
  }

  const confidenceValue = parseFloat(result.confidence);
  const decision = result.decision === 'YES' ? 'proceed' : 'not proceed';
  confidence.textContent = `Confidence: ${result.confidence}% (${confidenceValue.toFixed(0)}% confident you should ${decision})`;

  // Add confidence explanation
  const confidenceExplanation = getConfidenceExplanation(parseFloat(result.confidence));
  const confidenceElement = document.getElementById('confidence-explanation');
  if (confidenceElement) {
    confidenceElement.textContent = confidenceExplanation;
  }

  // Add confidence factors explanation
  const confidenceFactorsText = `Confidence is based on 4 factors: Financial Benefit (40%), ROI (30%), Break-Even Time (20%), and Failure Rate Impact (10%)`;
  let confidenceFactorsElement = document.getElementById('confidence-factors');
  if (!confidenceFactorsElement) {
    confidenceFactorsElement = document.createElement('div');
    confidenceFactorsElement.id = 'confidence-factors';
    confidenceFactorsElement.className = 'text-xs text-base-content/50 italic mt-1';
    if (confidenceElement && confidenceElement.parentNode) {
      confidenceElement.parentNode.insertBefore(
        confidenceFactorsElement,
        confidenceElement.nextSibling
      );
    }
  }
  confidenceFactorsElement.textContent = confidenceFactorsText;

  // Display metrics
  const metrics = result.metrics;
  const metricGroups = [
    {
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
    },
    {
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
    },
  ];

  metricsTableBody.innerHTML = metricGroups
    .map((group) => {
      const groupHeader = `
        <tr>
          <td colspan="2" class="font-bold text-lg pt-4 pb-2 border-b-2 border-base-300">${group.title}</td>
        </tr>
      `;

      const groupRows = group.rows
        .map((row) => {
          let valueClass = '';
          if (row.colored) {
            valueClass = row.isPositive ? 'text-success font-bold' : 'text-error font-bold';
          } else if (row.positive) {
            valueClass = 'text-success font-bold';
          }

          return `
          <tr>
            <td class="font-semibold">${row.label}</td>
            <td class="${valueClass}">${row.value}</td>
          </tr>
        `;
        })
        .join('');

      return groupHeader + groupRows;
    })
    .join('');

  // Display explanation
  let explanationHTML = '';

  // Decision box
  if (result.decision === 'YES') {
    explanationHTML += '<div class="alert alert-success mb-4">';
    explanationHTML +=
      '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    explanationHTML +=
      '<span><strong>Recommendation:</strong> Proceed with the optimization</span>';
    explanationHTML += '</div>';
  } else if (result.decision === 'MAYBE') {
    explanationHTML += '<div class="alert alert-warning mb-4">';
    explanationHTML +=
      '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
    explanationHTML += '<span><strong>Recommendation:</strong> Proceed with caution</span>';
    explanationHTML += '</div>';
  } else {
    explanationHTML += '<div class="alert alert-error mb-4">';
    explanationHTML +=
      '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    explanationHTML +=
      '<span><strong>Recommendation:</strong> Do not proceed with this optimization</span>';
    explanationHTML += '</div>';
  }

  // Decision factors
  explanationHTML += '<h4 class="text-xl font-bold mb-3">Decision Factors:</h4>';
  explanationHTML += '<ul class="list-disc list-inside space-y-2 mb-6">';
  result.reasoning.forEach((reason, index) => {
    if (index === 0) {
      // First item is the explanation - style it differently
      explanationHTML += `<li class="text-sm text-base-content/70 italic mb-2">${reason}</li>`;
    } else {
      explanationHTML += `<li>${reason}</li>`;
    }
  });
  explanationHTML += '</ul>';

  // Interpretation
  explanationHTML += '<h4 class="text-xl font-bold mb-3">What This Means:</h4>';
  explanationHTML += '<div class="space-y-3">';

  const netBenefit = parseFloat(metrics.netBenefit);

  if (netBenefit > 0) {
    explanationHTML += `<p>Over your time horizon, you will save a net of <strong class="text-success">${metrics.netBenefit} hours</strong> `;
    explanationHTML += `(${(netBenefit / 24).toFixed(1)} days) after accounting for implementation and maintenance costs.</p>`;
  } else {
    explanationHTML += `<p>The optimization will <strong class="text-error">cost more time than it saves</strong>. You'll lose `;
    explanationHTML += `${Math.abs(netBenefit).toFixed(2)} hours (${(Math.abs(netBenefit) / 24).toFixed(1)} days) over your time horizon.</p>`;
  }

  const roiMoneyValue = parseFloat(metrics.roiMoney);
  if (roiMoneyValue > 0) {
    explanationHTML += `<p>For every 💰 invested, you'll get back <strong class="text-success">💰${(roiMoneyValue / 100 + 1).toFixed(2)}</strong> in total value (including your original investment).</p>`;
  }

  const breakEvenMoneyYears = parseFloat(metrics.breakEvenYearsMoney);
  if (isFinite(breakEvenMoneyYears)) {
    const timeHorizon = parseFloat(
      (document.getElementById('time-horizon') as HTMLInputElement).value
    );
    const timeHorizonUnit = (document.getElementById('time-horizon-unit') as HTMLSelectElement)
      .value;
    const timeHorizonYears = timeHorizonUnit === 'year' ? timeHorizon : timeHorizon / 12;

    if (breakEvenMoneyYears < timeHorizonYears) {
      explanationHTML += `<p>The optimization will <strong class="text-success">pay for itself in ${metrics.breakEvenYearsMoney} years</strong>, `;
      explanationHTML += `which is within your planned time horizon.</p>`;
    } else {
      explanationHTML += `<p>The optimization would take <strong class="text-warning">${metrics.breakEvenYearsMoney} years to pay for itself</strong>, `;
      explanationHTML += `which exceeds your planned time horizon.</p>`;
    }
  }

  explanationHTML += '</div>';
  explanationContent.innerHTML = explanationHTML;
}

function updateFloatingBubble(decision: string, confidence: string): void {
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
