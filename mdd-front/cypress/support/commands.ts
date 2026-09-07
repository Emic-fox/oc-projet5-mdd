/// <reference types="cypress" />

const API = 'http://localhost:8080/api';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Sélectionne un élément par son attribut data-testid.
       * Chaîné sur un sujet, restreint la recherche à ses descendants
       * (ex. `cy.getByTestId('login').getByTestId('input')`).
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      /** Charge l'app avec un token déjà présent dans le localStorage. */
      visitWithToken(url: string, token?: string): Chainable<void>;
      /** Stubbe GET /api/auth/me avec l'utilisateur donné. */
      stubMe(user?: Partial<{ id: number; username: string; email: string }>, statusCode?: number): Chainable<null>;
    }
  }
}

Cypress.Commands.add(
  'getByTestId',
  { prevSubject: ['optional'] },
  ((subject: JQuery<HTMLElement> | undefined, testId: string) => {
    const selector = `[data-testid="${testId}"]`;
    return subject ? cy.wrap(subject).find(selector) : cy.get(selector);
  }) as Cypress.CommandFnWithSubject<'getByTestId', unknown>,
);

Cypress.Commands.add('visitWithToken', (url: string, token = 'fake-jwt-token') => {
  cy.visit(url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', token);
    },
  });
});

Cypress.Commands.add('stubMe', (user = {}, statusCode = 200) => {
  const body =
    statusCode === 200
      ? { id: 1, username: 'JohnDoe', email: 'john.doe@example.com', ...user }
      : { type: 'about:blank', title: 'Unauthorized', status: statusCode, detail: 'Token invalide' };
  return cy.intercept('GET', `${API}/auth/me`, { statusCode, body }).as('me');
});

export {};
