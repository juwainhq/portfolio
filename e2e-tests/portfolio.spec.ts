import { test, expect } from "@playwright/test";

/**
 * Critical user journey for the dithered redesign.
 *
 * Run against the dev server with:
 *   npx playwright test -c playwright-dyad.config.ts
 * (DYAD_TEST_BASE_URL overrides the base URL.)
 */
test.describe("Portfolio — critical user journey", () => {
  test("homepage shows every section, the dither field and consistent numbering", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Juwain Haque/i })
    ).toBeVisible();

    // The live ordered-dither canvas behind the hero.
    await expect(page.locator("canvas[data-dither-field]")).toBeVisible();

    for (const id of [
      "#about",
      "#services",
      "#work",
      "#highlights",
      "#how-i-work",
      "#contact",
    ]) {
      await expect(page.locator(id)).toBeAttached();
    }

    // "03 Projects" must match the card numbering 01 / 02 / 03.
    const work = page.locator("#work");
    await expect(work.getByText(/03\s+Projects/i)).toBeVisible();
    const numbers = await work.locator("li h3").evaluateAll((nodes) =>
      nodes.map(
        (node) =>
          node.parentElement?.querySelector("span")?.textContent?.trim() ?? ""
      )
    );
    expect(numbers).toEqual(["01", "02", "03"]);

    // Exactly one link to the full archive, and no duplicate "Work" nav item.
    expect(await page.locator('a[href="/work"]').count()).toBe(1);
    expect(await page.locator('header nav a', { hasText: /^Work$/ }).count()).toBe(1);
  });

  test("project cards are dithered and switch to colour on hover", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator("#work li").first();
    await card.scrollIntoViewIfNeeded();

    const canvas = card.locator("canvas");
    const image = card.locator("img");
    await expect(canvas).toBeVisible();
    await expect(image).toHaveCSS("opacity", "0");

    await card.hover();
    await expect(image).toHaveCSS("opacity", "1");
  });

  test("theme toggle switches theme and remembers the choice", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    await page.locator("[data-theme-toggle]").click();
    await expect(html).not.toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem("juwain-theme"))
    ).toBe("light");

    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("sticky nav highlights the section in view", async ({ page }) => {
    await page.goto("/");
    await page.locator("#services").scrollIntoViewIfNeeded();
    await expect(
      page.locator('header nav a[aria-current="location"]')
    ).toHaveText(/Services/i);
  });

  test("contact form validates and reports its state", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();

    await page.getByLabel(/Name/i).fill("Test User");
    await page.getByLabel(/Email/i).fill("not-an-email");
    await page.getByLabel(/Message/i).fill("Hello, I would like to get in touch!");
    await contact.getByRole("button", { name: /Send Message/i }).click();

    await expect(page.locator("[data-form-status]")).toContainText(/incomplete/i);

    // With the placeholder form id in place the form refuses to fake a send
    // and points at the email address instead.
    await page.getByLabel(/Email/i).fill("test@example.com");
    await contact.getByRole("button", { name: /Send Message/i }).click();
    await expect(page.locator("[data-form-status]")).toContainText(
      /not connected|email/i
    );
  });

  test("project detail page opens from the work grid", async ({ page }) => {
    await page.goto("/");
    const work = page.locator("#work");
    await work.scrollIntoViewIfNeeded();
    await work.locator("li a").first().click();

    await expect(page).toHaveURL(/\/work\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("no horizontal scroll at mobile widths", async ({ page }) => {
    for (const width of [390, 820]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
});
