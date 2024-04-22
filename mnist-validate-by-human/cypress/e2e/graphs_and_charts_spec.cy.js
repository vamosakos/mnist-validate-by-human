describe('Graphs & Charts Test', () => {
    it('should interact with the Graphs & Charts page and with different chart views also perform sorting and searching', () => {
        cy.visit('http://127.0.0.1:8000/login');
        cy.get('#email').type('test1@test.com');
        cy.get('#password').type('12345678');
        cy.contains('button', 'Log in').click();
        
        cy.get('a[href="http://127.0.0.1:8000/statistics/responses-charts"]').should('be.visible').click();
        cy.wait(2000);

        cy.get('button').contains('Sort').should('be.visible').click();
        cy.wait(2000);
        cy.get('button').contains('Sort').should('be.visible').click();
        cy.wait(2000);
    
        
        cy.get('#displayOption').select('Average Response Time by Image');
    
        cy.get('#searchInput').type('70000');
        cy.contains('button', 'Show Image').click();
    
        cy.contains('Please enter a valid image ID (maximum value is 69.999)').should('be.visible');
        cy.wait(2000);
    
        cy.get('#searchInput').clear().type('100');
        cy.contains('button', 'Show Image').click();
        cy.wait(2000);

        cy.contains('Image ID: 100').should('be.visible');
        cy.contains('Correct Label:').should('be.visible');
    
        cy.contains('button', 'Close').click();

        cy.get('.flex.items-center').contains('Responses').click();
        cy.get('a[href="http://127.0.0.1:8000/statistics/image-frequencies-charts"]').should('be.visible').click();
    });
  });
  