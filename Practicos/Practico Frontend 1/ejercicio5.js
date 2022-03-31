/*
Crea un objeto Array con los días laborables de la semana (Lunes a Viernes).
utiliza un método del objeto para recorrer el array y convertir cada elemento de ese array a mayúsculas.

No se trata de usar un bucle, debes usar un método del objeto Array.
No debes copiar el array en otro nuevo.
Los objetos string tienen el método toUpperCase para cambiar a mayúsculas

 */

let diasLaborales = ['lunes', 'martes', 'Miercoles', 'Jueves', 'Viernes'];

diasLaborales = diasLaborales.map(dia => dia.toUpperCase());

console.log(diasLaborales);
