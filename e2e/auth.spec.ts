import { expect, test } from "@playwright/test";
import { addAuthCookiesToContext, resolveBaseURL } from "./support/auth";

const authCookie = process.env.E2E_AUTH_COOKIE;

test.describe("auth flow", () => {
  test("renders login page sign-in action", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Sign In with Google" })).toBeVisible();
  });

  test("returns 401 for protected board API without auth", async ({ request }) => {
    const response = await request.get("/api/board");
    expect(response.status()).toBe(401);
  });

  test("redirects unauthenticated user from protected boards route", async ({ request }) => {
    const response = await request.get("/boards", { maxRedirects: 0 });
    expect([301, 302, 303, 307, 308]).toContain(response.status());

    const location = response.headers()["location"] ?? "";
    expect(location).toContain("callbackUrl=");
    expect(location.includes("/login") || location.includes("/api/auth/signin")).toBeTruthy();
  });

  test.describe("authenticated session", () => {
    test.skip(!authCookie, "Set E2E_AUTH_COOKIE to run authenticated auth checks");

    test("allows authenticated access to protected board API", async ({ request }) => {
      const response = await request.get("/api/board", {
        headers: { cookie: authCookie as string },
      });
      expect(response.ok()).toBeTruthy();
    });

    test("allows authenticated navigation to /boards", async ({ page }) => {
      const baseURL = resolveBaseURL(test.info().project.use.baseURL);
      await addAuthCookiesToContext(page.context(), authCookie as string, baseURL);
      await page.goto("/boards");
      await expect(page).toHaveURL(/\/boards/);
      await expect(page).not.toHaveURL(/\/login|\/api\/auth\/signin/);
    });
  });
});
