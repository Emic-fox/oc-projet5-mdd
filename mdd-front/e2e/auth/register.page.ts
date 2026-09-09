import { type Locator, expect } from '@playwright/test';

import { AuthFormPage } from './auth-form.page';

export class RegisterPage extends AuthFormPage {
  readonly submit: Locator = this.page.getByTestId('register-submit');
  readonly submitButton: Locator = this.submit.locator('button');

  async goto() {
    await this.page.goto('/register');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('/register');
    await expect(this.submitButton).toBeVisible();
  }

  async fill(username: string, email: string, password: string) {
    await this.fillField('username', username);
    await this.fillField('email', email);
    await this.fillField('password', password);
  }
}
