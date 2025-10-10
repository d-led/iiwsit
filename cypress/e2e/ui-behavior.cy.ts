/// <reference types="cypress" />

describe('UI Behavior and User Experience', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When first visiting the calculator', () => {
    it('should display the header and form', () => {
      cy.contains('Is It Worth Speeding It').should('be.visible');
      cy.get('#calculator-form').should('be.visible');
      cy.get('#rate').should('be.visible');
    });

    it('should have default values pre-filled', () => {
      // We'll add a command to verify default configuration
      cy.shouldHaveDefaultConfiguration();
    });

    it('should auto-calculate results on page load with default values', () => {
      // The app automatically calculates results with default values on load
      cy.shouldDisplayResults();
      cy.shouldShowDecisionBadge();
    });
  });

  describe('When calculating a decision', () => {
    it('should scroll to and display results', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();

      cy.shouldDisplayResults();
    });

    it('should display decision with appropriate styling', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();

      cy.shouldRecommendDecision('YES');
    });

    it('should show detailed explanation', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();

      cy.shouldShowDetailedExplanation();
    });
  });

  describe('When interacting with form inputs', () => {
    it('should allow changing all input fields', () => {
      cy.enterRequestRate(500);
      cy.enterSpeedGain(35);
      cy.enterImplementationTime(80);

      cy.shouldHaveRequestRate(500);
      cy.shouldHaveSpeedGain(35);
      cy.shouldHaveImplementationTime(80);
    });

    it('should allow changing unit selections', () => {
      cy.enterRequestRate(100, 'minute');
      cy.enterRequestDuration(2, 'second');
      cy.enterTimeHorizon(6, 'month');

      cy.shouldHaveRateUnit('minute');
      cy.shouldHaveDurationUnit('second');
      cy.shouldHaveTimeHorizonUnit('month');
    });
  });

  describe('When viewing results', () => {
    beforeEach(() => {
      cy.configureHighTrafficScenario();
      cy.calculate();
    });

    it('should display confidence percentage', () => {
      cy.shouldShowConfidence();
    });

    it('should display all metrics in a table', () => {
      cy.shouldShowMetricsTable();
    });

    it('should include links to xkcd in footer', () => {
      cy.shouldHaveXkcdLinks();
    });
  });

  describe('When working with responsive design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.shouldBeVisibleOnMobile();
      cy.calculate();
      cy.shouldDisplayResults();
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.shouldBeVisibleOnTablet();
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.shouldDisplayResults();
    });
  });
});
