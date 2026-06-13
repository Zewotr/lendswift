describe('Responsive Design', () => {
  const viewports = [320, 375, 768, 1024, 1280, 1920];
  viewports.forEach(width => {
    it(`should display correctly at ${width}px width`, () => {
      cy.viewport(width, 800);
      cy.visit('/');
      cy.fillStep1('personal', 300000, 36, 'Wedding');
      cy.get('input[name="loanAmount"]').should('be.visible');
      cy.get('button').contains('Next').click();
      // Check that no horizontal scroll occurs on mobile
      cy.window().then(win => {
        expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth);
      });
    });
  });
});