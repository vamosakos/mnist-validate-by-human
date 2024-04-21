describe('Charts & Graphs Test', () => {
    it('should interact with the Charts & Graphs page and with different chart views also perform sorting and searching', () => {
        // Bejelentkezés
        cy.visit('http://127.0.0.1:8000/login');
        cy.get('#email').type('test1@test.com');
        cy.get('#password').type('12345678');
        cy.contains('button', 'Log in').click();
        
        // 'Graphs & Charts' oldalra navigálás
        cy.get('a[href="http://127.0.0.1:8000/statistics/responses-charts"]').should('be.visible').click();
        cy.wait(2000);

        // 'Sort' gombra kattintás kétszer a csökkenő és növekvő sorrend ellenőrzéséhez
        cy.get('button').contains('Sort').should('be.visible').click();
        cy.wait(2000);
        cy.get('button').contains('Sort').should('be.visible').click();
        cy.wait(2000);
    
        
        // 'Display Option' legördülő menüből 'Average Response Time by Image' oszlopdiagram nézet kiválasztása
        cy.get('#displayOption').select('Average Response Time by Image');
    
        // 'Search' mezőbe '70000' beírása és 'Show Image' gombra kattintás
        cy.get('#searchInput').type('70000');
        cy.contains('button', 'Show Image').click();
    
        // Hibaüzenet ellenőrzése
        cy.contains('Please enter a valid image ID (maximum value is 69.999)').should('be.visible');
        cy.wait(2000);
    
        // 'Search' mezőbe '100' beírása és 'Show Image' gombra kattintás
        cy.get('#searchInput').clear().type('100');
        cy.contains('button', 'Show Image').click();
        cy.wait(2000);

        // 'Image ID: 100' és 'Correct Label:' szövegek ellenőrzése, amely azt jelzi, hogy a kép megjelenítése sikeres volt
        cy.contains('Image ID: 100').should('be.visible');
        cy.contains('Correct Label:').should('be.visible');
    
        // A képet megjelenítő Pop-up bezárása
        cy.contains('button', 'Close').click();

        // Átnavigálás az 'Image Frequencies' nézetre
        cy.get('.flex.items-center').contains('Responses').click();
        cy.get('a[href="http://127.0.0.1:8000/statistics/image-frequencies-charts"]').should('be.visible').click();
    });
  });
  