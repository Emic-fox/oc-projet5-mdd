import { type Locator, expect } from '@playwright/test';

import { AuthFormPage } from '../auth/auth-form.page';

export class ProfilePage extends AuthFormPage {
  readonly submit: Locator = this.page.getByTestId('profile-submit');
  readonly submitButton: Locator = this.submit.locator('button');

  async goto() {
    await this.page.goto('/profile');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('/profile');
    await expect(this.submitButton).toBeVisible();
  }
}
