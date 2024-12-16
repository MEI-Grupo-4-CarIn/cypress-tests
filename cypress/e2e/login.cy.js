describe("Login", () => {
  const baseUrl = "http://carin-web.hopto.org:3003";

  // runs before each test in the block
  beforeEach(() => {
    cy.clearLocalStorage(); // clear local storage
    cy.visit(baseUrl);
  });

  it("Test Case 1: Login with valid data", () => {
    cy.get("#email").type("mariajoao@carin.com");
    cy.get("#password").type("12345678");
    cy.contains("button", "Login").click();

    cy.contains("You have successfully logged in!").should("be.visible");
    cy.url().should("include", "company/dashboard");
  });

  it("Test Case 2: Logging in with an invalid email", () => {
    cy.get("#email").type("mariajoaocarin.com");
    cy.get("#password").type("12345678");
    cy.contains("button", "Login").click();

    cy.url().then((url) => {
      cy.contains("button", "Login").click();
      cy.url().should("eq", url);
      cy.get("#email:invalid").should("be.visible");
    });
  });

  it("Test Case 3: Logging in with an invalid password", () => {
    cy.get("#email").type("mariajoao@carin.com");
    cy.get("#password").type("1234567");
    cy.contains("button", "Login").click();

    cy.url().then((url) => {
      cy.contains("button", "Login").click();
      cy.url().should("eq", url);
      cy.contains("Invalid login attempt.").should("be.visible");
    });
  });

  it("Test Case 4: Logging in with an inactive user", () => {
    cy.get("#email").type("auto.teste.1@carin.com");
    cy.get("#password").type("12345678");
    cy.contains("button", "Login").click();

    cy.url().then((url) => {
      cy.contains("button", "Login").click();
      cy.url().should("eq", url);
      cy.contains("Inactive user.").should("be.visible");
    });
  });
});
