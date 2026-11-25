import { expect, test } from "@playwright/test";

test.describe("orbital motion concept", () => {
  test("renders the full learning page and a live simulation", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto("/concepts/orbital-motion");
    for (const name of [
      "Introduction",
      "Scientific explanation",
      "Mathematical foundation",
      "Interactive simulation",
      "Guided experiments",
      "Further reading and references",
    ]) {
      await expect(page.getByRole("heading", { name, level: 2 })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Vis-viva equation" })).toBeVisible();
    await expect(page.getByRole("note", { name: "Idealised model" })).toBeVisible();
    await expect(page.locator("#simulation canvas")).toBeVisible({ timeout: 15_000 });

    const readouts = page.getByLabel("Live readouts");
    const elapsed = readouts.locator("dd").first();
    await expect(elapsed).toHaveText("0 min");
    await page.getByRole("button", { name: "Play" }).click();
    await expect(elapsed).not.toHaveText("0 min");
    await page.getByRole("button", { name: "Pause" }).click();

    expect(errors).toEqual([]);
  });

  test("parameters drive the model", async ({ page }) => {
    await page.goto("/concepts/orbital-motion");
    const typeCell = page
      .getByLabel("Live readouts")
      .locator("dt", { hasText: "Orbit type" })
      .locator("xpath=following-sibling::dd[1]");
    await expect(typeCell).toHaveText(/elliptical/);
    const speed = page.getByLabel("Initial speed");
    await speed.fill("12000");
    await expect(typeCell).toHaveText(/hyperbolic/);
  });

  test("calculator updates live", async ({ page }) => {
    await page.goto("/concepts/orbital-motion");
    const form = page.getByRole("form", { name: "Orbital period calculator (Earth)" });
    await expect(form.getByText("92.97")).toBeVisible();
    await form.getByLabel(/Semi-major axis/).fill("42164");
    await expect(form.getByText("1,436.1")).toBeVisible();
  });

  test("experiment applies setup and compares prediction", async ({ page }) => {
    await page.goto("/concepts/orbital-motion");
    await page.getByRole("tab", { name: "Double the orbit size" }).click();
    await page.getByLabel("×2.83").check();
    await page.getByRole("button", { name: "Run experiment" }).click();
    await expect(page.getByText("Your prediction matches the model.")).toBeVisible();
    const period = page
      .getByLabel("Live readouts")
      .locator("dt", { hasText: "Period T" })
      .locator("xpath=following-sibling::dd[1]");
    await expect(period).toHaveText(/^33[0-9]\.?\d* min$/);
  });
});

test("planned concepts show a placeholder", async ({ page }) => {
  await page.goto("/concepts/tidal-forces");
  await expect(page.getByText(/planned and not yet implemented/)).toBeVisible();
});
