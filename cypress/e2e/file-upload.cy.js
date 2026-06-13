describe('File Upload Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep1(data.step1.loanType, data.step1.amount, data.step1.tenure, data.step1.purpose);
      cy.fillStep2(data.step2);
      cy.fillStep3(data.step3.pan, data.step3.aadhaar, data.step3.consent);
      cy.fillStep4(data.step4);
      cy.fillStep5(data.step5.employmentType, data.step5);
    });
  });

  it('should upload valid file and show preview', () => {
    cy.get('[data-testid="pan-card"]').selectFile('cypress/fixtures/pan-card.pdf', { force: true });
    cy.contains('pan-card.pdf').should('be.visible');
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/photo.jpg', { force: true });
    cy.get('img[alt="preview"]').should('be.visible');
  });

  it('should reject oversized file', () => {
    cy.get('[data-testid="pan-card"]').selectFile('cypress/fixtures/oversize.pdf', { force: true });
    cy.get('[role="alert"]', { timeout: 10000 }).should('contain', 'larger than 5MB');
  });

  it('should reject wrong file type', () => {
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/sample.txt', { force: true });
    cy.get('[role="alert"]', { timeout: 10000 }).should('contain', 'File type must be');
  });

  it('should remove uploaded file', () => {
    cy.get('[data-testid="pan-card"]').selectFile('cypress/fixtures/pan-card.pdf', { force: true });
    cy.contains('pan-card.pdf').should('be.visible');
    cy.get('button').contains('Remove').click();
    cy.contains('pan-card.pdf').should('not.exist');
  });

  it('should compress image', () => {
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/large-photo.jpg', { force: true });
    cy.wait(4000);
    cy.get('[data-testid="photograph-size"]', { timeout: 10000 }).then(($el) => {
      const sizeText = $el.text();
      const sizeKB = parseInt(sizeText.match(/\d+/)[0]);
      expect(sizeKB).to.be.lessThan(2052);
    });
  });
});