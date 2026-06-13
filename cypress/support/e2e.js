import 'cypress-axe';
import './commands';

beforeEach(() => {
  cy.clearLocalStorage();
});
