describe('Page d’accueil et navigation', () => {
  it('affiche le logo et les accès connexion / inscription pour un visiteur', () => {
    cy.visit('/');

    cy.get('app-logo').should('be.visible');
    cy.getByTestId('nav-login').should('be.visible');
    cy.getByTestId('nav-register').should('be.visible');
    cy.getByTestId('welcome').should('not.exist');
  });

  it('navigue vers la page de connexion', () => {
    cy.visit('/');
    cy.getByTestId('nav-login').click();

    cy.location('pathname').should('eq', '/login');
    cy.title().should('eq', 'Se connecter | MDD');
    cy.get('app-login-form').should('be.visible');
  });

  it('navigue vers la page d’inscription', () => {
    cy.visit('/');
    cy.getByTestId('nav-register').click();

    cy.location('pathname').should('eq', '/register');
    cy.title().should('eq', 'Inscription | MDD');
    cy.get('app-register-form').should('be.visible');
  });

  it('redirige une URL inconnue vers l’accueil', () => {
    cy.visit('/une-page-qui-nexiste-pas');

    cy.location('pathname').should('eq', '/');
    cy.getByTestId('nav-login').should('be.visible');
  });

  it('le lien retour du layout public ramène à l’accueil', () => {
    cy.visit('/login');
    cy.getByTestId('back-link').click();

    cy.location('pathname').should('eq', '/');
  });
});

export {};
