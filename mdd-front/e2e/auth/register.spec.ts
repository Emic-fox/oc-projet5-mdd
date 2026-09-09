import { expect, test } from './auth.fixtures';

test.describe('Inscription', () => {
  test('garde le bouton désactivé tant que le formulaire est invalide', async ({ registerPage }) => {
    await expect(registerPage.submitButton).toBeDisabled();

    await registerPage.fill('JohnDoe', 'john.doe@example.com', 'Password1!');
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('affiche les erreurs de validation du mot de passe et de l’e-mail', async ({ registerPage }) => {
    await registerPage.fillField('email', 'pas-un-email');
    await expect(registerPage.fieldErrors('email')).toContainText("L'adresse e-mail doit être valide");

    await registerPage.fillField('password', 'short');
    await expect(registerPage.fieldErrors('password')).toContainText(
      'Le mot de passe doit contenir au moins 8 caractères',
    );

    await registerPage.fillField('password', 'password1');
    await expect(registerPage.fieldErrors('password')).toContainText(
      'Le mot de passe doit contenir au moins 1 majuscule',
    );
    await expect(registerPage.fieldErrors('password')).toContainText(
      'Le mot de passe doit contenir au moins 1 caractère spécial',
    );
  });

  test('inscrit l’utilisateur et le connecte en cas de succès', async ({ registerPage, authApi, page }) => {
    await authApi.mockRegister({ status: 201, body: { token: 'fake-jwt-token' } });
    await authApi.mockMe({ username: 'JohnDoe' });

    await registerPage.fill('JohnDoe', 'john.doe@example.com', 'Password1!');

    const request = page.waitForRequest('**/api/auth/register');
    await registerPage.submit.click();

    expect((await request).postDataJSON()).toEqual({
      username: 'JohnDoe',
      email: 'john.doe@example.com',
      password: 'Password1!',
    });
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('welcome')).toContainText('Bienvenue JohnDoe');
    expect(await registerPage.token()).toBe('fake-jwt-token');
  });

  test('affiche un message d’erreur si l’e-mail est déjà utilisé', async ({ registerPage, authApi, page }) => {
    await authApi.mockRegister({
      status: 409,
      body: {
        type: 'about:blank',
        title: 'Conflict',
        status: 409,
        detail: 'Cet e-mail est déjà utilisé.',
      },
    });

    await registerPage.fill('JohnDoe', 'john.doe@example.com', 'Password1!');
    await registerPage.submit.click();

    await expect(registerPage.pageError).toContainText('Cet e-mail est déjà utilisé.');
    await expect(page).toHaveURL('/register');
  });
});
