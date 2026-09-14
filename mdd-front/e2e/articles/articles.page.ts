import { type Locator, type Page, expect } from '@playwright/test';

export class ArticlesPage {
  readonly cards: Locator;
  readonly sortButton: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.cards = this.page.locator('app-article-card');
    this.sortButton = this.page.getByTestId('sort-by');
    this.createButton = this.page.getByTestId('create-article');
  }

  async goto() {
    await this.page.goto('/articles');
  }

  /** Vérifie que le fil d'articles est bien chargé. */
  async expectLoaded() {
    await expect(this.page).toHaveURL('/articles');
    await expect(this.page).toHaveTitle("Fil d'actualités | MDD");
  }

  /** Retourne la carte correspondant à l'article portant ce titre. */
  card(title: string): Locator {
    return this.cards.filter({ has: this.page.getByRole('heading', { name: title, exact: true }) });
  }
}
