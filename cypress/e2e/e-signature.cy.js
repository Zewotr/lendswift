// cypress/e2e/e-signature.cy.js
describe('E-Signature Capture', () => {
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

  const drawSignature = () => {
    cy.get('[data-testid="signature-canvas"] canvas').then($canvas => {
        const canvas = $canvas[0];
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(200, 200);
        ctx.stroke();
        // Force the signature pad's onEnd event
        const event = new Event('mouseup', { bubbles: true });
        canvas.dispatchEvent(event);
    });
    cy.wait(500);
    };

  it('should draw signature and detect non-empty', () => {
    drawSignature();
    cy.get('[data-testid="signature-canvas"] canvas').then($canvas => {
      const ctx = $canvas[0].getContext('2d');
      const imgData = ctx.getImageData(0, 0, $canvas[0].width, $canvas[0].height);
      const hasDrawing = imgData.data.some(value => value !== 0);
      expect(hasDrawing).to.be.true;
    });
  });

  it('should clear signature and show empty validation', () => {
    drawSignature();
    cy.contains('Clear').click();
    cy.get('[data-testid="signature-canvas"] canvas').then($canvas => {
      const ctx = $canvas[0].getContext('2d');
      const imgData = ctx.getImageData(0, 0, $canvas[0].width, $canvas[0].height);
      const isEmpty = imgData.data.every(value => value === 0);
      expect(isEmpty).to.be.true;
    });
    // Try to move to next step; validation should fail because signature is required
    cy.get('button').contains('Next').click();
    cy.get('.text-error', { timeout: 5000 }).should('exist');
  });

  it('should display signature in Step 8 review', () => {
    drawSignature();
    // Upload required documents to pass Step 7
    cy.get('[data-testid="pan-card"]').selectFile('cypress/fixtures/pan-card.pdf', { force: true });
    cy.get('[data-testid="photo"]').selectFile('cypress/fixtures/photo.jpg', { force: true });
    cy.get('button').contains('Next').click(); // go to Step 8
    cy.get('img[alt="Signature"]', { timeout: 10000 }).should('be.visible');
  });
});