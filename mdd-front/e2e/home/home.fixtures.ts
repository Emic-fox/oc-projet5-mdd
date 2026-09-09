import { mergeTests, test as base } from '@playwright/test';

import { test as coverageTest } from '../fixtures/coverage.fixtures';
import { HomePage } from './home.page';

const pomTest = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage: HomePage = new HomePage(page);
    await homePage.goto();

    await use(homePage);
  },
});

export const test = mergeTests(coverageTest, pomTest);

export { expect } from '@playwright/test';
