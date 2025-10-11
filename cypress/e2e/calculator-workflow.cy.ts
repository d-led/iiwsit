/// <reference types="cypress" />

describe('Calculator Workflows', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('Complete Decision Workflow', () => {
    it('should calculate and display comprehensive results', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldRecommendDecision('YES');
      cy.shouldHaveConfidenceAbove(60);
      cy.shouldShowPositiveROI();
      cy.shouldDisplayMetric('Request Rate');
      cy.shouldDisplayMetric('Total Time Saved');
      cy.shouldDisplayMetric('Net Benefit');
      cy.shouldDisplayMetric('Return on Investment');
      cy.shouldShowBreakEvenTime();
    });
  });

  describe('Parameter Adjustment Workflow', () => {
    it('should recalculate when parameters change', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.shouldRecommendDecision('YES');

      cy.configurePessimisticScenario();
      cy.calculate();
      cy.shouldRecommendDecision('NO');
    });

    it('should improve recommendation when extending time horizon', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterMaintenanceTime(2, 'hour-per-week');
      cy.enterImplementationTime(100);
      cy.enterTimeHorizon(3, 'month');
      cy.calculate();
      cy.captureDecisionText('shortHorizonDecision');

      cy.enterTimeHorizon(5, 'year');
      cy.calculate();
      cy.shouldDisplayResults();
      cy.shouldDisplayMetric('Break-Even Time');
    });
  });
});
