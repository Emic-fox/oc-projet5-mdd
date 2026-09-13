import { test as base } from '@playwright/test';

/** Thème tel que renvoyé par l'API. */
export interface Topic {
  id: number;
  name: string;
  description: string;
  subscribed: boolean;
}

/** Réponse simulée d'un endpoint (abonnement/désabonnement). */
export interface MockResponse {
  status: number;
  body?: unknown;
}

/** Helpers de stub des appels réseau des thèmes (`**\/api/topics*`). */
export interface TopicsApi {
  /** Stubbe `GET /api/topics?subscribed=false` avec la liste de thèmes donnée. */
  mockTopics(topics: Topic[]): Promise<void>;
  /** Stubbe `POST /api/topics/:id/subscription`. */
  mockSubscribe(topicId: number, response?: MockResponse): Promise<void>;
  /** Stubbe `DELETE /api/topics/:id/subscription`. */
  mockUnsubscribe(topicId: number, response?: MockResponse): Promise<void>;
}

export const test = base.extend<{ topicsApi: TopicsApi }>({
  topicsApi: async ({ page }, use) => {
    await use({
      mockTopics: async (topics) => {
        await page.route('**/api/topics?subscribed=false', (route) => route.fulfill({ status: 200, json: topics }));
      },
      mockSubscribe: async (topicId, { status, body = { topic: { id: topicId }, user: { id: 1 } } } = { status: 200 }) => {
        await page.route(`**/api/topics/${topicId}/subscription`, (route) => {
          if (route.request().method() !== 'POST') return route.fallback();
          return route.fulfill({ status, json: body });
        });
      },
      mockUnsubscribe: async (topicId, { status, body = {} } = { status: 204 }) => {
        await page.route(`**/api/topics/${topicId}/subscription`, (route) => {
          if (route.request().method() !== 'DELETE') return route.fallback();
          return route.fulfill({ status, json: body });
        });
      },
    });
  },
});

export { expect } from '@playwright/test';
