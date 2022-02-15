const producto = {
    nombre: 'Monitor 20 pulgadas',
    precio: 30,
    disponible: true
}

console.log(producto)

Object.seal(producto)
producto.nombre = 'Tablet'
delete producto.precio
producto.imagen = 'imagen.jpg'
console.log(producto)

console.log(Object.isSealed(producto))