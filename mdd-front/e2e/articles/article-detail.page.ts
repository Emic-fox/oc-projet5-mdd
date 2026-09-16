import { type Locator, type Page, expect } from '@playwright/test';

export class ArticleDetailPage {
  readonly title: Locator;
  readonly date: Locator;
  readonly author: Locator;
  readonly topic: Locator;
  readonly content: Locator;
  readonly backLink: Locator;
  readonly comments: Locator;
  readonly commentInput: Locator;
  readonly commentSubmit: Locator;

  constructor(private readonly page: Page) {
    this.title = this.page.getByRole('heading', { level: 1 });
    this.date = this.page.getByTestId('article-date');
    this.author = this.page.getByTestId('article-author');
    this.topic = this.page.getByTestId('article-topic');
    this.content = this.page.getByTestId('article-content');
    this.backLink = this.page.getByTestId('back-link');
    this.comments = this.page.getByTestId('comment');
    this.commentInput = this.page.getByTestId('comment-content-input');
    this.commentSubmit = this.page.getByTestId('comment-submit');
  }

  async goto(id: number) {
    await this.page.goto(`/articles/${id}`);
  }

  /** Vérifie que le détail de l'article portant ce titre est bien chargé. */
  async expectLoaded(title: string) {
    await expect(this.page).toHaveURL(/\/articles\/\d+$/);
    await expect(this.title).toHaveText(title);
  }

  /** Remplit puis envoie le formulaire d'ajout de commentaire. */
  async submitComment(content: string) {
    await this.commentInput.fill(content);
    await this.commentSubmit.click();
  }
}
