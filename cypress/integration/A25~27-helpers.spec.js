/// <reference types="cypress" />

describe('Helpers...', () => {

    it('Wrap', () => {
        // WRAP: encapsula um objeto comum para que possa ser usado pela API do Cypress

        const obj = { nome: 'User', idade: 20 }
        expect(obj).to.have.property('nome')
        //obj.should('have.property', 'nome') // Erro, pois quem tem o should é a API do Cypress
        cy.wrap(obj).should('have.property', 'nome')
        
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.get('#formNome').then($el => {
            //$el.val('funciona via jquery') // Via JQuery
            cy.wrap($el).type('funciona via Cypress')
        })
    })

    it('Wrap 2', () => {
        const obj = { nome: 'User', idade: 20 }
        expect(obj).to.have.property('nome')
        cy.wrap(obj).should('have.property', 'nome')
        
        cy.visit('https://wcaquino.me/cypress/componentes.html')

        const promise = new Promise( (resolve, reject) => {
            setTimeout( () => {
                resolve(10)
            }, 500) // 500ms de Timeout
        })
        
        cy.get('#buttonSimple').then(() => console.log('Encontrei o primeiro botão'))
        
        //promise.then(num => console.log(num)) // Imprime o resultado da Promise
        cy.wrap(promise).then(ret => console.log(ret))

        cy.get('#buttonList').then(() => console.log('Encontrei o segundo botão'))
    })

    it('Wrap 3', () => {
        cy.wrap(1).then(num => { // THEN considera o "return"
            return 2
        }).should('be.equal', 2)

        //cy.wrap(1).should(num => { // SHOULD ignora o "return"
        //    return 2
        //}).should('be.equal', 2) // Vai dar Erro!
    })

    it('Its...', () => {
        // ITs: pega uma propriedade do Objeto

        const obj = { nome: 'User', idade: 20 }
        cy.wrap(obj).should('have.property', 'nome', 'User')
        cy.wrap(obj).its('nome').should('be.equal', 'User')

        const obj2 = { nome: 'User', idade: 20, endereço: {rua: 'ABC'} }
        cy.wrap(obj2).its('endereço').should('have.property', 'rua')
        cy.wrap(obj2).its('endereço').its('rua').should('contain', 'ABC')
        cy.wrap(obj2).its('endereço.rua').should('contain', 'ABC')

        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.title().its('length').should('be.equal', 20) // Tamanho do título
    })

    it.only('Invoke...', () => {
        // INVOKE: trabalha com as Funções

        const getValue = () => 1;
        const soma = (a, b) => a + b;

        cy.wrap( {fn: getValue} ).invoke('fn').should('be.equal', 1)
        cy.wrap( {fn: soma} ).invoke('fn', 2, 5).should('be.equal', 7)

        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.get('#formNome').invoke('val', 'Texto via Invoke')
        cy.window().invoke('alert', 'Dá pra ver?')

        cy.get('#resultado')
            .invoke('html', '<input type="button", value="Teste"/>')
            // Embutir um HTML dentro dessa div "resultado"
    })

})
