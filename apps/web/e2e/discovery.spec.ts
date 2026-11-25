import { expect, test } from "@playwright/test";

test("discovery page lists the launch concepts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ORBITAL" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Tidal Forces/ })).toBeVisible();
});
