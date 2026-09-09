import { mergeTests, test as base } from '@playwright/test';

import { test as coverageTest } from '../fixtures/coverage.fixtures';
import { test as authApiTest } from './auth-api.fixtures';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';

interface AuthPomFixtures {
  loginPage: LoginPage;
  registerPage: RegisterPage;
}

const pomTest = base.extend<AuthPomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.goto();

    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage: RegisterPage = new RegisterPage(page);
    await registerPage.goto();

    await use(registerPage);
  },
});

export const test = mergeTests(coverageTest, pomTest, authApiTest);

export { expect } from '@playwright/test';
