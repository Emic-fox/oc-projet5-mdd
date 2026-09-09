import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly logo: Locator;
  readonly navLogin: Locator;
  readonly navRegister: Locator;
  readonly welcomeMessage: Locator;
  readonly logout: Locator;

  constructor(private readonly page: Page) {
    this.logo = this.page.locator('app-logo');
    this.navLogin = this.page.getByTestId('nav-login');
    this.navRegister = this.page.getByTestId('nav-register');
    this.welcomeMessage = this.page.getByTestId('welcome');
    this.logout = this.page.getByTestId('logout');
  }

  async goto() {
    await this.page.goto('/');
  }
  
  /** Vérifie que la page de connexion est bien chargée. */
  async expectLoaded() {
    await expect(this.page).toHaveURL('/');
    await expect(this.page).toHaveTitle('Monde de Dév | MDD');
    await expect(this.logo).toBeVisible();
  }

  /** Vérifie que la page affiche les bons items pour un utilisateur non authentifié */
  async expectUnauth() {
    await expect(this.navLogin).toBeVisible();
    await expect(this.navRegister).toBeVisible();
    await expect(this.logout).not.toBeVisible();
    await expect(this.welcomeMessage).toHaveCount(0);
  }

  /** Vérifie que la page affiche la session de l'utilisateur donné. */
  async expectAuth(username: string) {
    await expect(this.navLogin).not.toBeVisible();
    await expect(this.navRegister).not.toBeVisible();
    await expect(this.logout).toBeVisible();
    await expect(this.welcomeMessage).toContainText(`Bienvenue ${username}`);
  }
}