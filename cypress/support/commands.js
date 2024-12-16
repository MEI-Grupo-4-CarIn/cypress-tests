Cypress.Commands.add("register", () => {
  const baseUrl = "http://carin-web.hopto.org:3003";

  // Intercept the register request
  cy.intercept("POST", "/auth/register").as("registerRequest");

  // Clear the local storage
  cy.clearLocalStorage();
  cy.visit(baseUrl);

  // Click on the sign up href
  cy.get(".mt-4 > .underline").click();

  // Generate a unique email
  const email = `auto.test.${Date.now()}@carin.com`;

  cy.get("#first-name").type("John");
  cy.get("#last-name").type("Doe");

  cy.contains("span", "Pick a date").click();
  cy.get('button[name="day"]').not("[disabled]").first().click();
  cy.get(".mx-auto").click();

  cy.get("#email").type(email);
  cy.get("#password").type("12345678");
  cy.get("#confirm-password").type("12345678");
  cy.contains("button", "Create an account").click();

  // Wait for the register request to finish
  cy.wait("@registerRequest").then((interception) => {
    const response = interception.response.body;

    // Load the current fixture content
    cy.readFile("cypress/fixtures/login_credentials.json").then((data) => {
      // Add the new user to the "created" array
      data.created.push({
        id: response.userId,
        email: response.email,
        password: "12345678",
        role: null,
        approved: false,
      });

      // Save the updated data back to the fixture file
      cy.writeFile("cypress/fixtures/login_credentials.json", data);
    });
  });
});

Cypress.Commands.add("loginViaApi", (email, password) => {
  const baseApiUrl = "http://carin-web.hopto.org:9000";

  cy.request({
    method: "POST",
    url: `${baseApiUrl}/auth/login`,
    body: {
      email: email,
      password: password,
    },
  }).then((response) => {
    localStorage.setItem("token", response.body.token);
  });
});

Cypress.Commands.add("login", (email, password) => {
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", "Login").click();
});
