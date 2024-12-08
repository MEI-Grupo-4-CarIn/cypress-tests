describe("Register", () => {
  const baseUrl = "http://carin-web.hopto.org:3003";

  // Runs before each test in the block
  beforeEach(() => {
    // Clear the local storage
    cy.clearLocalStorage();
    cy.visit(baseUrl);

    // Click on the sign up href
    cy.get(".mt-4 > .underline").click();
  });

  it("Test Case 1: Should loud the register page", () => {
    cy.url().should("include", "auth/register");
  });

  it("Test Case 2: Register with valid data", () => {
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

    // Validate the success message
    cy.contains("Your account has been created!").should("be.visible");

    // Validate the redirection to the login page
    cy.url().should("include", "auth/login");
  });

  it("Test Case 3: Register with invalid email", () => {
    cy.get("#first-name").type("John");
    cy.get("#last-name").type("Doe");

    cy.contains("span", "Pick a date").click();
    cy.get('button[name="day"]').not("[disabled]").first().click();
    cy.get(".mx-auto").click();

    cy.get("#email").type("auto.test");
    cy.get("#password").type("12345678");
    cy.get("#confirm-password").type("12345678");

    // Verify if the page remains the same
    cy.url().then((currentUrl) => {
      cy.contains("button", "Create an account").click();

      // Validate the input validation
      cy.get("#email:invalid").should("exist");
      cy.url().should("eq", currentUrl);
    });
  });

  it("Test Case 4: Register with not matching passwords", () => {
    cy.get("#first-name").type("John");
    cy.get("#last-name").type("Doe");

    cy.contains("span", "Pick a date").click();
    cy.get('button[name="day"]').not("[disabled]").first().click();
    cy.get(".mx-auto").click();

    cy.get("#email").type("auto.test@carin.com");
    cy.get("#password").type("12345678");
    cy.get("#confirm-password").type("12345679");

    // Verify if the page remains the same
    cy.url().then((currentUrl) => {
      cy.contains("button", "Create an account").click();

      // Validate the error message
      cy.contains("Passwords do not match!").should("be.visible");
      cy.url().should("eq", currentUrl);
    });
  });

  const decisionTableTestCases = [
    {
      description: "Missing First Name",
      data: {
        firstName: null,
        lastName: "Doe",
        birthDate: true,
        email: "test@example.com",
        password: "12345678",
        confirmPassword: "12345678",
        expectedError: null,
        invalidFields: ["#first-name"],
      },
    },
    {
      description: "Missing Last Name",
      data: {
        firstName: "John",
        lastName: null,
        birthDate: true,
        email: "test@example.com",
        password: "12345678",
        confirmPassword: "12345678",
        expectedError: null,
        invalidFields: ["#last-name"],
      },
    },
    {
      description: "Missing Birth Date",
      data: {
        firstName: "John",
        lastName: "Doe",
        birthDate: false,
        email: "test@example.com",
        password: "12345678",
        confirmPassword: "12345678",
        expectedError: "All fields are required!",
        invalidFields: [],
      },
    },
    {
      description: "Missing Email",
      data: {
        firstName: "John",
        lastName: "Doe",
        birthDate: true,
        email: null,
        password: "12345678",
        confirmPassword: "12345678",
        expectedError: null,
        invalidFields: ["#email"],
      },
    },
    {
      description: "Missing Password",
      data: {
        firstName: "John",
        lastName: "Doe",
        birthDate: true,
        email: "test@example.com",
        password: null,
        confirmPassword: "12345678",
        expectedError: null,
        invalidFields: ["#password"],
      },
    },
    {
      description: "Missing Confirm Password",
      data: {
        firstName: "John",
        lastName: "Doe",
        birthDate: true,
        email: "test@example.com",
        password: "12345678",
        confirmPassword: null,
        expectedError: null,
        invalidFields: ["#confirm-password"],
      },
    },
  ];

  decisionTableTestCases.forEach((scenario) => {
    it(`Test Case: ${scenario.description}`, () => {
      const { firstName, lastName, birthDate, email, password, confirmPassword, expectedError, invalidFields } = scenario.data;

      if (firstName) cy.get("#first-name").type(firstName);
      if (lastName) cy.get("#last-name").type(lastName);

      if (birthDate) {
        cy.contains("span", "Pick a date").click();
        cy.get('button[name="day"]').not("[disabled]").first().click();
        cy.get(".mx-auto").click();
      }

      if (email) cy.get("#email").type(email);
      if (password) cy.get("#password").type(password);
      if (confirmPassword) cy.get("#confirm-password").type(confirmPassword);

      cy.contains("button", "Create an account").click();

      if (expectedError) {
        cy.contains(expectedError).should("be.visible");
      }

      invalidFields.forEach((selector) => {
        // Validate the input validation
        cy.get(`${selector}:invalid`).should("exist");
        cy.get(selector).then(($input) => {
          const validityState = $input[0].validity;
          expect(validityState.valid).to.be.false;
        });
      });
    });
  });
});
