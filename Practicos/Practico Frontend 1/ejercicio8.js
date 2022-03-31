/*
Diseña una función que calcule el factorial de un número, usa una función recursiva (que se llama a si misma).
Recuerda que el factorial de un número es el resultado de multiplicar cada número por el anterior hasta llegar a 1.
Y el factorail de 0 es por definición 1.

Si escribo factorial(4) obtendré 4*3*2*1 = 24
 */

function factorial(n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n-1);
}

console.log(factorial(4));