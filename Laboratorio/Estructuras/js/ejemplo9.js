const autenticado = false
const puedePagar = false

console.log(autenticado ? 'Si esta Autenticado' : 'No esta Autenticado')

console.log(autenticado && puedePagar ? 'Esta autenticado' : 'No esta autenticado')

console.log(autenticado ? (puedePagar ? 'Puede pagar' : 'No puede pagar') : 'No esta autenticado')