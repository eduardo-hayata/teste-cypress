/// <reference types="cypress" />

describe('Work with basic elements', () => {

    before(() => { // Executa antes de todo o teste, apenas 1 vez
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => { // Executa antes de cada teste
        cy.reload() // Recarregar a Página
    })

    it('Text', () => {       
        cy.get('body').should('contain', 'Cuidado')
        cy.get('span').should('contain', 'Cuidado')
        cy.get('.facilAchar').should('contain', 'Cuidado')
        cy.get('.facilAchar').should('have.text', 'Cuidado onde clica, muitas armadilhas...')
    })

    it('Links', () => {
        cy.get('[href="#"]').click()  // Link "Voltar" no final da página
        cy.get('#resultado').should('have.text', 'Voltou!')

        cy.reload() // Recarregar a Página
        cy.get('#resultado').should('have.not.text', 'Voltou!') // Assegurar que "Voltou" ainda não aparece
        cy.contains('Voltar').click()
        cy.get('#resultado').should('have.text', 'Voltou!')
    })

    it('TextFields', () => {
        cy.get('#formNome').type('Cypress Test')  // Campo "Nome"
        cy.get('#formNome').should('have.value', 'Cypress Test')

        cy.get('#elementosForm\\:sugestoes')  // Campo "Sugestões"
            .type('Text Area')  
            .should('have.value', 'Text Area')

        cy.get('#tabelaUsuarios > :nth-child(2) > :nth-child(1) > :nth-child(6) > input')
            .type('???')  // Campo "Input", da 1º linha da Tabela
        
        cy.get('[data-cy=dataSobrenome]')  // Campo "Sobrenome"
            .type('Teste12345{backspace}{backspace}')  // Depois o Backspace vai apagar o 4 e 5
            .should('have.value', 'Teste123')
        
        cy.get('#elementosForm\\:sugestoes')  // Campo "Sugestões"
            .clear() // Limpa os campos, caso já tenha algo escrito
            .type('Erro{selectall}Acerto', {delay: 100}) // Escreve "Erro", depois muda pra "Acerto", com delay de 100ms
            .should('have.value', 'Acerto')
    })

    it('Radio Button', () => {
        cy.get('#formSexoFem')  // Sexo "Feminino"
            .click()
            .should('be.checked')

        cy.get('#formSexoMasc')  // Sexo "Masculino"
            .should('not.be.checked')
        
        cy.get('[name=formSexo]').should('have.length', 2)  // Verifica se tem 2 Radio Buttons relacionado com esse grupo
    })

    it('Checkbox', () => {
        cy.get('#formComidaPizza') // Pizza
            .click()
            .should('be.checked')
        
        cy.get('[name=formComidaFavorita]').click({multiple: true}) // Seleciona múltiplos checkbox
        
        cy.get('#formComidaCarne').should('be.checked')
        cy.get('#formComidaFrango').should('be.checked')
        cy.get('#formComidaPizza').should('not.be.checked')
        cy.get('#formComidaVegetariana').should('be.checked')
    })

    it('Combo', () => {
        cy.get('[data-test=dataEscolaridade]')  // Escolaridade
            .select('2o grau completo')         // Valor que está visível no combo
            .should('have.value', '2graucomp')  // Valor que está no "Value"

        cy.get('[data-test=dataEscolaridade]')
            .select('1graucomp')                // Valor que está no "Value"
            .should('have.value', '1graucomp')  // Valor que está no "Value"
        
        // Validar as opções do combo
        cy.get('[data-test=dataEscolaridade] option')
            .should('have.length', 8) // Combo tem 8 elementos
        
        cy.get('[data-test=dataEscolaridade] option').then($arr => {
            const values = []
            $arr.each(function() {
                values.push(this.innerHTML) // Coloca os valores dentro do Array
            })
            expect(values).to.include.members(['Superior', 'Mestrado']) // Verifica se tem esses valores no Array
        })
            
    })

    it.only('Combo Multiplo', () => {
        cy.get('[data-testid=dataEsportes]') // Esportes
            .select(['natacao', 'Corrida'])  // Valor que está no "Value"
        
        // Validar opções selecionadas do combo múltiplo
        cy.get('[data-testid=dataEsportes]').then($el => {
            expect($el.val()).to.be.deep.equal(['natacao', 'Corrida'])
            expect($el.val()).to.have.length(2)
        })

        // Outra forma
        cy.get('[data-testid=dataEsportes]')
            .invoke('val')
            .should('eql', ['natacao', 'Corrida'])
    })



})