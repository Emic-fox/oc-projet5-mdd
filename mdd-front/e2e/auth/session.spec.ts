import { HomePage } from '../home/home.page';
import { expect, test } from './auth.fixtures';

test.describe('Session et déconnexion', () => {
  test('restaure la session depuis un token présent au chargement', async ({ authApi, page }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });

    const meRequest = page.waitForRequest('**/api/auth/me');
    await page.goto('/');

    expect((await meRequest).headers()['authorization']).toBe('Bearer fake-jwt-token');

    const home = new HomePage(page);
    await home.expectAuth('JohnDoe');
  });

  test('déconnecte l’utilisateur et nettoie le token', async ({ authApi, page }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
    await page.goto('/');

    const home = new HomePage(page);
    await home.expectAuth('JohnDoe');

    await home.logout.click();

    await home.expectUnauth();
    expect(await page.evaluate(() => window.localStorage.getItem('token'))).toBeNull();
  });

  test('nettoie la session si le token est rejeté par l’API (401 sur /me)', async ({ authApi, page }) => {
    await authApi.seedToken();
    await authApi.mockMe({}, 401);

    await page.goto('/');

    const home = new HomePage(page);
    await expect(home.navLogin).toBeVisible();
    expect(await page.evaluate(() => window.localStorage.getItem('token'))).toBeNull();
  });

  test('n’appelle pas /me sans token', async ({ page }) => {
    let meCalled = false;
    await page.route('**/api/auth/me', (route) => {
      meCalled = true;
      return route.fulfill({ status: 200, json: {} });
    });

    await page.goto('/');

    const home = new HomePage(page);
    await expect(home.navLogin).toBeVisible();
    expect(meCalled).toBe(false);
  });
});
