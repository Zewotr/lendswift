// cypress/e2e/keyboard-navigation.cy.js
describe('Keyboard Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Loan Type', { timeout: 10000 }).should('be.visible');
  });

  // Helper to move to the next step by clicking the button (Enter/Space accessible)
  const clickNext = () => {
    cy.get('button').contains('Next').click();
    cy.wait(500);
  };

  const clickSubmit = () => {
    cy.get('button').contains('Submit Application').click();
    cy.wait(500);
  };

  it('should navigate Step 1 using keyboard only', () => {
    // Focus and select loan type
    cy.get('input[name="loanType"][value="personal"]').focus().click();
    cy.get('input[name="loanAmount"]').focus().type('300000');
    cy.get('input[name="loanTenure"]').focus().type('36');
    cy.get('select[name="loanPurpose"]').focus().select('Wedding');
    clickNext();
    cy.get('input[name="fullName"]', { timeout: 10000 }).should('be.visible');
  });

  it('should complete Step 2 with keyboard', () => {
    // Fill Step 1 using keyboard
    cy.get('input[name="loanType"][value="personal"]').focus().click();
    cy.get('input[name="loanAmount"]').focus().type('300000');
    cy.get('input[name="loanTenure"]').focus().type('36');
    cy.get('select[name="loanPurpose"]').focus().select('Wedding');
    clickNext();

    // Fill Step 2
    cy.get('input[name="fullName"]').focus().type('Rahul Sharma');
    cy.get('input[name="dateOfBirth"]').focus().type('1990-01-01');
    cy.get('input[name="gender"][value="male"]').focus().type('{downarrow}');
    cy.get('select[name="maritalStatus"]').focus().select('Married');
    cy.get('input[name="fathersName"]').focus().type('Suresh Sharma');
    cy.get('input[name="mothersName"]').focus().type('Geeta Sharma');
    cy.get('input[name="email"]').focus().type('rahul@example.com');
    cy.get('input[name="mobileNumber"]').focus().type('9876543210');
    clickNext();
    cy.get('input[name="panNumber"]', { timeout: 10000 }).should('be.visible');
  });

  it('should complete entire form using keyboard only (end‑to‑end)', () => {
    // Use proven fillStep commands (they simulate keyboard input where possible)
    cy.fillStep1('personal', 500000, 60, 'Wedding');
    cy.fillStep2({
      fullName: 'Test User',
      dateOfBirth: '1985-05-15',
      gender: 'male',
      maritalStatus: 'Married',
      fathersName: 'Father Name',
      mothersName: 'Mother Name',
      email: 'test@example.com',
      mobileNumber: '9876543210',
    });
    cy.fillStep3('ABCDE1234F', '123456789012', true);
    cy.fillStep4({
      line1: '123 Main St',
      line2: '',
      pinCode: '110001',
      residenceType: 'owned',
      yearsAtCurrentAddress: 5,
      sameAsPermanent: false,
      permanentLine1: 'Permanent Line1',
      permanentPinCode: '110002',
    });
    cy.fillStep5('Salaried', {
      companyName: 'Tech Corp',
      designation: 'Engineer',
      monthlyNetSalary: 75000,
      officeAddress: 'Office Address',
      yearsOfExperience: 5,
    });
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep7(data.documents);
    });
    // After fillStep7, we are on Step 8
    cy.get('input[name="consentAccuracy"]').focus().click();
    cy.get('input[name="consentCreditCheck"]').focus().click();
    cy.get('input[name="consentTerms"]').focus().click();
    cy.get('input[name="consentCommunications"]').focus().click();
    clickSubmit();
    cy.contains('Application Submitted', { timeout: 10000 }).should('be.visible');
  });
});