it('sem testes, ainda', () => { })

//const getSomething = () => 10;   // Método

const getSomething = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(10);
        }, 1000) // vai demorar 1000ms = 1s pra responder
    })
}

const system = () => {  // Outro Método que vai usar o método anterior
    console.log('init');
    const prom = getSomething();
    prom.then(some => { // Aguarda até que a Promise seja resolvida
        console.log(`Something is ${some}`)  
        console.log('end')
    })
}

system();  // Chamando o Método