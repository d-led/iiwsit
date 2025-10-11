/// <reference types="cypress" />

describe('Optimization Preference Slider', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When adjusting optimization preference', () => {
    it('should display slider with default "Balanced" label', () => {
      cy.shouldShowOptimizationPreferenceSlider();
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');
    });

    it('should update label based on slider value', () => {
      cy.enterOptimizationPreference(0);
      cy.shouldHaveOptimizationPreferenceLabel('Cost-focused');

      cy.enterOptimizationPreference(100);
      cy.shouldHaveOptimizationPreferenceLabel('Throughput-focused');

      cy.enterOptimizationPreference(50);
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');
    });
  });

  describe('When optimization preference affects decisions', () => {
    it('should show preference mode in reasoning and recalculate', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);

      cy.enterOptimizationPreference(0);
      cy.calculate();
      cy.shouldDisplayResults();
      cy.shouldContainTextInExplanation('Cost-optimized');

      cy.enterOptimizationPreference(100);
      cy.calculate();
      cy.shouldContainTextInExplanation('Throughput-optimized');

      cy.enterOptimizationPreference(50);
      cy.calculate();
      cy.shouldContainTextInExplanation('Balanced');
    });
  });

});
