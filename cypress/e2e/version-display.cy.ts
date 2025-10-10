describe('Version Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display version in footer', () => {
    // Check that the version element exists
    cy.get('#app-version').should('exist');

    // Check that it contains some text (branch-commit format)
    cy.get('#app-version').should('not.be.empty');

    // In dev mode it should show "dev-local", in build mode it should show "branch-commit"
    cy.get('#app-version')
      .invoke('text')
      .should('match', /^[\w-]+$/);
  });

  it('version should be visible in the footer', () => {
    // Scroll to footer
    cy.get('footer').scrollIntoView();

    // Check that version is visible
    cy.get('#app-version').should('be.visible');
  });

  it('version should have correct format', () => {
    cy.get('#app-version')
      .invoke('text')
      .then((versionText) => {
        // Version should contain at least one character
        expect(versionText.length).to.be.greaterThan(0);

        // Version should contain a hyphen (branch-commit format)
        expect(versionText).to.include('-');
      });
  });
});
