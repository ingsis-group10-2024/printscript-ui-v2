import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
     cy.loginToAuth0(
         AUTH0_USERNAME,
         AUTH0_PASSWORD
     )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")
    cy.intercept('POST', BACKEND_URL+"/manager/snippet", (req) => {
      req.reply((res) => {
        expect(res.body).to.have.property('message').and.to.be.a('string');
        expect(res.body.message).to.contain('Successfully created snippet:');
        expect(res.body).to.have.property('errors').and.to.be.null;
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click()
    cy.get('[data-testid="menu-option-PrintScript"]').click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`const snippet: string = "some snippet"; \n println(snippet);`);
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', BACKEND_URL+"/manager/snippet/upload", (req) => {
      req.reply((res) => {
        expect(res.body).to.have.property('message').and.to.be.a('string');
        expect(res.body.message).to.contain('Successfully created snippet:');
        expect(res.body).to.have.property('errors').and.to.be.null;
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="upload-file-input"]').selectFile("cypress/fixtures/trololo.ps", {force: true})

    cy.get('[data-testid="SaveIcon"]', { timeout: 10000 }).should('be.visible').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })
})
