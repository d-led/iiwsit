/// <reference types="cypress" />

describe('Screenshot Tests - Visual Regression', () => {
  beforeEach(() => {
    cy.visitCalculator();
    cy.fillHighTrafficScenario();
    cy.wait(500); // Wait for calculations to complete
  });

  describe('Desktop Screenshots (1200px width)', () => {
    it('should capture full desktop layout', () => {
      cy.viewport(1200, 800);
      cy.wait(500); // Wait for layout to stabilize

      cy.screenshot('desktop-full-layout', {
        capture: 'fullPage',
        overwrite: true,
      });
    });

    it('should capture desktop inputs section', () => {
      cy.viewport(1200, 800);
      cy.wait(500);

      // Scroll to top to capture inputs
      cy.window().scrollTo(0, 0);
      cy.wait(300);

      cy.screenshotInputsSection('desktop-inputs-section');
    });

    it('should capture desktop results section', () => {
      cy.viewport(1200, 800);
      cy.wait(500);

      // Scroll to results section
      cy.scrollToResults();
      cy.wait(300);

      cy.screenshotResultsSection('desktop-results-section');
    });
  });

  describe('Mobile Screenshots (375px width)', () => {
    it('should capture mobile full page', () => {
      cy.viewport(375, 667); // iPhone SE dimensions
      cy.wait(500);

      cy.screenshot('mobile-full-page', {
        capture: 'fullPage',
        overwrite: true,
      });
    });

    it('should capture mobile inputs section', () => {
      cy.viewport(375, 667);
      cy.wait(500);

      // Scroll to top
      cy.window().scrollTo(0, 0);
      cy.wait(300);

      cy.screenshotInputsSection('mobile-inputs-section');
    });

    it('should capture mobile results section', () => {
      cy.viewport(375, 667);
      cy.wait(500);

      // Scroll to results
      cy.scrollToResults();
      cy.wait(300);

      cy.screenshotResultsSection('mobile-results-section');
    });

    it('should capture mobile floating bubble', () => {
      cy.viewport(375, 667);
      cy.wait(500);

      // The floating bubble should be visible on mobile
      cy.shouldShowFloatingBubble();
      cy.screenshotFloatingBubble('mobile-floating-bubble');
    });
  });

  describe('Tablet Screenshots (768px width)', () => {
    it('should capture tablet layout', () => {
      cy.viewport(768, 1024); // iPad dimensions
      cy.wait(500);

      cy.screenshot('tablet-layout', {
        capture: 'fullPage',
        overwrite: true,
      });
    });
  });

  describe('Different Scenarios', () => {
    it('should capture NO decision scenario', () => {
      cy.viewport(1200, 800);
      cy.fillPessimisticScenario();
      cy.wait(500);

      cy.screenshot('desktop-no-decision', {
        capture: 'fullPage',
        overwrite: true,
      });
    });

    it('should capture MAYBE decision scenario', () => {
      cy.viewport(1200, 800);
      // Fill with moderate values that might result in MAYBE
      cy.enterRequestRate(50, 'second');
      cy.enterRequestDuration(200, 'millisecond');
      cy.enterSpeedGain(15);
      cy.enterCurrentFailureRate(3);
      cy.enterBugFailureRate(2);
      cy.enterMaintenanceTime(1, 'hour-per-week');
      cy.enterImplementationTime(200);
      cy.enterTimeHorizon(1, 'year');
      cy.enterComputeCost(0.25);
      cy.enterDeveloperRate(60);
      cy.wait(500);

      cy.screenshot('desktop-maybe-decision', {
        capture: 'fullPage',
        overwrite: true,
      });
    });
  });
});
