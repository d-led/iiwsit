/// <reference types="cypress" />

/**
 * Influence Diagram E2E Tests
 *
 * Tests the Mermaid.js influence diagram functionality including:
 * - Diagram rendering and expansion
 * - Fullscreen modal with zoom/pan
 * - Static content verification (nodes, success factors, feedback loops)
 * - Multiple close methods (button, escape, backdrop)
 *
 * Note: The Mermaid diagram is static and doesn't change based on input values,
 * so we only need one configuration to generate results.
 */

describe('Influence Diagram', () => {
  beforeEach(() => {
    cy.visitCalculator();
    cy.configureHighTrafficScenario();
    cy.calculate();
  });

  describe('Basic Rendering', () => {
    it('should be initially collapsed and expand on click', () => {
      cy.waitForResultsAndScroll();
      cy.shouldBeInitiallyCollapsed();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
    });

    it('should render Mermaid SVG with diagram nodes', () => {
      cy.expandInfluenceDiagram();
      cy.shouldRenderMermaidSvg();
      cy.shouldShowInfluenceDiagramNodes();
    });

    it('should maintain state when collapsing and re-expanding', () => {
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
      cy.collapseInfluenceDiagram();
      cy.shouldBeInitiallyCollapsed();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
    });
  });

  describe('Static Content', () => {
    beforeEach(() => {
      cy.expandInfluenceDiagram();
    });

    it('should display diagram description and instructions', () => {
      cy.shouldShowInfluenceDiagramContent();
    });

    it('should show all key insights', () => {
      cy.shouldShowSuccessFactors();
      cy.shouldShowCompoundingEffect();
      cy.shouldShowBreakEvenDynamics();
      cy.shouldShowSpeedGainImpact();
    });

    it('should show preference slider explanation', () => {
      cy.shouldShowFeedbackLoops();
    });
  });

  describe('Fullscreen Modal', () => {
    beforeEach(() => {
      cy.expandInfluenceDiagram();
      cy.shouldShowFullscreenButton();
    });

    it('should open with all content and controls', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.shouldShowFullscreenModalTitle();
      cy.shouldShowMermaidControls();
      cy.shouldShowFullscreenDiagram();
      cy.shouldContainAllDiagramNodes();
    });

    it('should close with button', () => {
      cy.openFullscreenDiagram();
      cy.closeFullscreenModal();
      cy.shouldHideFullscreenModal();
    });

    it('should close with Escape key', () => {
      cy.openFullscreenDiagram();
      cy.closeFullscreenModalWithEscape();
      cy.shouldHideFullscreenModal();
    });

    it('should close by clicking backdrop', () => {
      cy.openFullscreenDiagram();
      cy.closeFullscreenModalWithBackdrop();
      cy.shouldHideFullscreenModal();
    });

    it('should allow reopening after close', () => {
      cy.openFullscreenDiagram();
      cy.closeFullscreenModal();
      cy.shouldHideFullscreenModal();
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible fullscreen button with title', () => {
      cy.expandInfluenceDiagram();
      cy.shouldShowFullscreenButtonWithTitle();
    });

    it('should have accessible close button in modal', () => {
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
      cy.shouldHaveAccessibleCloseButton();
    });
  });

  describe('Performance', () => {
    it('should render diagram within reasonable time', () => {
      cy.shouldRenderDiagramWithinReasonableTime();
    });

    it('should open fullscreen modal quickly', () => {
      cy.expandInfluenceDiagram();
      cy.shouldOpenFullscreenQuickly();
    });
  });

  describe('URL Anchor Integration', () => {
    it('should add #diagram to URL when opening fullscreen', () => {
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.url().should('include', '#diagram');
    });

    it('should remove #diagram from URL when closing fullscreen', () => {
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
      cy.url().should('include', '#diagram');
      cy.closeFullscreenModal();
      cy.shouldHideFullscreenModal();
      cy.url().should('not.include', '#diagram');
    });

    it('should remove #diagram when closing with Escape', () => {
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
      cy.url().should('include', '#diagram');
      cy.closeFullscreenModalWithEscape();
      cy.shouldHideFullscreenModal();
      cy.url().should('not.include', '#diagram');
    });

    it('should remove #diagram when closing with backdrop click', () => {
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
      cy.url().should('include', '#diagram');
      cy.closeFullscreenModalWithBackdrop();
      cy.shouldHideFullscreenModal();
      cy.url().should('not.include', '#diagram');
    });

    it('should automatically open fullscreen when page loads with #diagram', () => {
      // Visit with #diagram anchor - default settings will trigger automatic calculation
      cy.visit('/#diagram');
      
      // Wait for automatic calculation, results rendering, diagram rendering, and fullscreen opening
      cy.wait(5000); // Allow time for: auto-calc → results → diagram section expansion → diagram render → fullscreen open
      
      // Verify fullscreen modal is open
      cy.get('#mermaid-fullscreen-modal', { timeout: 10000 }).should('be.visible');
      cy.url().should('include', '#diagram');
    });

    it('should preserve #diagram anchor on page reload', () => {
      // First open fullscreen normally
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
      cy.url().should('include', '#diagram');

      // Reload page
      cy.reload();

      // Wait for page to reload and modal to reopen automatically
      cy.wait(3000); // Wait for page reload, rendering, and automatic opening

      // Verify modal reopens automatically
      cy.shouldShowFullscreenModal();
      cy.url().should('include', '#diagram');
    });
  });
});


