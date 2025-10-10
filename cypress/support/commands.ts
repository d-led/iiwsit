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
  resetButton: '#reset-button',

  // Results
  resultsSection: '#results-section',
  resultsPlaceholder: '#results-placeholder',
  decisionBadge: '#decision-badge',
  confidence: '#confidence',
  confidenceExplanation: '#confidence-explanation',
  metricsBreakdown: '#metrics-breakdown',
  metricsTableBody: '#metrics-table-body',
  explanationContent: '#explanation-content',

  // Data attributes
  inputsSection: '[data-cy="inputs-section"]',
  resultsSectionData: '[data-cy="results-section"]',
  floatingBubble: '[data-cy="floating-bubble"]',
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
  cy.get('#confidence-explanation').should('exist').and('not.be.empty');
  // Should contain actionable language for busy users
  cy.get('#confidence-explanation')
    .invoke('text')
    .should('match', /^(Go ahead|Likely good|Maybe|Risky|Don't do it)/);
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
  Object.entries(values).forEach(([fieldId, expectedValue]) => {
    // Allow flexible matching for decimal values like 0.5 vs 0.50
    if (expectedValue.match(/^\d+\.\d*0$/)) {
      const flexiblePattern = new RegExp(`^${expectedValue.replace(/\.?0+$/, '(?:\\.\\d+)?')}$`);
      cy.get(`#${fieldId}`).invoke('val').should('match', flexiblePattern);
    } else {
      cy.get(`#${fieldId}`).should('have.value', expectedValue);
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
  cy.get(`${SELECTORS.metricsTableBody} tr`).should('have.length.greaterThan', 5);
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
        width: viewportWidth
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
        width: viewportWidth
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

export {};
