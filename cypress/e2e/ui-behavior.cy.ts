/// <reference types="cypress" />

describe('UI Behavior and User Experience', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('Initial Load', () => {
    it('should display form with default values and auto-calculate', () => {
      cy.contains('Is It Worth Speeding It').should('be.visible');
      cy.shouldShowCalculatorForm();
      cy.shouldHaveDefaultConfiguration();
      cy.shouldDisplayResults();
      cy.shouldShowDecisionBadge();
    });
  });

  describe('Form Interactions', () => {
    it('should allow changing input fields and update values', () => {
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

  describe('Results Display', () => {
    it('should display confidence, metrics table, and footer links', () => {
      cy.shouldShowConfidence();
      cy.shouldShowMetricsTable();
      cy.shouldHaveXkcdLinks();
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.shouldBeVisibleOnMobile();
      cy.shouldDisplayResults();
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.shouldBeVisibleOnTablet();
      cy.shouldDisplayResults();
    });
  });
});
