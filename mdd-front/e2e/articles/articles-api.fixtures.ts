import { test as base } from '@playwright/test';
import type { Topic } from '../topics/topics-api.fixtures';

/** Article tel que renvoyé par l'API. */
export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  topic: { id: number; name: string };
  author: { id: number; username: string };
}

/** Réponse simulée d'un endpoint (création d'article). */
export interface MockResponse {
  status: number;
  body?: unknown;
}

/** Helpers de stub des appels réseau des articles (`**\/api/articles*`). */
export interface ArticlesApi {
  /** Stubbe `GET /api/articles` (quel que soit l'ordre de tri) avec la liste donnée. */
  mockArticles(articles: Article[]): Promise<void>;
  /** Stubbe `GET /api/articles/{id}` avec l'article donné. */
  mockArticle(article: Article): Promise<void>;
  /** Stubbe `GET /api/topics` (sans filtre) avec la liste de thèmes donnée, pour le formulaire de création. */
  mockTopics(topics: Topic[]): Promise<void>;
  /** Stubbe `POST /api/articles`. */
  mockCreateArticle(response: MockResponse): Promise<void>;
}

export const test = base.extend<{ articlesApi: ArticlesApi }>({
  articlesApi: async ({ page }, use) => {
    await use({
      mockArticles: async (articles) => {
        await page.route('**/api/articles?sort=*', (route) => route.fulfill({ status: 200, json: articles }));
      },
      mockArticle: async (article) => {
        await page.route(`**/api/articles/${article.id}`, (route) => route.fulfill({ status: 200, json: article }));
      },
      mockTopics: async (topics) => {
        await page.route('**/api/topics', (route) => {
          if (route.request().method() !== 'GET') return route.fallback();
          return route.fulfill({ status: 200, json: topics });
        });
      },
      mockCreateArticle: async ({ status, body = {} }) => {
        await page.route('**/api/articles', (route) => {
          if (route.request().method() !== 'POST') return route.fallback();
          return route.fulfill({ status, json: body });
        });
      },
    });
  },
});

export { expect } from '@playwright/test';
