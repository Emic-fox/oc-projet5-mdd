import { type Locator, type Page, expect } from '@playwright/test';

export class TopicsPage {
  readonly cards: Locator;
  readonly menuToggle: Locator;
  readonly mobileMenu: Locator;
  readonly menuBackdrop: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.cards = this.page.locator('app-topic-card');
    this.menuToggle = this.page.getByTestId('menu-toggle');
    this.mobileMenu = this.page.getByTestId('mobile-menu');
    this.menuBackdrop = this.page.getByTestId('menu-backdrop');
    this.toast = this.page.getByTestId('toast');
  }

  async goto() {
    await this.page.goto('/topics');
  }

  /** Vérifie que la page des thèmes est bien chargée. */
  async expectLoaded() {
    await expect(this.page).toHaveURL('/topics');
    await expect(this.page).toHaveTitle('Thèmes | MDD');
  }

  /** Retourne la carte correspondant au thème portant ce nom. */
  card(name: string): Locator {
    return this.cards.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  /** Retourne le bouton d'abonnement/désabonnement de la carte portant ce nom. */
  subscribeButton(name: string): Locator {
    return this.card(name).getByRole('button');
  }

  /** Retourne le bouton de fermeture du toast affiché. */
  toastCloseButton(): Locator {
    return this.toast.getByRole('button');
  }
}
