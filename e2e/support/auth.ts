import type { BrowserContext } from "@playwright/test";

export const parseCookieHeader = (header: string) => {
  return header
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return {
        name,
        value: rest.join("="),
      };
    })
    .filter((cookie) => cookie.name && cookie.value);
};

export const resolveBaseURL = (configuredBaseURL?: string) => {
  if (typeof configuredBaseURL === "string" && configuredBaseURL.length > 0) {
    return configuredBaseURL;
  }

  return process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
};

export const addAuthCookiesToContext = async (
  context: BrowserContext,
  cookieHeader: string,
  baseURL: string
) => {
  const host = new URL(baseURL);
  const cookies = parseCookieHeader(cookieHeader).map((cookie) => ({
    ...cookie,
    domain: host.hostname,
    path: "/",
    httpOnly: true,
    secure: host.protocol === "https:",
    sameSite: "Lax" as const,
  }));

  await context.addCookies(cookies);
};
