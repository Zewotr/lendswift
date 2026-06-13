describe('Auto-Save & Resume', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });

  it('should save progress and resume after reload', () => {
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep1(data.step1.loanType, data.step1.amount, data.step1.tenure, data.step1.purpose);
      cy.fillStep2(data.step2);
      cy.fillStep3(data.step3.pan, data.step3.aadhaar, data.step3.consent);
      cy.fillStep4(data.step4);
    });

    // Wait for the manual save (triggered on step change) to complete
    cy.wait(1000);
    cy.reload();

    // Use the exact modal title from your Wizard component
    cy.contains('Resume Application?', { timeout: 10000 }).should('be.visible');
    cy.contains('Resume').click();

   
  });
});