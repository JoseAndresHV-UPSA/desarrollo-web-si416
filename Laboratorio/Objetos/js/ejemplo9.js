const producto = {
    nombre: 'Monitor 20 pulgadas',
    precio: 30,
    disponible: true
}

const medidas = {
    peso: '1kg',
    medida: '1m'
}

const resultado = Object.assign(producto, medidas)
console.log(resultado)