describe('Version Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display version in footer', () => {
    cy.shouldDisplayVersion();
  });

  it('version should be visible in the footer', () => {
    cy.scrollToResults(); // Scroll to ensure footer is in view
    cy.shouldDisplayVersion();
  });

  it('version should have correct format', () => {
    cy.shouldHaveVersionFormat();
  });
});
