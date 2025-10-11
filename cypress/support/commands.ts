/// <reference types="cypress" />

/**
 * Custom Cypress commands for readable, script-like E2E tests
 */

// Single source of truth for all selectors
const SELECTORS = {
  // Form inputs
  rate: '#rate',
  rateUnit: '#rate-unit',
  duration: '#duration',
  durationUnit: '#duration-unit',
  speedGain: '#speed-gain',
  currentFailure: '#current-failure',
  bugFailure: '#bug-failure',
  maintenance: '#maintenance',
  maintenanceUnit: '#maintenance-unit',
  implementationTime: '#implementation-time',
  timeHorizon: '#time-horizon',
  timeHorizonUnit: '#time-horizon-unit',
  computeCost: '#compute-cost',
  developerRate: '#developer-rate',
  optimizationPreference: '#optimization-preference',
  resetButton: '#reset-button',

  // Results
  resultsSection: '#results-section',
  resultsPlaceholder: '#results-placeholder',
  decisionBadge: '#decision-badge',
  confidence: '#confidence',
  confidenceExplanation: '#confidence-explanation',
  metricsBreakdown: '#metrics-breakdown',
  metricsTableBody: '#metrics-table-body',
  metricsTableRows: '#metrics-table-body tr',
  explanationContent: '#explanation-content',

  // Data attributes
  inputsSection: '[data-cy="inputs-section"]',
  resultsSectionData: '[data-cy="results-section"]',
  floatingBubble: '[data-cy="floating-bubble"]',

  // KaTeX/Formulas
  unifiedAnalysisSection: 'h3:contains("📊 Analysis & Mathematical Foundation")',
  mathematicalFoundationDivider: 'div.divider:contains("🧮 Mathematical Foundation")',
  viewFormulasToggle: 'div.collapse-title:contains("📐 View Mathematical Formulas")',
  formulaRender: '.formula-render',
  formulaRenderWithData: '.formula-render[data-formula]',
  katexElement: '.katex',
  formulaContextText: 'p:contains("The calculations below form the mathematical foundation")',

  // Influence Diagram
  influenceDiagramDivider: 'div.divider:contains("🔄 Decision Influence Diagram")',
  viewInfluenceMapToggle: 'div.collapse-title:contains("📈 View Factor Influence Map")',
  influenceDiagram: '#influence-diagram',
  influenceDiagramContainer: '#influence-diagram',
  fullscreenDiagramBtn: '#fullscreen-diagram-btn',
  mermaidDiagram: '.mermaid',
  mermaidSvg: '.mermaid svg',

  // Fullscreen Modal
  mermaidFullscreenModal: '#mermaid-fullscreen-modal',
  fullscreenModalTitle: 'h3:contains("📈 Influence Diagram - Full Screen")',
  closeFullscreenBtn: '#close-fullscreen-btn',
  fullscreenMermaidContainer: '#fullscreen-mermaid-container',
  fullscreenMermaidDiagram: '#fullscreen-mermaid-diagram',
  fullscreenMermaidSvg: '#fullscreen-mermaid-diagram svg',
  fullscreenInstructions: 'div:contains("💡 Use mouse wheel to zoom, drag to pan (Mermaid native controls)")',

  // Version and UI elements
  appVersion: '#app-version',
  footer: 'footer',
  calculatorForm: '#calculator-form',
  optimizationPreferenceLabel: '#optimization-preference-label',
} as const;

declare global {
  namespace Cypress {
    interface Chainable {
      // Navigation commands
      visitCalculator(): Chainable<void>;

      // Input commands
      enterRequestRate(rate: number, unit?: 'second' | 'minute' | 'hour'): Chainable<void>;
      enterRequestDuration(
        duration: number,
        unit?: 'millisecond' | 'second' | 'minute'
      ): Chainable<void>;
      enterSpeedGain(percentage: number): Chainable<void>;
      enterCurrentFailureRate(percentage: number): Chainable<void>;
      enterBugFailureRate(percentage: number): Chainable<void>;
      enterMaintenanceTime(
        hours: number,
        unit?: 'hour-per-day' | 'hour-per-week' | 'hour-per-month'
      ): Chainable<void>;
      enterImplementationTime(hours: number): Chainable<void>;
      enterTimeHorizon(time: number, unit?: 'month' | 'year'): Chainable<void>;
      enterComputeCost(cost: number): Chainable<void>;
      enterDeveloperRate(rate: number): Chainable<void>;
      enterOptimizationPreference(preference: number): Chainable<void>;

      // Action commands
      calculate(): Chainable<void>;
      configureHighTrafficScenario(): Chainable<void>;
      configureLowTrafficScenario(): Chainable<void>;
      configureOptimisticScenario(): Chainable<void>;
      configurePessimisticScenario(): Chainable<void>;

      // Assertion commands
      shouldRecommendDecision(decision: 'YES' | 'NO' | 'MAYBE'): Chainable<void>;
      shouldDisplayResults(): Chainable<void>;
      shouldShowPositiveROI(): Chainable<void>;
      shouldShowNegativeROI(): Chainable<void>;
      shouldDisplayMetric(metricLabel: string): Chainable<void>;
      shouldHaveConfidenceAbove(percentage: number): Chainable<void>;
      shouldHaveConfidenceBelow(percentage: number): Chainable<void>;
      shouldShowConfidenceExplanation(): Chainable<void>;
      shouldDisplayMonetaryMetrics(): Chainable<void>;
      shouldShowBreakEvenTime(): Chainable<void>;
      shouldHaveDefaultConfiguration(): Chainable<void>;
      shouldNotShowResults(): Chainable<void>;
      resetToDefaults(): Chainable<void>;
      shouldHaveConfiguredValues(values: Record<string, string>): Chainable<void>;
      shouldShowDetailedExplanation(): Chainable<void>;
      enterRequestRate(rate: number, unit?: string): Chainable<void>;
      enterSpeedGain(gain: number): Chainable<void>;
      enterImplementationTime(time: number): Chainable<void>;
      shouldHaveRequestRate(rate: number): Chainable<void>;
      shouldHaveSpeedGain(gain: number): Chainable<void>;
      shouldHaveImplementationTime(time: number): Chainable<void>;
      shouldHaveRateUnit(unit: string): Chainable<void>;
      shouldHaveDurationUnit(unit: string): Chainable<void>;
      shouldHaveTimeHorizonUnit(unit: string): Chainable<void>;
      shouldShowConfidence(): Chainable<void>;
      shouldShowMetricsTable(): Chainable<void>;
      shouldHaveXkcdLinks(): Chainable<void>;
      shouldBeVisibleOnMobile(): Chainable<void>;
      shouldBeVisibleOnTablet(): Chainable<void>;
      shouldShowDecisionBadge(): Chainable<void>;
      screenshotInputsSection(filename: string): Chainable<void>;
      screenshotResultsSection(filename: string): Chainable<void>;
      screenshotFloatingBubble(filename: string): Chainable<void>;
      scrollToResults(): Chainable<void>;
      shouldShowFloatingBubble(): Chainable<void>;
      captureDecisionText(alias: string): Chainable<void>;

      // KaTeX/Formula commands
      shouldHaveUnifiedAnalysisSection(): Chainable<void>;
      shouldHaveMathematicalFoundationSection(): Chainable<void>;
      expandMathFormulas(): Chainable<void>;
      shouldRenderKatexFormulas(): Chainable<void>;
      shouldHaveFormulaDataAttributes(minCount: number): Chainable<void>;
      shouldHaveLargerFormulas(): Chainable<void>;
      shouldHaveHumanReadableDescriptions(): Chainable<void>;
      shouldHaveVariableExplanations(): Chainable<void>;
      shouldCollapseAndExpandFormulas(): Chainable<void>;
      shouldShowMathematicalFoundationContext(): Chainable<void>;

      // Version and UI commands
      shouldDisplayVersion(): Chainable<void>;
      shouldHaveVersionFormat(): Chainable<void>;
      shouldShowOptimizationPreferenceSlider(): Chainable<void>;
      shouldHaveOptimizationPreferenceLabel(label: string): Chainable<void>;
      shouldShowCalculatorForm(): Chainable<void>;
      shouldContainTextInExplanation(text: string): Chainable<void>;
      costDecisionShouldBeOneOf(validDecisions: string[]): Chainable<void>;
      throughputDecisionShouldBeOneOf(validDecisions: string[]): Chainable<void>;

      // Influence Diagram commands
      expandInfluenceDiagram(): Chainable<void>;
      shouldShowInfluenceDiagram(): Chainable<void>;
      shouldShowInfluenceDiagramContent(): Chainable<void>;
      shouldShowFullscreenButton(): Chainable<void>;
      openFullscreenDiagram(): Chainable<void>;
      shouldShowFullscreenModal(): Chainable<void>;
      shouldShowFullscreenDiagram(): Chainable<void>;
      closeFullscreenModal(): Chainable<void>;
      shouldHideFullscreenModal(): Chainable<void>;
      closeFullscreenModalWithEscape(): Chainable<void>;
      closeFullscreenModalWithBackdrop(): Chainable<void>;
      shouldShowInfluenceDiagramNodes(): Chainable<void>;
      shouldShowSuccessFactors(): Chainable<void>;
      shouldShowFeedbackLoops(): Chainable<void>;
      testInfluenceDiagramWorkflow(): Chainable<void>;
    }
  }
}

// Navigation Commands

Cypress.Commands.add('visitCalculator', () => {
  cy.visit('/');
  cy.contains('Is It Worth Speeding It').should('be.visible');
});

// Input Commands

Cypress.Commands.add('enterRequestRate', (rate: number, unit = 'second') => {
  cy.get(SELECTORS.rate).clear().type(rate.toString());
  cy.get(SELECTORS.rateUnit).select(unit);
});

Cypress.Commands.add('enterRequestDuration', (duration: number, unit = 'millisecond') => {
  cy.get(SELECTORS.duration).clear().type(duration.toString());
  cy.get(SELECTORS.durationUnit).select(unit);
});

Cypress.Commands.add('enterSpeedGain', (percentage: number) => {
  cy.get(SELECTORS.speedGain).clear().type(percentage.toString());
});

Cypress.Commands.add('enterCurrentFailureRate', (percentage: number) => {
  cy.get(SELECTORS.currentFailure).invoke('val', percentage).trigger('input');
});

Cypress.Commands.add('enterBugFailureRate', (percentage: number) => {
  cy.get(SELECTORS.bugFailure).invoke('val', percentage).trigger('input');
});

Cypress.Commands.add('enterMaintenanceTime', (hours: number, unit = 'hour-per-week') => {
  cy.get(SELECTORS.maintenance).clear().type(hours.toString());
  cy.get(SELECTORS.maintenanceUnit).select(unit);
});

Cypress.Commands.add('enterImplementationTime', (hours: number) => {
  cy.get(SELECTORS.implementationTime).clear().type(hours.toString());
});

Cypress.Commands.add('enterTimeHorizon', (time: number, unit = 'year') => {
  cy.get(SELECTORS.timeHorizon).clear().type(time.toString());
  cy.get(SELECTORS.timeHorizonUnit).select(unit);
});

Cypress.Commands.add('enterComputeCost', (cost: number) => {
  cy.get(SELECTORS.computeCost).clear().type(cost.toString());
});

Cypress.Commands.add('enterDeveloperRate', (rate: number) => {
  cy.get(SELECTORS.developerRate).clear().type(rate.toString());
});

Cypress.Commands.add('enterOptimizationPreference', (preference: number) => {
  cy.get(SELECTORS.optimizationPreference)
    .invoke('val', preference)
    .trigger('input')
    .trigger('change');
});

// Action Commands

Cypress.Commands.add('calculate', () => {
  // Since we have auto-calculation, we just need to wait for the calculation to complete
  cy.wait(500); // Wait for debounced calculation
});

Cypress.Commands.add('configureHighTrafficScenario', () => {
  cy.enterRequestRate(1000, 'second');
  cy.enterRequestDuration(500, 'millisecond');
  cy.enterSpeedGain(30);
  cy.enterCurrentFailureRate(5);
  cy.enterBugFailureRate(1);
  cy.enterMaintenanceTime(2, 'hour-per-week');
  cy.enterImplementationTime(40);
  cy.enterTimeHorizon(1, 'year');
  cy.enterComputeCost(0.75);
  cy.enterDeveloperRate(100);
});

Cypress.Commands.add('configureLowTrafficScenario', () => {
  cy.enterRequestRate(1, 'minute');
  cy.enterRequestDuration(500, 'millisecond');
  cy.enterSpeedGain(20);
  cy.enterCurrentFailureRate(5);
  cy.enterBugFailureRate(1);
  cy.enterMaintenanceTime(5, 'hour-per-day');
  cy.enterImplementationTime(500);
  cy.enterTimeHorizon(1, 'year');
  cy.enterComputeCost(0.25);
  cy.enterDeveloperRate(50);
});

Cypress.Commands.add('configureOptimisticScenario', () => {
  cy.enterRequestRate(500, 'second');
  cy.enterRequestDuration(1, 'second');
  cy.enterSpeedGain(50);
  cy.enterCurrentFailureRate(10);
  cy.enterBugFailureRate(1);
  cy.enterMaintenanceTime(1, 'hour-per-week');
  cy.enterImplementationTime(20);
  cy.enterTimeHorizon(5, 'year');
  cy.enterComputeCost(1.0);
  cy.enterDeveloperRate(120);
});

Cypress.Commands.add('configurePessimisticScenario', () => {
  cy.enterRequestRate(0.1, 'hour');
  cy.enterRequestDuration(10, 'second');
  cy.enterSpeedGain(10);
  cy.enterCurrentFailureRate(1);
  cy.enterBugFailureRate(15);
  cy.enterMaintenanceTime(8, 'hour-per-day');
  cy.enterImplementationTime(1000);
  cy.enterTimeHorizon(6, 'month');
  cy.enterComputeCost(2.0);
  cy.enterDeveloperRate(150);
});

// Assertion Commands

Cypress.Commands.add('shouldRecommendDecision', (decision: 'YES' | 'NO' | 'MAYBE') => {
  cy.get(SELECTORS.decisionBadge).should('exist').and('contain.text', decision);
});

Cypress.Commands.add('shouldDisplayResults', () => {
  // Wait for results to be calculated and displayed (display changes from 'none' to 'block')
  cy.get(SELECTORS.resultsSection, { timeout: 10000 }).should('not.have.css', 'display', 'none');

  // Verify all result elements exist and have content (don't rely on visibility due to layout)
  cy.get(SELECTORS.decisionBadge).should('exist').and('not.be.empty');
  cy.get(SELECTORS.confidence).should('exist').and('contain', 'Confidence');
  cy.get(SELECTORS.metricsTableBody)
    .should('exist')
    .find('tr')
    .should('have.length.greaterThan', 0);
  cy.get(SELECTORS.explanationContent).should('exist').and('not.be.empty');
});

Cypress.Commands.add('shouldShowPositiveROI', () => {
  cy.get(SELECTORS.metricsTableBody).contains('tr', 'Return on Investment').should('exist');
  cy.get(SELECTORS.metricsTableBody)
    .contains('tr', 'Return on Investment')
    .should('not.contain', '-');
});

Cypress.Commands.add('shouldShowNegativeROI', () => {
  cy.get(SELECTORS.metricsTableBody).contains('tr', 'Return on Investment').should('exist');
  cy.get(SELECTORS.metricsTableBody).contains('tr', 'Return on Investment').should('contain', '-');
});

Cypress.Commands.add('shouldDisplayMetric', (metricLabel: string) => {
  cy.get(SELECTORS.metricsTableBody).contains('td', metricLabel).should('exist');
});

Cypress.Commands.add('shouldHaveConfidenceAbove', (percentage: number) => {
  cy.get(SELECTORS.confidence).should('exist');
  cy.get(SELECTORS.confidence)
    .invoke('text')
    .then((text) => {
      const match = text.match(/(\d+\.?\d*)/);
      expect(match).to.exist;
      const confidence = parseFloat(match![1]);
      expect(confidence).to.be.greaterThan(percentage);
    });
});

Cypress.Commands.add('shouldHaveConfidenceBelow', (percentage: number) => {
  cy.get(SELECTORS.confidence).should('exist');
  cy.get(SELECTORS.confidence)
    .invoke('text')
    .then((text) => {
      const match = text.match(/(\d+\.?\d*)/);
      expect(match).to.exist;
      const confidence = parseFloat(match![1]);
      expect(confidence).to.be.lessThan(percentage);
    });
});

Cypress.Commands.add('shouldShowConfidenceExplanation', () => {
  cy.get(SELECTORS.confidenceExplanation).should('exist').and('not.be.empty');
  // Should contain actionable language for busy users
  cy.get(SELECTORS.confidenceExplanation)
    .invoke('text')
    .should(
      'match',
      /^(Proceed with confidence|Likely beneficial|Mixed signals|Risky proposition|High risk)/
    );
});

Cypress.Commands.add('shouldDisplayMonetaryMetrics', () => {
  cy.shouldDisplayMetric('Compute Cost Savings');
  cy.shouldDisplayMetric('Implementation Cost (Money)');
  cy.shouldDisplayMetric('Maintenance Cost (Money)');
  cy.shouldDisplayMetric('Net Benefit (Money)');
  cy.shouldDisplayMetric('Return on Investment (Money)');
});

Cypress.Commands.add('shouldShowBreakEvenTime', () => {
  cy.shouldDisplayMetric('Break-Even Time');
});

Cypress.Commands.add('shouldHaveDefaultConfiguration', () => {
  cy.get(SELECTORS.rate).should('have.value', '100');
  cy.get(SELECTORS.duration).should('have.value', '500');
  cy.get(SELECTORS.speedGain).should('have.value', '20');
  cy.get(SELECTORS.currentFailure).should('have.value', '5');
  cy.get(SELECTORS.bugFailure).should('have.value', '1');
  cy.get(SELECTORS.maintenance).should('have.value', '2');
  cy.get(SELECTORS.implementationTime).should('have.value', '100');
  cy.get(SELECTORS.timeHorizon).should('have.value', '2');
  // Allow both '0.5' and '0.50' as valid default values
  cy.get(SELECTORS.computeCost)
    .invoke('val')
    .should('match', /^0\.5(0)?$/);
  cy.get(SELECTORS.developerRate).should('have.value', '75');
  cy.get(SELECTORS.optimizationPreference).should('have.value', '50');
});

Cypress.Commands.add('shouldNotShowResults', () => {
  // On page load, the app auto-calculates, so results might already be showing
  // Check that resultsSection is hidden (has display: none)
  cy.get(SELECTORS.resultsSection).should('have.css', 'display', 'none');
});

Cypress.Commands.add('resetToDefaults', () => {
  cy.get(SELECTORS.resetButton).click();
  cy.wait(500); // Wait for reset and recalculation
});

Cypress.Commands.add('shouldHaveConfiguredValues', (values: Record<string, string>) => {
  // Mapping from field IDs to SELECTORS keys
  const fieldIdToSelector: Record<string, keyof typeof SELECTORS> = {
    rate: 'rate',
    'rate-unit': 'rateUnit',
    duration: 'duration',
    'duration-unit': 'durationUnit',
    'speed-gain': 'speedGain',
    'current-failure': 'currentFailure',
    'bug-failure': 'bugFailure',
    maintenance: 'maintenance',
    'maintenance-unit': 'maintenanceUnit',
    'implementation-time': 'implementationTime',
    'time-horizon': 'timeHorizon',
    'time-horizon-unit': 'timeHorizonUnit',
    'compute-cost': 'computeCost',
    'developer-rate': 'developerRate',
    'optimization-preference': 'optimizationPreference',
  };

  Object.entries(values).forEach(([fieldId, expectedValue]) => {
    const selectorKey = fieldIdToSelector[fieldId];
    if (!selectorKey) {
      throw new Error(`Unknown field ID: ${fieldId}. Add it to fieldIdToSelector mapping.`);
    }

    // Allow flexible matching for decimal values like 0.5 vs 0.50
    if (expectedValue.match(/^\d+\.\d*0$/)) {
      const flexiblePattern = new RegExp(`^${expectedValue.replace(/\.?0+$/, '(?:\\.\\d+)?')}$`);
      cy.get(SELECTORS[selectorKey]).invoke('val').should('match', flexiblePattern);
    } else {
      cy.get(SELECTORS[selectorKey]).should('have.value', expectedValue);
    }
  });
});

Cypress.Commands.add('shouldShowDetailedExplanation', () => {
  cy.get(SELECTORS.explanationContent).should('exist').and('not.be.empty');
  cy.get(SELECTORS.explanationContent).should('contain', 'Decision Factors');
  cy.get(SELECTORS.explanationContent).should('contain', 'What This Means');
});

Cypress.Commands.add('shouldHaveRequestRate', (rate: number) => {
  cy.get(SELECTORS.rate).should('have.value', rate.toString());
});

Cypress.Commands.add('shouldHaveSpeedGain', (gain: number) => {
  cy.get(SELECTORS.speedGain).should('have.value', gain.toString());
});

Cypress.Commands.add('shouldHaveImplementationTime', (time: number) => {
  cy.get(SELECTORS.implementationTime).should('have.value', time.toString());
});

Cypress.Commands.add('shouldHaveRateUnit', (unit: string) => {
  cy.get(SELECTORS.rateUnit).should('have.value', unit);
});

Cypress.Commands.add('shouldHaveDurationUnit', (unit: string) => {
  cy.get(SELECTORS.durationUnit).should('have.value', unit);
});

Cypress.Commands.add('shouldHaveTimeHorizonUnit', (unit: string) => {
  cy.get(SELECTORS.timeHorizonUnit).should('have.value', unit);
});

Cypress.Commands.add('shouldShowConfidence', () => {
  cy.get(SELECTORS.confidence).should('exist');
  cy.get(SELECTORS.confidence).should('contain', 'Confidence');
  cy.get(SELECTORS.confidence).should('contain', '%');
});

Cypress.Commands.add('shouldShowMetricsTable', () => {
  cy.get(SELECTORS.metricsBreakdown).should('exist');
  cy.get(SELECTORS.metricsTableRows).should('have.length.greaterThan', 5);
});

Cypress.Commands.add('shouldHaveXkcdLinks', () => {
  cy.contains('a', 'xkcd').should('have.attr', 'href').and('include', 'xkcd.com');
});

Cypress.Commands.add('shouldBeVisibleOnMobile', () => {
  cy.contains('Is It Worth Speeding It').should('be.visible');
  cy.get(SELECTORS.rate).should('be.visible');
});

Cypress.Commands.add('shouldBeVisibleOnTablet', () => {
  cy.contains('Is It Worth Speeding It').should('be.visible');
});

Cypress.Commands.add('shouldShowDecisionBadge', () => {
  cy.get(SELECTORS.decisionBadge).should('exist').and('not.be.empty');
});

Cypress.Commands.add('screenshotInputsSection', (filename: string) => {
  // Hide floating bubble to prevent it from appearing in inputs section screenshots
  cy.get(SELECTORS.floatingBubble).invoke('css', 'display', 'none');
  // Scroll to inputs section to center it in viewport
  cy.get(SELECTORS.inputsSection).scrollIntoView();
  cy.wait(300);

  // Get current viewport dimensions
  cy.window().then((win) => {
    const viewportWidth = win.innerWidth;
    const viewportHeight = win.innerHeight;

    // Take clipped screenshot - adjust clip coordinates as needed
    cy.screenshot(filename, {
      overwrite: true,
      clip: {
        x: 0,
        y: 0,
        height: viewportHeight,
        width: viewportWidth,
      },
    });
  });
});

Cypress.Commands.add('screenshotResultsSection', (filename: string) => {
  // Hide floating bubble to prevent it from appearing in results section screenshots
  cy.get(SELECTORS.floatingBubble).invoke('css', 'display', 'none');
  // Scroll to results section to center it in viewport
  cy.get(SELECTORS.resultsSectionData).scrollIntoView();
  cy.wait(300);

  // Get current viewport dimensions
  cy.window().then((win) => {
    const viewportWidth = win.innerWidth;
    const viewportHeight = win.innerHeight;

    // Take clipped screenshot - adjust clip coordinates as needed
    cy.screenshot(filename, {
      overwrite: true,
      clip: {
        x: 0,
        y: 0,
        height: viewportHeight,
        width: viewportWidth,
      },
    });
  });
});

Cypress.Commands.add('screenshotFloatingBubble', (filename: string) => {
  cy.get(SELECTORS.floatingBubble).screenshot(filename, {
    overwrite: true,
  });
});

Cypress.Commands.add('scrollToResults', () => {
  cy.get(SELECTORS.resultsSectionData).scrollIntoView();
});

Cypress.Commands.add('shouldShowFloatingBubble', () => {
  cy.get(SELECTORS.floatingBubble).should('be.visible');
});

Cypress.Commands.add('captureDecisionText', (alias: string) => {
  cy.get(SELECTORS.decisionBadge).invoke('text').as(alias);
});

// KaTeX/Formula Commands

Cypress.Commands.add('shouldHaveUnifiedAnalysisSection', () => {
  cy.contains('📊 Analysis & Mathematical Foundation').should('exist');
});

Cypress.Commands.add('shouldHaveMathematicalFoundationSection', () => {
  cy.contains('🧮 Mathematical Foundation').should('exist');
  cy.contains('📐 View Mathematical Formulas').should('exist');
});

Cypress.Commands.add('expandMathFormulas', () => {
  cy.contains('📐 View Mathematical Formulas').click({ force: true });
  cy.wait(1000); // Wait for animation and KaTeX rendering
});

Cypress.Commands.add('shouldRenderKatexFormulas', () => {
  cy.get(SELECTORS.formulaRender).should('exist');
  cy.get(SELECTORS.katexElement).should('exist');
  cy.get(SELECTORS.katexElement).should('have.length.at.least', 1);
});

Cypress.Commands.add('shouldHaveFormulaDataAttributes', (minCount: number) => {
  cy.get(SELECTORS.formulaRender).should('exist');
  cy.get(SELECTORS.formulaRenderWithData).should('have.length.at.least', minCount);
});

Cypress.Commands.add('shouldHaveLargerFormulas', () => {
  cy.get(SELECTORS.formulaRender)
    .first()
    .should('have.css', 'font-size')
    .and('match', /^(28|32)px$/); // Responsive scaling between 1.75em and 2em
});

Cypress.Commands.add('shouldHaveHumanReadableDescriptions', () => {
  cy.contains(
    'Total Requests = Rate (req/hr) × 24 (hr/day) × 365 (days/yr) × Time Horizon (years)'
  ).should('exist');
  cy.contains('Time Saved = Current Duration × (Speed Gain % ÷ 100)').should('exist');
  cy.contains('ROI = (Net Benefit ÷ Total Cost) × 100%').should('exist');
});

Cypress.Commands.add('shouldHaveVariableExplanations', () => {
  cy.contains('where r = requests per hour, T = time horizon in years').should('exist');
  cy.contains('where d = duration per request (hours), g = speed gain (%)').should('exist');
  cy.contains('where I = implementation hours, M = maintenance hours/year').should('exist');
});

Cypress.Commands.add('shouldCollapseAndExpandFormulas', () => {
  cy.contains('Total Requests = Rate (req/hr)').should('exist');
  cy.contains('📐 View Mathematical Formulas').click({ force: true });
  cy.wait(500);
});

Cypress.Commands.add('shouldShowMathematicalFoundationContext', () => {
  cy.contains(
    'The calculations below form the mathematical foundation for the optimization decision above'
  ).should('exist');
});

// Version and UI Commands

Cypress.Commands.add('shouldDisplayVersion', () => {
  cy.get(SELECTORS.appVersion).should('exist').and('not.be.empty');
  cy.get(SELECTORS.appVersion)
    .invoke('text')
    .should('match', /^[\w-]+$/);
});

Cypress.Commands.add('shouldHaveVersionFormat', () => {
  cy.get(SELECTORS.appVersion)
    .invoke('text')
    .then((versionText) => {
      expect(versionText.length).to.be.greaterThan(0);
      expect(versionText).to.include('-');
    });
});

Cypress.Commands.add('shouldShowOptimizationPreferenceSlider', () => {
  cy.get(SELECTORS.optimizationPreference).should('exist').and('be.visible');
  cy.get(SELECTORS.optimizationPreferenceLabel).should('exist').and('be.visible');
});

Cypress.Commands.add('shouldHaveOptimizationPreferenceLabel', (label: string) => {
  cy.get(SELECTORS.optimizationPreferenceLabel).should('contain', label);
});

Cypress.Commands.add('shouldShowCalculatorForm', () => {
  cy.get(SELECTORS.calculatorForm).should('be.visible');
  cy.get(SELECTORS.rate).should('be.visible');
});

Cypress.Commands.add('shouldContainTextInExplanation', (text: string) => {
  cy.get(SELECTORS.explanationContent).should('contain', text);
});

Cypress.Commands.add('costDecisionShouldBeOneOf', (validDecisions: string[]) => {
  cy.get('@costDecision').should('be.oneOf', validDecisions);
});

Cypress.Commands.add('throughputDecisionShouldBeOneOf', (validDecisions: string[]) => {
  cy.get('@throughputDecision').should('be.oneOf', validDecisions);
});

// Influence Diagram Commands

Cypress.Commands.add('expandInfluenceDiagram', () => {
  // First ensure results are generated and scroll to results section
  cy.get(SELECTORS.resultsSection).scrollIntoView();
  cy.get(SELECTORS.decisionBadge).should('exist');

  // Click to expand the influence diagram section
  cy.get(SELECTORS.viewInfluenceMapToggle).click({ force: true });
  
  // Wait for DaisyUI collapse animation to complete by checking the checkbox state
  cy.get(SELECTORS.viewInfluenceMapToggle).parent().find('input[type="checkbox"]').should('be.checked');
  cy.wait(800); // Wait for CSS transition to complete (DaisyUI uses 300ms + rendering time)
});

Cypress.Commands.add('shouldShowInfluenceDiagram', () => {
  // Wait for the diagram to exist and become visible (with increased timeout for DaisyUI animation)
  cy.get(SELECTORS.influenceDiagram, { timeout: 10000 })
    .should('exist')
    .should(($el) => {
      // Check if element is actually visible in viewport (not just display/visibility CSS)
      const el = $el[0];
      const rect = el.getBoundingClientRect();
      expect(rect.width).to.be.greaterThan(0);
      expect(rect.height).to.be.greaterThan(0);
    });

  // Wait for Mermaid to render the SVG
  cy.get(SELECTORS.mermaidSvg, { timeout: 10000 }).should('exist').and('be.visible');
});

Cypress.Commands.add('shouldShowInfluenceDiagramContent', () => {
  cy.contains('This diagram shows how all factors interact to influence the final optimization decision').should('exist');
  cy.contains('Green arrows indicate positive influence').should('exist');
  cy.contains('orange nodes are critical leverage points').should('exist');
});

Cypress.Commands.add('shouldShowFullscreenButton', () => {
  // Wait for the diagram to be fully visible first
  cy.get(SELECTORS.influenceDiagram, { timeout: 10000 })
    .should(($el) => {
      const el = $el[0];
      const rect = el.getBoundingClientRect();
      expect(rect.width).to.be.greaterThan(0);
      expect(rect.height).to.be.greaterThan(0);
    });
  
  cy.get(SELECTORS.fullscreenDiagramBtn, { timeout: 10000 }).should('exist').and('be.visible');
  cy.get(SELECTORS.fullscreenDiagramBtn).should('contain', 'Fullscreen');
});

Cypress.Commands.add('openFullscreenDiagram', () => {
  cy.get(SELECTORS.fullscreenDiagramBtn).click({ force: true });
  cy.wait(300); // Wait for modal animation
});

Cypress.Commands.add('shouldShowFullscreenModal', () => {
  cy.get(SELECTORS.mermaidFullscreenModal).should('exist').and('be.visible');
  cy.get(SELECTORS.fullscreenModalTitle).should('exist').and('be.visible');
  cy.get(SELECTORS.closeFullscreenBtn).should('exist').and('be.visible');
  cy.get(SELECTORS.fullscreenInstructions).should('exist').and('be.visible');
});

Cypress.Commands.add('shouldShowFullscreenDiagram', () => {
  cy.get(SELECTORS.fullscreenMermaidDiagram).should('exist').and('be.visible');
  cy.get(SELECTORS.fullscreenMermaidSvg).should('exist').and('be.visible');
});

Cypress.Commands.add('closeFullscreenModal', () => {
  cy.get(SELECTORS.closeFullscreenBtn).click({ force: true });
  cy.wait(300); // Wait for modal close animation
});

Cypress.Commands.add('shouldHideFullscreenModal', () => {
  cy.get(SELECTORS.mermaidFullscreenModal).should('not.be.visible');
});

Cypress.Commands.add('closeFullscreenModalWithEscape', () => {
  cy.get(SELECTORS.mermaidFullscreenModal).should('be.visible');
  cy.get('body').type('{esc}');
  cy.wait(300); // Wait for modal close animation
});

Cypress.Commands.add('closeFullscreenModalWithBackdrop', () => {
  cy.get(SELECTORS.mermaidFullscreenModal).should('be.visible');
  // Click on the modal backdrop (the dark overlay)
  cy.get(SELECTORS.mermaidFullscreenModal).click({ force: true });
  cy.wait(300); // Wait for modal close animation
});

Cypress.Commands.add('shouldShowInfluenceDiagramNodes', () => {
  // Check for key nodes in the influence diagram
  cy.get(SELECTORS.mermaidSvg).should('contain.text', 'Request Rate');
  cy.get(SELECTORS.mermaidSvg).should('contain.text', 'Speed Gain %');
  cy.get(SELECTORS.mermaidSvg).should('contain.text', 'Total Time Saved');
  cy.get(SELECTORS.mermaidSvg).should('contain.text', 'Net Benefit');
  cy.get(SELECTORS.mermaidSvg).should('contain.text', 'Final Decision');
});

Cypress.Commands.add('shouldShowSuccessFactors', () => {
  cy.contains('🎯 Key Success Factors').should('exist');
  cy.contains('Request Rate Amplification').should('exist');
  cy.contains('Time Horizon Leverage').should('exist');
  cy.contains('Optimization Preference').should('exist');
});

Cypress.Commands.add('shouldShowFeedbackLoops', () => {
  cy.contains('🔄 Critical Feedback Loops').should('exist');
  cy.contains('High Traffic Loop').should('exist');
  cy.contains('Cost Efficiency Loop').should('exist');
  cy.contains('Risk vs Reward').should('exist');
});

Cypress.Commands.add('testInfluenceDiagramWorkflow', () => {
  // Fill in some data to generate results
  cy.configureHighTrafficScenario();
  cy.calculate();

  // Wait for results to be generated and scroll to them
  cy.get(SELECTORS.resultsSection).scrollIntoView();
  cy.get(SELECTORS.decisionBadge).should('exist');

  // Expand the influence diagram
  cy.expandInfluenceDiagram();

  // Verify diagram content
  cy.shouldShowInfluenceDiagramContent();
  cy.shouldShowInfluenceDiagram();
  cy.shouldShowInfluenceDiagramNodes();

  // Verify fullscreen button appears
  cy.shouldShowFullscreenButton();

  // Test fullscreen functionality
  cy.openFullscreenDiagram();
  cy.shouldShowFullscreenModal();
  cy.shouldShowFullscreenDiagram();

  // Test closing fullscreen
  cy.closeFullscreenModal();
  cy.shouldHideFullscreenModal();

  // Test alternative close methods
  cy.openFullscreenDiagram();
  cy.closeFullscreenModalWithEscape();
  cy.shouldHideFullscreenModal();

  // Verify success factors and feedback loops
  cy.expandInfluenceDiagram();
  cy.shouldShowSuccessFactors();
  cy.shouldShowFeedbackLoops();
});

export {};
