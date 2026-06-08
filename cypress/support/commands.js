const normalize = (value) => value?.toString().trim();

const optionValue = (value, mappings) => {
  const normalized = normalize(value);
  return mappings[normalized] || mappings[normalized?.toLowerCase()] || normalized;
};

const employmentValue = (value) => optionValue(value, {
  Salaried: 'salaried',
  salaried: 'salaried',
  'Self-Employed': 'selfEmployed',
  'self-employed': 'selfEmployed',
  selfEmployed: 'selfEmployed',
  'Business Owner': 'businessOwner',
  'business owner': 'businessOwner',
  businessOwner: 'businessOwner',
});

const relationshipValue = (value) => optionValue(value, {
  Spouse: 'spouse',
  spouse: 'spouse',
  Parent: 'parent',
  parent: 'parent',
  Sibling: 'sibling',
  sibling: 'sibling',
  'Business Partner': 'businessPartner',
  'business partner': 'businessPartner',
  businessPartner: 'businessPartner',
});

const residenceValue = (value) => optionValue(value, {
  Owned: 'owned',
  owned: 'owned',
  Rented: 'rented',
  rented: 'rented',
  'Company Provided': 'company',
  company: 'company',
  Family: 'family',
  family: 'family',
});

const genderValue = (value) => optionValue(value, {
  Male: 'male',
  male: 'male',
  Female: 'female',
  female: 'female',
  Other: 'other',
  other: 'other',
});

const maritalValue = (value) => optionValue(value, {
  Single: 'single',
  single: 'single',
  Married: 'married',
  married: 'married',
  Divorced: 'divorced',
  divorced: 'divorced',
  Widowed: 'widowed',
  widowed: 'widowed',
});

const typeField = (name, value) => {
  if (value !== undefined && value !== null && value !== '') {
    cy.get(`input[name="${name}"]`).clear().type(value.toString());
  }
};

const maybeTypeField = (name, value) => {
  if (value !== undefined && value !== null && value !== '') {
    cy.get('body').then(($body) => {
      if ($body.find(`input[name="${name}"]`).length) {
        cy.get(`input[name="${name}"]`).clear().type(value.toString());
      }
    });
  }
};

const uploadIfRendered = (testId, filePath) => {
  const selector = `input[data-testid="${testId}"]`;
  cy.get('body').then(($body) => {
    if ($body.find(selector).length) {
      cy.get(selector).selectFile(filePath, { force: true });
    }
  });
};

Cypress.Commands.add('fillStep1', (loanType, amount, tenure, purpose) => {
  const type = normalize(loanType).toLowerCase();

  cy.get('input[name="loanType"]', { timeout: 10000 }).should('exist');
  cy.get(`[data-testid="loan-type-${type}"]`).check({ force: true });
  cy.get('input[name="loanAmount"]').clear().type(amount.toString());
  cy.get('input[name="loanTenure"]').clear().type(tenure.toString());
  cy.get('select[name="loanPurpose"]').should('contain', purpose).select(purpose);
  cy.contains('button', 'Next').click();

  cy.get('input[name="fullName"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('fillStep2', (data) => {
  cy.get('input[name="fullName"]', { timeout: 10000 }).should('be.visible');
  typeField('fullName', data.fullName);
  cy.get('input[name="dateOfBirth"]').clear().type(data.dateOfBirth);
  cy.get(`input[name="gender"][value="${genderValue(data.gender)}"]`).check({ force: true });
  cy.get('select[name="maritalStatus"]').select(maritalValue(data.maritalStatus));
  typeField('fathersName', data.fathersName || data.fatherName);
  typeField('mothersName', data.mothersName || data.motherName);
  typeField('email', data.email);
  typeField('mobileNumber', data.mobileNumber);
  maybeTypeField('alternateMobile', data.alternateMobile);
  cy.contains('button', 'Next').click();

  cy.get('input[name="panNumber"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('fillStep3', (pan, aadhaar, consent = true) => {
  typeField('panNumber', pan);
  typeField('aadhaarNumber', aadhaar);
  if (consent) {
    cy.get('input[name="aadhaarConsent"]').check({ force: true });
  }
  cy.contains('button', 'Next').click();

  cy.get('input[name="currentAddressLine1"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('fillStep4', (addressData) => {
  typeField('currentAddressLine1', addressData.line1);
  maybeTypeField('currentAddressLine2', addressData.line2);
  typeField('currentPinCode', addressData.pinCode);

  cy.get('input[name="currentCity"]', { timeout: 5000 }).invoke('val').should('not.be.empty');
  cy.get('input[name="currentState"]').invoke('val').should('not.be.empty');
  cy.get('input[name="currentPostOffice"]').invoke('val').should('not.be.empty');

  cy.get('select[name="residenceType"]').select(residenceValue(addressData.residenceType));
  if (residenceValue(addressData.residenceType) === 'rented') {
    typeField('rentAmount', addressData.rentAmount);
  }
  typeField('yearsAtCurrentAddress', addressData.yearsAtCurrentAddress);

  if (Number(addressData.yearsAtCurrentAddress) < 1) {
    maybeTypeField('prevAddressLine1', addressData.previousLine1 || addressData.permanentLine1);
    maybeTypeField('PinCode', addressData.previousPinCode || addressData.permanentPinCode);
  }

  if (addressData.sameAsPermanent !== false) {
    cy.get('input[name="sameAsPermanent"]').check({ force: true });
  } else {
    typeField('permanentAddressLine1', addressData.permanentLine1);
    maybeTypeField('permanentAddressLine2', addressData.permanentLine2);
    typeField('permanentPinCode', addressData.permanentPinCode);
    typeField('permanentCity', addressData.permanentCity);
    typeField('permanentState', addressData.permanentState);
  }

  cy.contains('button', 'Next').click();
  cy.get('input[name="employmentType"]', { timeout: 10000 }).should('exist');
});

Cypress.Commands.add('fillStep5', (employmentType, data) => {
  const type = employmentValue(employmentType);

  cy.get(`input[name="employmentType"][value="${type}"]`, { timeout: 10000 }).check({ force: true });
  typeField('yearsOfExperience', data.yearsOfExperience ?? data.yearsInBusiness);

  if (type === 'salaried') {
    typeField('companyName', data.companyName);
    typeField('designation', data.designation);
    typeField('monthlyNetSalary', data.monthlyNetSalary);
    typeField('officeAddress', data.officeAddress);
  }

  if (type === 'selfEmployed' || type === 'businessOwner') {
    typeField('businessName', data.businessName);
    cy.get('select[name="businessType"]').select(data.businessType);
    typeField('annualTurnover', data.annualTurnover);
    typeField('yearsInBusiness', data.yearsInBusiness);
    typeField('monthlyIncome', data.monthlyIncome);
    if (type === 'businessOwner') {
      typeField('gstNumber', data.gstNumber);
    }
    typeField('officeAddress', data.officeAddress);
  }

  cy.contains('button', 'Next').click();
});

Cypress.Commands.add('fillStep6', (coAppData) => {
  if (!coAppData) {
    cy.get('input[name="coApplicantName"]').should('not.exist');
    return;
  }

  cy.get('input[name="coApplicantName"]', { timeout: 10000 }).should('be.visible');
  typeField('coApplicantName', coAppData.name || coAppData.fullName);
  cy.get('select[name="relationship"]').select(relationshipValue(coAppData.relationship));
  typeField('coApplicantPAN', coAppData.pan || coAppData.panNumber);
  typeField('coApplicantIncome', coAppData.income || coAppData.monthlyIncome);
  cy.get('input[name="coApplicantConsent"]').check({ force: true });
  cy.contains('button', 'Next').click();
});

Cypress.Commands.add('fillStep7', (documents) => {
  const testIdMap = {
    panCard: 'pan-card',
    aadhaarCard: 'aadhaar',
    salarySlips: 'salary',
    bankStatements: 'bank',
    itr: 'itr',
    propertyDocuments: 'property',
    propertyDocs: 'property',
    businessRegistration: 'business-reg',
    businessReg: 'business-reg',
    gstReturns: 'gst',
    photograph: 'photo',
    photo: 'photo',
  };

  documents.forEach((doc) => {
    const testId = testIdMap[doc.docName];
    if (testId) uploadIfRendered(testId, doc.filePath);
  });

  cy.contains('Please upload all required documents and wait for upload to complete.', { timeout: 12000 })
    .should('not.exist');

  cy.get('[data-testid="signature-canvas"] canvas', { timeout: 10000 })
    .should('be.visible')
    .then(($canvas) => {
      cy.wrap($canvas)
        .trigger('mousedown', { clientX: 50, clientY: 50, force: true })
        .trigger('mousemove', { clientX: 180, clientY: 90, force: true })
        .trigger('mouseup', { force: true });
    });

  cy.contains('button', 'Next').click();
  cy.contains('Review Your Application', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('fillStep8', () => {
  cy.get('input[name="consentAccuracy"]').check({ force: true });
  cy.get('input[name="consentCreditCheck"]').check({ force: true });
  cy.get('input[name="consentTerms"]').check({ force: true });
  cy.get('input[name="consentCommunications"]').check({ force: true });
  cy.contains('button', 'Submit Application').should('not.be.disabled').click();
});
