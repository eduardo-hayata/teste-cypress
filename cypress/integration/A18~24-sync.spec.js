/// <reference types="cypress" />

describe('Esperas...', () => {

    before(() => { // Executa antes de todo o teste, apenas 1 vez
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => { // Executa antes de cada teste
        cy.reload() // Recarregar a Página
    })

    it('Deve aguardar elemento estar disponível', () => {
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()  // Botão "Resposta Demorada"
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo').should('exist')
        cy.get('#novoCampo').type('Funciona')
    })

    it('Deve fazer Retrys', () => {
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click() // Botão "Resposta Demorada"
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo')
            //.should('not.exist') // Se colocar aqui, vai dar erro!
            .should('exist')
            .type('Funciona')
    })

    it('Uso do Find', () => {
        cy.get('#buttonList').click() // Botão "Listar"

        cy.get('#lista li') // Vai até as Tags "lista" e "li"
            .find('span')   // Desce até a próx Tag
            .should('contain', 'Item 1')

        cy.get('#lista li span') // Vai até as Tags "lista", "li" e "span"
            .should('contain', 'Item 2')
    })

    it('Uso do Timeout', () => {
        cy.get('#buttonDelay').click() // Botão "Resposta Demorada"
        cy.get('#novoCampo').should('exist')
        //cy.get('#novoCampo', {timeout: 1000}).should('exist') // Timeout de 1s. Padrão do Cypress é 4s
        
        /* Para definir um Timeout padrão para TODOS os testes
           No arquivo "cypress.json", escrever o código:
           {
                "defaultCommandTimeout": 1000  // tempo de 1s
           }
        */
        
        cy.get('#buttonListDOM').click() // Botão "Listar DOM"
        //cy.wait(5000) // Espera fixa de 5s. EVITAR usar esse tipo de espera
        cy.get('#lista li span', {timeout: 30000}) // Timeout de até 30s
            .should('contain', 'Item 2')
        
        cy.get('#buttonListDOM').click()
        cy.get('#lista li span', {timeout: 30000})
            .should('have.length', '1') // Verifica se tem 1 elemento
            // Vai passar ao encontrar o 1 elemento, mesmo que depois venha a ter 2 elementos

        cy.get('#buttonListDOM').click()
        cy.get('#lista li span', {timeout: 30000})
            .should('have.length', '2') // Verifica se tem 2 elementos
            // Vai passar, se encontrar 2 elementos, OU falhar, se não encontrar e der timeout

        cy.get('#buttonListDOM').click()
        cy.get('#lista li span')
            .should('have.length', '1')
        cy.get('#lista li span')
            .should('have.length', '2')
    })

    it('Click Retry', () => {
        cy.get('#buttonCount')  // Botão "1", no canto superior
            .click()
            .should('have.value', '1')
    })
    
    it.only('Should vs Then', () => {
        cy.get('#buttonListDOM').click() // Botão "Listar DOM"
        
        // SHOULD: faz a busca, e já fica fazendo a verificação
        // Fica sendo executado (retrys) ao longo da espera
        //cy.get('#lista li span').should($element => {
        //    console.log($element)
        //    expect($element).to.have.length(1)
        //})

        // THEN: aguarda o get ser finalizado, para então ser executado
        cy.get('#lista li span').then($element => {
            console.log($element)
            expect($element).to.have.length(1)
        })
    })
    
})
