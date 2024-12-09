import {AUTH0_PASSWORD, AUTH0_USERNAME , FRONTEND_URL} from "../../src/utils/constants";


describe('Add snippet tests', () => {


  beforeEach(() => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )

    cy.visit(FRONTEND_URL)

    cy.wait(2000)
    cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(2)').click();
  })

  it('Can share a snippet ', () => {
    cy.get('[aria-label="Share"]').click();
    cy.get('#\\:rl\\:').click();
    cy.get('#\\:rl\\:-option-0').click();
    cy.get('.css-1yuhvjn > .MuiBox-root > .MuiButton-contained').click();
    cy.wait(2000)
  })


  it('Can run snippets', function() {
    cy.get('[data-testid="PlayArrowIcon"]').click();
    cy.get('.MuiBox-root pre').invoke('text').then((text) => {
      const lines = text.trim().split('\n'); // Divide el texto en líneas
      expect(lines.length).to.be.greaterThan(0); // Asegura que hay al menos una línea
    });
  });

  it('Can format snippets', function() {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function() {
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function() {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})
