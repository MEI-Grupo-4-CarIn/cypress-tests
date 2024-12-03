describe('Register', () => {
  const baseUrl = 'http://carin-web.hopto.org:3003';

  // runs before each test in the block
  beforeEach(() => {
    cy.clearLocalStorage(); // clear local storage
    cy.visit(baseUrl);
    cy.get('.mt-4 > .underline').click(); // click on the sign up href
  });

  it('Should loud the register page', () => {
    cy.url().should('include', 'auth/register');
  });

  it('Test Case 1: Register with valid data', () => {
    cy.get('#first-name').type('John');
    cy.get('#last-name').type('Doe');
    cy.contains('span', 'Pick a date').click();
    cy.get('button[name="day"]')
            .not('[disabled]')
            .first()
            .click();
    cy.get('.mx-auto').click();
    cy.get('#email').type('auto.teste.1@carin.com');
    cy.get('#password').type('12345678');
    cy.get('#confirm-password').type('12345678');
    cy.contains('button', 'Create an account').click();
  });
})