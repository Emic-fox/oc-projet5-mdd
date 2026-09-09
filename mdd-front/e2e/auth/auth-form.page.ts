import { type Locator, type Page } from '@playwright/test';

/**
 * Base commune aux pages d'authentification (connexion / inscription).
 */
export abstract class AuthFormPage {
  constructor(protected readonly page: Page) {}

  /** `<input>` d'un champ donné. */
  input(field: string): Locator {
    return this.page.getByTestId(field).getByTestId('input');
  }

  /** Liste des messages de validation d'un champ donné. */
  fieldErrors(field: string): Locator {
    return this.page.getByTestId(field).getByTestId('error-messages');
  }

  /** Message d'erreur au niveau de la page (retour API). */
  get pageError(): Locator {
    return this.page.getByTestId('api-error');
  }

  /** Renseigne un champ puis déclenche son `blur` (validation « touché »). */
  async fillField(field: string, value: string) {
    const input = this.input(field);
    await input.fill(value);
    await input.blur();
  }

  /** Focus puis blur sans saisie : marque le champ comme « touché ». */
  async touchField(field: string) {
    await this.input(field).focus();
    await this.input(field).blur();
  }

  /** Token présent dans le `localStorage` (ou `null`). */
  token(): Promise<string | null> {
    return this.page.evaluate(() => window.localStorage.getItem('token'));
  }
}
