describe("Approve User - API", () => {
  const baseApiUrl = "http://carin-web.hopto.org:9000";

  it("Test Case 1: Approve a user", () => {
    // Call the register command
    cy.register();

    // Load the login credentials from the fixture file
    cy.fixture("login_credentials.json").then((credentials) => {
      const admin = credentials.base.find((user) => user.name === "admin");

      cy.loginViaApi(admin.email, admin.password);
    });

    cy.fixture("login_credentials.json").then((credentials) => {
      const user = credentials.created.find((user) => user.approved === false);
      const roles = [1, 2, 3];
      const roleNumber = roles[Math.floor(Math.random() * roles.length)];

      cy.request({
        method: "POST",
        url: `${baseApiUrl}/users/${user.id}/approval?roleId=${roleNumber}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        user.approved = true;
        user.role = roleNumber;

        cy.writeFile("cypress/fixtures/login_credentials.json", credentials);
      });
    });
  });
});
