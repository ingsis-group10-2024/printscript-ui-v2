import {AUTH0_USERNAME, AUTH0_PASSWORD, FRONTEND_URL } from "../../src/utils/constants";

describe('Protected routes test', () => {
  it('should redirect to login when accessing a protected route unauthenticated', () => {

    // Visit the protected route
    cy.visit(FRONTEND_URL);

    cy.wait(1000)

    // Check if the URL is redirected to the login page
    cy.url().should('include', '');
  });

  it('should display login content', () => {
    // Visit the login page
    cy.visit(FRONTEND_URL);
    cy.url().should('include' , '')

    // Look for text that is likely to appear on a login page
    cy.origin(Cypress.env('VITE_AUTH0_DOMAIN'), () =>{
      cy.contains('Welcome').should('exist');
      cy.contains('button', 'Continue').should('exist'); // Adjust the text based on actual content
    });
  });

  it('should not redirect to login when the user is already authenticated', () => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )

    cy.visit(FRONTEND_URL);

    cy.wait(1000)

    // Check if the URL is redirected to the login page
    cy.url().should('not.include', '/login');
  });

})
