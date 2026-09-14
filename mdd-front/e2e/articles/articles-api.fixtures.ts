import { test as base } from '@playwright/test';

/** Article tel que renvoyé par l'API. */
export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  topic: { id: number; name: string };
  author: { id: number; username: string };
}

/** Helpers de stub des appels réseau des articles (`**\/api/articles*`). */
export interface ArticlesApi {
  /** Stubbe `GET /api/articles` (quel que soit l'ordre de tri) avec la liste donnée. */
  mockArticles(articles: Article[]): Promise<void>;
}

export const test = base.extend<{ articlesApi: ArticlesApi }>({
  articlesApi: async ({ page }, use) => {
    await use({
      mockArticles: async (articles) => {
        await page.route('**/api/articles?sort=*', (route) => route.fulfill({ status: 200, json: articles }));
      },
    });
  },
});

export { expect } from '@playwright/test';
