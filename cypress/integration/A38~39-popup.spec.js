/// <reference types="cypress" />

describe('Work with Popup', () => {

    // Obs: Cypress NÂO interage com Popup

    //Para simular um Popup
    it('Deve testar Popup diretamente', () => {
        cy.visit('https://wcaquino.me/cypress/frame.html')

        cy.get('#otherButton').click() // Botão "Elemento Externo

        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Click OK!')
        })
    })

    it('Deve verificar se o Popup foi invocado', () => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        
        cy.window().then(win => {
            cy.stub(win, 'open').as('winOpen')
        })
        cy.get('#buttonPopUp').click() // Botão "Abir Popup"
        cy.get('@winOpen').should('be.called')
    })

    describe.only('With Links...', () => {
        beforeEach(() => {
            cy.visit('https://wcaquino.me/cypress/componentes.html')
        })

        it('Check Popup URL', () => {
            cy.contains('Popup2')
                .should('have.prop', 'href')
                .and('equal', 'https://wcaquino.me/cypress/frame.html')
        })

        it('Should access Popup dinamically', () => {
            cy.contains('Popup2').then($a => {
                const href = $a.prop('href')
                cy.visit(href)
                cy.get('#tfield').type('funciona')
            })
        })

        it('Should force link on same page', () => {
            cy.contains('Popup2')
                .invoke('removeAttr', 'target') // Remove atributo "target", p/ poder abrir na mesma pág.
                .click()
            cy.get('#tfield').type('funciona')
        })
    })

})