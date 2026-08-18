import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs on a dedicated port and always starts its own server.
 *
 * Port 3000 is deliberately avoided: reusing whatever happens to be listening there makes the
 * suite pass or fail based on what else the developer has running.
 */
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: { baseURL: BASE_URL, trace: 'on-first-retry' },
  projects: [
    // The dominant client is an entry-level Android phone (BRD). channel 'chrome' uses the Chrome
    // already installed on the machine, so runs do not need a separate Playwright browser download.
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'], channel: 'chrome' } },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
