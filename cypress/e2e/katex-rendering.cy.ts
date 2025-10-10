describe('KaTeX Formula Rendering', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have unified analysis section in the page', () => {
    cy.contains('📊 Analysis & Mathematical Foundation').should('exist');
  });

  it('should have mathematical foundation section', () => {
    cy.contains('🧮 Mathematical Foundation').should('exist');
    cy.contains('📐 View Mathematical Formulas').should('exist');
  });

  it('should render formulas with KaTeX when expanded', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(800); // Wait for KaTeX rendering

    // Check that KaTeX elements exist
    cy.get('.formula-render').should('exist');
    cy.get('.katex').should('exist');
    cy.get('.katex').should('have.length.at.least', 1);
  });

  it('should render formulas with data attributes', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(800);

    // Check that formula-render elements exist
    cy.get('.formula-render').should('exist');
    cy.get('.formula-render[data-formula]').should('have.length.at.least', 10);
  });

  it('should have larger rendered formulas (2x size)', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(800);

    cy.get('.formula-render').first().should('have.css', 'font-size', '32px'); // 2em = 32px (16px base * 2)
  });

  it('should have human-readable formula descriptions', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(300);

    // Check that human-readable descriptions exist
    cy.contains(
      'Total Requests = Rate (req/hr) × 24 (hr/day) × 365 (days/yr) × Time Horizon (years)'
    ).should('exist');
    cy.contains('Time Saved = Current Duration × (Speed Gain % ÷ 100)').should('exist');
    cy.contains('ROI = (Net Benefit ÷ Total Cost) × 100%').should('exist');
  });

  it('should have variable explanations', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(300);

    // Check that variable explanations exist
    cy.contains('where r = requests per hour, T = time horizon in years').should('exist');
    cy.contains('where d = duration per request (hours), g = speed gain (%)').should('exist');
    cy.contains('where I = implementation hours, M = maintenance hours/year').should('exist');
  });

  it('should collapse and expand formulas section', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(300);
    cy.contains('Total Requests = Rate (req/hr)').should('be.visible');
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(300);
  });

  it('should show mathematical foundation context', () => {
    cy.contains('📐 View Mathematical Formulas').click();
    cy.wait(300);

    // Check that context explanation exists
    cy.contains(
      'The calculations below form the mathematical foundation for the optimization decision above'
    ).should('exist');
  });
});
