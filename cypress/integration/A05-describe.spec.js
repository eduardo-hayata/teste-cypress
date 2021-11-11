/// <reference types="cypress" />

it('An external test...', () => {

})

describe('Should group tests...', () => {
    
    describe('Should group more specific tests...', () => {
        it.skip('A specific internal test...', () => {
            // skip: para o teste não ser executado
        })
    })

    it('An internal test...', () => {

    })
})