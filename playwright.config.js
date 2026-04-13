// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],                                              // live terminal output
    ['html', { outputFolder: 'playwright-report' }],    // built-in HTML report
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results', // raw allure data
      suiteTitle: true,
      categories: [
        {
          name: 'Product Bugs',
          matchedStatuses: ['failed'],
          messageRegex: '.*expected.*received.*',
        },
        {
          name: 'Test Defects',
          matchedStatuses: ['broken'],
        },
        {
          name: 'Timeouts',
          matchedStatuses: ['failed', 'broken'],
          messageRegex: '.*Timeout.*',
        },
      ],
      environmentInfo: {
        Environment: process.env.ENV || 'staging',
        Browser: 'Chromium / Firefox / WebKit',
        BaseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
        Framework: 'Playwright v1.44',
        OS: 'Windows',
      },
    }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});