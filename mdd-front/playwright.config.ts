import { defineConfig, devices } from '@playwright/test';
import type { CoverageReportOptions } from 'monocart-reporter';

/**
 * Couverture de code collectée pendant les tests E2E (voir
 * `e2e/fixtures/coverage.fixtures.ts`). Rapports générés dans `coverage/e2e`.
 */
const coverage: CoverageReportOptions = {
  outputDir: './coverage/e2e',
  reports: [
    ['v8', { outputFile: 'index.html', metrics: ['lines'] }],
    ['console-summary', { metrics: ['lines'] }],
    ['html-spa', { subdir: 'html-spa' }],
    ['lcovonly', { file: 'lcov.info' }],
  ],
  // On ne garde que les bundles servis par l'application Angular.
  entryFilter: (entry) => {
    const url = entry.url as string;
    return (
      url.includes('localhost:4200') &&
      !url.includes('@vite') &&
      !url.includes('@fs') &&
      !url.endsWith('/styles.css')
    );
  },
  // On ne remonte que le code source de l'app, hors tests/config.
  sourceFilter: (sourcePath) =>
    sourcePath.search(/src\//u) !== -1 && !/\.(spec|config)\./u.test(sourcePath),
};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'monocart-reporter',
      {
        name: 'MDD — Rapport E2E',
        outputFile: './playwright-report/index.html',
        coverage,
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
