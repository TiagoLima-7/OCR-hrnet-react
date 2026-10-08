import { test, expect } from "@playwright/test";

async function seedEmployee(page, employee) {
  await page.evaluate((emp) => {
    const store = {
      employees: JSON.stringify({ list: [emp] }),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    };
    localStorage.setItem("persist:hrnet", JSON.stringify(store));
  }, employee);
}

const testEmployee = {
  firstName: "Jane",
  lastName: "Smith",
  dateOfBirth: "1985-05-20",
  startDate: "2020-01-10",
  street: "456 Oak Ave",
  city: "Portland",
  state: "OR",
  zipCode: "97201",
  department: "Marketing",
};

// --- Navigation ---------------------------------------------------
test.describe("Navigation", () => {
  test("la page principale charge correctement", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test('le lien "View Employees" navigue vers /employees', async ({ page }) => {
    await page.goto("/");
    await page.click("text=View Employees");
    await expect(page).toHaveURL(/\/employees/);
  });

  test('le lien "Create Employee" navigue vers la page du formulaire', async ({
    page,
  }) => {
    await page.goto("/employees");
    await page.click("text=Create Employee");
    await expect(page).toHaveURL(/\/$|\/create/);
  });
});

// --- Création d'un employé ----------------------------------------
test.describe("Création d'un employé", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  async function fillForm(page) {
    await page.goto("/");
    await page.getByTestId("input-first-name").fill("John");
    await page.getByTestId("input-last-name").fill("Doe");
    await page.getByTestId("input-date-of-birth").fill("01/15/1990");
    await page.keyboard.press("Tab");
    await page.getByTestId("input-start-date").fill("01/03/2024");
    await page.keyboard.press("Tab");
    await page.getByTestId("input-street").fill("123 Main St");
    await page.getByTestId("input-city").fill("Springfield");
    await page.getByTestId("input-zip-code").fill("12345");

    await page.getByTestId("select-state").locator(".rs__control").click();
    await page
      .locator(".rs__option")
      .filter({ hasText: "Alabama" })
      .first()
      .click();

    await page.getByTestId("select-department").locator(".rs__control").click();
    await page
      .locator(".rs__option")
      .filter({ hasText: "Engineering" })
      .first()
      .click();
  }

  test("remplit et soumet le formulaire avec succès", async ({ page }) => {
    await fillForm(page);
    await page.getByTestId("btn-submit").click();

    await expect(page.getByTestId("modal")).toBeVisible();
    await page.getByTestId("btn-modal-close").click();
    await expect(page.getByTestId("modal")).not.toBeVisible();
  });

  test("l'employé créé apparaît dans la liste", async ({ page }) => {
    await fillForm(page);
    await page.getByTestId("btn-submit").click();
    await page.getByTestId("btn-modal-close").click();

    await page.click("text=View Employees");
    await expect(page).toHaveURL(/\/employees/);
    await expect(page.locator('td:has-text("John")')).toBeVisible();
    await expect(page.locator('td:has-text("Doe")')).toBeVisible();
  });
});

// --- Liste des employés -------------------------------------------
test.describe("Liste des employés", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await seedEmployee(page, testEmployee);
    await page.goto("/employees");
  });

  test("affiche la table avec les employés", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator('td:has-text("Jane")')).toBeVisible();
    await expect(page.locator('td:has-text("Smith")')).toBeVisible();
  });

  test("la recherche filtre les résultats", async ({ page }) => {
    await page.getByTestId("input-search").fill("Jane");
    await expect(page.locator('td:has-text("Jane")')).toBeVisible();
    await expect(page.locator("text=Showing 1 to 1")).toBeVisible();
  });

  test("aucun résultat pour une recherche sans correspondance", async ({
    page,
  }) => {
    await page.getByTestId("input-search").fill("xyz_inexistant");
    await expect(page.locator("text=No entries found")).toBeVisible();
  });

  test("le tri sur une colonne fonctionne", async ({ page }) => {
    await page.locator("th").filter({ hasText: "First Name" }).click();
    await expect(page.locator("th.active-sort")).toBeVisible();
  });

  test("le sélecteur d'entrées par page fonctionne", async ({ page }) => {
    await page.getByTestId("select-page-size").selectOption("25");
    await expect(page.getByTestId("select-page-size")).toHaveValue("25");
  });
});
