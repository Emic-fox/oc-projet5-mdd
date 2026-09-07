const API = 'http://localhost:8080/api/auth';

describe('Session et déconnexion', () => {
  it('restaure la session depuis un token présent au chargement', () => {
    cy.stubMe({ username: 'JohnDoe' });
    cy.visitWithToken('/');

    cy.wait('@me').its('request.headers.authorization').should('eq', 'Bearer fake-jwt-token');
    cy.getByTestId('welcome').should('contain', 'Bienvenue JohnDoe');
    cy.getByTestId('logout').should('be.visible');
  });

  it('déconnecte l’utilisateur et nettoie le token', () => {
    cy.stubMe({ username: 'JohnDoe' });
    cy.visitWithToken('/');
    cy.wait('@me');

    cy.getByTestId('logout').click();

    cy.window().its('localStorage.token').should('not.exist');
    cy.getByTestId('nav-login').should('be.visible');
    cy.getByTestId('nav-register').should('be.visible');
    cy.getByTestId('welcome').should('not.exist');
  });

  it('nettoie la session si le token est rejeté par l’API (401 sur /me)', () => {
    cy.stubMe({}, 401);
    cy.visitWithToken('/');

    cy.wait('@me');
    cy.getByTestId('nav-login').should('be.visible');
    cy.window().its('localStorage.token').should('not.exist');
  });

  it('n’appelle pas /me sans token', () => {
    cy.intercept('GET', `${API}/me`, cy.spy().as('meSpy'));
    cy.visit('/');

    cy.getByTestId('nav-login').should('be.visible');
    cy.get('@meSpy').should('not.have.been.called');
  });
});

export {};
