// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import loc from './locators'

Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click()  // Botão "Alert"
    
    cy.on('window:alert', msg => {
        console.log(msg)
        expect(msg).to.be.equal(message)
    })
}) 

Cypress.Commands.add('login', (username, password) => {
    cy.visit('https://barrigareact.wcaquino.me/')
    cy.get(loc.LOGIN.USER).type(username)
    cy.get(loc.LOGIN.PASSWORD).type(password)
    cy.get(loc.LOGIN.BTN_LOGIN).click()
    cy.get(loc.MESSAGE).should('contain', 'Bem vindo')
})

Cypress.Commands.add('resetApp', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.RESET).click()
})

Cypress.Commands.add('getToken', (user, password) => {
    cy.request({
        method: 'POST',
        url: '/signin',   // BaseURL está configurada em "cypress.json"
        body: {
            email: user,
            redirecionar: false,
            senha: password
        }
    }).its('body.token').should('not.be.empty')
    .then(token => {
        Cypress.env('token', token) // Armazenar o Token em uma variável de ambiente
        return token
    })
})

Cypress.Commands.add('resetRest', () => {
    cy.getToken('teste@email.com', '*******').then(token => {
        cy.request({
            method: 'GET',
            url: '/reset',
            headers: { Authorization: `JWT ${token}` }
        }).its('status').should('be.equal', 200)
    })

})

Cypress.Commands.add('getAccountByName', name => {
    cy.getToken('teste@email.com', '*******').then(token => {
        cy.request({ // Request URL: https://barrigarest.wcaquino.me/contas?nome={nome_Conta}}
            method: 'GET',
            url: '/contas',
            headers: { Authorization: `JWT ${token}` },
            qs: {  // qs: query string
                nome: name
            }
        }).then(resp => {
            return resp.body[0].id
        })
    })
})

// Método para Sobreecrever o Request
// Para o Request poder adicionar o Token automaticamente
// Uma vez que fizer o Login, e guardar o Token em uma Variável de Ambiente,
// o Request, vai poder utilizar o valor dessa variável
// Assim, não será preciso adicionar o Token em cada teste
Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    // Se receber 1 valor como parâmetro, que seria o Objeto que contém todos os dados da requisição
    if(options.length == 1) {
        if(Cypress.env('token')) { // Se o Token existir como variável de ambiente
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}` // add esse atributo ao Objeto
            }
        }
    }
    return originalFn(...options) // Retorna a execução da Função Original, c/ os parâmetros originais
})