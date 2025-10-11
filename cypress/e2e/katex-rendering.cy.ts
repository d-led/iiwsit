describe('KaTeX Formula Rendering', () => {
  beforeEach(() => {
    cy.visitCalculator();
  });

  it('should have unified analysis section in the page', () => {
    cy.shouldHaveUnifiedAnalysisSection();
  });

  it('should have mathematical foundation section', () => {
    cy.shouldHaveMathematicalFoundationSection();
  });

  it('should render formulas with KaTeX when expanded', () => {
    cy.expandMathFormulas();
    cy.shouldRenderKatexFormulas();
  });

  it('should render formulas with data attributes', () => {
    cy.expandMathFormulas();
    cy.shouldHaveFormulaDataAttributes(10);
  });

  it('should have larger rendered formulas (2x size)', () => {
    cy.expandMathFormulas();
    cy.shouldHaveLargerFormulas();
  });

  it('should have human-readable formula descriptions', () => {
    cy.expandMathFormulas();
    cy.shouldHaveHumanReadableDescriptions();
  });

  it('should have variable explanations', () => {
    cy.expandMathFormulas();
    cy.shouldHaveVariableExplanations();
  });

  it('should collapse and expand formulas section', () => {
    cy.expandMathFormulas();
    cy.shouldCollapseAndExpandFormulas();
  });

  it('should show mathematical foundation context', () => {
    cy.expandMathFormulas();
    cy.shouldShowMathematicalFoundationContext();
  });
});
