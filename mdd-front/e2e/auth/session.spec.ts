import { HomePage } from '../home/home.page';
import { ArticlesPage } from '../articles/articles.page';
import { expect, test } from './auth.fixtures';

test.describe('Session et déconnexion', () => {
  test('restaure la session depuis un token présent au chargement', async ({ authApi, articlesApi, page }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
    await articlesApi.mockArticles([]);

    const meRequest = page.waitForRequest('**/api/auth/me');
    await page.goto('/');

    expect((await meRequest).headers()['authorization']).toBe('Bearer fake-jwt-token');

    const articles = new ArticlesPage(page);
    await articles.expectLoaded();
  });

  test('déconnecte l’utilisateur et nettoie le token', async ({ authApi, articlesApi, page }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
    await articlesApi.mockArticles([]);
    await page.goto('/');

    const articles = new ArticlesPage(page);
    await articles.expectLoaded();

    await page.getByTestId('logout').click();

    const home = new HomePage(page);
    await home.expectLoaded();
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

  test('nettoie la session et redirige vers l’accueil si un appel authentifié est rejeté (401)', async ({
    authApi,
    articlesApi,
    page,
  }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
    await articlesApi.mockArticles([]);
    await page.goto('/');

    const articles = new ArticlesPage(page);
    await articles.expectLoaded();

    await page.route('**/api/articles?sort=*', (route) =>
      route.fulfill({
        status: 401,
        json: { type: 'about:blank', title: 'Unauthorized', status: 401, detail: 'Token invalide' },
      }),
    );

    await page.reload();

    const home = new HomePage(page);
    await home.expectLoaded();
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

  test('redirige vers l’accueil un accès direct à une page privée sans être connecté', async ({ page }) => {
    await page.goto('/articles');

    const home = new HomePage(page);
    await home.expectLoaded();
  });
});
