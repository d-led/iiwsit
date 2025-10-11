describe('Version Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display version in footer with correct format', () => {
    cy.scrollToResults(); // Scroll to ensure footer is in view
    cy.shouldDisplayVersion();
    cy.shouldHaveVersionFormat();
  });
});
