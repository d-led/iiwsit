import './styles.css';
import { ThroughputOptimizationCalculator } from './calculator';
import type { CalculatorParams } from './types';
import { Settings } from './settings';
import { displayResults, displayVersion } from './ui';
import {
  initKaTeX,
  waitForKaTeX,
  typesetMath,
  isKaTeXReady,
  setupResponsiveFormulas,
} from './katex';
import {
  initMermaid,
  renderMermaidDiagrams,
  waitForMermaid,
  setupMermaidExpansion,
  createFullscreenModal,
  checkAndOpenDiagramFromHash,
} from './mermaid';

// Initialize the calculator
const calculator = new ThroughputOptimizationCalculator();

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
  (document.getElementById('optimization-preference') as HTMLInputElement).value =
    settings.optimizationPreference.toString();

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
    optimizationPreference: parseFloat(
      (document.getElementById('optimization-preference') as HTMLInputElement).value
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
 * Update slider value displays (called when loading settings)
 */
function updateSliderDisplays(): void {
  updateOptimizationPreferenceDisplay();
}

function updateOptimizationPreferenceDisplay(): void {
  const slider = document.getElementById('optimization-preference') as HTMLInputElement;
  const label = document.getElementById('optimization-preference-label') as HTMLSpanElement;
  if (slider && label) {
    const value = parseFloat(slider.value);
    label.textContent = getOptimizationPreferenceLabel(value);
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
  // Initialize KaTeX (non-blocking)
  initKaTeX();

  // Initialize Mermaid (non-blocking)
  initMermaid();

  // Create fullscreen modal for diagrams
  createFullscreenModal();

  // Setup responsive formula scaling
  setupResponsiveFormulas();

  // Display version
  displayVersion();

  // Setup form submission handler
  setupFormSubmissionHandler();

  // Setup auto-calculation on form inputs
  setupAutoCalculation();

  // Setup slider display updates
  setupSliderDisplays();

  // Load initial settings and calculate
  loadSettings();
  calculate();

  // Setup bubble navigation
  setupBubbleNavigation();

  // Setup reset button
  setupResetButton();

  // Setup formulas section expansion handler
  setupFormulasExpansion();

  // Setup Mermaid expansion handler
  setupMermaidExpansion();

  // Try to typeset math formulas (non-blocking)
  waitForKaTeX()
    .then((isReady) => {
      if (isReady) {
        console.log('KaTeX is ready, typesetting formulas...');
        typesetMath()
          .then(() => {
            console.log('KaTeX typesetting completed');
          })
          .catch((err) => {
            console.warn('KaTeX typesetting failed:', err);
          });
      } else {
        console.warn('KaTeX failed to load');
      }
    })
    .catch((err) => {
      console.warn('KaTeX initialization failed:', err);
    });

  // Try to render Mermaid diagrams (non-blocking)
  waitForMermaid()
    .then((isReady) => {
      if (isReady) {
        console.log('Mermaid is ready, rendering diagrams...');
        renderMermaidDiagrams()
          .then(() => {
            console.log('Mermaid rendering completed');
            // Check if we should open diagram from URL hash
            checkAndOpenDiagramFromHash();
          })
          .catch((err) => {
            console.warn('Mermaid rendering failed:', err);
          });
      } else {
        console.warn('Mermaid failed to initialize');
      }
    })
    .catch((err) => {
      console.warn('Mermaid initialization failed:', err);
    });
});

// ============================================================================
// Setup Functions (Literate Programming Pattern)
// ============================================================================

/**
 * Setup form submission handler to prevent default and trigger calculation
 */
function setupFormSubmissionHandler(): void {
  const form = document.getElementById('calculator-form') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      calculate();
    });
  }
}

/**
 * Setup auto-calculation on all form inputs
 * - Range sliders trigger on change (when drag ends) to prevent flickering
 * - Other inputs trigger on input and change for immediate feedback
 */
function setupAutoCalculation(): void {
  const form = document.getElementById('calculator-form') as HTMLFormElement;
  if (!form) return;

  const allInputs = form.querySelectorAll('input, select');
  allInputs.forEach((input) => {
    if (input instanceof HTMLInputElement && input.type === 'range') {
      input.addEventListener('change', triggerCalculation);
    } else {
      input.addEventListener('input', triggerCalculation);
      input.addEventListener('change', triggerCalculation);
    }
  });
}

/**
 * Setup real-time slider value displays
 * Updates display labels as user drags sliders
 */
function setupSliderDisplays(): void {
  setupOptimizationPreferenceSlider();
}

/**
 * Setup optimization preference slider display with contextual labels
 */
function setupOptimizationPreferenceSlider(): void {
  const slider = document.getElementById('optimization-preference') as HTMLInputElement;
  const label = document.getElementById('optimization-preference-label') as HTMLSpanElement;

  if (slider && label) {
    slider.addEventListener('input', () => {
      const value = parseFloat(slider.value);
      label.textContent = getOptimizationPreferenceLabel(value);
    });
  }
}

/**
 * Get the label text for optimization preference value
 */
function getOptimizationPreferenceLabel(value: number): string {
  if (value < 33) return '💰 Cost-focused';
  if (value > 67) return '⚡ Throughput-focused';
  return '⚖️ Balanced';
}

/**
 * Setup floating bubble navigation to scroll to results section
 */
function setupBubbleNavigation(): void {
  const bubbleButton = document.getElementById('bubble-button') as HTMLButtonElement;
  const resultsSection = document.getElementById('results-section') as HTMLDivElement;

  if (bubbleButton && resultsSection) {
    bubbleButton.addEventListener('click', () => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/**
 * Setup reset button to restore default values
 */
function setupResetButton(): void {
  const resetButton = document.getElementById('reset-button') as HTMLButtonElement;

  if (resetButton) {
    resetButton.addEventListener('click', resetToDefaults);
  }
}

/**
 * Setup formulas section expansion handler to trigger KaTeX rendering
 */
function setupFormulasExpansion(): void {
  // Find the Mathematical Formulas details element
  const detailsElements = document.querySelectorAll('details');
  const mathFormulasDetails = Array.from(detailsElements).find((details) =>
    details.textContent?.includes('Mathematical Formulas')
  );

  if (mathFormulasDetails) {
    mathFormulasDetails.addEventListener('toggle', async () => {
      if (mathFormulasDetails.open) {
        // Wait a bit for the collapse animation, then typeset
        setTimeout(async () => {
          if (isKaTeXReady()) {
            console.log('Mathematical formulas section expanded, typesetting with KaTeX...');
            // Typeset the entire formulas section
            await typesetMath();
          }
        }, 300);
      }
    });
  }
}
