/*
Construye una clase usando function para implementar una cuenta de efectivo.
Poseerá dos propiedades: nombre del titular y saldo. Además debe tener dos métodos: ingresar() y retirar().
El primero incrementa el saldo en la cantidad indicada en el argumento y el segundo lo reduce.
No se puede sacar más de lo que exista en el saldo.

A los métodos los invocaremos con las llamadas ingresar(1000) o retirar(100).

Tras ingresar el saldo será 1000 y tras retirar el saldo será 900.

Respuesta esperada:

El saldo actual es 1000
El saldo actual es 900
 */

const cuenta = {
    titular: 'Jose Andres Hurtado',
    saldo: 0,
    ingresar: function(dinero) {
        this.saldo += dinero;
        console.log(`Saldo actual: ${this.saldo}`);
    },
    retirar: function(dinero) {
        this.saldo -= dinero;
        console.log(`Saldo actual: ${this.saldo}`);
    }
}

cuenta.ingresar(1000);
cuenta.retirar(100);
