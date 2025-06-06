describe('Home View - Pruebas e2e', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Carga correctamente la pagina principal', () => {
    cy.contains('¿Eres el mejor maestro Pokémon del mundo?')
    cy.contains('Instrucciones')
    cy.get('input#username').should('exist')
  })

  it('Permite escribir un nombre de usuario y muestra regiones', () => {
    cy.get('input#username').type('AshKetchum')
    cy.contains('Selecciona una Región:')
    cy.get('.button-group button').should('have.length.greaterThan', 0)     //*Verifica que aparecieron las regiones
  })

  it('Selecciona region, dificultad y permite comenzar el juego', () => {
    cy.get('input#username').type('AshKetchum') 
    cy.get('.button-group button').first().click()
    cy.contains('Selecciona Dificultad:')
    cy.get('.button-group button').contains('Facil').click()

    window.localStorage.setItem('auth', JSON.stringify({ authToken: 'test123' }))
    cy.window().then(win => win.location.reload())

    cy.get('input#username').type('AshKetchum')
    cy.get('.button-group button').first().click()
    cy.get('.button-group button').contains('Facil').click()
    cy.get('.start-button').should('be.visible')
  })

  it('Redirige al juego al iniciar', () => {
    cy.get('input#username').type('AshKetchum')
    cy.get('.button-group button').first().click()
    cy.get('.button-group button').contains('Facil').click()
    window.localStorage.setItem('auth', JSON.stringify({ authToken: 'test123' }))
    cy.window().then(win => win.location.reload())

    cy.get('input#username').type('AshKetchum')
    cy.get('.button-group button').first().click()
    cy.get('.button-group button').contains('Facil').click()
    cy.get('.start-button').click()
    cy.url().should('include', '/game')
  })
})
