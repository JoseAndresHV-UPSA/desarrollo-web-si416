let pendientes = [
    'Tarea', 'Comer', 'Proyecto', 'Estudiar', 'Javascript'
]

pendientes.forEach((pendiente, i) => {
    console.log(`${i}: ${pendiente}`)
})

const carrito = [
    { id: 1, producto: 'Libro' },
    { id: 2, producto: 'Camisa' },
    { id: 3, producto: 'Disco' }
]

carrito.forEach(producto => {
    console.log(`Agregaste ${producto.producto}`)
})