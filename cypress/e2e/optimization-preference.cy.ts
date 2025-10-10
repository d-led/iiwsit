/// <reference types="cypress" />

describe('Optimization Preference Slider', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When adjusting optimization preference', () => {
    it('should display the optimization preference slider', () => {
      cy.get('#optimization-preference').should('exist').and('be.visible');
      cy.get('#optimization-preference-label').should('exist').and('be.visible');
    });

    it('should show "Balanced" label by default', () => {
      cy.get('#optimization-preference-label').should('contain', 'Balanced');
    });

    it('should update label to "Cost-focused" when set to low values', () => {
      cy.enterOptimizationPreference(0);
      cy.get('#optimization-preference-label').should('contain', 'Cost-focused');

      cy.enterOptimizationPreference(25);
      cy.get('#optimization-preference-label').should('contain', 'Cost-focused');
    });

    it('should update label to "Throughput-focused" when set to high values', () => {
      cy.enterOptimizationPreference(100);
      cy.get('#optimization-preference-label').should('contain', 'Throughput-focused');

      cy.enterOptimizationPreference(75);
      cy.get('#optimization-preference-label').should('contain', 'Throughput-focused');
    });

    it('should keep "Balanced" label for middle values', () => {
      cy.enterOptimizationPreference(50);
      cy.get('#optimization-preference-label').should('contain', 'Balanced');

      cy.enterOptimizationPreference(45);
      cy.get('#optimization-preference-label').should('contain', 'Balanced');

      cy.enterOptimizationPreference(55);
      cy.get('#optimization-preference-label').should('contain', 'Balanced');
    });
  });

  describe('When optimization preference affects decisions', () => {
    it('should show preference mode in reasoning for cost-optimized', () => {
      // Configure a scenario
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterOptimizationPreference(0); // Cost-optimized
      cy.calculate();

      cy.shouldDisplayResults();
      cy.get('#explanation-content').should('contain', 'Cost-optimized');
    });

    it('should show preference mode in reasoning for throughput-optimized', () => {
      // Configure a scenario
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterOptimizationPreference(100); // Throughput-optimized
      cy.calculate();

      cy.shouldDisplayResults();
      cy.get('#explanation-content').should('contain', 'Throughput-optimized');
    });

    it('should show preference mode in reasoning for balanced', () => {
      // Configure a scenario
      cy.enterRequestRate(100, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(30);
      cy.enterOptimizationPreference(50); // Balanced
      cy.calculate();

      cy.shouldDisplayResults();
      cy.get('#explanation-content').should('contain', 'Balanced');
    });

    it('should recalculate when preference changes', () => {
      // Configure a scenario with good throughput but high cost
      cy.enterRequestRate(200, 'second');
      cy.enterRequestDuration(500, 'millisecond');
      cy.enterSpeedGain(40);
      cy.enterComputeCost(0.1); // Low compute cost
      cy.enterDeveloperRate(150); // High developer cost
      cy.enterImplementationTime(200); // High implementation cost

      // Test with cost optimization
      cy.enterOptimizationPreference(0);
      cy.calculate();
      cy.shouldDisplayResults();
      cy.captureDecisionText('costDecision');

      // Test with throughput optimization
      cy.enterOptimizationPreference(100);
      cy.calculate();
      cy.shouldDisplayResults();
      cy.captureDecisionText('throughputDecision');

      // Both should produce valid decisions
      cy.get('@costDecision').should('be.oneOf', ['YES', 'NO', 'MAYBE']);
      cy.get('@throughputDecision').should('be.oneOf', ['YES', 'NO', 'MAYBE']);
    });
  });

  describe('When reset to defaults', () => {
    it('should reset optimization preference to 50 (balanced)', () => {
      // Given a user has set a custom preference
      cy.enterOptimizationPreference(25);
      cy.calculate();
      cy.shouldHaveConfiguredValues({
        'optimization-preference': '25',
      });

      // When the user resets to defaults
      cy.resetToDefaults();

      // Then the preference should be back to 50
      cy.shouldHaveConfiguredValues({
        'optimization-preference': '50',
      });
      cy.get('#optimization-preference-label').should('contain', 'Balanced');
    });
  });
});
