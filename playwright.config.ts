import { defineConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const traceMode =
  process.env.PW_TRACE_MODE ?? (process.env.CI ? "off" : "retain-on-failure");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: traceMode as "off" | "on" | "on-first-retry" | "on-all-retries" | "retain-on-failure",
  },
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
