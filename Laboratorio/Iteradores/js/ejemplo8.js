const carrito = [
    { id: 1, producto: 'Libro' },
    { id: 2, producto: 'Camisa' },
    { id: 3, producto: 'Disco' }
]

for (const producto of carrito) {
    console.log(producto.producto)
}

let automovil = {
    modelo: 'Camaro',
    motor: '6.0',
    anio: '1950',
    marca: 'Chevrolet'
}

for (const automovilKey in automovil) {
    console.log(`${automovilKey}: ${automovil[automovilKey]}`)
}