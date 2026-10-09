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

// --- Navigation --------------------------------------------------
test.describe("Navigation", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test('"View Employees" link navigates to /employees', async ({ page }) => {
    await page.goto("/");
    await page.click("text=View Employees");
    await expect(page).toHaveURL(/\/employees/);
  });

  test('"Create Employee" link navigates back to the form', async ({
    page,
  }) => {
    await page.goto("/employees");
    await page.click("text=Create Employee");
    await expect(page).toHaveURL(/\/$|\/create/);
  });
});

// --- Create employee ---------------------------------------------
test.describe("Create employee", () => {
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

  test("fills and submits the form successfully", async ({ page }) => {
    await fillForm(page);
    await page.getByTestId("btn-submit").click();

    await expect(page.getByTestId("modal")).toBeVisible();
    await page.getByTestId("btn-modal-close").click();
    await expect(page.getByTestId("modal")).not.toBeVisible();
  });

  test("created employee appears in the list", async ({ page }) => {
    await fillForm(page);
    await page.getByTestId("btn-submit").click();
    await page.getByTestId("btn-modal-close").click();

    await page.click("text=View Employees");
    await expect(page).toHaveURL(/\/employees/);
    await expect(page.locator('td:has-text("John")')).toBeVisible();
    await expect(page.locator('td:has-text("Doe")')).toBeVisible();
  });

  // --- Form validation -------------------------------------------
  test("shows error when date of birth is missing", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("input-first-name").fill("John");
    await page.getByTestId("input-last-name").fill("Doe");
    // Required HTML fields must be filled so the browser allows form submission
    await page.getByTestId("input-street").fill("123 Main St");
    await page.getByTestId("input-city").fill("Springfield");
    await page.getByTestId("input-zip-code").fill("12345");
    await page.getByTestId("btn-submit").click();

    await expect(page.locator("text=Date of birth is required")).toBeVisible();
    await expect(page.getByTestId("modal")).not.toBeVisible();
  });

  test("shows error when start date is before employee turns 18", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("input-first-name").fill("John");
    await page.getByTestId("input-last-name").fill("Doe");
    // Fill startDate BEFORE dateOfBirth — no minDate restriction yet,
    // so the date registers in React state
    await page.getByTestId("input-start-date").fill("01/01/2005");
    await page.keyboard.press("Tab");
    // Now fill dateOfBirth — born 1990, so 18th birthday is 2008.
    // startDate 2005 < 2008 → validation error
    await page.getByTestId("input-date-of-birth").fill("06/15/1990");
    await page.keyboard.press("Tab");
    await page.getByTestId("input-street").fill("123 Main St");
    await page.getByTestId("input-city").fill("Springfield");
    await page.getByTestId("input-zip-code").fill("12345");
    await page.getByTestId("btn-submit").click();

    await expect(
      page.locator(
        "text=Employee must be at least 18 years old at the start date",
      ),
    ).toBeVisible();
    await expect(page.getByTestId("modal")).not.toBeVisible();
  });

  test("shows error when start date is missing", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("input-first-name").fill("John");
    await page.getByTestId("input-last-name").fill("Doe");
    await page.getByTestId("input-date-of-birth").fill("01/15/1990");
    await page.keyboard.press("Tab");
    await page.getByTestId("input-street").fill("123 Main St");
    await page.getByTestId("input-city").fill("Springfield");
    await page.getByTestId("input-zip-code").fill("12345");
    await page.getByTestId("btn-submit").click();

    await expect(page.locator("text=Start date is required")).toBeVisible();
    await expect(page.getByTestId("modal")).not.toBeVisible();
  });
});

// --- Employee list -----------------------------------------------
test.describe("Employee list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await seedEmployee(page, testEmployee);
    await page.goto("/employees");
  });

  test("displays the table with employees", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator('td:has-text("Jane")')).toBeVisible();
    await expect(page.locator('td:has-text("Smith")')).toBeVisible();
  });

  test("search filters the results", async ({ page }) => {
    await page.getByTestId("input-search").fill("Jane");
    await expect(page.locator('td:has-text("Jane")')).toBeVisible();
    await expect(page.locator("text=Showing 1 to 1")).toBeVisible();
  });

  test("no results for an unmatched search", async ({ page }) => {
    await page.getByTestId("input-search").fill("xyz_not_found");
    await expect(page.locator("text=No entries found")).toBeVisible();
  });

  test("column sort works", async ({ page }) => {
    await page.locator("th").filter({ hasText: "First Name" }).click();
    await expect(page.locator("th.active-sort")).toBeVisible();
  });

  test("page size selector works", async ({ page }) => {
    await page.getByTestId("select-page-size").selectOption("25");
    await expect(page.getByTestId("select-page-size")).toHaveValue("25");
  });
});
