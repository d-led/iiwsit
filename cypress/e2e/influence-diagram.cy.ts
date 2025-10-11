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

      // Wait for results section to exist and then scroll to it
      cy.get('#results-section', { timeout: 10000 }).should('exist');
      cy.get('#results-section').scrollIntoView();
      cy.wait(1000); // Wait for DOM to be fully updated

      // Wait a bit for DOM to be fully updated
      cy.wait(1000);

      cy.get('#influence-diagram').should('not.be.visible'); // Initially collapsed
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
    });

    it('should render Mermaid diagram with SVG', () => {
      cy.configureHighTrafficScenario();
      cy.get('#results-section', { timeout: 10000 }).should('exist');
      cy.get('#results-section').scrollIntoView();
      cy.wait(1000); // Wait for DOM to be fully updated
      cy.expandInfluenceDiagram();
      cy.get('.mermaid svg').first().scrollIntoView().should('exist').and('be.visible');
    });

    it('should display diagram description and instructions', () => {
      cy.configureHighTrafficScenario();
      cy.get('#results-section', { timeout: 10000 }).should('exist');
      cy.get('#results-section').scrollIntoView();
      cy.wait(1000); // Wait for DOM to be fully updated
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagramContent();
    });

    it('should show fullscreen button after diagram renders', () => {
      cy.configureHighTrafficScenario();
      cy.get('#results-section', { timeout: 10000 }).should('exist');
      cy.get('#results-section').scrollIntoView();
      cy.wait(1000); // Wait for DOM to be fully updated
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

    it('should show success factors section', () => {
      cy.shouldShowSuccessFactors();
    });

    it('should show feedback loops section', () => {
      cy.shouldShowFeedbackLoops();
    });

    it('should explain request rate amplification', () => {
      cy.contains('Request Rate Amplification').should('exist');
      cy.contains('High traffic creates exponential value').should('exist');
    });

    it('should explain time horizon leverage', () => {
      cy.contains('Time Horizon Leverage').should('exist');
      cy.contains('Longer horizons allow modest optimizations').should('exist');
    });

    it('should explain optimization preference control', () => {
      cy.contains('Optimization Preference').should('exist');
      cy.contains('Master control lever').should('exist');
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
      cy.contains('📈 Influence Diagram - Full Screen').should('be.visible');
    });

    it('should show Mermaid native controls instructions', () => {
      cy.openFullscreenDiagram();
      cy.contains('💡 Use mouse wheel to zoom, drag to pan').should('be.visible');
    });

    it('should render diagram in fullscreen modal', () => {
      cy.openFullscreenDiagram();
      cy.get('#fullscreen-mermaid-diagram svg').should('exist').and('be.visible');
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
      cy.get('#fullscreen-mermaid-diagram svg')
        .should('exist')
        .and('be.visible')
        .and('not.be.empty');
    });

    it('should contain all diagram nodes in fullscreen', () => {
      cy.get('#fullscreen-mermaid-diagram svg').should('contain.text', 'Request Rate');
      cy.get('#fullscreen-mermaid-diagram svg').should('contain.text', 'Final Decision');
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

      // Collapse by unchecking the checkbox
      cy.get('div.collapse-title:contains("📈 View Factor Influence Map")')
        .parent()
        .find('input[type="checkbox"]')
        .uncheck({ force: true });
      cy.wait(800); // Wait for collapse animation
      cy.get('#influence-diagram').should('not.be.visible');

      // Re-expand
      cy.expandInfluenceDiagram();
      cy.shouldShowInfluenceDiagram();
    });

    it('should show fullscreen button consistently after render', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
      cy.shouldShowFullscreenButton();
      cy.get('#fullscreen-diagram-btn').should('have.attr', 'title', 'Open diagram in fullscreen with zoom/pan');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();
    });

    it('should have accessible fullscreen button', () => {
      cy.get('#fullscreen-diagram-btn')
        .scrollIntoView()
        .should('be.visible')
        .and('have.attr', 'title');
    });

    it('should have accessible close button in modal', () => {
      cy.openFullscreenDiagram();
      cy.get('#close-fullscreen-btn')
        .should('be.visible')
        .and('contain', 'Close');
    });
  });

  describe('Performance', () => {
    it('should render diagram within reasonable time', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();

      const start = Date.now();
      cy.expandInfluenceDiagram();
      cy.get('.mermaid svg', { timeout: 10000 }).should('exist').then(() => {
        const renderTime = Date.now() - start;
        expect(renderTime).to.be.lessThan(8000); // Mermaid + animations take 5-7s typically
      });
    });

    it('should open fullscreen modal quickly', () => {
      cy.configureHighTrafficScenario();
      cy.calculate();
      cy.expandInfluenceDiagram();

      const start = Date.now();
      cy.openFullscreenDiagram();
      cy.get('#fullscreen-mermaid-diagram svg', { timeout: 10000 }).should('exist').then(() => {
        const openTime = Date.now() - start;
        expect(openTime).to.be.lessThan(8000); // Mermaid re-rendering takes 5-7s typically
      });
    });
  });
});

