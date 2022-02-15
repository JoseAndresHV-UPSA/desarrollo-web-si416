const producto = {
    nombre: "Monitor 20 pulgadas",
    precio: 30,
    disponible: true
}

console.log(producto.nombre)
console.log(producto.precio)
console.log(producto.disponible)

console.log(producto['nombre'])

producto.imagen = 'image.jpg'
console.log(producto)

delete producto.imagen
console.log(producto)
