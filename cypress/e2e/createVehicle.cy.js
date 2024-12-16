import { faker } from "@faker-js/faker";

describe("Create Vehicle", () => {
  const baseUrl = "http://carin-web.hopto.org:3003";

  // runs before each test in the block
  beforeEach(() => {
    cy.clearLocalStorage(); // clear local storage
    cy.visit(baseUrl);
    cy.login("mariajoao@carin.com", "12345678");
    cy.contains("button", "Vehicles").click();
    cy.contains("button", "Add Vehicle").click();
  });

  it("Test Case 1: Create a vehicle with valid data.", () => {
    cy.get("[name='brand']").type(faker.vehicle.manufacturer());
    cy.get('[name="model"]').type(faker.vehicle.model());
    cy.get('[name="licensePlate"]').type(faker.vehicle.vrm());
    cy.get("[name='vin']").type(faker.vehicle.vin());
    cy.get("[name='color']").type(faker.color.human());
    cy.get('[name="category"]').type("City");

    cy.contains("label", "Register Date").parent().find("button").click();
    cy.get('button[name="day"]').not("[disabled]").first().click();
    cy.contains("Add New Vehicle").click();

    cy.contains("label", "Acquisition Date").parent().find("button").click();
    cy.get('button[name="day"]').not("[disabled]").first().click();
    cy.contains("Add New Vehicle").click();

    cy.get('[name="kms"]').type("12345");
    cy.get("[name='capacity']").type("5");

    cy.contains("Select Fuel Type").click();
    cy.contains('[role="option"]', "Diesel").click({ force: true });

    cy.get('[name="averageFuelConsumption"]').type("5.6");
    cy.get("[type='submit']").click();

    cy.contains("Vehicle created successfully.").should("be.visible");
  });

  it("Test Case 2: Create a vehicle without data.", () => {
    cy.intercept("POST", "/vehicles").as("postVehicle");

    cy.get("[type='submit']").click();

    cy.wait(1000);
    cy.get("@postVehicle.all").should("have.length", 0);
  });

  it("Test Case 3: Create a vehicle with invalid VIN.", () => {
    cy.get("[name='vin']").type("1234567890123457");

    cy.get("[type='submit']").click();

    cy.contains("VIN needs to be exactly 17 characters long.").should("be.visible");
  });

  it("Test Case 4: Validate negative inputs for KMS, Capacity, and Fuel Consumption", () => {
    cy.get('[name="kms"]').type("-1");
    cy.get('[name="kms"]:invalid').should("exist");

    cy.get("[name='capacity']").type("-1");
    cy.get('[name="capacity"]:invalid').should("exist");

    cy.get('[name="averageFuelConsumption"]').type("-1");
    cy.get('[name="averageFuelConsumption"]:invalid').should("exist");

    cy.get("[type='submit']").click();
  });
});
