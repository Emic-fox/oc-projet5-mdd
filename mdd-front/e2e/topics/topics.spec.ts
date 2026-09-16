import { expect, test } from './topics.fixtures';

const topics = [
  { id: 1, name: 'Thème 1', description: 'Description du thème 1', subscribed: false },
  { id: 2, name: 'Thème 2', description: 'Description du thème 2', subscribed: true },
];

test.describe('Liste des thèmes', () => {
  test.beforeEach(async ({ authApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
  });

  test('affiche les thèmes renvoyés par l’API', async ({ topicsApi, topicsPage }) => {
    await topicsApi.mockTopics(topics);

    await topicsPage.goto();

    await topicsPage.expectLoaded();
    await expect(topicsPage.cards).toHaveCount(2);
    await expect(topicsPage.card('Thème 1')).toContainText('Description du thème 1');
    await expect(topicsPage.card('Thème 2')).toContainText('Description du thème 2');
  });

  test('affiche une liste vide quand il n’y a pas de thèmes', async ({
    topicsApi,
    topicsPage,
  }) => {
    await topicsApi.mockTopics([]);

    await topicsPage.goto();

    await topicsPage.expectLoaded();
    await expect(topicsPage.cards).toHaveCount(0);
  });

  test('propose "S’abonner" pour un thème non abonné et "Déjà abonné" (désactivé) sinon', async ({
    topicsApi,
    topicsPage,
  }) => {
    await topicsApi.mockTopics(topics);

    await topicsPage.goto();

    await expect(topicsPage.subscribeButton('Thème 1')).toHaveText("S'abonner");
    await expect(topicsPage.subscribeButton('Thème 1')).toBeEnabled();

    await expect(topicsPage.subscribeButton('Thème 2')).toHaveText('Déjà abonné');
    await expect(topicsPage.subscribeButton('Thème 2')).toBeDisabled();
  });

  test('abonne l’utilisateur à un thème et désactive le bouton', async ({ page, topicsApi, topicsPage }) => {
    await topicsApi.mockTopics(topics);
    await topicsApi.mockSubscribe(1);

    await topicsPage.goto();

    const request = page.waitForRequest('**/api/topics/1/subscription');
    await topicsPage.subscribeButton('Thème 1').click();
    expect((await request).method()).toBe('POST');

    await expect(topicsPage.subscribeButton('Thème 1')).toHaveText('Déjà abonné');
    await expect(topicsPage.subscribeButton('Thème 1')).toBeDisabled();
  });

  test('n’altère pas les autres thèmes lors d’un abonnement', async ({ topicsApi, topicsPage }) => {
    await topicsApi.mockTopics(topics);
    await topicsApi.mockSubscribe(1);

    await topicsPage.goto();
    await topicsPage.subscribeButton('Thème 1').click();

    await expect(topicsPage.subscribeButton('Thème 2')).toHaveText('Déjà abonné');
    await expect(topicsPage.subscribeButton('Thème 2')).toBeDisabled();
  });

  test('le lien de navigation "Thèmes" est actif sur cette page', async ({ page, topicsApi, topicsPage }) => {
    await topicsApi.mockTopics(topics);

    await topicsPage.goto();

    await expect(page.getByTestId('nav-topics')).toHaveClass(/text-primary/);
  });
});

test.describe('Notifications', () => {
  test.beforeEach(async ({ authApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
  });

  test('affiche un toast d’erreur quand l’abonnement échoue', async ({ topicsApi, topicsPage }) => {
    await topicsApi.mockTopics(topics);
    await topicsApi.mockSubscribe(1, { status: 500 });

    await topicsPage.goto();
    await topicsPage.subscribeButton('Thème 1').click();

    await expect(topicsPage.toast).toBeVisible();
    await expect(topicsPage.toast).toContainText('Une erreur est survenue. Veuillez réessayer.');
  });

  test('ferme le toast au clic sur le bouton de fermeture', async ({ topicsApi, topicsPage }) => {
    await topicsApi.mockTopics(topics);
    await topicsApi.mockSubscribe(1, { status: 500 });

    await topicsPage.goto();
    await topicsPage.subscribeButton('Thème 1').click();
    await expect(topicsPage.toast).toBeVisible();

    await topicsPage.toastCloseButton().click();

    await expect(topicsPage.toast).not.toBeVisible();
  });
});

test.describe('Menu mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ authApi, topicsApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe' });
    await topicsApi.mockTopics(topics);
  });

  test('est masqué par défaut', async ({ topicsPage }) => {
    await topicsPage.goto();

    await expect(topicsPage.mobileMenu).not.toBeVisible();
  });

  test('s’ouvre au clic sur le bouton hamburger', async ({ topicsPage }) => {
    await topicsPage.goto();

    await topicsPage.menuToggle.click();

    await expect(topicsPage.mobileMenu).toBeVisible();
    await expect(topicsPage.menuToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(topicsPage.mobileMenu.getByTestId('nav-topics')).toBeVisible();
    await expect(topicsPage.mobileMenu.getByTestId('nav-articles')).toBeVisible();
    await expect(topicsPage.mobileMenu.getByTestId('logout')).toBeVisible();
  });

  test('se ferme au clic sur le fond', async ({ topicsPage }) => {
    await topicsPage.goto();
    await topicsPage.menuToggle.click();
    await expect(topicsPage.mobileMenu).toBeVisible();

    // Le fond couvre tout l'écran mais le panneau du menu (à droite) le recouvre visuellement :
    // on clique donc sur une zone du fond restée découverte, à gauche du panneau.
    await topicsPage.menuBackdrop.click({ position: { x: 10, y: 10 } });

    await expect(topicsPage.mobileMenu).not.toBeVisible();
  });

  test('se ferme au clic sur un lien du menu', async ({ page, topicsPage }) => {
    await topicsPage.goto();
    await topicsPage.menuToggle.click();

    await topicsPage.mobileMenu.getByTestId('nav-topics').click();

    await expect(topicsPage.mobileMenu).not.toBeVisible();
    await expect(page).toHaveURL('/topics');
  });

  test('se ferme et déconnecte l’utilisateur au clic sur "Se déconnecter"', async ({ page, topicsPage }) => {
    await topicsPage.goto();
    await topicsPage.menuToggle.click();

    await topicsPage.mobileMenu.getByTestId('logout').click();

    await expect(topicsPage.mobileMenu).not.toBeVisible();
    await expect(page).toHaveURL('/');
    expect(await page.evaluate(() => window.localStorage.getItem('token'))).toBeNull();
  });
});
