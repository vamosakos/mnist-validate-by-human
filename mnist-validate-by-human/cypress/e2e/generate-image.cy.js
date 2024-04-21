describe('generate-image API test', () => {
  it('visits the generate-image API endpoint', () => {
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/generate-image',
      failOnStatusCode: false 
    }).then((response) => {

      expect(response.status).to.eq(401)

      expect(response.body).to.include({ error: 'Unauthorized' })
      
    })
  })
})
