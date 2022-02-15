const producto = {
    nombre: 'Monitor 20 pulgadas',
    precio: 30,
    disponible: true
}

console.log(producto)

Object.freeze(producto)
producto.disponible = false
producto.imagen = 'imagen.jpg'
delete producto.name

console.log(producto)

console.log(Object.isFrozen(producto))
