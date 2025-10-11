/// <reference types="cypress" />

import { TEXT_CONTENT } from '../support/commands';

describe('Optimization Preference Slider', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('When adjusting optimization preference', () => {
    it('should display slider with default "Balanced" label', () => {
      cy.shouldShowOptimizationPreferenceSlider();
      cy.shouldHaveOptimizationPreferenceLabel(TEXT_CONTENT.balanced);
    });

    it('should update label based on slider value', () => {
      cy.enterOptimizationPreference(0);
      cy.shouldHaveOptimizationPreferenceLabel(TEXT_CONTENT.costFocused);

      cy.enterOptimizationPreference(100);
      cy.shouldHaveOptimizationPreferenceLabel(TEXT_CONTENT.throughputFocused);

      cy.enterOptimizationPreference(50);
      cy.shouldHaveOptimizationPreferenceLabel(TEXT_CONTENT.balanced);
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
      cy.shouldContainTextInExplanation(TEXT_CONTENT.costOptimized);

      cy.enterOptimizationPreference(100);
      cy.calculate();
      cy.shouldContainTextInExplanation(TEXT_CONTENT.throughputOptimized);

      cy.enterOptimizationPreference(50);
      cy.calculate();
      cy.shouldContainTextInExplanation(TEXT_CONTENT.balanced);
    });
  });

});
