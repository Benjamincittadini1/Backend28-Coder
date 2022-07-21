const numeroRandom = function (num) {
    let numeros = new Object();
    let {
        cantidad
    } = num;

    if (!cantidad) {
        cantidad = 100000000
    } else {
        cantidad = parseInt(cantidad)
    }

    for (let i = 0; i < cantidad; i++) {
        let random = Math.floor(Math.random() * 1000) + 1

        if (isNaN(numeros[random])) {
            numeros[random] = 1
        } else {
            numeros[random]++
        }
    }
    return numeros
}

process.on('message', req => {
    process.send(numeroRandom(req))
    process.exit()
})

process.send('start')