/// <reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv'

describe('Should test at a Functional Level', () => {
    after(() => {
        cy.clearLocalStorage()  // Limpar o Local Storage
    })

    beforeEach(() => { 
        buildEnv()  // Carregar as Rotas definidas em .../support/buildEnv.js
        cy.login('teste@email.com', 'senha errada')
        cy.get(loc.MENU.HOME).click()
        //cy.resetApp() // Resetar a massa de dados
    })

    it('Should create an Account', () => {
        // cy.route: Criar uma rota para "Mockar" as Respostas,
        //           simulando como se estivesse recebendo a resposta do BackEnd

        cy.route({ // Adicionar uma conta
            method: 'POST',
            url: '/contas',   // BaseURL está configurada em "cypress.json"
            response: [
                {id: 3, nome: 'Conta de Teste', visivel: true, usuario_id: 1}
            ]
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({ // Listar as contas, atualizada
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Conta de Teste', visivel: true, usuario_id: 1}
            ]
        }).as('contasSave')

        cy.inserirConta('Conta de Teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an Account', () => {
        cy.route({ // Atualiza uma conta
            method: 'PUT',
            url: '/contas/**',  // /contas/**  --> aceita qlqr coisa depois de /contas/
            response: [
                {id: 1, nome: 'Conta Alterada', visivel: true, usuario_id: 1}
            ]
        }).as('contas')
        
        cy.acessarMenuConta()

        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Carteira')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta Alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create an Account with same name', () => {
        cy.route({ // Adicionar uma conta
            method: 'POST',
            url: '/contas',
            response: {error: 'Já existe uma conta com esse nome!'},
            status: 400
        }).as('saveContaMesmoNome')

        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })

    it('Should Create a Transaction', () => {
        cy.route({ // Cria uma Transação
            method: 'POST',
            url: '/transacoes',
            response: {id: 605136, descricao: 'desc', envolvido: 'interessado', observacao: null, tipo: 'REC', data_transacao: '2021-06-22T03:00:00.000Z', data_pagamento: '2021-06-22T03:00:00.000Z', valor: '100.00', status: false, conta_id: 653232, usuario_id: 13723, transferencia_id: null, parcelamento_id: null}
        }).as('saveContaMesmoNome')

        cy.route({ // Listar os Extratos, atualizado
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'  // Pega os dados de "fixtures/movimentacaoSalva.json"
        })

        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Descrição')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Interessado')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso')
        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Descrição', '123')).should('exist')
    })

    it('Should get Balance', () => {
        cy.route({ 
            method: 'GET',
            url: '/transacoes/**',
            response: {"conta": "Conta para saldo","id": 605139,"descricao": "Movimentacao 1, calculo saldo","envolvido": "CCC","observacao": null,"tipo": "REC","data_transacao": "2021-06-22T03:00:00.000Z","data_pagamento": "2021-06-22T03:00:00.000Z","valor": "3500.00","status": false,"conta_id": 653240,"usuario_id": 13723,"transferencia_id": null,"parcelamento_id": null}
        })

        cy.route({ 
            method: 'PUT',
            url: '/transacoes/**',
            response: {"conta": "Conta para saldo","id": 605139,"descricao": "Movimentacao 1, calculo saldo","envolvido": "CCC","observacao": null,"tipo": "REC","data_transacao": "2021-06-22T03:00:00.000Z","data_pagamento": "2021-06-22T03:00:00.000Z","valor": "3500.00","status": false,"conta_id": 653240,"usuario_id": 13723,"transferencia_id": null,"parcelamento_id": null}
        })

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')

        // Altera um Balanço
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        
        // Espera até que um determinado campo venha preenchido, assim a tela já está carregada
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo') 
        
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação alterada com sucesso')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [
                {conta_id: 999, conta: "Carteira", saldo: "4034.00"},
                {conta_id: 9909, conta: "Banco", saldo: "10000000.00"}
            ]
        }).as('saldoFinal')

        // Verifica o novo saldo
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')
    })

    it('Should Remove a Transaction', () => {
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response: {},
            status: 204
        }).as('del')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso')
    })

    it('Should Validate data send to create an Account', () => {
        const reqStub = cy.stub() // 3º Forma

        cy.route({ // Adicionar uma conta
            method: 'POST',
            url: '/contas',
            response: {id: 3, nome: 'Conta de Teste', visivel: true, usuario_id: 1},
            //onRequest: req => { // 2º Forma
            //    expect(req.request.body.nome).to.be.empty
            //    expect(req.request.headers).to.have.property('Authorization')
            //}
            onRequest: reqStub // 3º Forma
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({ // Listar as contas, atualizada
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Conta de Teste', visivel: true, usuario_id: 1}
            ]
        }).as('contasSave')

        cy.inserirConta('{CONTROL}')  // Clicar na tecla Ctrl para "fingir" que preencheu algo no formulário
        //cy.wait('@saveConta').its('request.body.nome').should('not.be.empty') // 1º Forma
        cy.wait('@saveConta').then(() => { // 3º Forma
            console.log(reqStub.args[0][0])
            expect(reqStub.args[0][0].request.body.nome).to.be.empty
            expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        })
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should test Colors', () => { // Tela Extrato
        cy.route({ // Listaros Extratos
            method: 'GET',
            url: '/extrato/**',
            response: [
                {"conta":"Conta para movimentacoes","id":605137,"descricao":"Receita paga","envolvido":"AAA","observacao":null,"tipo":"REC","data_transacao":"2021-06-22T03:00:00.000Z","data_pagamento":"2021-06-22T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":653238,"usuario_id":13723,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta com movimentacao","id":605138,"descricao":"Receita pendente","envolvido":"BBB","observacao":null,"tipo":"REC","data_transacao":"2021-06-22T03:00:00.000Z","data_pagamento":"2021-06-22T03:00:00.000Z","valor":"-1500.00","status":false,"conta_id":653239,"usuario_id":13723,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":605139,"descricao":"Despesa paga","envolvido":"CCC","observacao":null,"tipo":"DESP","data_transacao":"2021-06-22T03:00:00.000Z","data_pagamento":"2021-06-22T03:00:00.000Z","valor":"3500.00","status":true,"conta_id":653240,"usuario_id":13723,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":605140,"descricao":"Despesa pendente","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2021-06-22T03:00:00.000Z","data_pagamento":"2021-06-22T03:00:00.000Z","valor":"-1000.00","status":false,"conta_id":653240,"usuario_id":13723,"transferencia_id":null,"parcelamento_id":null}
            ]
        })

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
    })

    it('Should test the Responsiveness', () => {
        // Como a Aplicação vai se comportar dependendo do tamanho da tela
        
        cy.get('[data-test=menu-home]').should('exist') // Menu Home vai estar visível
            .and('be.visible')

        cy.viewport(500, 700) // Troca o tamanho da tela (Horizontal x Vertical)
        cy.get('[data-test=menu-home]').should('exist') // Menu Home NÃO vai estar visível
            .and('be.not.visible')

        cy.viewport('iphone-5') // iPhone 5
        cy.get('[data-test=menu-home]').should('exist') // Menu Home NÃO vai estar visível
            .and('be.not.visible')
        
        cy.viewport('ipad-2') // iPad 2
        cy.get('[data-test=menu-home]').should('exist') // Menu Home vai estar visível
            .and('be.visible')
    })
    

})