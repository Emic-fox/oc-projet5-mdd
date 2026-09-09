import { test as base } from '@playwright/test';

/** Réponse simulée d'un endpoint d'authentification. */
export interface MockResponse {
  status: number;
  body?: unknown;
}

type MeUser = Partial<{ id: number; username: string; email: string }>;

/** Helpers de stub des appels réseau d'authentification (`**\/api/auth/*`). */
export interface AuthApi {
  /** Injecte un token dans le `localStorage` avant le chargement de l'app. */
  seedToken(token?: string): Promise<void>;
  /** Stubbe `GET /api/auth/me` avec l'utilisateur donné (200) ou une erreur. */
  mockMe(user?: MeUser, status?: number): Promise<void>;
  /** Stubbe `POST /api/auth/login`. */
  mockLogin(response: MockResponse): Promise<void>;
  /** Stubbe `POST /api/auth/register`. */
  mockRegister(response: MockResponse): Promise<void>;
}

export const test = base.extend<{ authApi: AuthApi }>({
  authApi: async ({ page }, use) => {
    const mockAuth = async (endpoint: 'login' | 'register', { status, body = {} }: MockResponse) => {
      await page.route(`**/api/auth/${endpoint}`, (route) => route.fulfill({ status, json: body }));
    };

    await use({
      seedToken: async (token = 'fake-jwt-token') => {
        await page.addInitScript((value) => window.localStorage.setItem('token', value), token);
      },
      mockMe: async (user = {}, status = 200) => {
        const body =
          status === 200
            ? { id: 1, username: 'JohnDoe', email: 'john.doe@example.com', ...user }
            : { type: 'about:blank', title: 'Unauthorized', status, detail: 'Token invalide' };
        await page.route('**/api/auth/me', (route) => route.fulfill({ status, json: body }));
      },
      mockLogin: (response) => mockAuth('login', response),
      mockRegister: (response) => mockAuth('register', response),
    });
  },
});

export { expect } from '@playwright/test';
