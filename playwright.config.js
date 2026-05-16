// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // shared MySQL state — keep serial for now
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // SchreckNet's edit pages collapse the right-side nav (Spend XP, XP
        // Log, Set XP) below ~1440px. Run wide enough that the two-column
        // layout is in effect.
        viewport: { width: 1600, height: 900 },
      },
    },
  ],
  webServer: [
    {
      // API server — plain node (not nodemon) so Playwright can manage lifecycle.
      // Use `port` for a TCP-level readiness check; the API has no
      // public-by-default GET that survives connect-history-api-fallback.
      command: "node server.js",
      port: 5000,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      // Frontend — quasar dev. First compile is slow (often 60-120s on a
      // cold node_modules); webpack-dev-server doesn't bind to :8080 until
      // it's ready, so port-based readiness is reliable.
      command: "npx quasar dev",
      port: 8080,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
});
