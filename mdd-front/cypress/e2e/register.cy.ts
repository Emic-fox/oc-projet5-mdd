const API = 'http://localhost:8080/api/auth';

describe('Inscription', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  const fillForm = (username: string, email: string, password: string) => {
    cy.getByTestId('username').getByTestId('input').clear().type(username).blur();
    cy.getByTestId('email').getByTestId('input').clear().type(email).blur();
    cy.getByTestId('password').getByTestId('input').clear().type(password).blur();
  };

  it('garde le bouton désactivé tant que le formulaire est invalide', () => {
    cy.getByTestId('register-submit').find('button').should('be.disabled');

    fillForm('JohnDoe', 'john.doe@example.com', 'Password1!');
    cy.getByTestId('register-submit').find('button').should('be.enabled');
  });

  it('affiche les erreurs de validation du mot de passe et de l’e-mail', () => {
    cy.getByTestId('email').getByTestId('input').type('pas-un-email').blur();
    cy.getByTestId('email').getByTestId('error-messages').should('contain', "L'adresse e-mail doit être valide");

    cy.getByTestId('password').getByTestId('input').type('short').blur();
    cy.getByTestId('password').getByTestId('error-messages').should('contain', 'Le mot de passe doit contenir au moins 8 caractères');

    cy.getByTestId('password').getByTestId('input').clear().type('password1').blur();
    cy.getByTestId('password').getByTestId('error-messages')
      .should('contain', 'Le mot de passe doit contenir au moins 1 majuscule')
      .and('contain', 'Le mot de passe doit contenir au moins 1 caractère spécial');
  });

  it('inscrit l’utilisateur et le connecte en cas de succès', () => {
    cy.intercept('POST', `${API}/register`, {
      statusCode: 201,
      body: { token: 'fake-jwt-token' },
    }).as('register');
    cy.stubMe({ username: 'JohnDoe' });

    fillForm('JohnDoe', 'john.doe@example.com', 'Password1!');
    cy.getByTestId('register-submit').click();

    cy.wait('@register').its('request.body').should('deep.equal', {
      username: 'JohnDoe',
      email: 'john.doe@example.com',
      password: 'Password1!',
    });
    cy.location('pathname').should('eq', '/');
    cy.getByTestId('welcome').should('contain', 'Bienvenue JohnDoe');
    cy.window().its('localStorage.token').should('eq', 'fake-jwt-token');
  });

  it('affiche un message d’erreur si l’e-mail est déjà utilisé', () => {
    cy.intercept('POST', `${API}/register`, {
      statusCode: 409,
      body: {
        type: 'about:blank',
        title: 'Conflict',
        status: 409,
        detail: 'Cet e-mail est déjà utilisé.',
      },
    }).as('register');

    fillForm('JohnDoe', 'john.doe@example.com', 'Password1!');
    cy.getByTestId('register-submit').click();

    cy.wait('@register');
    cy.getByTestId('error-messages').should('contain', 'Cet e-mail est déjà utilisé.');
    cy.location('pathname').should('eq', '/register');
  });
});

export {};
