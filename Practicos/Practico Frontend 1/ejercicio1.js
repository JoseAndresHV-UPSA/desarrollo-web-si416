/*
Define un objeto, mediante una expresión, que tenga dos propiedades: precio y descuento y un método neto.
El método calculará el precio con el descuento aplicado. Los valores se pedirán por teclado.
Por ejemplo objeto vestido, precio 400 y descuento 10. El método devolverá como resultado 360 (400 - 10*400/100).
 */

const vestido = {
    precio: 400,
    descuento: 10,
    neto: function() {
        return this.precio - this.descuento * this.precio / 100;
    }
}

console.log(vestido.neto());