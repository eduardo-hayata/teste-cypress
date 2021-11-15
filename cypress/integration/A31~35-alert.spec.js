/// <reference types="cypress" />

describe('Work with Alerts', () => {

    before(() => { // Executa antes de todo o teste, apenas 1 vez
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => { // Executa antes de cada teste
        cy.reload() // Recarregar a Página
    })

    it('Alert', () => {
        cy.get('#alert').click()  // Botão "Alert"
        
        // cy.on: Pega eventos que ocorrem na Tela
        cy.on('window:alert', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Alert Simples')
        })
    })

    // Commandos (depois de criar em commands.js)
    it.only('Alert 2', () => {
        cy.clickAlert('#alert', 'Alert Simples')
    })

    it('Alert com Mock', () => {
        // stub: substitui uma função, registra seu uso, e controla o seu comportamento
        const stub = cy.stub().as('alerta')  // .as('...') : define um alias
        cy.on('window:alert', stub) // Qdo ocorrer esse evento, chama o Stub

        cy.get('#alert').click().then(() => { // Botão "Alert"
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples')
            // getCall(0): pega a primeira chamada
        })  
    })

    it('Confirm', () => {
        cy.get('#confirm').click()  // Botão "Confirm"

        cy.on('window:confirm', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Confirm Simples')
        })
        cy.on('window:alert', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Confirmado')
        })
    })

    it('Deny', () => {
        cy.get('#confirm').click()  // Botão "Confirm"

        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples')
            return false
        })
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Negado')
        })
    })

    it('Prompt', () => {
        cy.window().then(win => {
            cy.stub(win, 'prompt').returns('42')
        })
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Era 42?')
        })
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal(':D')
        })

        cy.get('#prompt').click()  // Botão "Prompt"
    })

    it('Validando Mensagens', () => {
        const stub = cy.stub().as('alerta')
        cy.on('window:alert', stub)

        cy.get('#formCadastrar').click() // Botão "Cadastrar"
            .then(() => expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio'))

        cy.get('#formNome').type('Nome') // Preenche o Nome
        cy.get('#formCadastrar').click() // Botão "Cadastrar"
            .then(() => expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio'))

        cy.get('[data-cy=dataSobrenome]').type('Sobrenome') // Preenche o Sobrenome
        cy.get('#formCadastrar').click() // Botão "Cadastrar"
            .then(() => expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio'))
        
        cy.get('#formSexoMasc').click() // Sexo Masculino
        cy.get('#formCadastrar').click() // Botão "Cadastrar"

        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')
    })

})