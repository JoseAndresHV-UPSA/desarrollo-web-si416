/*
Sin usar métodos del objeto array, diseña una función llamada sumaLista() capaz de sumar todos los
números que forman el array que se le pase como argumento.

Si ejecuto sumaLista([2,4,5,1,2]) deberá devolver como resultado 14.
 */

const lista = [2, 4, 5, 1, 2];

function sumaLista(lista) {
    let suma= 0;
    for (let i = 0; i < lista.length; i++) {
        suma += lista[i];
    }
    return suma;
}

console.log(sumaLista(lista));