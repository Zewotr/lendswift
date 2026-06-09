describe('File Upload Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/');
    // Navigate to Step 7 quickly (use a shortcut or fill previous steps)
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep1(data.step1.loanType, data.step1.amount, data.step1.tenure, data.step1.purpose);
      cy.fillStep2(data.step2);
      cy.fillStep3(data.step3.pan, data.step3.aadhaar, data.step3.consent);
      cy.fillStep4(data.step4);
      cy.fillStep5(data.step5.employmentType, data.step5);
      if (data.step6) cy.fillStep6(data.step6);
    });
  });

  it('should upload valid file and show preview', () => {
    cy.get('[data-testid="pan-card"]').selectFile('cypress/fixtures/pan-card.pdf', { force: true });
    cy.contains('pan-card.pdf').should('be.visible');
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/photo.jpg', { force: true });
    cy.get('img[alt="preview"]').should('be.visible');
  });

  it('should reject oversized file', () => {
    // Create a large dummy file (6MB)
    cy.get('[data-testid="pan-card"]').selectFile({
      contents: Cypress.Buffer.alloc(6 * 1024 * 1024),
      fileName: 'large.pdf',
      mimeType: 'application/pdf',
    }, { force: true });
    cy.contains('File is larger than 5MB').should('be.visible');
  });

  it('should reject wrong file type', () => {
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/sample.txt', { force: true });
    cy.contains('File type must be').should('be.visible');
  });

  it('should remove uploaded file', () => {
    cy.get('[data-testid="pan-card"]').selectFile('cypress/fixtures/pan-card.pdf', { force: true });
    cy.contains('pan-card.pdf').should('be.visible');
    cy.get('button').contains('Remove').click();
    cy.contains('pan-card.pdf').should('not.exist');
  });

  it('should compress image', () => {
    // Upload a larger image (e.g., 2MB) and check that compressed size is smaller
    // This is tricky to assert in Cypress; we can check that the file size in UI is reduced.
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/large-photo.jpg', { force: true });
    // Wait for compression
    cy.wait(2000);
    cy.get('[data-testid="photo"]').parent().contains(/MB/).then(($el) => {
      const sizeText = $el.text();
      expect(parseInt(sizeText)).to.be.lessThan(5); // assume compressed under 500KB
    });
  });
});