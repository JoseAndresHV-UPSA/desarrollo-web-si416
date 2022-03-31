/*
Crea un array para guardar al menos 10 números enteros cualesquiera, luego rellena el array (o crealo ya con los valores).
El ejercicio trata de crear a partir de este array otros dos; uno con los números pares y otro con los impares.
No debes usar bucles, usa el método del array que creas más apropiado.

No debes usar bucles, mira el método más apropiado para crear un array a partir de otro.

Un número es par si al dividirlo por 2 el resto es 0 (num%2 es 0).
 */

const nums = [1, 234, 4, 43, 321, 56, 6745, 7, 0, 90];

const impares = [];
const pares = [];

nums.forEach(n => {
    if (n % 2 == 0) {
        pares.push(n);
    }
    else {
        impares.push(n);
    }
});

console.log('Impares: ' + impares);
console.log('Pares: ' + pares);
