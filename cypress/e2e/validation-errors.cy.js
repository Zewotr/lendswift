// cypress/e2e/validation-errors.cy.js
import personalFixture from '../fixtures/personal-loan-salaried.json';
import homeFixture from '../fixtures/home-loan-salaried.json';

describe('Validation Errors – All Steps', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Step 1: empty submission shows errors', () => {
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('have.length.at.least', 1);
  });

  it('Step 2: empty submission shows errors', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('have.length.at.least', 1);
  });

  it('Step 3: PAN/Aadhaar format and consent errors', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.fillStep2(personalFixture.step2);
    cy.get('input[name="panNumber"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[name="panNumber"]').clear().type('INVALID').blur();
    cy.get('.text-error').should('exist');
    cy.get('input[name="aadhaarNumber"]').clear().type('123').blur();
    cy.get('.text-error').should('exist');
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('exist');
  });

  it('Step 4a: empty submission shows required field errors', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.fillStep2(personalFixture.step2);
    cy.fillStep3(personalFixture.step3.pan, personalFixture.step3.aadhaar, personalFixture.step3.consent);
    cy.get('input[name="currentAddressLine1"]', { timeout: 10000 }).should('be.visible');
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('exist');
  });

  it('Step 4b: conditional rent validation', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.fillStep2(personalFixture.step2);
    cy.fillStep3(personalFixture.step3.pan, personalFixture.step3.aadhaar, personalFixture.step3.consent);
    cy.get('input[name="currentAddressLine1"]', { timeout: 10000 }).should('be.visible');
    cy.get('select[name="residenceType"]').select('rented');
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('exist');
  });

  it('Step 5a: empty submission shows required field errors', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.fillStep2(personalFixture.step2);
    cy.fillStep3(personalFixture.step3.pan, personalFixture.step3.aadhaar, personalFixture.step3.consent);
    cy.fillStep4(personalFixture.step4);
    cy.get('input[name="employmentType"]', { timeout: 10000 }).should('exist');
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('exist');
  });

  it('Step 5b: salaried sub‑validation (company name required)', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.fillStep2(personalFixture.step2);
    cy.fillStep3(personalFixture.step3.pan, personalFixture.step3.aadhaar, personalFixture.step3.consent);
    cy.fillStep4(personalFixture.step4);
    cy.get('input[name="employmentType"][value="salaried"]').check();
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('exist');
  });

  it('Step 6: conditional co-applicant validation (if visible)', () => {
    cy.fillStep1(homeFixture.step1.loanType, homeFixture.step1.amount, homeFixture.step1.tenure, homeFixture.step1.purpose);
    cy.fillStep2(homeFixture.step2);
    cy.fillStep3(homeFixture.step3.pan, homeFixture.step3.aadhaar, homeFixture.step3.consent);
    cy.fillStep4(homeFixture.step4);
    cy.fillStep5(homeFixture.step5.employmentType, homeFixture.step5);
    cy.get('input[name="coApplicantName"]', { timeout: 10000 }).should('be.visible');
    cy.get('button').contains('Next').click();
    cy.get('.text-error').should('exist');
  });

  it('Step 8: all consents required', () => {
    cy.fillStep1(personalFixture.step1.loanType, personalFixture.step1.amount, personalFixture.step1.tenure, personalFixture.step1.purpose);
    cy.fillStep2(personalFixture.step2);
    cy.fillStep3(personalFixture.step3.pan, personalFixture.step3.aadhaar, personalFixture.step3.consent);
    cy.fillStep4(personalFixture.step4);
    cy.fillStep5(personalFixture.step5.employmentType, personalFixture.step5);
    cy.fillStep7(personalFixture.documents);
    cy.get('button').contains('Submit Application').should('be.disabled');
    cy.get('input[name="consentAccuracy"]').check();
    cy.get('input[name="consentCreditCheck"]').check();
    cy.get('input[name="consentTerms"]').check();
    cy.get('input[name="consentCommunications"]').check();
    cy.get('button').contains('Submit Application').should('be.enabled');
  });
});