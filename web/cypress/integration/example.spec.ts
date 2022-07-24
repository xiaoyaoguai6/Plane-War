// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('h1', 'You did it!');
  });

  it('navigates to the about page', () => {
    cy.visit('http://localhost:8080/about');
    cy.contains('h1', 'This is an about page');
  });
});
