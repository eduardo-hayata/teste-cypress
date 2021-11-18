/// <reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'

describe('Should test at a Functional Level', () => {
    before(() => {
        //cy.visit('https://barrigareact.wcaquino.me/')
        //cy.get(loc.LOGIN.USER).type('teste@email.com')
        //cy.get(loc.LOGIN.PASSWORD).type('*******')
        //cy.get(loc.LOGIN.BTN_LOGIN).click()
        //cy.get(loc.MESSAGE).should('contain', 'Bem vindo')
        cy.login('teste@email.com', '*******') // Foi criado um Comando p/ o login
        cy.resetApp() // Resetar a massa de dados
    })

    beforeEach(() => {
        cy.get(loc.MENU.HOME).click()
    })

    it('Should create an Account', () => {
        //cy.get(loc.MENU.SETTINGS).click()
        //cy.get(loc.MENU.CONTAS).click()
        cy.acessarMenuConta()

        //cy.get(loc.CONTAS.NOME).type('Conta de Teste')
        //cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.inserirConta('Conta de Teste')

        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an Account', () => {
        cy.acessarMenuConta()

        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Conta para alterar')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta Alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create an Account with same name', () => {
        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })

    it('Should Create a Transaction', () => {
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Descrição')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Interessado')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)  // Lista de conter 7 registros
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Descrição', '123')).should('exist')
    })

    it('Should get Balance', () => {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

        // Altera um Balanço
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        
        //cy.wait(2000) // Evitar esse tipo de espera
        // Espera até que um determinado campo venha preenchido, assim a tela já está carregada
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo') 
        
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação alterada com sucesso')

        // Verifica o novo saldo
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
    })

    it('Should Remove a Transaction', () => {
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso')
    })

})