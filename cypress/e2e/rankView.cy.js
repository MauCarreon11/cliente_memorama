/// <reference types="cypress" />

// Utilidad para formatear el tiempo en mm:ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

describe('Rank View - Pruebas e2e', () => {           //Este arreglo es el que mapeara con .map en la 58
  const leaderboardData = {
    Facil: {
      Kanto: [
        {
          name: 'Ash',
          score: 15,
          time: 60,

        },
        {
          name: 'Mau',
          score: 15,
          time: 85,

        },
        {
          name: 'Jassong',
          score: 16,
          time: 90,

        },
      ],
    },
  }

  beforeEach(() => {
                                    // Precargar localStorage 
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('leaderboard', JSON.stringify(leaderboardData))
      },
    })

    // Navegar directamente a la vista de ranking
    cy.visit('/leaderboard')

    // Confirmar que el título esté visible
    cy.get('h2.leaderboard-title').should('contain.text', 'Tabla de Posiciones')
  })

  it('Carga correctamente la tabla en la vista de ranking', () => {
    cy.get('table').should('exist')
    cy.get('thead th').should('have.length', 4) // Posición, Jugador, Puntaje, Tiempo
  })

  it('Muestra correctamente todos los jugadores cargados', () => {
    const expectedPlayers = [                                                       //Se crea constante con el mapeado de los jugadores
      ...leaderboardData.Facil.Kanto.map(p => ({ ...p})) //Creoq es la el avance de posición para que sean todas las filas 

    ]

    cy.get('tbody tr').should('have.length', expectedPlayers.length)

    expectedPlayers.forEach((player, index) => {
      cy.get('tbody tr').eq(index).within(() => {

        cy.get('td').eq(1).should('contain.text', player.name)
        cy.get('td').eq(2).should('contain.text', player.score.toString())
        cy.get('td').eq(3).should('contain.text', formatTime(player.time))  //Para que las horas coincidan en numeros
      })
    })
  })

  it('El boton “Volver a jugar” navega correctamente a /game)', () => {
    cy.get('button').contains('Volver a jugar').should('be.visible').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('El boton “Volver al inicio” funciona y navega correctamente.)', () => {
    cy.get('button').contains('Volver al inicio').should('be.visible').click()
    cy.url().should('include', '/')
  })
})