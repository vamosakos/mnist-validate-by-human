describe('CAPTCHA and iframe test', () => {
    it('checks if the CAPTCHA contains an iframe', () => {
      cy.visit('http://127.0.0.1:8000/mnist-human-validation-test')
  
      cy.get('iframe').should('be.visible')
  
      cy.get('iframe').should('exist')
    })
  })
  