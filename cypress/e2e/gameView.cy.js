describe('Game View - Pruebas e2e', () => {
  beforeEach(() => {
    // 1. Intenta arrancar en /game pero redirige a home xq no hay authToken
    cy.visit('/game')

  

    cy.get('input#username').type('AshKetchum')              // 2. Ingresa nombre 

    // 3. Selecciona primera region 
    cy.get('.button-group button').first().click()


    cy.get('.button-group button').contains('Facil').click()                 // 4. Selecciona dificultad

    // 5. Esperar a que aparezca el botón de comenzar por el token devuelto
    cy.get('.start-button', { timeout: 10_000 }).should('be.visible').click()

    
    cy.url().should('include', '/game')                  // 6. Confirmar que ahora si se encuentra en /game

    // 7. Esperar a que el tablero de cartas se renderice y tenga las 12  de facil 
    cy.get('.card', { timeout: 10_000 }).should('have.length', 12)
  })

  it('Carga correctamente el tablero de juego con 12 cartas', () => {
    cy.get('.card').should('have.length', 12)
  })

  it('Muestra el panel de información con nombre, región y dificultad', () => {
    cy.get('h2.title').should('contain.text', 'Jugador: AshKetchum')
    cy.get('h3.subtitle').should('contain.text', 'Región: Kanto').and('contain.text', 'Dificultad: Facil')
  })

  it('Permite hacer clic en una carta y la marca como “revealed”', () => { 
    // Dar clic en la primera carta (div.card) y comprobar que adquiere la clase .revealed
    cy.get('.card').first().click()
    cy.get('.card').first().should('have.class', 'revealed')
  })
})