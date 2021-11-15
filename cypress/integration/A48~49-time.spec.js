/// <reference types="cypress" />

describe('Working with Clocks', () => {

    beforeEach(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    it('Going Back to the Past', () => {
        //cy.get('#buttonNow').click()  // Botão "Hora Certa"
        //cy.get('#resultado > span').should('contain', '20/06/2021') // Data atual

        //cy.clock() // Reseta os milisegundos para 0, na data 01/01/1970 (Default)
        //cy.get('#buttonNow').click()
        //cy.get('#resultado > span').should('contain', '31/12/1969')

        const dt = new Date(2020, 3, 10, 15, 23, 50) // Seta data específica: 10/04/2020 15:23:50
        cy.clock(dt.getTime()) // Reseta para a data específica
        cy.get('#buttonNow').click()
        cy.get('#resultado > span').should('contain', '10/04/2020')
    })

    it('Goes to the Future', () => {
        cy.get('#buttonTimePassed').click() // Botão "Tempo Corrido"
        cy.get('#resultado > span').should('contain', '1624')    
        cy.get('#resultado > span').invoke('text').should('gt', 1624218092960) // Greater Than

        cy.clock() // Reseta os milisegundos para 0, na data 01/01/1970 (Default)
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > span').invoke('text').should('lte', 0) // Less Than or Equal

        cy.tick(5000) // Avançar 5000 milisegundos = 5s
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > span').invoke('text').should('gte', 5000) // Greater Than or Equal

        cy.tick(10000) // Avançar 10000 milisegundos = 10s
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > span').invoke('text').should('gte', 15000) // Greater Than or Equal
    })

})