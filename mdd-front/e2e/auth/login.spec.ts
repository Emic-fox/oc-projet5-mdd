import { expect, test } from './auth.fixtures';

test.describe('Connexion', () => {
  test('garde le bouton désactivé tant qu’un champ est vide', async ({ loginPage }) => {
    await expect(loginPage.submitButton).toBeDisabled();

    await loginPage.fillField('login', 'JohnDoe');
    await expect(loginPage.submitButton).toBeDisabled();

    await loginPage.fillField('password', 'Password1!');
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('affiche les messages de validation quand les champs obligatoires sont vides', async ({ loginPage }) => {
    await expect(loginPage.fieldErrors('login')).toHaveCount(0);

    await loginPage.touchField('login');
    await loginPage.touchField('password');

    await expect(loginPage.fieldErrors('login')).toContainText("L'identifiant est obligatoire");
    await expect(loginPage.fieldErrors('password')).toContainText('Le mot de passe est obligatoire');
  });

  test('efface le message de validation une fois le champ renseigné', async ({ loginPage }) => {
    await loginPage.touchField('login');
    await expect(loginPage.fieldErrors('login')).toBeVisible();

    await loginPage.fillField('login', 'JohnDoe');
    await expect(loginPage.fieldErrors('login')).toHaveCount(0);
  });

  test('connecte l’utilisateur en cas de succès', async ({ loginPage, authApi, page }) => {
    await authApi.mockLogin({ status: 200, body: { token: 'fake-jwt-token' } });
    await authApi.mockMe({ username: 'JohnDoe' });

    await loginPage.fill('JohnDoe', 'Password1!');

    const request = page.waitForRequest('**/api/auth/login');
    await loginPage.submit.click();

    expect((await request).postDataJSON()).toEqual({
      login: 'JohnDoe',
      password: 'Password1!',
    });
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('welcome')).toContainText('Bienvenue JohnDoe');
    expect(await loginPage.token()).toBe('fake-jwt-token');
  });

  test('affiche un message dédié sur identifiants invalides (401)', async ({ loginPage, authApi, page }) => {
    await authApi.mockLogin({
      status: 401,
      body: { type: 'about:blank', title: 'Unauthorized', status: 401 },
    });

    await loginPage.fill('JohnDoe', 'mauvais-mot-de-passe');
    await loginPage.submit.click();

    await expect(loginPage.pageError).toContainText('Identifiant ou mot de passe incorrect.');
    await expect(page).toHaveURL('/login');
    expect(await loginPage.token()).toBeNull();
  });

  test('affiche un message générique en cas d’erreur serveur', async ({ loginPage, authApi, page }) => {
    await authApi.mockLogin({ status: 500, body: {} });

    await loginPage.fill('JohnDoe', 'Password1!');
    await loginPage.submit.click();

    await expect(loginPage.pageError).toBeVisible();
    await expect(loginPage.pageError).not.toBeEmpty();
    await expect(page).toHaveURL('/login');
  });
});
