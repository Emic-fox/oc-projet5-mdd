import { test as base } from '@playwright/test';

/** Réponse simulée d'un endpoint de mise à jour du profil. */
export interface MockResponse {
  status: number;
  body?: unknown;
}

/** Helpers de stub des appels réseau de mise à jour du profil (`**\/api/auth/me*`). */
export interface ProfileApi {
  /** Stubbe `PUT /api/auth/me`. */
  mockUpdateProfile(response?: MockResponse): Promise<void>;
  /** Stubbe `PUT /api/auth/me/password`. */
  mockUpdatePassword(response?: MockResponse): Promise<void>;
}

export const test = base.extend<{ profileApi: ProfileApi }>({
  profileApi: async ({ page }, use) => {
    await use({
      mockUpdateProfile: async ({ status, body = { user: { id: 1 }, token: 'refreshed-jwt-token' } } = { status: 200 }) => {
        await page.route('**/api/auth/me', (route) => {
          if (route.request().method() !== 'PUT') return route.fallback();
          return route.fulfill({ status, json: body });
        });
      },
      mockUpdatePassword: async ({ status, body = {} } = { status: 200 }) => {
        await page.route('**/api/auth/me/password', (route) => {
          if (route.request().method() !== 'PUT') return route.fallback();
          return route.fulfill({ status, json: body });
        });
      },
    });
  },
});

export { expect } from '@playwright/test';
