const producto = {
    nombre: "Monitor 20 pulgadas",
    precio: 30,
    disponible: true
}

// const nombre = producto.nombre
const { nombre } = producto
console.log(nombre)

const { precio, disponible } = producto
console.log(precio, disponible)
