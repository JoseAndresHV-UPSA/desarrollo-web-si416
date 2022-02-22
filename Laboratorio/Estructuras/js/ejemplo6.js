const usuario = false
const puedePagar = true

if (usuario && puedePagar) {
    console.log('Tu pedido se hizo con exito')
} else {
    console.log('Hubo un error con tu pago')
}

if (usuario && puedePagar) {
    console.log('Tu pedido se hizo con exito')
} else if (!usuario) {
    console.log('Inicar sesion para realizar el pedido')
} else if (!puedePagar) {
    console.log('Fondos insuficientes')
} else {
    console.log('Hubo un error con tu pago')
}
