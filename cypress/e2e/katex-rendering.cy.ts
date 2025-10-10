describe('KaTeX Formula Rendering', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have both formula sections in the page', () => {
    cy.contains('📐 Mathematical Formulas').should('exist');
    cy.contains('✨ Rendered Formulas').should('exist');
  });

  it('should have AsciiMath formulas section with text formulas', () => {
    cy.contains('📐 Mathematical Formulas').click();
    cy.wait(500);
    cy.contains('Core Calculations').should('exist');
    cy.contains('Total Requests Over Time Horizon').should('exist');
    // Check that backtick formulas exist
    cy.contains('`R_("total")`').should('exist');
  });

  it('should have rendered formulas section', () => {
    cy.contains('✨ Rendered Formulas').click();
    cy.wait(500);
    cy.contains('Mathematical formulas rendered for easier reading').should('exist');
  });

  it('should render formulas with KaTeX when expanded', () => {
    cy.contains('✨ Rendered Formulas').click();
    cy.wait(800); // Wait for KaTeX rendering

    // Check that KaTeX elements exist
    cy.get('#rendered-formulas').within(() => {
      cy.get('.katex').should('exist');
      cy.get('.katex').should('have.length.at.least', 1);
    });
  });

  it('should render formulas with data attributes', () => {
    cy.contains('✨ Rendered Formulas').click();
    cy.wait(800);

    cy.get('#rendered-formulas').within(() => {
      // Check that formula-render elements exist
      cy.get('.formula-render').should('exist');
      cy.get('.formula-render[data-formula]').should('have.length.at.least', 10);
    });
  });

  it('should have larger rendered formulas (2x size)', () => {
    cy.contains('✨ Rendered Formulas').click();
    cy.wait(800);

    cy.get('#rendered-formulas').within(() => {
      cy.get('.formula-render').first().should('have.css', 'font-size', '32px'); // 2em = 32px (16px base * 2)
    });
  });

  it('should preserve original AsciiMath in separate section', () => {
    cy.contains('📐 Mathematical Formulas').click();
    cy.wait(300);

    // Original formulas should be in backticks
    cy.contains('`R_("total") = r * 24 * 365 * T`').should('exist');
    cy.contains('`"ROI" = (B_("money") / C_("money")) * 100%`').should('exist');
  });

  it('should have hover text on original formulas', () => {
    cy.contains('📐 Mathematical Formulas').click();
    cy.wait(300);

    cy.get('p[title*="AsciiMath"]').should('exist');
    cy.get('p[title*="AsciiMath"]').first()
      .should('have.attr', 'title')
      .and('include', 'AsciiMath:');
  });

  it('should collapse and expand both sections independently', () => {
    // Expand first section
    cy.contains('📐 Mathematical Formulas').click();
    cy.wait(300);
    cy.contains('Core Calculations').should('be.visible');

    // Expand second section
    cy.contains('✨ Rendered Formulas').click();
    cy.wait(300);
    cy.contains('Mathematical formulas rendered for easier reading').should('be.visible');

    // Both should be open
    cy.contains('Core Calculations').should('be.visible');
    cy.contains('Mathematical formulas rendered for easier reading').should('be.visible');
  });
});
