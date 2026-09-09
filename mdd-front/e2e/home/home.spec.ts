import { expect, test } from './home.fixtures';
import { HomePage } from './home.page';

test.describe("Page d'accueil et navigation", () => {
    test('affiche les accès connexion / inscription pour un visiteur', async ({ homePage }) => {
        await homePage.expectLoaded();
        await homePage.expectUnauth();
    });

    test('navigue vers la page de connexion', async ({ page, homePage }) => {
        await homePage.navLogin.click();
        await expect(page).toHaveURL('/login');
    });

    test("navigue vers la page d'inscription", async ({ page, homePage }) => {
        await homePage.navRegister.click();
        await expect(page).toHaveURL('/register');
    });

    test("redirige une URL inconnue vers l'accueil", async ({ page }) => {
        await page.goto('/une-page-qui-nexiste-pas');

        const homePage = new HomePage(page);
        await homePage.expectLoaded();
    });

    test('le lien retour du layout public ramène à l’accueil', async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('back-link').click();

        const homePage = new HomePage(page);
        await homePage.expectLoaded();
    });
});
