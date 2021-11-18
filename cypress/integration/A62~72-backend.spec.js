/// <reference types="cypress" />

describe('Should test at a Functional Level', () => {
    //let token   // Se o token estiver como Variável de Ambiente, NÃO precisa disso

    before(() => {
        cy.getToken('teste@email.com', '*******') // Obs: Ver em "commands.js"
            //.then(tkn => {
            //    token = tkn
            //})
    })

    beforeEach(() => {
        cy.resetRest() // Resetar a massa de dados  // Obs: Ver em "commands.js"
    })

    it('Should create an Account', () => {
        cy.request({
            url: '/contas',
            method: 'POST',   // BaseURL está configurada em "cypress.json"
            //headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta via REST',
            }
        }).as('response')

        cy.get('@response').then(resp => {
            expect(resp.status).to.be.equal(201)
            expect(resp.body).to.have.property('id')
            expect(resp.body).to.have.property('nome', 'Conta via REST')
        })
    })

    it('Should update an Account', () => {
        cy.getAccountByName('Conta para alterar') // Obs: Ver em "commands.js"
        .then(contaId => { // A partir da resp acima, pega o ID dessa conta, pra usar em outra Request
            cy.request({ // Request URL: https://barrigarest.wcaquino.me/contas/{id_conta}
                url: `/contas/${contaId}`,
                method: 'PUT',
                //headers: { Authorization: `JWT ${token}` },
                body: {
                    nome: 'Conta alterada via Rest'
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 200)
    })

    it('Should not create an Account with same name', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            //headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta mesmo nome',
            },
            failOnStatusCode: false // Se vier um statusCode de falha, como 400, ..., NÃO é para falhar o teste,
                                    // pois é justamente o resultado esperado para esse teste
        }).as('response')

        cy.get('@response').then(resp => {
            expect(resp.status).to.be.equal(400)
            expect(resp.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Should Create a Transaction', () => {
        cy.getAccountByName('Conta para movimentacoes') // Obs: Ver em "commands.js"
        .then(contaId => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                //headers: { Authorization: `JWT ${token}` },
                body: {
                    conta_id: contaId,
                    data_pagamento: Cypress.moment().add({days: 1}).format('DD/MM/YYYY'), // D+1
                    data_transacao: Cypress.moment().format('DD/MM/YYYY'), // Data atual,
                    descricao: "Descrição",
                    envolvido: "Interessado",
                    status: true, // true: Pra dizer que foi paga
                    tipo: "REC",  // Receita
                    valor: "123"
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Should get Balance', () => {
        cy.request({
            url: '/saldo',
            method: 'GET',
            //headers: { Authorization: `JWT ${token}` }
        }).then(resp => {
            let saldoConta = null
            resp.body.forEach(c => {
                if(c.conta == 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('534.00')
        })

        // Altera um Balanço
        cy.request({ // Request URL: https://barrigarest.wcaquino.me/transacoes?descricao={desc_conta}
            method: 'GET',
            url: '/transacoes',
            //headers: { Authorization: `JWT ${token}` },
            qs: {
                descricao: 'Movimentacao 1, calculo saldo'
            }
        }).then(resp => { // A partir da resp acima, pega o ID dessa conta, pra usar em outra Request
            cy.request({ // Request URL: https://barrigarest.wcaquino.me/transacoes/{id_conta}
                url: `/transacoes/${resp.body[0].id}`, // ID é o primeiro parâmetro do body
                method: 'PUT',
                //headers: { Authorization: `JWT ${token}` },
                body: {
                    status: true,
                    data_transacao: Cypress.moment(resp.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment(resp.body[0].data_pagamento).format('DD/MM/YYYY'),
                    descricao: resp.body[0].descricao,
                    envolvido: resp.body[0].envolvido,
                    valor: resp.body[0].valor,
                    conta_id: resp.body[0].conta_id
                }
            }).its('status').should('be.equal', 200)
        })

        // Verifica o novo saldo
        cy.request({ // Request URL: https://barrigarest.wcaquino.me/saldo
            url: '/saldo',
            method: 'GET',
            //headers: { Authorization: `JWT ${token}` }
        }).then(resp => {
            let saldoConta = null
            resp.body.forEach(c => {
                if(c.conta == 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('4034.00')
        })
    })

    it('Should Remove a Transaction', () => {
        cy.request({ // Request URL: https://barrigarest.wcaquino.me/transacoes?descricao={desc_conta}
            method: 'GET',
            url: '/transacoes',
            //headers: { Authorization: `JWT ${token}` },
            qs: {
                descricao: 'Movimentacao para exclusao'
            }
        }).then(resp => { // A partir da resp acima, pega o ID dessa conta, pra usar em outra Request
            cy.request({ // Request URL: https://barrigarest.wcaquino.me/transacoes/{id_conta}
                url: `/transacoes/${resp.body[0].id}`,  // ID é o primeiro parâmetro do body
                method: 'DELETE',
                //headers: { Authorization: `JWT ${token}` },
            }).its('status').should('be.equal', 204)
        })
    })

})