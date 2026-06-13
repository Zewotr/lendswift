// cypress/e2e/stress-test.cy.js
describe('Stress Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const clickNext = () => {
    cy.get('button').contains('Next').should('not.be.disabled').click();
    cy.wait(300);
  };

  // Normal form fill (without fillStep commands) – used for test (2)
  const fillNormalForm = () => {
    // Step 1
    cy.get('input[name="loanType"][value="personal"]').check();
    cy.get('input[name="loanAmount"]').clear().type('300000');
    cy.get('input[name="loanTenure"]').clear().type('36');
    cy.get('select[name="loanPurpose"]').select('Wedding');
    clickNext();

    // Step 2
    cy.get('input[name="fullName"]').clear().type('Rahul Sharma');
    cy.get('input[name="dateOfBirth"]').clear().type('1990-01-01');
    cy.get('input[name="gender"][value="male"]').check();
    cy.get('select[name="maritalStatus"]').select('Married');
    cy.get('input[name="fathersName"]').clear().type('Suresh Sharma');
    cy.get('input[name="mothersName"]').clear().type('Geeta Sharma');
    cy.get('input[name="email"]').clear().type('rahul@example.com');
    cy.get('input[name="mobileNumber"]').clear().type('9876543210');
    clickNext();

    // Step 3
    cy.get('input[name="panNumber"]').clear().type('ABCDE1234F');
    cy.get('input[name="aadhaarNumber"]').clear().type('123456789012');
    cy.get('input[name="aadhaarConsent"]').check();
    clickNext();

    // Step 4
    cy.get('input[name="currentAddressLine1"]').clear().type('123 Main St');
    cy.get('input[name="currentPinCode"]').clear().type('110001');
    cy.wait(1000);
    cy.get('select[name="residenceType"]').select('owned');
    cy.get('input[name="yearsAtCurrentAddress"]').clear().type('5');
    cy.get('input[name="permanentAddressLine1"]').clear().type('456 Old Address');
    cy.get('input[name="permanentPinCode"]').clear().type('110002');
    clickNext();

    // Step 5
    cy.get('input[name="employmentType"][value="salaried"]').check();
    cy.get('input[name="yearsOfExperience"]').clear().type('6');
    cy.get('input[name="companyName"]').clear().type('TechCorp');
    cy.get('input[name="designation"]').clear().type('Engineer');
    cy.get('input[name="monthlyNetSalary"]').clear().type('75000');
    cy.get('input[name="officeAddress"]').clear().type('Bangalore');
    clickNext();

    // Step 6 – should NOT appear (amount 300k), so proceed to Step 7
    // Wait for Step 7 heading
    cy.contains('Required Documents', { timeout: 15000 }).should('be.visible');
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep7(data.documents);
    });
  };

  it('(1) Rapid step navigation: click Next 5 times rapidly, verify no state corruption', () => {
    cy.fillStep1('personal', 300000, 36, 'Wedding');
    for (let i = 0; i < 5; i++) {
      cy.get('button').contains('Next').click();
      cy.wait(50);
    }
    cy.get('h2').contains('Review Your Application').should('be.visible');
    cy.get('button').contains('Submit Application').should('be.visible');
  });

  it('(2) Double‑submit prevention: click Submit twice rapidly, verify only one submission processes', () => {
    fillNormalForm();
    cy.get('input[name="consentAccuracy"]').check();
    cy.get('input[name="consentCreditCheck"]').check();
    cy.get('input[name="consentTerms"]').check();
    cy.get('input[name="consentCommunications"]').check();
    cy.get('button').contains('Submit Application').click({ force: true });
    cy.get('button').contains('Submit Application').click({ force: true });
    cy.get('.fixed.inset-0.bg-black\\/50', { timeout: 5000 }).should('have.length', 1);
    cy.contains('Application Submitted').should('be.visible');
  });

  it('(3) Back‑forward loop: navigate back to Step 1, change loan type, navigate forward, verify conditional steps update correctly', () => {
    cy.fillStep1('personal', 300000, 36, 'Wedding');
    cy.fillStep2({
      fullName: 'Rahul Sharma',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      maritalStatus: 'Married',
      fathersName: 'Suresh Sharma',
      mothersName: 'Geeta Sharma',
      email: 'rahul@example.com',
      mobileNumber: '9876543210',
    });
    cy.fillStep3('ABCDE1234F', '123456789012', true);
    cy.get('button').contains('Previous').click();
    cy.get('button').contains('Previous').click();
    cy.get('button').contains('Previous').click();
    cy.get('input[name="loanType"][value="personal"]').should('be.checked');
    cy.get('input[name="loanType"][value="home"]').check();
    cy.get('input[name="loanAmount"]').clear().type('5000000');
    cy.get('input[name="loanTenure"]').clear().type('240');
    cy.get('select[name="loanPurpose"]').select('Purchase');
    clickNext(); // Step 2
    clickNext(); // Step 3
    clickNext(); // Step 4
    clickNext(); // Step 5
    clickNext(); // Step 6
    cy.get('input[name="coApplicantName"]', { timeout: 10000 }).should('be.visible');
    cy.contains('Co-Applicant Details').should('be.visible');
  });

  // Manual fill for max-length and special characters
  const fillLongForm = (overrides) => {
    // Step 1
    cy.get('input[name="loanType"][value="personal"]').check();
    cy.get('input[name="loanAmount"]').clear().type(overrides.loanAmount || '500000');
    cy.get('input[name="loanTenure"]').clear().type(overrides.loanTenure || '60');
    cy.get('select[name="loanPurpose"]').select(overrides.loanPurpose || 'Wedding');
    clickNext();

    // Step 2
    cy.get('input[name="fullName"]').clear().type(overrides.fullName || 'Test User');
    cy.get('input[name="dateOfBirth"]').clear().type(overrides.dateOfBirth || '1980-01-01');
    cy.get(`input[name="gender"][value="${overrides.gender || 'male'}"]`).check();
    cy.get('select[name="maritalStatus"]').select(overrides.maritalStatus || 'Married');
    cy.get('input[name="fathersName"]').clear().type(overrides.fathersName || 'Father');
    cy.get('input[name="mothersName"]').clear().type(overrides.mothersName || 'Mother');
    cy.get('input[name="email"]').clear().type(overrides.email || 'test@example.com');
    cy.get('input[name="mobileNumber"]').clear().type(overrides.mobileNumber || '9876543210');
    clickNext();

    // Step 3
    cy.get('input[name="panNumber"]').clear().type('ABCDE1234F');
    cy.get('input[name="aadhaarNumber"]').clear().type('123456789012');
    cy.get('input[name="aadhaarConsent"]').check();
    clickNext();

    // Step 4
    cy.get('input[name="currentAddressLine1"]').clear().type(overrides.addressLine1 || '123 Main St');
    if (overrides.addressLine2) cy.get('input[name="currentAddressLine2"]').clear().type(overrides.addressLine2);
    cy.get('input[name="currentPinCode"]').clear().type('110001');
    cy.wait(1000);
    cy.get('select[name="residenceType"]').select(overrides.residenceType || 'owned');
    cy.get('input[name="yearsAtCurrentAddress"]').clear().type(overrides.yearsAtCurrentAddress || '10');
    cy.get('input[name="permanentAddressLine1"]').clear().type(overrides.permanentAddress || 'Permanent');
    cy.get('input[name="permanentPinCode"]').clear().type('110002');
    clickNext();

    // Step 5
    cy.get('input[name="employmentType"][value="salaried"]').check();
    cy.get('input[name="yearsOfExperience"]').clear().type(overrides.yearsOfExperience || '10');
    cy.get('input[name="companyName"]').clear().type(overrides.companyName || 'Company');
    cy.get('input[name="designation"]').clear().type(overrides.designation || 'Designation');
    cy.get('input[name="monthlyNetSalary"]').clear().type('75000');
    cy.get('input[name="officeAddress"]').clear().type(overrides.officeAddress || 'Office');
    clickNext();

    // Step 6 (conditional – appears for amount >500k)
    cy.get('body').then($body => {
      if ($body.find('input[name="coApplicantName"]').length) {
        cy.get('input[name="coApplicantName"]').type('Co App');
        cy.get('input[name="coApplicantPAN"]').type('ABCDE1234F');
        cy.get('input[name="coApplicantIncome"]').type('50000');
        cy.get('input[name="coApplicantConsent"]').check();
        clickNext();
      }
    });
  };

  it('(4) Fill with max‑length values in every field, verify no overflow or truncation', () => {
    const longName = 'A'.repeat(100);
    const longAddress = 'B'.repeat(200);
    const longEmail = `${'c'.repeat(50)}@example.com`;

    fillLongForm({
      fullName: longName,
      fathersName: longName,
      motherName: longName,
      email: longEmail,
      addressLine1: longAddress,
      addressLine2: longAddress,
      permanentAddress: longAddress,
      companyName: longName,
      designation: longName,
      officeAddress: longAddress,
    });

    cy.contains('Required Documents', { timeout: 15000 }).should('be.visible');
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep7(data.documents);
    });
    cy.contains('Review Your Application', { timeout: 10000 }).should('be.visible');
    cy.contains(longName.slice(0, 20)).should('be.visible');
  });

  it('(5) Fill with special characters and Unicode in text fields, verify sanitisation', () => {
    const specialString = '!@#$%^&*()_+{}[]|\\:;"\'<>,.?/~`¡™£¢∞§¶•ªº–≠≠≤≥';
    const unicodeString = '你好世界 こんにちは Привет عربي ภาษาไทย';

    fillLongForm({
      fullName: 'Test User ' + specialString.slice(0, 20),
      fathersName: specialString,
      mothersName: unicodeString,
      addressLine1: specialString,
      addressLine2: unicodeString,
      permanentAddress: specialString,
      companyName: specialString,
      designation: unicodeString,
      officeAddress: specialString,
    });

    cy.contains('Required Documents', { timeout: 15000 }).should('be.visible');
    cy.fixture('personal-loan-salaried').then((data) => {
      cy.fillStep7(data.documents);
    });
    cy.contains('Review Your Application', { timeout: 10000 }).should('be.visible');
    cy.contains(specialString.slice(0, 20)).should('be.visible');
  });
});