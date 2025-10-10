/// <reference types="cypress" />

describe('Input Validation and Edge Cases', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When a developer enters various input combinations', () => {
    it('should handle zero maintenance cost', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(20);
      cy.enterCurrentFailureRate(5);
      cy.enterBugFailureRate(1);
      cy.enterMaintenanceTime(0, 'hour-per-week');
      cy.enterImplementationTime(40);
      cy.enterTimeHorizon(1, 'year');

      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldDisplayMetric('Maintenance Cost');
    });

    it('should handle very high speed gains', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(1, 'second');
      cy.enterSpeedGain(95);
      cy.enterCurrentFailureRate(5);
      cy.enterBugFailureRate(1);
      cy.enterMaintenanceTime(1, 'hour-per-week');
      cy.enterImplementationTime(50);
      cy.enterTimeHorizon(1, 'year');

      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldRecommendDecision('YES');
    });

    it('should handle minimal request rates', () => {
      cy.enterRequestRate(0.1, 'hour');
      cy.enterRequestDuration(10, 'second');
      cy.enterSpeedGain(50);
      cy.enterCurrentFailureRate(5);
      cy.enterBugFailureRate(1);
      cy.enterMaintenanceTime(1, 'hour-per-day');
      cy.enterImplementationTime(100);
      cy.enterTimeHorizon(1, 'year');

      cy.calculate();

      cy.shouldDisplayResults();
      // With such low traffic, likely not worth it
      cy.shouldShowDecisionBadge();
    });
  });

  describe('When working with different time units', () => {
    it('should handle seconds for request rate', () => {
      cy.enterRequestRate(50, 'second');
      cy.calculate();
      cy.shouldDisplayResults();
    });

    it('should handle minutes for request duration', () => {
      cy.enterRequestDuration(2, 'minute');
      cy.calculate();
      cy.shouldDisplayResults();
    });

    it('should handle monthly time horizons', () => {
      cy.enterTimeHorizon(6, 'month');
      cy.calculate();
      cy.shouldDisplayResults();
    });
  });

  describe('When exploring failure rate scenarios', () => {
    it('should favor optimizations that reduce failures significantly', () => {
      cy.enterRequestRate(200, 'second');
      cy.enterRequestDuration(1, 'second');
      cy.enterSpeedGain(40);
      cy.enterCurrentFailureRate(25); // High current failure rate
      cy.enterBugFailureRate(2); // Low expected bugs
      cy.enterMaintenanceTime(2, 'hour-per-week');
      cy.enterImplementationTime(60);
      cy.enterTimeHorizon(2, 'year');

      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldDisplayMetric('Failure Rate Change');
      // Should likely recommend YES due to failure reduction
      cy.shouldShowDecisionBadge();
    });

    it('should penalize optimizations that introduce many bugs', () => {
      cy.enterRequestRate(200, 'second');
      cy.enterRequestDuration(1, 'second');
      cy.enterSpeedGain(20);
      cy.enterCurrentFailureRate(2); // Low current failure rate
      cy.enterBugFailureRate(20); // High expected bugs
      cy.enterMaintenanceTime(2, 'hour-per-week');
      cy.enterImplementationTime(40);
      cy.enterTimeHorizon(1, 'year');

      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldDisplayMetric('Failure Rate Change');
      // May impact the decision negatively
    });
  });
});
