/// <reference types="cypress" />

describe('Work with basic elements', () => {

    before(() => { // Executa antes de todo o teste, apenas 1 vez
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => { // Executa antes de cada teste
        cy.reload() // Recarregar a Página
    })

    it('Using JQuery Selector', () => {
        // 1º Registro da tabela - Botão "Clique Aqui"
        cy.get(':nth-child(1) > :nth-child(3) > [type="button"]')
        cy.get('table#tabelaUsuarios tbody > tr:eq(0) td:nth-child(3) > input')  // Outra Forma
        cy.get("[onClick*='Francisco']")  // Outra Forma

        // 2º Registro da tabela - Primeiro Input, cuja escolaridade seja Doutorado
        cy.get('#tabelaUsuarios td:contains(\'Doutorado\'):eq(0) ~ td:eq(3) > input')
        cy.get('#tabelaUsuarios tr:contains(\'Doutorado\'):eq(0) td:eq(6) input') // Outra Forma
    })

    it.only('Using xPath', () => {
        // 1º Registro da tabela - Botão "Clique Aqui"
        cy.xpath('//input[contains(@onclick, \'Francisco\')]')
        cy.xpath('//table[@id=\'tabelaUsuarios\']//td[contains(., \'Francisco\')]/..//input[@type=\'button\']')
        cy.xpath("//table[@id='tabelaUsuarios']//td[contains(., 'Francisco')]/..//input[@type='button']")

        // 2º Registro da tabela - Input, cuja escolaridade seja Doutorado
        cy.xpath("(//table[@id='tabelaUsuarios']//td[contains(., 'Doutorado')])[1]/..//input[@type='text']")
        cy.xpath("(//table[@id='tabelaUsuarios']//td[contains(., 'Doutorado')])[1]/..//input[@type='radio']")

        // 3º Registro da tabela
        cy.xpath("//td[contains(., 'Usuario A')]/following-sibling::td[contains(., 'Mestrado')]/..//input[@type='text']")
            .type('Funciona?')

    })

})