import { expect, test } from './profile.fixtures';

test.describe('Profil', () => {
  test.beforeEach(async ({ authApi, topicsApi }) => {
    await authApi.seedToken();
    await authApi.mockMe({ username: 'JohnDoe', email: 'john.doe@example.com' });
    await topicsApi.mockTopics([]);
  });

  test('pré-remplit le formulaire avec les informations actuelles de l’utilisateur', async ({ profilePage }) => {
    await profilePage.goto();

    await profilePage.expectLoaded();
    await expect(profilePage.input('username')).toHaveValue('JohnDoe');
    await expect(profilePage.input('email')).toHaveValue('john.doe@example.com');
    await expect(profilePage.input('password')).toHaveValue('');
  });

  test('met à jour le nom d’utilisateur et l’e-mail, puis rafraîchit l’utilisateur courant', async ({
    page,
    profilePage,
    profileApi,
  }) => {
    await profilePage.goto();
    await profilePage.fillField('username', 'JaneDoe');
    await profilePage.fillField('email', 'jane.doe@example.com');

    await profileApi.mockUpdateProfile({
      status: 200,
      body: { user: { id: 1, username: 'JaneDoe', email: 'jane.doe@example.com' }, token: 'refreshed-jwt-token' },
    });

    const request = page.waitForRequest('**/api/auth/me');
    await profilePage.submit.click();

    const updateRequest = await request;
    expect(updateRequest.method()).toBe('PUT');
    expect(updateRequest.postDataJSON()).toEqual({ username: 'JaneDoe', email: 'jane.doe@example.com' });

    await expect(profilePage.input('username')).toHaveValue('JaneDoe');
    await expect(profilePage.input('email')).toHaveValue('jane.doe@example.com');
    expect(await profilePage.token()).toBe('refreshed-jwt-token');
  });

  test('met à jour le mot de passe sans toucher au nom d’utilisateur ni à l’e-mail', async ({
    page,
    profilePage,
    profileApi,
  }) => {
    await profileApi.mockUpdatePassword({ status: 200 });

    await profilePage.goto();
    await profilePage.fillField('password', 'NewPassword1!');

    const request = page.waitForRequest('**/api/auth/me/password');
    await profilePage.submit.click();

    const passwordRequest = await request;
    expect(passwordRequest.method()).toBe('PUT');
    expect(passwordRequest.postDataJSON()).toEqual({ newPassword: 'NewPassword1!' });
  });

  test('ne fait aucun appel réseau si rien n’a été modifié', async ({ page, profilePage }) => {
    let updateCalled = false;
    let passwordCalled = false;
    await page.route('**/api/auth/me', (route) => {
      if (route.request().method() === 'PUT') updateCalled = true;
      return route.fallback();
    });
    await page.route('**/api/auth/me/password', (route) => {
      passwordCalled = true;
      return route.fallback();
    });

    await profilePage.goto();
    await profilePage.expectLoaded();
    await expect(profilePage.submitButton).toBeEnabled();

    await profilePage.submit.click();
    await page.waitForLoadState('networkidle');

    expect(updateCalled).toBe(false);
    expect(passwordCalled).toBe(false);
  });
});
