import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly logo: Locator;
  readonly navLogin: Locator;
  readonly navRegister: Locator;

  constructor(private readonly page: Page) {
    this.logo = this.page.locator('app-logo');
    this.navLogin = this.page.getByTestId('nav-login');
    this.navRegister = this.page.getByTestId('nav-register');
  }

  async goto() {
    await this.page.goto('/');
  }
  
  /** Vérifie que la page de connexion est bien chargée. */
  async expectLoaded() {
    await expect(this.page).toHaveURL('/');
    await expect(this.page).toHaveTitle('Monde de Dév | MDD');
    await expect(this.logo).toBeVisible();
    await expect(this.navLogin).toBeVisible();
    await expect(this.navRegister).toBeVisible();
  }
}