import { type Locator, type Page, expect } from '@playwright/test';

export class ArticleCreatePage {
  readonly backLink: Locator;
  readonly submit: Locator;
  readonly submitButton: Locator;
  readonly pageError: Locator;

  constructor(private readonly page: Page) {
    this.backLink = this.page.getByTestId('back-link');
    this.submit = this.page.getByTestId('create-submit');
    this.submitButton = this.submit.locator('button');
    this.pageError = this.page.getByTestId('api-error');
  }

  async goto() {
    await this.page.goto('/new-article');
  }

  /** Vérifie que la page de création est bien chargée. */
  async expectLoaded() {
    await expect(this.page).toHaveURL('/new-article');
    await expect(this.page).toHaveTitle('Créer un article | MDD');
  }

  /** `<input>`/`<select>`/`<textarea>` d'un champ donné. */
  input(field: string): Locator {
    return this.page.getByTestId(field).getByTestId('input');
  }

  /** Liste des messages de validation d'un champ donné. */
  fieldErrors(field: string): Locator {
    return this.page.getByTestId(field).getByTestId('error-messages');
  }

  async fill({ topic, title, content }: { topic?: string; title?: string; content?: string }) {
    if (topic) {
      await this.input('topic').selectOption({ label: topic });
    }
    if (title) {
      await this.input('title').fill(title);
    }
    if (content) {
      await this.input('content').fill(content);
    }
  }
}
