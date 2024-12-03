const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // Directory for test files
  retries: 1,         // Retry once on failure
  use: {
    headless: false,   // Run tests in headless mode
    baseURL: 'https://app.asana.com', // Base URL for Asana
    viewport: { width: 1280, height: 720 }, // Browser viewport size
    video: 'on-first-retry', // Record video on retry
    screenshot: 'only-on-failure', // Take screenshots on failure
  },
});
