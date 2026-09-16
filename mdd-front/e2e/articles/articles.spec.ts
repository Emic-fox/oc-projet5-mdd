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

test.describe('Détail d’un article', () => {
  test.beforeEach(async ({ authApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
  });

  test('navigue vers le détail au clic sur une carte et affiche l’article complet', async ({
    articlesApi,
    articlesPage,
    articleDetailPage,
  }) => {
    await articlesApi.mockArticles(articles);
    await articlesApi.mockArticle(articles[0]);
    await articlesApi.mockComments(1, []);

    await articlesPage.goto();
    await articlesPage.expectLoaded();
    await articlesPage.card('Article 1').click();

    await articleDetailPage.expectLoaded('Article 1');
    await expect(articleDetailPage.content).toHaveText('Contenu de l’article 1');
    await expect(articleDetailPage.author).toHaveText('JohnDoe');
    await expect(articleDetailPage.topic).toHaveText('Thème 1');
  });

  test('accède directement au détail d’un article via son URL', async ({ articlesApi, articleDetailPage }) => {
    await articlesApi.mockArticle(articles[1]);
    await articlesApi.mockComments(2, []);

    await articleDetailPage.goto(2);

    await articleDetailPage.expectLoaded('Article 2');
    await expect(articleDetailPage.content).toHaveText('Contenu de l’article 2');
    await expect(articleDetailPage.author).toHaveText('JaneDoe');
    await expect(articleDetailPage.topic).toHaveText('Thème 2');
  });

  test('revient au fil d’articles au clic sur le lien retour', async ({
    articlesApi,
    articlesPage,
    articleDetailPage,
  }) => {
    await articlesApi.mockArticles(articles);
    await articlesApi.mockArticle(articles[0]);
    await articlesApi.mockComments(1, []);

    await articlesPage.goto();
    await articlesPage.card('Article 1').click();
    await articleDetailPage.expectLoaded('Article 1');

    await articleDetailPage.backLink.click();

    await articlesPage.expectLoaded();
  });

  test('affiche les commentaires existants de l’article', async ({ articlesApi, articleDetailPage }) => {
    await articlesApi.mockArticle(articles[0]);
    await articlesApi.mockComments(1, [
      {
        id: 1,
        content: 'Super article !',
        createdAt: '2026-09-15T00:00:00.000Z',
        author: { id: 2, username: 'JaneDoe' },
      },
    ]);

    await articleDetailPage.goto(1);
    await articleDetailPage.expectLoaded('Article 1');

    await expect(articleDetailPage.comments).toHaveCount(1);
    await expect(articleDetailPage.comments.first()).toContainText('Super article !');
    await expect(articleDetailPage.comments.first()).toContainText('JaneDoe');
  });

  test('poste un nouveau commentaire et l’ajoute à la liste', async ({ page, articlesApi, articleDetailPage }) => {
    await articlesApi.mockArticle(articles[0]);
    await articlesApi.mockComments(1, []);
    await articlesApi.mockCreateComment(1, {
      status: 201,
      body: {
        id: 2,
        content: 'Merci pour cet article !',
        createdAt: '2026-09-16T00:00:00.000Z',
        author: { id: 1, username: 'JohnDoe' },
      },
    });

    await articleDetailPage.goto(1);
    await articleDetailPage.expectLoaded('Article 1');

    const request = page.waitForRequest('**/api/articles/1/comments');
    await articleDetailPage.submitComment('Merci pour cet article !');

    expect((await request).postDataJSON()).toEqual({ content: 'Merci pour cet article !' });
    await expect(articleDetailPage.comments).toHaveCount(1);
    await expect(articleDetailPage.comments.first()).toContainText('Merci pour cet article !');
    await expect(articleDetailPage.comments.first()).toContainText('JohnDoe');
    await expect(articleDetailPage.commentInput).toHaveValue('');
  });
});

test.describe('Création d’un article', () => {
  const topics = [
    { id: 1, name: 'Thème 1', description: 'Description du thème 1', subscribed: false },
    { id: 2, name: 'Thème 2', description: 'Description du thème 2', subscribed: true },
  ];

  test.beforeEach(async ({ authApi, articlesApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
    await articlesApi.mockTopics(topics);
  });

  test('navigue vers la page de création au clic sur le bouton "Créer un article"', async ({
    articlesApi,
    articlesPage,
    articleCreatePage,
  }) => {
    await articlesApi.mockArticles([]);
    await articlesPage.goto();

    await articlesPage.createButton.click();

    await articleCreatePage.expectLoaded();
  });

  test('revient au fil d’articles au clic sur le lien retour', async ({ articlesPage, articleCreatePage }) => {
    await articleCreatePage.goto();
    await articleCreatePage.expectLoaded();

    await articleCreatePage.backLink.click();

    await articlesPage.expectLoaded();
  });

  test('propose les thèmes renvoyés par l’API dans la liste déroulante', async ({ articleCreatePage }) => {
    await articleCreatePage.goto();

    const options = articleCreatePage.input('topic').locator('option');
    await expect(options.filter({ hasText: 'Thème 1' })).toHaveCount(1);
    await expect(options.filter({ hasText: 'Thème 2' })).toHaveCount(1);
  });

  test('garde le bouton désactivé tant qu’un champ est vide', async ({ articleCreatePage }) => {
    await articleCreatePage.goto();
    await expect(articleCreatePage.submitButton).toBeDisabled();

    await articleCreatePage.fill({ topic: 'Thème 1' });
    await expect(articleCreatePage.submitButton).toBeDisabled();

    await articleCreatePage.fill({ title: 'Mon article' });
    await expect(articleCreatePage.submitButton).toBeDisabled();

    await articleCreatePage.fill({ content: 'Le contenu de mon article' });
    await expect(articleCreatePage.submitButton).toBeEnabled();
  });

  test('crée l’article et redirige vers son détail au clic sur "Créer"', async ({
    articlesApi,
    articleCreatePage,
    articleDetailPage,
    page,
  }) => {
    const created = {
      id: 42,
      title: 'Mon article',
      content: 'Le contenu de mon article',
      createdAt: '2026-09-15T00:00:00.000Z',
      topic: { id: 1, name: 'Thème 1' },
      author: { id: 1, username: 'JohnDoe' },
    };
    await articlesApi.mockCreateArticle({ status: 201, body: created });
    await articlesApi.mockArticle(created);
    await articlesApi.mockComments(created.id, []);

    await articleCreatePage.goto();
    await articleCreatePage.fill({
      topic: 'Thème 1',
      title: 'Mon article',
      content: 'Le contenu de mon article',
    });

    const request = page.waitForRequest('**/api/articles');
    await articleCreatePage.submitButton.click();

    expect((await request).postDataJSON()).toEqual({
      topic_id: 1,
      title: 'Mon article',
      content: 'Le contenu de mon article',
    });
    await articleDetailPage.expectLoaded('Mon article');
  });

  test('affiche un message d’erreur en cas d’échec et reste sur la page', async ({
    articlesApi,
    articleCreatePage,
  }) => {
    await articlesApi.mockCreateArticle({
      status: 500,
      body: { type: 'about:blank', title: 'Internal Server Error', status: 500 },
    });

    await articleCreatePage.goto();
    await articleCreatePage.fill({
      topic: 'Thème 1',
      title: 'Mon article',
      content: 'Le contenu de mon article',
    });
    await articleCreatePage.submitButton.click();

    await expect(articleCreatePage.pageError).toBeVisible();
    await articleCreatePage.expectLoaded();
  });
});
