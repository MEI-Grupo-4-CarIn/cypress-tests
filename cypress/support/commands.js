Cypress.Commands.add("login", (email, password) => {
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", "Login").click();
});
