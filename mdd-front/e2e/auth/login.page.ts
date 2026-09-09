import { type Locator, expect } from '@playwright/test';

import { AuthFormPage } from './auth-form.page';

export class LoginPage extends AuthFormPage {
  readonly submit: Locator = this.page.getByTestId('login-submit');
  readonly submitButton: Locator = this.submit.locator('button');

  async goto() {
    await this.page.goto('/login');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('/login');
    await expect(this.submitButton).toBeVisible();
  }

  async fill(login: string, password: string) {
    await this.fillField('login', login);
    await this.fillField('password', password);
  }
}
