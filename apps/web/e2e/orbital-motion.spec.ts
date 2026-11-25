import { expect, test } from "@playwright/test";

test.describe("orbital motion concept", () => {
  test("story, formula, playground and missions render without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/concepts/orbital-motion");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("satellites");
    await expect(page.getByRole("heading", { name: /Fire a cannon/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /in plain words/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Launch something" })).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15_000 });
    expect(errors).toEqual([]);
  });

  test("firing the cannon reports an outcome", async ({ page }) => {
    await page.goto("/concepts/orbital-motion");
    await page.getByRole("button", { name: /Fire/ }).click();
    await expect(page.getByText(/Splat!/)).toBeVisible();
  });

  test("a mission ticks off when its goal is met", async ({ page }) => {
    await page.goto("/concepts/orbital-motion");
    await expect(page.getByText("0 of 4 missions complete")).toBeVisible();
    await page.getByLabel("Launch speed").fill("12000");
    await expect(page.getByText("1 of 4 missions complete")).toBeVisible();
  });
});
