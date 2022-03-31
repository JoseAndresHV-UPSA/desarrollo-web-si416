/*
Escribe una función que recibe como argumento un precio y el porcentaje de impuestos.
La función devolverá el valor total a pagar, teniendo en cuenta que al precio se le descuenta un
porcentaje del 10% si es mayor de 100 bs.

Si he comprado por valor de 200 bs con un impuesto del 5%,
me descuentan un 10% por tanto pago 180 bs más los impuestos que son el 5% de 180. En total 189 bs.
 */

function totalAPagar(precio, impuestos) {
    if (precio > 100) {
        precio = precio * 0.9;
    }
    return precio + precio * impuestos/100;
}

console.log(totalAPagar(200, 5));