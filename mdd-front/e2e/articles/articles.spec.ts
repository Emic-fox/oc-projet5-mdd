import { expect, test } from './articles.fixtures';

const articles = [
  {
    id: 1,
    title: 'Article 1',
    content: 'Contenu de l’article 1',
    createdAt: '2024-01-15T00:00:00.000Z',
    topic: { id: 1, name: 'Thème 1' },
    author: { id: 1, username: 'JohnDoe' },
  },
  {
    id: 2,
    title: 'Article 2',
    content: 'Contenu de l’article 2',
    createdAt: '2024-02-20T00:00:00.000Z',
    topic: { id: 2, name: 'Thème 2' },
    author: { id: 2, username: 'JaneDoe' },
  },
];

test.describe('Fil d’articles', () => {
  test.beforeEach(async ({ authApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
  });

  test('affiche les articles renvoyés par l’API', async ({ articlesApi, articlesPage }) => {
    await articlesApi.mockArticles(articles);

    await articlesPage.goto();

    await articlesPage.expectLoaded();
    await expect(articlesPage.cards).toHaveCount(2);
    await expect(articlesPage.card('Article 1')).toContainText('Contenu de l’article 1');
    await expect(articlesPage.card('Article 1')).toContainText('JohnDoe');
    await expect(articlesPage.card('Article 2')).toContainText('Contenu de l’article 2');
    await expect(articlesPage.card('Article 2')).toContainText('JaneDoe');
  });

  test('affiche une liste vide quand il n’y a pas d’articles', async ({ articlesApi, articlesPage }) => {
    await articlesApi.mockArticles([]);

    await articlesPage.goto();

    await articlesPage.expectLoaded();
    await expect(articlesPage.cards).toHaveCount(0);
  });

  test('trie les articles par ordre décroissant par défaut', async ({ page, articlesApi, articlesPage }) => {
    await articlesApi.mockArticles(articles);

    const request = page.waitForRequest('**/api/articles?sort=desc');
    await articlesPage.goto();

    expect((await request).method()).toBe('GET');
  });

  test('recharge les articles par ordre croissant au clic sur le bouton de tri', async ({
    page,
    articlesApi,
    articlesPage,
  }) => {
    await articlesApi.mockArticles(articles);
    await articlesPage.goto();

    const request = page.waitForRequest('**/api/articles?sort=asc');
    await articlesPage.sortButton.click();

    expect((await request).method()).toBe('GET');
  });

  test('inverse à nouveau l’ordre au second clic sur le bouton de tri', async ({
    page,
    articlesApi,
    articlesPage,
  }) => {
    await articlesApi.mockArticles(articles);
    await articlesPage.goto();

    await articlesPage.sortButton.click();
    const request = page.waitForRequest('**/api/articles?sort=desc');
    await articlesPage.sortButton.click();

    expect((await request).method()).toBe('GET');
  });

  test('le lien de navigation "Articles" est actif sur cette page', async ({ page, articlesApi, articlesPage }) => {
    await articlesApi.mockArticles(articles);

    await articlesPage.goto();

    await expect(page.getByTestId('nav-articles')).toHaveClass(/text-primary/);
  });

  test('propose un bouton pour créer un article', async ({ articlesApi, articlesPage }) => {
    await articlesApi.mockArticles(articles);

    await articlesPage.goto();

    await expect(articlesPage.createButton).toBeVisible();
  });
});
