const API = 'http://localhost:8080/api/auth';

describe('Connexion', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  const fill = (login: string, password: string) => {
    cy.getByTestId('login').getByTestId('input').clear().type(login).blur();
    cy.getByTestId('password').getByTestId('input').clear().type(password).blur();
  };

  it('garde le bouton désactivé tant qu’un champ est vide', () => {
    cy.getByTestId('login-submit').find('button').should('be.disabled');

    cy.getByTestId('login').getByTestId('input').type('JohnDoe').blur();
    cy.getByTestId('login-submit').find('button').should('be.disabled');

    cy.getByTestId('password').getByTestId('input').type('Password1!').blur();
    cy.getByTestId('login-submit').find('button').should('be.enabled');
  });

  it('affiche les messages de validation quand les champs obligatoires sont vides', () => {
    cy.getByTestId('login').getByTestId('error-messages').should('not.exist');

    cy.getByTestId('login').getByTestId('input').focus().blur();
    cy.getByTestId('password').getByTestId('input').focus().blur();

    cy.getByTestId('login').getByTestId('error-messages').should('contain', "L'identifiant est obligatoire");
    cy.getByTestId('password').getByTestId('error-messages').should('contain', 'Le mot de passe est obligatoire');
  });

  it('efface le message de validation une fois le champ renseigné', () => {
    cy.getByTestId('login').getByTestId('input').focus().blur();
    cy.getByTestId('login').getByTestId('error-messages').should('be.visible');

    cy.getByTestId('login').getByTestId('input').type('JohnDoe').blur();
    cy.getByTestId('login').getByTestId('error-messages').should('not.exist');
  });

  it('connecte l’utilisateur en cas de succès', () => {
    cy.intercept('POST', `${API}/login`, {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('login');
    cy.stubMe({ username: 'JohnDoe' });

    fill('JohnDoe', 'Password1!');
    cy.getByTestId('login-submit').click();

    cy.wait('@login').its('request.body').should('deep.equal', {
      login: 'JohnDoe',
      password: 'Password1!',
    });
    cy.location('pathname').should('eq', '/');
    cy.getByTestId('welcome').should('contain', 'Bienvenue JohnDoe');
    cy.window().its('localStorage.token').should('eq', 'fake-jwt-token');
  });

  it('affiche un message dédié sur identifiants invalides (401)', () => {
    cy.intercept('POST', `${API}/login`, {
      statusCode: 401,
      body: { type: 'about:blank', title: 'Unauthorized', status: 401 },
    }).as('login');

    fill('JohnDoe', 'mauvais-mot-de-passe');
    cy.getByTestId('login-submit').click();

    cy.wait('@login');
    cy.getByTestId('error-messages').should('contain', 'Identifiant ou mot de passe incorrect.');
    cy.location('pathname').should('eq', '/login');
    cy.window().its('localStorage.token').should('not.exist');
  });

  it('affiche un message générique en cas d’erreur serveur', () => {
    cy.intercept('POST', `${API}/login`, { statusCode: 500, body: {} }).as('login');

    fill('JohnDoe', 'Password1!');
    cy.getByTestId('login-submit').click();

    cy.wait('@login');
    cy.getByTestId('error-messages').should('be.visible').and('not.be.empty');
    cy.location('pathname').should('eq', '/login');
  });
});

export {};
