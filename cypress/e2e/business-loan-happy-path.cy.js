describe('Business Loan Happy Path (Business Owner with Co-Applicant)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('valid-business-loan').as('loanData');
  });

  it('should complete a business loan application with GST and co-applicant', function() {
    cy.fillStep1(this.loanData.step1.loanType, this.loanData.step1.amount, this.loanData.step1.tenure, this.loanData.step1.purpose);
    cy.fillStep2(this.loanData.step2);
    cy.fillStep3(this.loanData.step3.pan, this.loanData.step3.aadhaar, this.loanData.step3.consent);
    cy.fillStep4(this.loanData.step4);
    cy.fillStep5(this.loanData.step5.employmentType, this.loanData.step5);
    cy.fillStep6(this.loanData.step6);
    cy.fillStep7(this.loanData.documents);
    cy.fillStep8();

    cy.contains('Application Submitted').should('be.visible');
    cy.contains('Application Reference Number:').should('be.visible');
    cy.get('[data-testid="close-modal"]').click();
  });
});
