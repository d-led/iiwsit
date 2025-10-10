/// <reference types="cypress" />

describe('Throughput Optimization Calculator - User Workflows', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When a developer evaluates a high-traffic system optimization', () => {
    it('should recommend proceeding with the optimization', () => {
      // Given a high-traffic system with good optimization potential
      cy.configureHighTrafficScenario();

      // When the developer calculates the decision
      cy.calculate();

      // Then the system should recommend proceeding
      cy.shouldDisplayResults();
      cy.shouldRecommendDecision('YES');
      cy.shouldHaveConfidenceAbove(60);
      cy.shouldShowPositiveROI();
    });

    it('should display all relevant metrics', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();

      // The developer should see comprehensive metrics
      cy.shouldDisplayMetric('Request Rate');
      cy.shouldDisplayMetric('Total Time Saved');
      cy.shouldDisplayMetric('Net Benefit');
      cy.shouldDisplayMetric('Return on Investment');
      cy.shouldShowBreakEvenTime();
    });
  });

  describe('When a developer evaluates a low-traffic system optimization', () => {
    it('should recommend against the optimization', () => {
      // Given a low-traffic system with high costs
      cy.configureLowTrafficScenario();

      // When the developer calculates the decision
      cy.calculate();

      // Then the system should recommend not proceeding
      cy.shouldDisplayResults();
      cy.shouldRecommendDecision('NO');
      cy.shouldHaveConfidenceBelow(40);
      cy.shouldShowNegativeROI();
    });
  });

  describe('When conditions are highly favorable', () => {
    it('should show strong confidence in the YES decision', () => {
      // Given very favorable conditions
      cy.configureOptimisticScenario();

      // When calculating the decision
      cy.calculate();

      // Then confidence should be very high
      cy.shouldRecommendDecision('YES');
      cy.shouldHaveConfidenceAbove(80);
    });
  });

  describe('When conditions are clearly unfavorable', () => {
    it('should show strong confidence in the NO decision', () => {
      // Given very unfavorable conditions
      cy.configurePessimisticScenario();

      // When calculating the decision
      cy.calculate();

      // Then confidence should clearly indicate NO
      cy.shouldRecommendDecision('NO');
      cy.shouldHaveConfidenceBelow(30);
    });
  });

  describe('When a developer adjusts parameters', () => {
    it('should recalculate and update results', () => {
      // Given initial high-traffic scenario
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.shouldRecommendDecision('YES');

      // When the developer changes to pessimistic parameters
      cy.configurePessimisticScenario();
      cy.calculate();

      // Then the decision should update accordingly
      cy.shouldRecommendDecision('NO');
    });
  });

  describe('When evaluating different time horizons', () => {
    it('should show better outcomes for longer time horizons', () => {
      // Given a scenario with short time horizon
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterCurrentFailureRate(5);
      cy.enterBugFailureRate(1);
      cy.enterMaintenanceTime(2, 'hour-per-week');
      cy.enterImplementationTime(100);
      cy.enterTimeHorizon(3, 'month');

      cy.calculate();
      cy.shouldShowDecisionBadge();
      cy.captureDecisionText('shortHorizonDecision');

      // When extending the time horizon
      cy.enterTimeHorizon(5, 'year');
      cy.calculate();

      // Then the recommendation might improve
      cy.shouldDisplayResults();
      // The results should be visible and metrics should reflect longer horizon
      cy.shouldDisplayMetric('Break-Even Time');
    });
  });
});
