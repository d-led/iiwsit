/// <reference types="cypress" />

describe('Optimization Preference Slider', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When adjusting optimization preference', () => {
    it('should display the optimization preference slider', () => {
      cy.shouldShowOptimizationPreferenceSlider();
    });

    it('should show "Balanced" label by default', () => {
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');
    });

    it('should update label to "Cost-focused" when set to low values', () => {
      cy.enterOptimizationPreference(0);
      cy.shouldHaveOptimizationPreferenceLabel('Cost-focused');

      cy.enterOptimizationPreference(25);
      cy.shouldHaveOptimizationPreferenceLabel('Cost-focused');
    });

    it('should update label to "Throughput-focused" when set to high values', () => {
      cy.enterOptimizationPreference(100);
      cy.shouldHaveOptimizationPreferenceLabel('Throughput-focused');

      cy.enterOptimizationPreference(75);
      cy.shouldHaveOptimizationPreferenceLabel('Throughput-focused');
    });

    it('should keep "Balanced" label for middle values', () => {
      cy.enterOptimizationPreference(50);
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');

      cy.enterOptimizationPreference(45);
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');

      cy.enterOptimizationPreference(55);
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');
    });
  });

  describe('When optimization preference affects decisions', () => {
    it('should show preference mode in reasoning for cost-optimized', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterOptimizationPreference(0);
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldContainTextInExplanation('Cost-optimized');
    });

    it('should show preference mode in reasoning for throughput-optimized', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterOptimizationPreference(100);
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldContainTextInExplanation('Throughput-optimized');
    });

    it('should show preference mode in reasoning for balanced', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterOptimizationPreference(50);
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldContainTextInExplanation('Balanced');
    });

    it('should recalculate when preference changes', () => {
      cy.enterRequestRate(200, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(40);
      cy.enterComputeCost(0.1);
      cy.enterDeveloperRate(150);
      cy.enterImplementationTime(200);

      cy.enterOptimizationPreference(0);
      cy.calculate();
      cy.shouldDisplayResults();
      cy.captureDecisionText('costDecision');

      cy.enterOptimizationPreference(100);
      cy.calculate();
      cy.shouldDisplayResults();
      cy.captureDecisionText('throughputDecision');

      cy.costDecisionShouldBeOneOf(['YES', 'NO', 'MAYBE']);
      cy.throughputDecisionShouldBeOneOf(['YES', 'NO', 'MAYBE']);
    });
  });

  describe('When reset to defaults', () => {
    it('should reset optimization preference to 50 (balanced)', () => {
      cy.enterOptimizationPreference(25);
      cy.calculate();
      cy.shouldHaveConfiguredValues({
        'optimization-preference': '25',
      });

      cy.resetToDefaults();

      cy.shouldHaveConfiguredValues({
        'optimization-preference': '50',
      });
      cy.shouldHaveOptimizationPreferenceLabel('Balanced');
    });
  });
});
