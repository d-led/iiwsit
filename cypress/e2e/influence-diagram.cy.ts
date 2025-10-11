/// <reference types="cypress" />

/**
 * Influence Diagram E2E Tests
 *
 * Tests the Mermaid.js influence diagram functionality including:
 * - Diagram rendering and expansion
 * - Fullscreen modal with zoom/pan
 * - Content verification (nodes, success factors, feedback loops)
 * - Multiple close methods (button, escape, backdrop)
 */

describe('Influence Diagram', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  describe('Diagram Rendering and Expansion', () => {
    it('should show influence diagram section', () => {
      cy.configureHighTrafficScenario();
      cy.waitForResultsAndScroll();
      cy.shouldBeInitiallyCollapsed();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
    });

    it('should render Mermaid diagram with SVG', () => {
      cy.configureHighTrafficScenario();
      cy.waitForResultsAndScroll();
      cy.expandInfluenceDiagram();
      cy.shouldRenderMermaidSvg();
    });

    it('should display diagram description and instructions', () => {
      cy.configureHighTrafficScenario();
      cy.waitForResultsAndScroll();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagramContent();
    });

    it('should show fullscreen button after diagram renders', () => {
      cy.configureHighTrafficScenario();
      cy.waitForResultsAndScroll();
      cy.expandInfluenceDiagram();
      cy.shouldShowFullscreenButton();
    });
  });

  describe('Diagram Content Verification', () => {
    beforeEach(() => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
    });

    it('should display key influence diagram nodes', () => {
      cy.shouldShowInfluenceDiagramNodes();
    });

    it('should show key insights section', () => {
      cy.shouldShowSuccessFactors();
    });

    it('should show preference slider explanation', () => {
      cy.shouldShowFeedbackLoops();
    });

    it('should explain compounding effect', () => {
      cy.shouldShowCompoundingEffect();
    });

    it('should explain break-even dynamics', () => {
      cy.shouldShowBreakEvenDynamics();
    });

    it('should explain speed gain impact', () => {
      cy.shouldShowSpeedGainImpact();
    });
  });

  describe('Fullscreen Modal Functionality', () => {
    beforeEach(() => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
    });

    it('should open fullscreen modal', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.shouldShowFullscreenDiagram();
    });

    it('should display fullscreen modal title', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModalTitle();
    });

    it('should show Mermaid native controls instructions', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowMermaidControls();
    });

    it('should render diagram in fullscreen modal', () => {
      cy.openFullscreenDiagram();
      cy.shouldRenderFullscreenSvg();
    });

    it('should close fullscreen modal with close button', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.closeFullscreenModal();
      cy.shouldHideFullscreenModal();
    });

    it('should close fullscreen modal with Escape key', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.closeFullscreenModalWithEscape();
      cy.shouldHideFullscreenModal();
    });

    it('should close fullscreen modal by clicking backdrop', () => {
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.closeFullscreenModalWithBackdrop();
      cy.shouldHideFullscreenModal();
    });

    it('should allow reopening fullscreen modal after closing', () => {
      cy.openFullscreenDiagram();
      cy.closeFullscreenModal();
      cy.shouldHideFullscreenModal();

      // Reopen
      cy.openFullscreenDiagram();
      cy.shouldShowFullscreenModal();
      cy.shouldShowFullscreenDiagram();
    });
  });

  describe('Fullscreen Modal Interactions', () => {
    beforeEach(() => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.openFullscreenDiagram();
    });

    it('should have interactive SVG diagram', () => {
      cy.shouldHaveInteractiveSvg();
    });

    it('should contain all diagram nodes in fullscreen', () => {
      cy.shouldContainAllDiagramNodes();
    });
  });

  describe('Complete Workflow Test', () => {
    it('should execute complete influence diagram workflow', () => {
      cy.testInfluenceDiagramWorkflow();
    });
  });

  describe('Multiple Scenarios', () => {
    it('should show influence diagram for low traffic scenario', () => {
      cy.configureLowTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
      cy.shouldShowInfluenceDiagramNodes();
    });

    it('should show influence diagram for medium traffic scenario', () => {
      cy.configureOptimisticScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
      cy.shouldShowInfluenceDiagramNodes();
    });
  });

  describe('UI State Management', () => {
    it('should maintain diagram state when collapsing and expanding', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
      cy.collapseInfluenceDiagram();
      cy.shouldBeInitiallyCollapsed();
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
    });

    it('should show fullscreen button consistently after render', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.shouldShowFullscreenButtonWithTitle();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
    });

    it('should have accessible fullscreen button', () => {
      cy.shouldHaveAccessibleFullscreenButton();
    });

    it('should have accessible close button in modal', () => {
      cy.openFullscreenDiagram();
      cy.shouldHaveAccessibleCloseButton();
    });
  });

  describe('Performance', () => {
    it('should render diagram within reasonable time', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.shouldRenderDiagramWithinReasonableTime();
    });

    it('should open fullscreen modal quickly', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.shouldOpenFullscreenQuickly();
    });
  });
});

