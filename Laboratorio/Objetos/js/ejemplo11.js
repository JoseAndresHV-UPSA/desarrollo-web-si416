const producto = {
    nombre: 'Monitor 20 pulgadas',
    precio: 30,
    disponible: true,
    mostrarInfo: function () {
        return `El producto: ${ this.nombre } tiene un precio de $${ this.precio }`
    }
}

console.log(producto.mostrarInfo())