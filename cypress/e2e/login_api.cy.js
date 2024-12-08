describe("Login - API", () => {
  const baseApiUrl = "http://carin-web.hopto.org:9000";

  it("Test Case 1: Login with valid credentials", () => {
    // Load the login credentials from the fixture file
    cy.fixture("login_credentials.json").then((credentials) => {
      const admin = credentials.valid.find((user) => user.name === "admin");

      cy.request({
        method: "POST",
        url: `${baseApiUrl}/auth/login`,
        body: {
          email: admin.email,
          password: admin.password,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("token");
      });
    });
  });

  it("Test Case 2: Login with invalid credentials", () => {
    // Load the login credentials from the fixture file
    cy.fixture("login_credentials.json").then((credentials) => {
      const admin = credentials.valid.find((user) => user.name === "admin");

      cy.request({
        method: "POST",
        url: `${baseApiUrl}/auth/login`,
        body: {
          email: admin.email,
          password: "admin123",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });
  });
});
