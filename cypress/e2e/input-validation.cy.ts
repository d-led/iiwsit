/// <reference types="cypress" />

import { TEXT_CONTENT } from '../support/commands';

describe('Input Validation and Edge Cases', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('Edge Case Values', () => {
    it('should handle zero maintenance cost', () => {
      cy.enterRequestRate(100, 'second');
      cy.enterMaintenanceTime(0, 'hour-per-week');
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldDisplayMetric(TEXT_CONTENT.maintenanceCost);
    });

    it('should handle very high speed gains', () => {
      cy.enterSpeedGain(95);
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldShowDecisionBadge();
    });

    it('should handle minimal request rates', () => {
      cy.enterRequestRate(0.1, 'hour');
      cy.enterRequestDuration(10, 'second');
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldShowDecisionBadge();
    });
  });

  describe('Time Unit Conversions', () => {
    it('should handle all time unit combinations', () => {
      cy.enterRequestRate(50, 'second');
      cy.enterRequestDuration(2, 'minute');
      cy.enterTimeHorizon(6, 'month');
      cy.calculate();

      cy.shouldDisplayResults();
      cy.shouldDisplayMetric(TEXT_CONTENT.totalTimeSaved);
    });
  });
});
